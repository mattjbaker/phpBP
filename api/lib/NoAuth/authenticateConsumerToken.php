<?php
/* 
 * Created by Matt Baker 2015
 */

namespace NoAuth;

class authenticateConsumerToken extends noAuthProcess {
    
    private $token;

    
    //pass the authenticate parameters and database parameters?
    function __construct($params){

        parent::__construct();

        $this->token = $params['token'];
    }
    

    
    function execute(){
//        if(!$this->validKey($this->userkey)){return false;}
     
//        if(!$dwt || 
//           !$this->isExpired($dwt['exp']) ||
//           !$this->notBefore($dwt['nbf'])){
//            return false;
//        }
        return $this->decode($this->token);
    }
}