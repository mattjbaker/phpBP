<?php
/**
 * Crude document parser to generate 
 * documentation and encapsulate 
 * reflection output to the api
 */

class info_collection{
    
    private $collection = array();
    
    function __construct(){}
    
    public function set($val){
      array_push($this->collection,$val);
    }
    
    public function get(){
        if(count($this->collection) <= -1){
            return false;
        }
        return $this->collection;
    }
}

class ApiInfo {
    
    private $instance;
    private $raw_methods;
    private $raw;
    private $class_data;
    private $methods;
    
    private $collection = array();
    private $pointer    = 0;
    
    function __construct($obj){
        $this->instance = new ReflectionClass($obj);
        $this->raw_methods = $this->instance->getMethods(ReflectionMethod::IS_PRIVATE | ReflectionMethod::IS_PROTECTED);
        $this->class_data  = $this->instance->getDocComment();
        $this->raw   =  json_encode($this->raw_methods);
        $methods     =  json_decode($this->raw,true);
     
        $i = 0;
        foreach($methods as $meth){
            $methods[$i]['interface'] = 
                $this->methodInfo($this->raw_methods[$i]);
            if($meth['class'] == 'API'){
                unset($methods[$i]);
            }
            $i++;
        }
        $this->methods = $methods;  
    }
    
    private function matchArray($string){
        $words = preg_split("/[,]*\\\"([^\\\"]+)\\\"[,]*|" . "[,]*'([^']+)'[,]*|" . "[,]+/", $string, 0, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);
        return $words;
    }
    
    private function getParents($class){   
        $parents = array();
        while ($parent = $class->getParentClass()) {
           
            $parents[] = $parent->getName();
            $class     = $parent;
        }
        return $parents;
    }
    
    private function MethodInfo($inst){   
        $ret = null;
        $comment = substr($inst->getDocComment(),3,-2);
        $comment = trim(preg_replace('/\s\s+/','',$comment));
        $comment = trim(preg_replace('/(\@{|\\*|\}@)/','',$comment));
        $vals = $this->matchArray($comment);
           foreach($vals as $p){
             if(strstr($p,'@')){continue;}else{ // strip out potential phpdoc comments
             $v = preg_split('[:]',$p,2);
            @ $ret[trim($v[0])] = $v[1];
             }
           }
           return $ret;
    }

    // recrusive array value search
    private function in_array_r( $key, $needle, $haystack, $strict = false) {
        
        foreach ($haystack as $k=>$item) {    
            $k = preg_replace('/\s+/', '', $k);
            if($k == $key && ($strict ? $item === $needle : $item == $needle) ||
                (is_array($item) && $this->in_array_r($key, $needle, $item, $strict))) {
                return true;
            }
        }
        return false;
    }
     
    private function getMethods(){ 
        if(isset($this->methods)){
            $this->methods['class_data'] = $this->getClassData();
            return $this->methods;
        }
        return false;
    }
    
    private function getClassData(){
        $comment = trim(preg_replace('/\s\s+/','',$this->class_data));
        return trim(preg_replace('/(\@{|\\*|\}@)/','',$comment));
    }
    
    // too much stupid thinking..
    private function findMethods($key,$val){
        $collection = new info_collection();
        foreach($this->methods as $meth){
            if($this->in_array_r($key,$val,$meth,true)){
                $collection->set($meth);
            }
        }
       return $collection->get();  
    }
    
    public function relatives($args){
        switch($args[0]){
         default:
             return $this->getParents($this->instance);  
        }
    }
    
 
    public function methods($args){
        $args[0] = (isset($args[0]))? $args[0] : null;
        switch($args[0]){
         case "find":
             return $this->findMethods($args[1],$args[2]);
         default:
             return $this->getMethods();
        }
    }  
}