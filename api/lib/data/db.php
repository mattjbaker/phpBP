<?php

/*
 * MONGO database connection object
 * This package is really the "MEAT" of data operations 
 * in this API
 * database objects interface the basic CRUD operaions
 * with a respective data resource.
 * expects a database model and
 * should return a packed error on failure.
 * read operations expect all parameters related to the query
 * and run through the query method.
 */

/* create a new mongoConnection()
 * get a new worker instance
 * add connection and parameters to worker
 * compare result
 * throw error , return message, or return data.
 */

// singleton to house multiple db connections.
class db_connections{
    
    private static $instance = null;
    private $db_connections  = array();
    
    static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    function get($key){
        return $this->db_connections[$key];
    }
    
    function set($key, mongoConnection $val){  
        $this->db_connections[$key] = $val;
    }
    
    static function dumpit(){
        print_r(self::instance());
    }
    
    static function addMongoConnection($key){
        $obj = new  mongoConnection($key);
        return self::instance()->set($key,$obj);
    }
    
    static function getMongoConnection($key){
      
        return self::instance()->get($key);
    }
   
}


// this becaomes a new instance per api request.
class mongoConnection{
    
    private $db;
    
    function __construct($method='tester'){

        $this->db = $this->$method();
    }
    
    private function tester(){
        return "HELLO";
    }
    
    public function mongo_connections(){
        return array();
    }
   
  
  public function getCollection($name){
      $db = $this->db->$name;
      return new mongoWorker($db);
  }
  
  public function getColl($name){
      return $this->db->$name;
  }
  
  public function getWorker(){
      return new mongoWorker();
  }
}

abstract class mongoTask {
    
    CONST REMOVE = 0;
    CONST CREATE = 1;
    CONST READ   = 2; // currently not set
    CONST UPDATE = 3;
    
    CONST LOG    = true;
    
    protected $code;
    protected $error;
    protected $message;
    protected $logdata = array();
    protected $process;
    
    function __construct(){
        $this->code    = 404;
        $this->message = "No Message";
        $this->error   = false;
        $this->process = null;
    }
 
    static function options($type){
        switch ($type) {
            // options for mongoDB insert
            case 1:
                return array(
                    'safe'    => true,
                    'fsync'   => true,
                    'timeout' => 30000
                );
            // options for mongoDB remove
            case 0:
                return array(
                    'safe'    => true,
                    'fsync'   => true,
                    'timeout' => 30000,
                    'justOne' => true
                );
            case 3:
                return array(
                    'safe'    => true,
                    'fsync'   => true,
                    'timeout' => 30000,
                    'justOne' => true
                );
        }
    }
    
    public function hasError(){
        return $this->error;
    }
    
    public function log_add($string){
        $this->process .= $string;
    }
    
    protected function log_request(){
        if(!self::LOG){ return; }
        
        $new = "error:[".(($this->error)? "true" : "false")."] | ".$this->process." | ".json_encode($this->message)." | ".
                $this->logdata['model'].' | '.$this->logdata['method'];
        $current = (file_exists('db-log.txt'))?
                    file_get_contents('db-log.txt') : '';
         return file_put_contents('db-log.txt',$current.PHP_EOL.$new);
    }
    
    abstract public function doUpdate(schema $model,$msg='Success'); // returns bool
    abstract public function doQuery($params);                       // returns array or bool
    abstract public function doDelete($verb,$msg='User Deleted');    // returns bool
    abstract public function doCreate(schema $model,$msg='Success'); // returns bool
}


// to do .. factor all mongo operations into on 
// method .
class mongoWorker extends mongoTask{
    
    private $object;
    private $cursor;

    function __construct(mongoCollection $object){
        parent::__construct();
        $this->cursor  = null;
        $this->object  = $object;
    }
    
    private function result($return=false){
        $this->log_request();
        return ($this->error)? false : $return;
    }
    
    public function clear(){
        $this->error   = false;
        $this->message = "No Message";
        $this->process = null;
        unset($this->logdata['model']);
        unset($this->logdata['method']);
    }
    
    // returns the error as an array.
    public function getErorr(){
        return array('mess'=>$this->message,
                     'code'=>$this-code);
    }
    
    public function getCode(){
        return $this->code;
    }
    
    public function getMessage(){
        return $this->message;
    }
    
    // todo
    // decouple try operations from request.
    private function mongoOperation(){}
    
    
    public function doCount($params){
           if(isset($params['query'])){
                return $this->object->count($params['query']);
           }
           return $this->object->count();
    }
    
    public function doQuery($params){
          $this->logdata['request'] = json_encode($params);
          $this->logdata['method']  = 'doQuery';
          $this->message = array('message'=>'Query success');

          try{   
              
            if(isset($params['query'])){  
                $cursor = $this->object->find($params['query']);
              
            }else{
                $cursor = $this->object->find();
            } 
            if(isset($params['start'])){
                $cursor->skip($params['start']);
            }
            if(isset($params['limit'])){
                $cursor->limit($params['limit']);
            }
            if(isset($params['fields'])){
                $cursor->fields($params['fields']);   
            }

            if(isset($params['sort'])){
                $cursor->sort($params['sort']);
            }
            
  
            
        }catch (MongoCursorException $mce) {
            $this->error   = true;
            $this->message = array('error'=>$mce->getMessage());
        }catch (MongoCursorTimeoutException $mcte) {
            $this->error   = true;
            $this->message = array('error'=>$mcte->getMessage());
        } 
        return $this->result($cursor);
    }

    public function doFindOne($key,$val,$msg="User found"){
        $this->logdata['model']  = "$key,$val";
        $this->logdata['method'] = 'doFindOne';
        $this->message = array('message'=>$msg);

        try{
            $cursor = $this->object->findOne(array($key=>$val));
        }catch(MongoCursorException $mce){
            $this->error   = true;
            $this->message = array('error'=>$mce->getMessage());
        }catch(MongoCursorTimeoutException $mcte){
            $this->error   = true;
            $this->message = array('error'=>$mcte->getMessage());
        }
        return $this->result($cursor);
    }
    
    // delete specific objects. or multiple objects.
    public function doDeleteUnique($key,$val,$msg='Entry Deleted'){
        $this->logdata['model'] = $key." ".$val;
        $this->logdata['method'] = 'doDeleteUnique';
        $this->message = array('message'=>$msg);
        
        try{
           $this->object->remove(array($key => $val));
        }catch(MongoCursorException $mce){
           $this->error   = true;
           $this->message = array('error'=>$mce->getMessage());
        }
        catch(MongoCursorTimeoutException $mcte){
           $this->error   = true;
           $this->message = array('error'=>$mcte->getMessage());
        }
        return $this->result(true);
        
    }
    
    public function doDelete($verb,$msg='Entry Deleted'){
         $this->logdata['model']  = $verb;
         $this->logdata['method'] = 'doDelete';
         $this->message  = array('message'=>$msg);

      //  $id = new MongoId($verb);
        try{
           $this->object->remove(array('_id' => $verb),self::options(self::REMOVE));
        }catch(MongoCursorException $mce){
           $this->error   = true;
           $this->message = array('error'=>$mce->getMessage());
        }
        catch(MongoCursorTimeoutException $mcte){
           $this->error   = true;
           $this->message = array('error'=>$mcte->getMessage());
        }
        return $this->result(true);
    }
    
    public function doCreate(schema $model,$msg='Success'){
        $this->logdata['model']  = json_encode($model);
        $this->logdata['method'] = 'doCreate';
        $this->message = array('message'=>$msg);

        try{
            $this->object->insert($model->getArray(),self::options(self::CREATE));
        }
        catch (MongoCursorException $mce) {
            $this->error   = true;
            $this->message = array('mssage'=>$mce->getMessage());
        }
        catch (MongoCursorTimeoutException $mcte) {
            $this->error   = true;
            $this->message = array('message'=>$mcte->getMessage());
        }
        return $this->result(true);
    }
    
    //these methods need to be spliced in somehow.
    public function doUpdate(schema $model,$msg='Success'){
        //$this->logdata['model']  = 'New Model: '.json_encode($model);
        $this->logdata['method'] = 'doUpdate';
        $this->message = array('message'=>$msg);
        
        $id  = $model->getId();
        $new = $model->getArray();
        $this->logdata['model'] = "ID ="+$id;
        $this->logdata['model'] .= json_encode($new);
            
        unset($new['_id']);
        try{ 
           $this->object->update(array('_id'=>$id),array('$set'=>$new),self::options(self::UPDATE));
        }
        catch (MongoCursorException $mce) {
            $this->error   = true;
            $this->message = array('error'=>$mce->getMessage());
        }
        catch (MongoCursorTimeoutException $mcte) {
            $this->error   = true;
            $this->message = array('error'=>$mcte->getMessage());
        } 
        return $this->result(true);
    }
    
    // redundant helper.
    public function doRead($params){
        return $this->doQuery($params);
    }   
    
}
