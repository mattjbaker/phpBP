<?php

/* 
 * Created by Matt Baker 2015
 *  reqeust header copat 
 *  from php site thanks dude for 
 *  this helpful funciton!
 */
 if (!function_exists('apache_request_headers')) { 
       function apache_request_headers() { 
            foreach($_SERVER as $key=>$value) { 
                if (substr($key,0,5)=="HTTP_") { 
                    $key=str_replace(" ","-",ucwords(strtolower(str_replace("_"," ",substr($key,5))))); 
                    $out[$key]=$value; 
                }else{ 
                    $out[$key]=$value; 
        } 
            } 
            return $out; 
        } 
} 