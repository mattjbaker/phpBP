<?php

/* 
 * Created by Matt Baker 2015
 */



class commentsSchema extends Schema{
    
    public $comment = array();
    
    function __construct($request){
        $this->comment['parent']   = $request['parent'];
        $this->comment['root']     = $request['root'];
        $this->comment['_id']      = $this->makeMongoId($request);
        $this->comment['created']  = $this->makeMongoDate($request['created']);
        $this->comment['content']  = $request['content'];
        $this->comment['userid']   = $request['userid'];
        $this->comment['udata']    = null;
    }
    
    public function add($value,$array){
        $this->comment[$value] = $array;
    }
    
    public function clearId(){
       unset($this->comment['_id']);
    }
    
    public function clear($key){
        unset($this->comment[$key]);
    }
    
    public function createMongoId(){
        $id = new MongoID($this->comment['_id']);
        $this->comment['_id'] = $id;
    }
    
    public function setMongoId($mid){
        $this->comment['_id'] = $mid;
    }
    
    public function getId(){
        return $this->comment['_id'];
    }
    
    public function getArticle(){
        return $this->comment;
    }
    
    public function getArray(){
        return $this->comment;
    }
    
}

