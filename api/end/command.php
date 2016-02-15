<?php
/* 
 * Authentication API endpoint.
 * Created by Matt Baker 2015
 * interface for server commands
 */

require_once("end/auth.php");
final class commandApi extends API{
    
    function commandApi($request){
        parent::__construct($request);
        
       // D\Injector::mapClass('authApi','authApi');
        $token = new authApi($request,null);
        //D\Injector::getInstanceof('authApi',array($request,null),'auth');
        if(!$token){
            return $this->error(array('error'=>'Unauthorized Request'),401);
        }
    }
    
    private function parseLogs(){
        $data = file_get_contents('../errors/PHP_errors.log');
        if(isset($data)){
           
             return array('log'=>$data); //explode(PHP_EOL,$data); 

        }
        return "could not open server log";
    }
    
    private function newPackage(){}
    
    final function command(){
        switch($this->method){
            case 'PUT':
            case 'POST':
            case 'DELETE':
            case 'GET':
                if($this->verb == 'logs'){
                    return $this->parseLogs();
                }
                
                if ($this->info()) {
                    return $this->ApiInfo($this);
                }
                return $this->error(array('message'=>"Api is empty"),404);
        }
    }  
}