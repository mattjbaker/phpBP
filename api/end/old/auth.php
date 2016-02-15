<?php
/* 
 * Authentication API endpoint.
 * Created by Matt Baker 2015
 * v2 removed session states from
 * api authentication. will replace
 * with a login tracking system.
 * This is by far the most important and complex
 * API service of the site, I would recomend not making
 * dirrectly or testing all changes first.
 * anything that dirrectly interfaces with the client 
 * is user sensitive, and does not requre an access token goes through auth 
 */

final class authApi extends API{
    
    private $UsersObj;

    function authApi($request){  
        parent::__construct($request); 
        
        $this->UsersObj = $this->db->getColl('users');
        /** setup data models **/
        D\Injector::mapClass('usersSchema','usersSchema');
        D\Injector::mapClass('usersApi','usersApi');
    }

    // To control access to apis services by user permission.
    private function hasPermission($permission=false,$roles){
       return (!$permission || in_array($permission,$roles))? true : false;
    }
    
    // Method called to authenticate api headers in secure service requests.
    public function authenticateRequest($permission=false){  

        $headers = apache_request_headers();
        if(isset($headers['Authorization'])){
            $token = $headers['Authorization'];
            $dwt   = NoAuth\NoAuth::authenticateToken(array('token'=>$token));
            if(!$dwt->error){
                $id   = new MongoId($dwt->jti->_id);
                $user = $this->UsersObj->findOne(array('_id'=>$id));
                if($user){
                    // return the valid result.
                    return ($this->hasPermission($permission,$user['roles']))? $dwt : false;
                }
                return false;
            }
            return false;
        }
        return false;
    }
    
    // create a new user token.
    private function issueToken(usersSchema $user){
       $t_params = array('jti'=>$user->getJTI(),
                         'iss'=>$_SERVER['SERVER_NAME'],
                         'aud'=>$_SERVER['SERVER_NAME']);
        return NoAuth\NoAuth::RegisterToken($t_params);
    }
    
    // creates the return for authentication, can also implement session tracking
    private function authPayload(usersSchema $user){
        $token = ($this->file['token'])? $this->file['token'] : 
        $this->issueToken($user);
        $return         = $user->getUser();
        $return['auth'] = $token;
        return $return;   
    }
  
   /**
   *@{
   *route:api/auth,
   *method:PUT,
   *"params:{token:string}",
   *"description:Authenticate a user session with token {token:string}"
   *}@
   */
    private function authenticate(){
       if($this->file['token']){
        $t_params = array('token'=>$this->file['token']);
        $dwt      = NoAuth\NoAuth::AuthenticateToken($t_params);
           if(!$dwt->error){
               $id      = new MongoId($dwt->jti->_id);
               // check to make sure user is the same in the database.
               $account = $this->UsersObj->findOne(array('_id'=>$id));
               if($account){
                   $user = D\injector::getInstanceOf('usersSchema',array($account),'users');              
                   return $this->authPayload($user);
               }
               return $this->error(array('error'=>"Unknown user"),401);
           }
           return $this->error($dwt,401);
       }
       return $this->error(array('error'=>'Unknown Token'),401);
    }
     
   /**
   *@{
   *route:api/auth,
   *method:DELETE,
   *"description: Cleans up database at user logout",
   *status:inactive
   *}@
   */
    private function logout(){
        return true;
    }
    
   /**
   *@{
   *route:api/auth,
   *method:POST,
   *"params:{emai:string,password:string}",
   *"description:Changes a user password by {_id:mongoid,password:string}"
   *}@
   */
    private function login(){
       
        $account = $this->UsersObj->findOne(array('email' => $this->file['key']));
        if(!is_null($account)){
            $user = D\injector::getInstanceOf('usersSchema',array($account),'users');
            if($user->user['pending']){
                return $this->error(array('message'=>"Account is pending password reset ".$user->user['pending']),404);
            }
            if($user->user['locked']){
                return $this->error(array('error'=>"User Account is locked"),404);
            }           
            if($user->validate($this->file['password'])){
                return $this->authPayload($user);  // all returns are good.
            }
            return $this->error(array('error'=>"User ID or Password Incorrect"));
        }
        return $this->error(array('error'=>"User not found"),404);
    }
    
    final function auth(){
        switch($this->method){
            case 'PUT':
                return $this->authenticate();
            case 'POST':
                return $this->login();
            case 'DELETE':
                return $this->logout();
            case 'GET':
         
                if ($this->info()) {
                    return $this->ApiInfo($this);
                }
                return $this->authenticate();
        }
    }  
}