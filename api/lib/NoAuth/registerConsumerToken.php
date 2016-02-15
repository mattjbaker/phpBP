<?php

/* 
 * Created by Matt Baker 2015 
 * Class creates a new JWT token for
 * for consumers.
 */

namespace NoAuth;


class registerConsumerToken extends noAuthProcess {
    
    private $params;

    CONST EXPIRES = '5 day';
    CONST ACTIVE  = '0 day';
 
    
    function __construct($params){
        parent::__construct();
        $this->params = $params;
    }

    
    function execute(){

        $token = array(
            "iss" => $this->params['iss'],
            "aud" => $this->params['aud'],
            "iat" => time(),                                 // issue time
            "nbf" => strtotime('+'.self::ACTIVE,time()),     // active time
            'exp' => strtotime('+'.self::EXPIRES,time()),    // expires time
            "jti" => $this->params['jti'],                   // json token id
            "alg" => self::ALG       );                      // encryption algo
        
        return $this->encode($token);
    
   }
}

