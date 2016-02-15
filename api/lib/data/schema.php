<?php
abstract class schema{
    
    protected $excludes = array();
    
    private function err($exp,$msg){
        if(!$exp){
           return $msg;
        }
        return true;
    }
    
    // back and fourth conversion of mongodates
    public function makeMongoDate($object){

        
        if(!$object){ 
            $object = new MongoDate();
        }else{
            if(is_object($object) && !isset($object->msec)){

                //$str_date = date(DATE_ISO8601,($request['created']->sec * 1000));
                $str_date     = $object->sec * 1000;
                $object->msec = $str_date;
            }
        }
        return $object;
    }
    
    // eclude data from update or return in getArray method.
    public function exclude($array){
        $this->excludes = $array;
    }
    
    // simple two way method to convert mongoIds 
    // convention switches on the array keys _id or id
    // doesnt seem to work as well as expected sometimes.
    public function makeMongoId($object){
        
        
    
        // _id = out
        // id  = in
        // value has *   = reverse
     
        if(!is_array($object)){ return null;}
        if(array_key_exists('id',$object)){
          return new MongoId();
        }
       
        if(strstr($object['_id'],'*')){
            $new = str_replace('*','',$object['_id']);
            return new MongoId($new);
        }

        $mid = new Mongoid($object['_id']); 
        return $mid->{'$id'};
    }
    
    abstract public function getId();
    abstract public function getArray();
}


