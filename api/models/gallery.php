<?php

/* 
 * File gallery model
 */

class gallerySchema extends schema{
    
   private $gallery;
  
    // schema will only enclude encrypted user token after update.
   public function __construct($request){
        $this->gallery = array(
          '_id'=>$this->makeMongoId($request),
          'name'=>$request['name'],
          'user'=>$request['user'],
          'created'=>$request['created']
        );
   }

   public function getArray(){
       return $this->gallery;
   }
   
   public function getId(){
       return $this->gallery['_id'];
   }
}