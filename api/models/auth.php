<?php

/* 
 * Created by Matt Baker 2015
 * I DONT THINK THIS IS NEEDED
 */

class authSchema extends schema{
    
    private $auth;
  
    // schema will only enclude encrypted user token after update.
    public function __construct($request){
        $this->auth = array(
          '_id'      => $request['_id'],
           'token'   => $request['token'],
           'userid'  => $request['userid'],
           'expires' => date("Y-m-d H:i:s",$request['expires']->sec)
         );
   }

   // Return the consumer token.
   public function getToken(){
       return $this->auth['token'];
   } 
   
   // Return the session Id.
   public function getId(){
       return $this->auth['_id'];
   }
   
   // Return a value from the auth array.
   public function get($key){
      return $this->auth[$key];
   }
   
   // Return the entire auth array.
   public function getSession(){
       return $this->auth;
   }
   
   public function getArray(){
       return $this->auth;
   }
}