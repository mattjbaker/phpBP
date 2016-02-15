<?php
// My ultra sloppy REST  V 1.0 (skimpy) 
// This is the entry point for the apis
// Requests from the same server don't have a HTTP_ORIGIN header
// Turn off all error reporting
 error_reporting(1);
 ini_set("display_errors", 1);

if (!array_key_exists('HTTP_ORIGIN', $_SERVER)) {
    $_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
}try{
    
    require_once ("lib/rh_compat/rh_compat.php");
//    require_once ("lib/password_compat/lib/password.php");
    require_once ("lib/data/schema.php");
    require_once ("lib/data/db.php");
    require_once ("lib/NoAuth/NoAuth.php");
    require_once ("lib/apinfo/info.php");
    
    require_once ("filters.php");
    require_once ("factory.php");
    require_once ("APIAbstract.php");
   
    
    require_once ("../app/settings.php");
    
    $request = (isset($_REQUEST['request']))? $_REQUEST['request'] : "";
    $route = new ApiFactory($request,$_SERVER['HTTP_ORIGIN']);
    $API   = $route->init();
      
    if(is_object($API)){
         echo $API->processAPI(); 
    }

} catch (Exception $e) {
    echo json_encode(Array('error' => $e->getMessage()));
}


