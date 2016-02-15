<?php

/* 
 * Created by Matt Baker 2015
 * 
 * 
 */


//MONGO DATA MODEL
class usersSchema extends schema
{
    public $user; //This schema makes the array public 

    public function __construct($request){

        $this->user = array(   
            '_id'      => $this->makeMongoId($request),
            'name'     => $request['name'],
            'last'     => $request['last'],
            'email'    => $request['email'], 
            'salt'     => $request['salt'],
            'username' => $request['username'],
            'roles'    => $request['roles'],
            'provider' => $request['provider'],
            'picture'  => $request['picture'],
            'pending'  => $request['pending'],
            'locked'   => $request['locked'],
            'created'  => $this->makeMongoDate($request['created']),
            'hashed_password'=> $request['hashed_password'],
        );
    }
    
    public function replace($new){
        foreach($new as $k=>$v){
            if($k != '_id' && array_key_exists($k,$this->user)){
               $this->user[$k] = $v;
            }
        }
    }
  
    // user authentication check.
    public function validate($pass){ 
    if(!$this->user['hashed_password'] || !$pass){ return false; }
      if($this->hash($pass) == $this->user['hashed_password']){
          return true;
      }
      return false;
    }
    
    public function getJTI(){
      return array('_id' =>$this->user['_id'],'email'=>$this->user['email']);
    }
    
    public function clear($value){
        unset($this->user[$value]);
    }
    
    public function clearRestricted(){
        unset($this->user['salt']);
        unset($this->user['hashed_password']); 
    }
    
    public function set($key,$val){
        $this->user[$key] = $val;
    }

    // dump all return data
    public function dump(){
        print_r($this->user);
    }
    
    public function get($key){
        return $this->user[$key];
    }
    
    public function getFilteredUser(){
        return array_filter($this->user);   
    }
    
    // returns a user object.
    public function getUser(){
        return $this->user;   
    }
    
    public function getId(){
        if(!$this->user['_id'] instanceof MongoId){
            return new MongoId($this->user['_id']);
        }
        return $this->user['_id'];
    }
    
    public function createSessionID(){
       $salt    = base64_encode(mcrypt_create_iv(22, MCRYPT_DEV_URANDOM));
       $options = ['cost'=>12,'salt'=> base64_decode($salt)];
       $key     =  password_hash($this->user['email'],PASSWORD_BCRYPT,$options);
       return   md5($key);
    }
    
    // hash password.
    public function hash($pass){
     if(!$pass || !$this->user['salt']){ return "";}
     
     $options = [ 'cost' => 12, 'salt' => 
             base64_decode($this->user['salt'])];
     $hash    = password_hash($pass, PASSWORD_BCRYPT, $options)."\n";

     if(!$this->user['hashed_password']){       
        return $this->user['hashed_password'] = $hash;
     }
     return $hash;
    }
   
    // custom salt the password.
    public function salt(){
      return  $this->user['salt'] =  base64_encode(mcrypt_create_iv(22, MCRYPT_DEV_URANDOM));
    }
    
    public function getArray(){
   
        return array_filter($this->user);
    }
    
    public function clearId(){
      $this->user['_id'] = null;
    }

}