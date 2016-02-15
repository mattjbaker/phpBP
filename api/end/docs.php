<?php
/**
 * This is a test
 */
final class docsApi extends Api{
    
    private $req;
    function docsApi($request){
        parent::__construct($request);	
    }
    
    // inject dynamic objects here.
    private function getApiInfoService($file,$key,$verb){
 
        $ref  = new ReflectionClass($key.'Api');
        $inst = $ref->newInstance($key.'/'.$verb,null);
        return $inst->ApiInfo($inst);
    }
    
    /** 
     *@{
     *route:api/docs/services,
     *method:GET,
     *description:returns JSON of api services and relatives.
     *}@
     */
    private function getApis(){
       $ret = array();
       
       foreach(new DirectoryIterator('end') as $file){

            if(!$file->isDot() && !$file->isDir()){
		
                require_once($file->getPathname());
            
			
                $key = str_replace('.php','',$file);
                $methods  = $this->getApiInfoService($file->getFilename(),$key,'methods');
                $parents  = $this->getApiInfoService($file->getFilename(),$key,'parents');
 
                $ret['services'][]  = array('service'=>$key,
                                            'methods'=>$methods,
                                            'parents'=>$parents);         
            }
       }
       return $ret;
    }
    
    /** 
     *@{
     *route:api/docs/args,
     *method:GET,
     *returns: array,
     *description:returns API information
     *}@
     */
    private function getApiArgs(){
       return array(
           'VERSION'=>self::API_VERSION,
              'NAME'=>self::API_NAME,
               'DEV'=>self::DEVELOPER_NAME,
              'YEAR'=>self::YEAR,
              'MODE'=>self::MODE);
    }

    final protected function docs(){
        switch($this->method){
         case "GET":
             if($this->verb == 'testapis'){
                 return $this->getApis();
             }
             if($this->info()){
                return $this->ApiInfo($this);
             }
             if($this->verb == 'services'){
                return $this->getApis();
             }
             if($this->verb == 'args'){
                 return $this->getApiArgs();
             }

         default:
              return "Endpoint Only accepts ".$this->method." requests";   
        } 
    }   
}
