<?PHP

require_once("end/auth.php");
require_once("models/users.php");

final class usersApi extends API
{
    protected $User;
    protected $UsersObj;
    protected $error;
    CONST COLLECTION ='users';
    
   // private   $token;

    // class name used in constructor for clarity? or confusion?
    function usersApi($request) {
        parent::__construct($request);
        
        $this->auth = new authApi($request); 
        //allow these verbs to be requested.
        $this->auth->excludeVerbs(array('exists'));
        $this->auth->excludeMethods(array('POST'));
        $this->auth->authenticateRequest();
        $this->UsersObj = $this->db->getCollection(self::COLLECTION);
    }
   
    /**
     *@{
     *route:api/users,
     *method:DELETE,
     *"description:removes a user by {_id:mongoid}"
     *}@
     */
    private function DELETE_users_process(){
         $id = new MongoId($this->verb);
         $result = $this->UsersObj->doDelete($id);
         if(!$result){
             return $this->error_result($result);
         }
         return $result;
    }
    
    private function checkPass(){   
       if(strlen($this->file['password']) < 6){
           $this->error = "Password Too short: < 6 chars";
           return false;
       }
       if($this->file['password'] == $this->file['confirmPassword']){
           return true;
       }
       $this->error = "Passwords do not match";
       return false;
    }
   
    private function checkEmail(){
        if(filter_var($this->file['email'], FILTER_VALIDATE_EMAIL) ||
           is_null($this->UsersObj->doFindOne('email',$this->file['email']))){
            return true;
        }
       $this->error = "Invalid Email";
       return false;
    }

    private function checkUserName(){
       
        if(is_null($this->UsersObj->doFindOne('username',$this->file['username']))){
            return true;
        }  
        $this->error = "User name: \"".$this->file['username']."\" already exists!";
        return false;
    }
 
     /**
     *@{
     *route:api/users,
     *method:POST,
     *"description:Creates a new user by
     * {name:string,username:string,email:email,
     *confirmPassword:string} "
     *}@
     */
    private function createUser(){
   
        $roles = ($this->file['roles'])? $this->file['roles'] : '';
        
        $post  = array(
            'id'       => null,
            'name'     => $this->file['name'],
            'last'     => $this->file['last'],
            'email'    => $this->file['email'],
            'username' => $this->file['username'],
            'roles'    => $roles
        );
        // Add admin to username admin
        // this creates an administer to user with name Admin.
        if(strtolower($this->file['username']) == 'admin'){
            if(is_array($post['roles'])){
                array_push($post['roles'],'admin');
            }
            $post['roles'] = array('admin');
        }
         
       if($this->checkUserName() && $this->checkPass() && $this->checkEmail()){

            $user = new usersSchema($post);
            $user->salt();
            $user->hash($this->file['password']);
                     
            $result = $this->UsersObj->doCreate($user);
             
            if(!$result){
                return $this->error_result($this->UsersObj);
            }
 
            $uvals = $user->getUser();
            $uvals['_id'] = $uvals['_id']->{'$id'};
            // return values for login.
            $ret['email']    = $uvals['email'];
            $ret['password'] = $this->file['password'];
            
            return $ret;
   
        }
        return $this->error(array('error'=>$this->error),404);
    }
    
    /**
     *@{
     *route:api/users/forgot,
     *method:PUT,
     *"description:Hashes new password and marks user as pending by {address:email}"
     *}@ 
     */
    private function forgotPassword(){
        require_once('lib/mail/mailers.php');

        
        $userdata = $this->UsersObj->doFindOne('email',$this->file['email']);
        if(!$userdata){
            return $this->error_result($this->UsersObj);
        }

        $user = new usersSchema($userdata);
        $user->salt();
        $temphash = base64_encode($user->hash($this->file['email']));
        $user->user['pending']         = $temphash;
        $user->user['hashed_password'] = "null";
        $msg = "Your account has been locked. Pending a password reset Please check "
             . "your email for instructions ";

        $result = $this->UsersObj->doUpdate($user,$msg);
        
        require_once('lib/mail/mailers.php');
       
//        $options = array('hash'=>$temphash,'toName'=>$user->user['name']);
//        sendMail::mailPasswordReset($options);
//        sendMail::send();
        
         if($result){
            return array('msg'=>$this->UsersObj->getMessage(),
                         'key'=>$temphash);
         }
         return $this->error_result($result);
    }

     /**
     *@{
     *route:api/users/newpass,
     *method:PUT,
     *"description:Hashes a new password for an authenticated user."
     *}@ 
     */
    protected function changePassword(){
        $this->file['_id'] = $this->token->jti->_id;
        $userdata = $this->getUser();
        if(!$userdata){ return $this->error(array('message'=>"BAD USERDATA"));}
        if($this->checkPass()){
            $user = new usersSchema($userdata);
            if($user->validate($this->file['oldPassword'])){
                $user->salt();
                $newhash = $user->hash($this->file['password']);
                $user->set('hashed_password',$newhash);
                $user->set('pending',null);
                // update the user object.
                return $this->doUpdate($user,'Password has been changed');
            }
            return $this->error(array('error'=>"The current password is invalid"));
        }
        return $this->error(array('error'=>"The new passwords do not match")); 
    }
    
   
   /**
   *@{
   *route:api/users/reset,
   *method:PUT,
   *"description:Changes a user password by {_id:mongoid,password:string}"
   *}@
   */
    protected function resetPassword(){  
        $userdata = $this->UsersObj->doFindOne($this->args[0],$this->args[1]);
        if(!$userdata){
            return $this->error_result($this->UsersObj);
        }
        if(!$this->checkPass()){
            return $this->error(array('error'=>'Passwords are incorrect'),404);
        }
        
        $user = new usersSchema($userdata);
        $user->user['hashed_password'] = false;
        $user->salt();
        $user->hash($this->file['password']);
        $user->user['pending'] = "null";
        $result = $this->UsersObj->doUpdate($user,'New Password has been set!');
        if(!$result){
            return $this->error_result($result);
        }     
        return $this->UsersObj->getMessage();
          
    }
    
  /**
   * @{
   * route:api/users/:id,
   * method:PUT,
   *"description:updates a user by {_id:mongoid}"
   *}@
   */
    private function PUT_users_process(){
        $user    = new usersSchema($this->file); 
        $user->user['_id'] = new MongoId($user->user['_id']);
       // return array('message'=>json_encode($user->getArray()));
        $result  = $this->UsersObj->doUpdate($user,'User Updated');
        if($result){
            return $this->UsersObj->getMessage();
        }
        return $this->error_result();
    }
    
   /**
   * @{
   * route:api/users/:id,
   * method:GET,
   *"description:Get a user resource by query"
   *}@
   */
    public function GET_users_process(){
        $filters = new filters($this->args,$this->verb);
        $params  = $filters->getParameters();
        $returns = array();

        // returns a query for key value if verb is not exclusive.
        if(isset($params['query']['_id'])){
            $params['query']['_id'] = new MongoId($params['query']['_id']);
        }
        $result = $this->UsersObj->doQuery($params);
        
        if(!$result){
            if($this->UsersObj->hasError()){
                return $this->error_result($this->UsersObj);
            }
            return $this->error_result($this->UsersObj);
        }
         
        foreach ($result as $k => $value ){
          $user = new usersSchema($value);
          $user->clearRestricted();
          array_push($returns,$user->getArray()); 
        }  
        return $returns;

    }
   
  /**
   * @{
   * route:api/users/exists,
   * method:GET,
   *"description:Returns BOOL, Test if a user exists"
   *}@
   */
    private function GET_exists(){
        $result = $this->UsersObj->doFindOne($this->args[0],$this->args[1]);
        if(isset($result[$this->args[0]])){
           return array('exists'=>true);
        }
        return array('exists'=>false);
    }
    
    private function authTest(){
        if($this->auth->authenticateRequest()){
            return $this->auth->authenticateRequest();
        }else{
            return $this->error(array('message'=>'no authentication'),404);
        }
    }
        
    protected function users() {
        switch($this->method){ 
            case parent::DELETE:
                return $this->DELETE_users_process();
            case parent::PUT:
                if($this->verb == 'newpass'){
                    return $this->changePassword();
                }
                if($this->verb == 'forgot'){
                   return $this->forgotPassword();
                }
                if($this->verb == 'reset'){
                   return $this->resetPassword();
                }
                return $this->PUT_users_process();
            case parent::POST:    
                return $this->createUser();
            case parent::GET: 
                // compares verb to the array of api info commands
                if($this->info()){
                    return $this->ApiInfo($this);
                }
                if($this->verb == 'exists'){
                    return $this->GET_exists();
                }
                if($this->verb == 'mail'){
                    return $this->testMail();
                }
                // authorized
                return $this->GET_users_process();
            
		}
        }
     }