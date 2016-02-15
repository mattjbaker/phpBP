<?php
// Front end command factory class.
class CmdFactory{
    
    private $request;
    private $origin;
    private $path;

    
    function __construct($request,$origin){
        $this->request = $request;
        $this->origin  = $origin;
        $this->path    = "packages";
    }
    
    /* init invokes the view for a frontend request */
    function init(){
        
        $args = explode('/', rtrim($this->request, '/'));
        $cmd  = array_shift($args);
 
        if(file_exists($this->path."/$cmd/".$cmd.".php")){
            require_once($this->path."/$cmd/".$cmd.".php");
            if(class_exists($cmd."Command")){
                 $preinst  = new ReflectionClass($cmd."Command");
                 $inst     = $preinst->newInstance($this->request,$this->origin);
                 if(is_subclass_of($inst,'Command')){
                     return $inst;
                 }else{
                     return false;
                    // echo "class $cmd Must inherit from commad";
                 }    
            }else{
                return false;
               // echo"class $cmd Command does not exist";
            }
        }
        return false;
      // echo "Package Named ".$cmd." does not exist";
    }
}

// Abstract command class.
abstract class Command {
    public $pack;
    
    abstract public function getDependancies();
 
}
