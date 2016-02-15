<?php
$cmd = isset($_REQUEST['cmd']) ?  $_REQUEST['cmd'] : '';
$org = isset($_SERVER['ORIGIN'])? $_SERVER['ORIGIN'] : null;

require_once("/app/CmdFactory.php"); 
require_once("/app/Agregator.php");
require_once("/app/settings.php");

// also should make package dirs a config.

    $global_scripts = array('_global'=>array('_scripts'=>array(
        'bower_components/angular/angular.min.js',
        'bower_components/angular-resource/angular-resource.min.js',
        'bower_components/angular-route/angular-route.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-messages/angular-messages.min.js',
        'bower_components/angular-ui-utils/ui-utils.min.js',
        'bower_components/angular-cookies/angular-cookies.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/bootstrap/js/collapse.js',
        'bower_components/angular-smart-table/dist/smart-table.min.js',
        'bower_components/moment/min/moment.min.js',
        'bower_components/angularUtils-pagination/dirPagination.js',
        'bower_components/ng-websocket/ng-websocket.js',
        'bower_components/JSON-js/cycle.js',
        'bower_components/html5shiv/dist/html5shiv.min.js',
        'bower_components/ngstorage/ngStorage.min.js',
        'bower_components/ng-file-upload/ng-file-upload.min.js',
        'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
        'bower_components/underscore/underscore-min.js',
        'local_components/matts-angular-carousel/matts-angular-carousel.js'
    )));

    $global_styles = array('_global'=>array('_styles'=>array(
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
        'bower_components/font-awesome/css/font-awesome.min.css',
        'bower_components/animate.css/animate.min.css',
        'local_components/matts-angular-carousel/carousel.css'
    )));

    //$reg     = registry::instance();
    $route   = new CmdFactory($cmd,$org);
    $agg     = new Agregator();
    $configs = new settings();
    
    $agg->add($global_scripts);
    $agg->add($global_styles);
    
    $bag = $configs->getFrontSide(); // Set the front end globals

        $package = $route->init();
        
        if(is_object($package)){
            $agg->add($package);
        }
// include main template and load the site.
include('packages/system/view/index.html');
