<?php
/* 
 * Authentication API endpoint.
 * Created by Matt Baker 2015
 * v2 removed session states from
 * api authentication. will replace
 * with a login tracking system.
 * This is by far the most important and complex
 * part of the site, I would recomend not making changes
 * dirrectly. This is surely not perfect, and I could easily be
 * missing some huge things here. 
 * anything that dirrectly interfaces with the client 
 * is user sensitive, and does not requre an access token goes through auth 
 */
require_once("models/users.php");

final class authApi extends API{
    
    private $AuthObj;
    private $dwt;

    private $exclude_methods = array();
    private $exclude_verbs   = array();
    private $exclude_routes  = array();
    
    CONST OVERRIDE    = true;
    CONST COLLECTION  = 'users';
    
    
    function authApi($request){  
        parent::__construct($request); 
        $this->AuthObj = $this->db->getCollection(self::COLLECTION);
    }
    
    function excludeMethods($array){
        $this->exclude_methods = $array;
    }
    
    function excludeRoutes($array){
        $this->exclude_routes = $array;
    }
    
    function excludeVerbs($array){
        $this->exclude_verbs   = $array;
    }
    
    // To control access to apis services by user permission.
    private function hasPermission($permission=false,$roles){
       return (!$permission || in_array($permission,$roles))? true : false;
    }
    
    // Easy accessor to be called from service costructors
    public function authenticateRequest(){
        if($this->doAuthenticateRequest()){ return true;}
         return $this->error(array("error"=>"Not Authenticated"),401);
    }   
    
    
    // Method called to authenticate api headers in secure service requests.
    public function doAuthenticateRequest($permission=false){  

        if(self::OVERRIDE ||
           in_array($this->verb,  $this->exclude_verbs)  ||
           in_array($this->route, $this->exclude_routes) ||
           in_array($this->method,$this->exclude_methods)){
            return true;
        }
        
        $headers = apache_request_headers();
        if(isset($headers['Authorization'])){
            $token = $headers['Authorization'];

            $dwt   = NoAuth\NoAuth::authenticateToken(array('token'=>$token));
            $this->dwt = $dwt;
            if($dwt){
                $id   = new MongoId($dwt->jti->_id);
                $user = $this->AuthObj->doFindOne('_id',$id);
                if($user){
                    // return the valid result.
                    return ($this->hasPermission($permission,$user['roles']))? true : false;
                }
                return false;
            }
            return false;
        }
        return false;
    }
    
    // create a new user token.
    private function issueToken(usersSchema $user){
       $this->AuthObj->log_add(">Creating Auth Token>");
       $t_params = array('jti'=>$user->getJTI(),
                         'iss'=>$_SERVER['SERVER_NAME'],
                         'aud'=>$_SERVER['SERVER_NAME']);
        return NoAuth\NoAuth::RegisterToken($t_params);
    }
    
    // creates the return for authentication.
    private function authPayload(usersSchema $user){
        $this->AuthObj->log_add(">Generating Payload>");
        $token = ($this->file['token'])? $this->file['token'] : 
        $this->issueToken($user);
        $user->clearRestricted();
        $return         = $user->getArray();
        $return['auth'] = $token;
        return $return;   
    }
  
   /**
   *@{
   *route:api/auth,
   *method:PUT,
   *"description:Authenticate a user session with token {token:jwt}"
   *}@
   */
    private function PUT_user_authenticate(){
       if($this->file['token']){
        $t_params = array('token'=>$this->file['token']);
        $dwt      = NoAuth\NoAuth::AuthenticateToken($t_params);
           if($dwt){
               $this->AuthObj->log_add(">Token issued!>");
               $id      = new MongoId($dwt->jti->_id);
               // check to make sure user is the same in the database.
               $account = $this->AuthObj->doFindOne('_id',$id);
               if(!$account){
                   return $this->error_result($this->AuthObj);
               }
               $this->AuthObj->log_add('>User Authenticated>');
               $user = new usersSchema($account); 
               return $this->authPayload($user);
               
           }
           return $this->error($dwt,401);
       }
       return $this->error(array('error'=>'Unknown Token'),401);
    }
     
   /**
   *@{
   *route:api/auth/:_id,
   *method:DELETE,
   *"description: Cleans up database at user logout",
   *status:inactive
   *}@
   */
    private function DELETE_user_logout(){
        return true;
    }
    
   /**
   *@{
   *route:api/auth/,
   *method:POST,
   *"description:Logs in user {email:email,password:string}"
   *}@
   */
    private function POST_user_login(){
       
        $this->AuthObj->log_add(">Instantiating User>");
        $account = $this->AuthObj->doFindOne('email',$this->file['email'],"Login Success");
        if(!$account){
            return $this->error_result($this->AuthObj);
        }
        
        $user  = new usersSchema($account); 
        
        $this->AuthObj->log_add(">Checking Credentials>");
        if($user->user['pending'] && $user->user['pending'] != 'null'){
            return $this->error(array('message'=>"Account is pending password reset ".$user->user['pending']),404);
        }
        if($user->user['locked']){
            return $this->error(array('message'=>"User Account is locked"),404);
        }           
        if($user->validate($this->file['password'])){
            
            return $this->authPayload($user); 
           // all returns are good.
        }else{
            return $this->error(array('message'=>"User ID or Password Incorrect"),404);
        }
        return $this->error(array('message'=>"User not found"),404);
    }
    
    
    function auth(){
        switch($this->method){
            case parent::PUT:
                return $this->PUT_user_authenticate();
            case parent::POST:
                return $this->POST_user_login();
            case parent::DELETE:
                return $this->DELETE_user_logout();
            case parent::GET:     
     
                if ($this->info()) {
                    return $this->ApiInfo($this);
                }
                
        }
    }  
}