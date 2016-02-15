<?php

/* 
 * Created by Matt Baker 2015
 *  articles model
 * 
 */


class articlesSchema extends Schema{
    
    public $article = array();
    
    function __construct($request){
      
        $this->article['_id']      = $this->makeMongoId($request);
        $this->article['created']  = $this->makeMongoDate($request['created']);
        $this->article['content']  = $request['content'];
        $this->article['title']    = $request['title'];
        $this->article['user']     = $request['user'];
    }
    
    public function add($value,$array){
        $this->article[$value] = $array;
    }
    
    public function clearId(){
       unset($this->article['_id']);
    }
    
    public function clear($key){
        unset($this->article[$key]);
    }
    
    public function createMongoId(){
        $id = new MongoID($this->article['_id']);
        $this->article['_id'] = $id;
    }
    
    public function setMongoId($mid){
        $this->article['_id'] = $mid;
    }
    
    public function getId(){
        return $this->article['_id'];
    }
    
    public function getArticle(){
        return $this->article;
    }
    
    public function getArray(){
        return $this->article;
    }
    
}
