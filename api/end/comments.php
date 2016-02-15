<?php

/* 
 * Created by Matt Baker 2015
 * API for comments system.
 * 
 */

require_once('models/comments.php');
require_once('models/users.php');
//require_once ("filters.php");
 
final class commentsApi extends API{
  
    private $CommentsObj;
    private $UsersObj;
 
    CONST COLLECTION = 'comments';
    
    function commentsApi($request){
        parent::__construct($request);
        $this->CommentsObj = $this->db->getCollection(self::COLLECTION);
        $this->UsersObj    = $this->db->getCollection('users');
       
    }
    /**
   *@{
   *route:api/comments/defrag/:_key/:_val,
   *method:DELETE,
   *description:removes all entries of _key where _val",
   *}@
   */
    private function DELETE_comment_fragments_process(){
        $result = $this->CommentsObj->doDeleteUnique($this->args[0],$this->args[1],"Fragments Remomved");
        if($result){
            return $this->CommentsObj->getMessage();
        }
        return $this->error_result($this->CommentsObj);
    }
    
   /**
   *@{
   *route:api/comments/:_id,
   *method:DELETE,
   *"description:removes an existing article by _id",
   *}@
   */
    private function DELETE_comments_process(){ 
       if($this->verb == 'defrag'){
           return $this->DELETE_comment_fragments_process();
       }
       $result = $this->CommentsObj->doDelete($this->verb,"Article Removed");
       if($result){
           return $this->CommentsObj->getMessage();
       }
       return $this->error_result($this->CommentsObj);
    }
   /**
   *@{
   *route:api/comments/,
   *method:PUT,
   *"description:updates an existing article",
   *}@
   */
    private function PUT_comments_process(){   
       
        unset($this->file['udata']);
        $comment = new commentsSchema($this->file); 
        $comment->clear('created'); // retain the time of creation.
        $result  = $this->CommentsObj->doUpdate($comment,'Article Updated');
        if($result){
            return $this->CommentsObj->getMessage();
        }
        return $this->error_result($this->CommentsObj);
    }
    
   /**
   *@{
   *route:api/comments/,
   *method:POST,
   *"description:creates a new article",
   *}@
   */
    private function POST_comments_process(){
       $comments = new commentsSchema($this->file); 
       $result = $this->CommentsObj->doCreate($comments,'Article Created');
       if($result){
           return $this->CommentsObj->getMessage();
       }
       return $this->error_result($this->CommentsObj);
    }
    
   /*@{
   *route:api/comments/,
   *method:GET,
   *"description:retrieves an article uses all filters returns array",
   *}@
   */
    private function GET_comments_process(){   

        $filters = new filters($this->args,$this->verb);
        $params  = $filters->getParameters();
        
        // die(print_r($params));
        // returns a query for key value if verb is not exclusive.
       
        if($this->verb == 'count'){
            return array('total'=>$this->CommentsObj->doCount());
        }
        if($params['ct'] == 1){
            return array('total'=>$this->CommentsObj->doCount($params));
        }
        
        $returns = array();
        $result  = $this->CommentsObj->doQuery($params);
        
       // die(print_r($params));
        if(!$result){

           return $this->error_result($this->CommentsObj);
        }
        
        foreach ($result as $k => $value ){
          $comment = new commentsSchema($value);
          $id   = new MongoId($comment->comment['userid']);
          $user = new usersSchema($this->UsersObj->doFindOne('_id',$id));
          $user->clearRestricted();          
          $comment->add('udata',$user->getArray());
          array_push($returns,$comment->getArray()); 
        }  
        
//        if($params['ct'] == 1){
//          return array('total'=> count($returns));
//        }
              

        
        if(!$returns){
            // empty response returns array.
            return array();
            //return array('message'=>'No data available');
        }
        

        
        return $returns;
    }
    
    function comments(){
        switch($this->method){
            case self::PUT:
                return $this->PUT_comments_process();
            case self::DELETE:
                return $this->DELETE_comments_process();
            case self::POST:
                return $this->POST_comments_process();
            case self::GET:
                return $this->GET_comments_process();
        }
    }
    
}