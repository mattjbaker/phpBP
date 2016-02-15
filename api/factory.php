<?php

// creates api object per request.


class ApiFactory{

    private $request;
    private $origin;
    private $path;

    function __construct($request,$origin){
        $this->request = $request;
        $this->origin  = $origin;
        $this->path    = "end";
    }

    function init(){
        
        $args     = explode('/', rtrim($this->request, '/'));
        $endpoint = array_shift($args);

        if(file_exists($this->path."/".$endpoint.".php")){
            require_once($this->path."/".$endpoint.".php");
            if(class_exists($endpoint."Api")){
                $preinst  = new ReflectionClass($endpoint."Api");
                $inst     = $preinst->newInstance($this->request,$this->origin);
                
                if(is_subclass_of($inst,'API')){
                   return $inst;
                }else{
                    echo "Service class $inst must inherit abstract API";
                }                
            }else{
                echo "Service class does not exist";
            }
        }
       echo "File or endpoint ".$endpoint."Api.php does not exist<br>
            Use( <a href='docs'>/api/docs</a> for documentation )" ;
    }
}