<?php

// Singleton to house all site configurations.
// These objects provide an interface to 
// json config files for the site.
class Configs{

    private static $instance = null;
    private $values = array();
    

    function __construct() {       
        $current = 'app/config/active.json';
        if(!file_exists($current)){
            $current =  '../'.$current;
        }
        $raw   = file_get_contents($current); 
        $this->values = json_decode($raw,true);
    }

    static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    static function getValues($key){
      return self::instance()->get($key);   
    }
    
    
    function get($key) {
        if (isset($this->values[$key])) {
            return $this->values[$key];
        }
        return null;
    }

    function set($key, $value) {
        $this->values[$key] = $value;
    }
}

// FRONT side configs.
class FrontConfigs extends Configs{
    private static $instance = null;
    private $config;
    
    function __construct(){
     parent::__construct();
     $this->config = parent::getValues('FRONTSIDE');
    }
    
    static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    function get($key) {
        if (isset($this->config[$key])) {
            return $this->config[$key];
        }
    }
    
    static function getViewParams(){
       
    }  
}

// API configs
class ApiConfigs extends Configs{
    
}

// BACK server configs.
class BackConfigs extends Configs {

    private static $instance = null;
    private $config;
    
    
    function __construct(){
        parent::__construct();
        $this->config = parent::getValues('BACKSIDE');
    }

    static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }
   
    function get($key) {
        if (isset($this->config[$key])) {
            return $this->config[$key];
        }
    }
    
    static function getWhiteLIst(){}
    
    static function getBlackList(){}
    
    static function getApiKey(){}
    
    static function getDSN() {
        return self::instance()->get('DSN');
    }

    static function setDSN($dsn) {
        return self::instance()->set('DSN', $dsn);
    }

}
