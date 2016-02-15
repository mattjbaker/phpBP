<?php /* 
 * Created by Matt Baker 2015
 * Sessions simply tracks user logins.
 * and keys. maybe dont use the key in
 * in the this data store.
 */
require_once("models/sessions.php");

final class sessionsApi extends API{
    
    private $SessObj;
    
    function sessionsApi($request){
       parent::__construct($request);
        $this->SessObj = $this->db->getColl('sessions');
       // D\Injector::addClasspath('models');
       // D\Injector::mapClass('sessionsSchema','sessoinsSchema');
    }

    private function setModel($token){
       $dwt = $this->validateToken($token);
       if($dwt){
         $params['_id'] = $token;
         $params['uid'] = $dwt->jti->_id;
         $params['exp'] = $dwt->exp;
         $params['nbf'] = $dwt->nbf;
         $model  = new sessionsSchema($params); 
               //  D\Injector::getInstanceOf('sessionsSchema',array($params),'sessions');
         return $model;
       }
       return false;
    }
    
    public function validateToken($token){
      $params  = array('token'=>$token);
      $dwt     = NoAuth\NoAuth::AuthenticateToken($params);
      return (!is_null($dwt))? $dwt : false;
    }
    
    public function findSession($id){
        $session = $this->SessObj->findOne(array('_id'=>$id));
        return ($session)? $session : false;
    }
     
    // Generate a new unique user session.
    public function createSession($token){  
        $model = $this->setModel($token);
        if(!$model){ return $this->error(array('error'=>'Session model could not be populated'));}
        try{
             $this->SessObj->insert($model->getSession(),$this->insertOptions);
        }catch (MongoCursorException $mce) {
            return $this->error(array('error'=>$mce->getMessage()),404);
        }catch (MongoCursorTimeoutException $mcte) {
            return $this->error(array('error'=>$mcte->getMessage()),404);
        }
        return true;
    }

    // Destroy a user session.
    public function destroySession($token){
        $model = $this->setModel($token);
        return $this->SessObj->remove(array('uid'=>$model->getUser()));
    }
    
    protected final function sessions(){
        return;
    }
}