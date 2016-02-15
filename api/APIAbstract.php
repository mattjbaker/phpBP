<?php

abstract class API
{  
    /**
     * Framework configs
     */
    protected $settings;
    CONST API_VERSION    = '1.0';
    CONST API_NAME       = "skimpy";
    CONST DEVELOPER_NAME = "Matt Baker";
    CONST YEAR           = '2015';
    CONST MODE           = 'Mongo';
    CONST USE_WHITELIST  = false;
    CONST LOG            = false;
    
    CONST PUT    = 'PUT';
    CONST GET    = 'GET';
    CONST DELETE = 'DELETE';
    CONST POST   = 'POST';
    /**
     * Whitelist array for production tests 
     * from authenticated servers
     */
    protected $whitelist = array('127.0.0.1','::1');
    /**
     * Property: method
     * The HTTP method this request was made in, either GET, POST, PUT or DELETE
     */
   
    protected $method = '';
    /**
     * Property: endpoint
     * The Model requested in the URI. eg: /files
     */
    protected $endpoint = '';
    /**
     * Property: verb
     * An optional additional descriptor about the endpoint, used for things that can
     * not be handled by the basic methods. eg: /files/process
     */
    protected $verb = '';
    /**
     * Property: args
     * Any additional URI components after the endpoint and verb have been removed, in our
     * case, an integer ID for the resource. eg: /<endpoint>/<verb>/<arg0>/<arg1>
     * or /<endpoint>/<arg0>
     */
    protected $args = Array();
    /**
     * Property: file
     * Stores the body of the PUT,POST methods
     */
    protected $file   = Null;
    protected $upload = NUll;

    protected $error = array();
 
    protected $db; 
    protected $request;

    protected $insertOptions = null;
    protected $removeOptions = null;
    protected $updateOptions = null;
    
    protected $info_methods = array('methods','parents');

    /**
    * Constructor: __construct
    * Allow for CORS, assemble and pre-process the data
    */
    public function __construct($request) {
      
       
        header("Access-Control-Allow-Orgin: *");
        header("Access-Control-Allow-Methods: POST,GET,PUT,DELETE,FILES");
        header("Content-Type: application/json");
        
        // configure injector.
       // D\Injector::addClasspath(array('end','models'));

        $settings = new settings();
        $this->settings = $settings->getRaw();
        
        // access the db_connections singleton.
        db_connections::addMongoConnection('local_mongo_connection');
        $this->db = db_connections::getMongoConnection('local_mongo_connection');
        
        $this->args     = (!is_array($request))? explode('/', rtrim($request, '/')) : $request;
        $this->endpoint = array_shift($this->args);
        
        if (array_key_exists(0, $this->args) && !is_numeric($this->args[0])) {
            $this->verb = array_shift($this->args);
        }

        $this->method = $_SERVER['REQUEST_METHOD'];
       
        if ($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)) {
            if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE' && array_key_exists('HTTP_X_HTTP_METHOD',$_SERVER)) {
                $this->method = 'DELETE';
            } else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT' && array_key_exists('HTTP_X_HTTP_METHOD',$_SERVER)) {
                $this->method = 'PUT';
            } else {
                throw new Exception("Unexpected Header");
            }
        }
       
 
        // This switch provides an opportunity to perform 
        // individual procedures on each method. It could be omited,
        // and refactored for object hirearchies instead.
        switch($this->method) {
            
        case 'DELETE':
            $this->request = $this->_cleanInputs($_DELETE);
            $this->file = json_decode(file_get_contents("php://input"),true);
            break;
        case 'POST':
            $this->request = $this->_cleanInputs($_POST);
            $this->file    = json_decode(file_get_contents("php://input"),true);
            if(!$this->file){   $this->file   = $_POST; }
            if(isset($_FILES)){ $this->upload = $_FILES;}
            break;
        case 'GET':
            $this->request = $this->_cleanInputs($_GET);
            $this->file = json_decode(file_get_contents("php://input"),true);
            break;
        case 'PUT':
            $this->request = $this->_cleanInputs($_PUT);
            $this->file = json_decode(file_get_contents("php://input"),true);
            break;
        default:
            $this->_response('Invalid Method', 405);
            break;
        }
    }
    
    protected function error_result($object){
       $err    = $object->getError();
       $return = $this->error(array('error'=>$err['mess']),$err['code']);   
       $object->clear();
       return $return;
    }
    
    protected function checkArgs($array){
        foreach($array as $v){
            if(!in_array($this->file,$v)){
                die($this->error(array('error'=>'Missing $v parameter')));
            }
        }
    }
    
    public function processAPI() {
        if (method_exists($this, $this->endpoint)) {
           return $this->_response($this->{$this->endpoint}($this->args));
        }
        return $this->_response("No Endpoint: $this->endpoint", 404);
    }

    protected function error($msg,$status=404){
        header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
        if(is_array($msg)){
             
            if(strstr($msg['error'],'duplicate key error')){
                $vals = split('key:',$msg['error']);
                $v = str_replace(array('{',':','}'),'',$vals[1]);
                $msg['error'] = "Value: ".$v." Already in use and must be unique!";
            } 
             die(json_encode($msg));
        }else{
            die($msg);
        }
    }
    
    protected function _logRequest($msg){
        $content = "";
        if(file_exists('PHP_errors.log')){
            $content = file_get_contents('PHP_errors.log');
        }
        $newcontent = $content.'\n'.$msg;
        file_put_contents('PHP_errors.log',$newcontent);  
    }
    
    protected function _htmlResponse(){
       header('Content-Type: text/html; charset=utf-8');
    }
    
    private function _response($data,$status = 200) {
       // if($this->_checkOrigin()){
            header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
            return json_encode($data);
        //
        //die("Access denied!");
    }
    
    private function _cleanInputs($data) {
        $clean_input = Array();
        if (is_array($data)) {
            foreach ($data as $k => $v) {
                $clean_input[$k] = $this->_cleanInputs($v);
            }
        } else {
            $clean_input = trim(strip_tags($data));
      
        }
        return $clean_input;
    }
    

    // returns bool
    protected function _checkOrigin(){
      if(!self::USE_WHITELIST){ return true; }
       if(in_array($_SERVER['REMOTE_ADDR'], $this->whitelist)){
           return true;
        }
        return false;
    }
    
    //Comparrison for global 'info' methods
    protected function info(){
       return in_array($this->verb, $this->info_methods);   
    }
    
    //Returns the endpoint for info parsed from the service file.
    protected function ApiInfo($inst){
       if(@class_exists(ApiInfo)){
            $info = new ApiInfo($inst);
            if($this->verb == 'parents'){
              return $info->relatives($this->args);   
            }
            if($this->verb == 'methods'){  
              return $info->methods($this->args);
            }
        }else{
            return "Api Info is not active.";
        }
    }

    private function _requestStatus($code) {
        $status = array(  
            200 => 'OK',
            404 => 'Not Found',   
            405 => 'Method Not Allowed',
            500 => 'Internal Server Error',
            401 => 'Unauthorized request'
  
        ); 
        return ($status[$code])?$status[$code]:$status[500]; 
    }
}
