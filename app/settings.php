<?php

class settings{
    
    private $configs = array();
    private $viewbag = array();
    private $raw;
    private $current = 'app/config/active.json';
    private $default = 'app/config/default.json';
    private $freeze  = '/config/freeze.json';
    
    function __construct(){
        
        // directory check.
        if(!file_exists($this->current)){
        
            $this->current =  '../'.$this->current;
           // $this->default =  '../'.$this->default;

        }
        
        $this->raw = file_get_contents($this->current);
        
//        if(isset($this->configs)){
//            $this->raw = file_get_contents($this->default);
//        }
        
        $this->configs = json_decode($this->raw,true);
    }
   
    
    function getFrontSide(){
        return $this->configs['FRONTSIDE'];
    }
    
    function getBackSide(){
        return $this->configs['BACKSIDE'];
    }
    
    function getGlobals(){
        return $this->configs['GLOBAL'];
    }  
    
    function getRaw(){
        return $this->raw;
    }
    
    function getAll(){
        return $this->configs;
    }
    
    // scope: GLBAL, BACKSIDE, FRONTSIDE
    function update($scope,$key,$val){
        $this->configs[$scope][$key] = $val;
    }
    
    function commit(){
        $newcontent = json_encode($this->configs);
        file_put_contents($this->freeze,$newcontent);
      
    }
}