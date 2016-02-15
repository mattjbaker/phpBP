<?php

/**
 * Provides an interface to the site config files.
 * Endpoints contain no delete method intentionally
 */
require_once("end/auth.php");


final class settingsApi extends API{
    
    private $configdir;
    
    function settingsApi($request){  
        parent::__construct($request); 
        $this->configdir = '../app/config';
        
       // D\Injector::mapClass('authApi','authApi');
        //$auth  = new authApi($request);
        //D\Injector::getInstanceOf('authApi',$request,'auth');
        
        //$token = $auth->authenticateRequest();
        //if(!$token && $this->verb !== 'methods' && $this->verb !== 'parents'){
         //   return $this->error(array('error'=>'Unauthorized'),401);
       // }
    }
    
    /**
     *  @{
     * route:api/settings/backup,
     * method:POST,
     * verb:backup,
     * "params: {newfilename:string,config:JSON}",
     * "description:Creates a backup of the site settings by {newfilename:string,config:JSON}"
     * }@
     */
    private function createBackup(){
        $newfile = $this->configdir."/".$this->file['newfilename'].'json';
        if(file_exists($newfile)){
            return $this->error(array('error'=>'Config File already exists please rename file.'));
        }
        file_put_contents($newfile,$this->file['config']);
        return array('Message'=>'Backup created!');
    }
    
     /** 
     * @{
     * route:api/settings/backups,
     * method:GET,
     * verb:backups,
     * params:null,
     * description:returns a list of the currently saved backup files.
     * omits active and default files.
     * }@
     */
    private function getBackupFiles(){
       $ret = array();
       foreach( new DirectoryIterator($this->configdir) as $file){
           if($file->isDot()|| 
              $file->getFilename() === 'default.json' ||
              $file->getFilename() === 'active.json'){continue;}
              array_push($ret,$file->getFilename());
       }
       return $ret;
    }
 
    /** 
     * @{
     * route:api/settings/restore,
     * method:POST,
     * verb:restore,
     * "params:{filename:string}",
     * "description:Uses settings from selected backup file overwrites the active.json file
     * with the selected backup file parameters by {filename:string}."
     * }@
     */
    private function restoreBackup(){
        $file = $this->configdir.'/'.$this->file['filename'];
        if(file_exists($file)){
           $restore = file_get_contents($file); 
           file_put_contents($this->configdir.'/active.json',$restore); 
           return array("message"=>"Configs Loaded!");  
        }
        return $this->error(array('error'=>"Error loading file"));
    }
    
     /** 
     * @{
     * route:api/settings/reset,
     * method:POST,
     * verb:reset,
     * params:null,
     * description: Restore site configs to default.
     * }@
     */
    private function restoreDefault(){
        $file = $this->configdir.'/default.json';
        if(file_exists($file)){
         $defaults = file_get_contents($file);
         file_put_contents($file,$defaults);
         return array('message'=>"Site configs restored to default");
        }
        return $this->error(array('error'=>"Error setting default configs"));
    }
    
    /** 
     * @{
     * route:api/settings/save,
     * method:POST,
     * verb:save,
     * "params: {settings:JSON}",
     * "description:Sets current configs to active by {settings:JSON}"
     * }@
     */
    private function updateSettings(){
        $newsettings = json_encode($this->file['settings']);
        file_put_contents($this->configdir.'/active.json',$newsettings); 
        return array("message"=>"Configs Updated");
    }
    
    /** 
     * @{
     * route:api/settings/all,
     * method:GET,
     * verb:all,
     * out:JSON,
     * description:Returns site configs from file.
     * }@
     */
    private function getSettings(){
       if(!$this->settings){
           return $this->error(array('error'=>'Site settings could not be loaded'));
       }
       return json_decode($this->settings,true);
    }
    
    final protected function settings() {
        // METHOD end point for delete requests.
         switch($this->method){
             case "POST":
                if($this->verb == 'save'){
                    return $this->updateSettings();
                }
                if($this->verb == 'backup'){
                    return $this->createBackup();   
                }
                if($this->verb == 'reset'){
                    return $this->restoreDefault();
                }
                if($this->verb == 'restore'){
                    return $this->restoreBackup();
                }
             case "GET":
                if($this->verb == 'backups'){ 
                    return $this->getBackupFiles();
                }
                if($this->verb == 'all'){
                    return $this->getSettings();
                }    
                if($this->info()){
                    return $this->apiInfo($this);
                }
                return $this->getSettings();
         }

     }
    
}