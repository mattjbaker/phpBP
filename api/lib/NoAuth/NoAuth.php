<?php

/* 
 * NoAuth 
 * this package is not tetsted secure but serves as a
 * humble begining. NoAuth is designed to provide
 * minimal security to public facing APIS, however it could
 * be extended to manage local (client) logins as well.
 * Created by Matt Baker 2015
 */


// "iss" (Issuer) Claim
// "sub" (Subject) Claim
// "aud" (Audience) Claim
// "exp" (Expiration Time) Claim
// "nbf" (Not Before) Claim
// "iat" (Issued At) Claim
// "jti" (JWT ID) Claim


namespace NoAuth;
use \Exception;

require_once("php-jwt/JWT.php");
require_once("authenticateConsumerToken.php");
require_once("registerConsumerToken.php");

// NO Auth Factory for token authroization.
class NoAuth{
    
    static function RegisterToken($params){
        $nauth = new registerConsumerToken($params);
        return $nauth->execute();
    }
    
    static function AuthenticateToken($params){
        $nauth = new authenticateConsumerToken($params);
        return $nauth->execute();
    }   
}

// NO Auth Abstract process
abstract class noAuthProcess {

    const CONFIG_FILE = "lib/NoAuth/config.json";
    const DEBUG       =  false;
    const ALG         = 'HSA256';
 
    protected $settings; 
    protected $expects;
    protected $key;
    public    $status;

    function __construct(){
       $this->expects  = array('iss','aud','jti');
       $this->settings = json_decode(file_get_contents(self::CONFIG_FILE),true);
       $this->key      = base64_encode($this->settings['key']);
    }
    

    // print just the key.
    protected function viewKey(){
        return array('settings'=>$this->settings,'key'=>$this->key);
    }
    
    // return bool
    protected function validKey($ukey){
        if($this->key == base64_encode($ukey)){
            return true;
        }
        return false;
    }

    protected function notBefore($time){
        return true;
    }
    
    // return bool
    protected function isExpired($time){
        if($time > time()){
            return true;
        }
        return false;
    }  
    
    // encode the token
    protected function encode($token){
         Token\JWT::$leeway = 60;
         return Token\JWT::encode($token,$this->key);
         
    }
    
    // decode the token
    protected function decode($token){
        Token\JWT::$leeway = 60;
        return Token\JWT::decode($token,$this->key,array('HS256'));
    }

    abstract function execute();
}

class NoAuthException extends Exception{}
class invalidTokenParameterException extends NoAuthException{}
class invalidServerKeyException extends NoAuthException{}
class invalidAlgException extends NoAuthException{}