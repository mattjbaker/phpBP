<?php
/* 
 * Created by Matt Baker 2015
 * dInjector a simple dependancy 
 * Injector created for organized 
 * management of multiple inheritance backend 
 * This is more of a factory than an injector
 * as it also autoloads file requirements.
 * libraries.
 */

// extend this to restrict duplicate objects .. and other anomylies.
class Injector {
    
    private static $map;
    private static $classpaths = array();
    
    public static function addToMap($key, $obj) {   
        if(self::$map === null) {
            self::$map = (object) array();
        }
        self::$map->$key = $obj;
    }
    
    public static function dumpMap(){
       print_r(self::$map);
       print_r(self::$classpaths);
    }
    
    public static function classpaths(){
        return self::$classpaths;
    }
    
    public static function objectMap(){
        return self::$map;
    }
    
    public static function removeClasspath($path){
        $p = array_search($path,self::$classpaths);
        if(!$p){ return;}
        unset(self::$classpaths[$path]);    
    }
    
    public static function clearMap(){
        unset(self::$map);
        unset(self::$classpaths);
    }
   
    // may be set as an array or a single path value
    public static function addClasspath($path){
       if(is_array($path)){
          return self::$classpaths = array_merge($path,self::$classpaths);
       }
       return self::$classpaths[] = $path;
    }
    
    public static function mapValue($key, $value) {
        self::addToMap($key, (object) array(
            "value" => $value,
            "type"  => "value"
        ));
    }
    public static function mapClass($key, $value,$arguments = null) {
        self::addToMap($key, (object) array(
            "value"     => $value,
            "type"      => "class",
            "arguments" => $arguments
        ));
    }
    public static function mapClassAsSingleton($key, $value, $arguments = null) {
        self::addToMap($key, (object) array(
            "value"     => $value,
            "type"      => "classSingleton",
            "instance"  => null,
            "arguments" => $arguments
        ));
    }
    
    public static function getInstanceOf($className,$arguments = null,$fname=null) {

    // checking if the class exists
    if(!class_exists($className)) {
        foreach(self::$classpaths as $cp){
            if(class_exists($className)){
                continue;
            }
            if(file_exists($cp.'/'.$fname.'.php')){
                require_once($cp.'/'.$fname.'.php');
            }
        } 
//     throw new Exception("Dependacy Injector: missing class '".$className."'");
    }
    // initialized the ReflectionClass
    $reflection = new ReflectionClass($className);
    
    // creating an instance of the class
    if($arguments === null || count($arguments) == 0) {
       $obj = new $className;
    } else {
        if(!is_array($arguments)) {
            $arguments = array($arguments);
        }
       $obj = $reflection->newInstanceArgs($arguments);
    }
    
    // injecting
    if($doc = $reflection->getDocComment()) {
        $lines = explode("\n", $doc);
        foreach($lines as $line) {
            if(count($parts = explode("@Inject", $line)) > 1) {
                $parts = explode(" ", $parts[1]);
                if(count($parts) > 1) {
                    $key = $parts[1];
                    $key = str_replace("\n", "", $key);
                    $key = str_replace("\r", "", $key);
                    if(isset(self::$map->$key)) {
                        switch(self::$map->$key->type) {
                            case "value":
                                $obj->$key = self::$map->$key->value;
                            break;
                            case "class":
                                $obj->$key = self::getInstanceOf(self::$map->$key->value, self::$map->$key->arguments);
                            break;
                            case "classSingleton":
                                if(self::$map->$key->instance === null) {
                                    $obj->$key = self::$map->$key->instance = self::getInstanceOf(self::$map->$key->value, self::$map->$key->arguments);
                                } else {
                                    $obj->$key = self::$map->$key->instance;
                                }
                            break;
                        }
                    }
                }
            }
        }
    }
    // return the created instance
    return $obj;   
}
}