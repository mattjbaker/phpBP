<?php

/* 
 * Created by Matt Baker 2015
 * articles end
 * 
 */


require_once('models/articles.php');
require_once('models/users.php');
//require_once ("filters.php");
 
final class articlesApi extends API{
  
    private $ArticlesObj;
    private $UsersObj;
    
    CONST COLLECTION = 'articles';
    
    function articlesApi($request){
        parent::__construct($request);
        $this->ArticlesObj = $this->db->getCollection(self::COLLECTION);
        $this->UsersObj    = $this->db->getCollection('users');
    }
    
   /**
   *@{
   *route:api/articles/:_id,
   *method:DELETE,
   *"description:removes an existing article by _id",
   *}@
   */
    private function DELETE_articles_process(){ 
       $result = $this->ArticlesObj->doDelete($this->verb,"Article Removed");
       if($result){
           return $this->ArticlesObj->getMessage();
       }
       return $this->error_result($this->ArticlesObj);
    }
    
   /**
   *@{
   *route:api/articles/,
   *method:PUT,
   *"description:updates an existing article",
   *}@
   */
    private function PUT_articles_process(){   
       
        $article = new articlesSchema($this->file); 
        $article->clear('created'); // retain the time of creation.
        $result  = $this->ArticlesObj->doUpdate($article,'Article Updated');
        if($result){
            return $this->ArticlesObj->getMessage();
        }
        return $this->error_result($this->ArticlesObj);
    }
    
   /**
   *@{
   *route:api/articles/,
   *method:POST,
   *"description:creates a new article",
   *}@
   */
    private function POST_articles_process(){
       $articles = new articlesSchema($this->file); 
       $result = $this->ArticlesObj->doCreate($articles,'Article Created');
       if($result){
           return $this->ArticlesObj->getMessage();
       }
       return $this->error_result($this->ArticlesObj);
    }
    
   /*@{
   *route:api/articles/,
   *method:GET,
   *"description:retrieves an article uses all filters returns array",
   *}@
   */
    private function GET_articles_process(){   

        $filters = new filters($this->args,$this->verb);
        $params  = $filters->getParameters();
  
        // die(print_r($params));
        // returns a query for key value if verb is not exclusive.
        $returns = array();
        $result  = $this->ArticlesObj->doQuery($params);
       // die(print_r($params));
        if(!$result){
            return $this->error_result($this->ArticlesObj);
        }
        
        foreach ($result as $k => $value ){
          $article = new articlesSchema($value);
          $id      = new MongoId($article->article['user']['userId']);
          $user    = new usersSchema($this->UsersObj->doFindOne('_id',$id));
         
          $user->clearRestricted();          
          $user->clear('name');
          $user->clear('last');
          $user->clear('pending');
          $user->clear('roles');
          $article->article['user']['udata'] = $user->getArray();
        
          array_push($returns,$article->getArray()); 
        }  
              
        if(!$returns){
            return array('message'=>'No data available');
        }
        
        if($this->verb == 'count'){
            return array('total'=>$this->ArticlesObj->doCount());
        }
        return $returns;
    }
    
    function articles(){
        switch($this->method){
            case self::PUT:
                return $this->PUT_articles_process();
            case self::DELETE:
                return $this->DELETE_articles_process();
            case self::POST:
                return $this->POST_articles_process();
            case self::GET:
                return $this->GET_articles_process();
        }
    }
    
}