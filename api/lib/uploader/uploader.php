<?php

/* 
 * File uploader class
 * created by matt B.
 */

class uploader{
    
    private $file;
    private $userid;
    private $imagesOnly = true;
    private $imageFileType; 
    private $target_file;
    private $directory;
    private $logfile;
    public  $error;
    private $result;
    private $log = true;
    private $types = array('jpg','png','jpeg','gif');
    
    function __construct($file,$userid){
        $this->file          = $file;
        $this->userid        = $userid;
        $this->directory     = "../user-content/".$userid;    
        $this->target_file   = $this->directory."/".basename($this->file['name']);
        $this->uploadOk      = 1;
        $this->imageFileType = pathinfo($file,PATHINFO_EXTENSION);
     
        $this->logfile       = $this->directory."/log";
    }
    
    private function sterilize(){
       
        // create users gallery directory.
        if(!$this->check(is_dir($this->directory))){
            mkdir($this->directory);
        }
        // only images
        if($this->imagesOnly){
            if($this->check(getimagesize($this->file['file']['tmp_name']))){
                $this->error  = true;
                $this->result['msg'] = "File is not an image";
                return false;
            }
        }
        
        if($this->check(file_exists($this->target_file))){
            $this->error  = true;
            $this->result['msg'] = "Target file already exists ".$this->target_file;  
            return false;
        }
        
        if($this->check($this->file['size'] > 1000000)){
            $this->error  = true;
            $this->result['msg'] = "File is too large";
            return false;
        }
        
        if($this->check(array_search(strtolower($this->file['type']),$this->types) > 0)){
            $this->error  = true;
            $this->result['msg'] = "File type not allowed";
            return false;
        }  
        
        return true;
    }
    
    private function log($newlog){
        if(!$this->log){ return;}
        $contents    = file_get_contents($this->logfile);
        $newcontents = $contents."\n--".$newlog;
        file_put_contents($this->logfile,$newcontents);
    }
    
    private function check($stmt){
        return($stmt)? true : false;
    }
   
    public function getPath(){
        return $this->target_file;
    }
    
    public function upload(){
        
        $this->result['file'] = "user-content/".$this->userid."/".basename($this->file['name']);
        
        if(!$this->sterilize()){
            $this->log($this->result['msg']);
            return $this->result;
        }
        
        
        if(move_uploaded_file($this->file["tmp_name"], $this->target_file)) {
            $this->result['msg'] =  "The file " . basename($this->file["name"]) . " has been uploaded.";
        } else {
            $this->result['msg'] =  "Sorry, there was an error uploading your file.".$this->target_file;
        }
        $this->log($this->result['msg']);
        return $this->result;
    } 
}