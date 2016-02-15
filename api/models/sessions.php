<?php

/* 
 * Created by Matt Baker 2015
 */

class sessionsSchema extends schema{
    
    private $session;
  
    // schema will only enclude encrypted user token after update.
   public function __construct($request){
        $this->session = array(
          '_id'=>$request['_id'],
          'uid'=>$request['uid'],
        );
   }
   
   // Return not before.
   public function getNbf(){
       return $this->session['nbf'];
   }
   
   // Return the consumer token.
   public function getToken(){
       return $this->session['_id'];
   } 
   
   // Return the session Id.
   public function getUser(){
       return $this->session['uid'];
   }
   
   // Return expiration
   public function getExp(){
       return $this->session['exp'];
   }
   
   // Return the entire auth array.
   public function getSession(){
       return $this->session;
   }
   
   public function getArray(){
       return $this->session;
   }
   
   public function getId(){
       return $this->session['_id'];
   }
}