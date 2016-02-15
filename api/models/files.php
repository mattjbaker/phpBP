<?php
/*
 * schema for files.
 */

class filesSchema extends schema{
    
    private $file;
  
    // schema will only enclude encrypted user token after update.
   public function __construct($request){
        $this->file = array(
          '_id' =>$this->makeMongoId($request),
          'file'=>$request['file'],
          'path'=>$request['path'],
     'galleries'=>$request['galleries'],  // array of associated collections.
          'user'=>$request['user'],       // owner of the file.
    'perm_roles'=>$request['roles'],      // shared with roles.
    'perm_users'=>$request['users']       // shared with users.
        );
   }
   
   public function clear($val){
       unset($this->file[$val]);
   }
 
   public function getArray(){
       return $this->file;
   }
   
   public function getId(){
       return $this->file['_id'];
   }
}