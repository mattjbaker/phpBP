<?php
require_once('models/files.php');
require_once('models/users.php');
require_once('lib/uploader/uploader.php');
 
final class filesApi extends API{
 
    private $FilesObj;
    private $UsersObj;
    
    function filesApi($request){
        parent::__construct($request);
        
        $this->FilesObj = $this->db->getCollection('files');
        $this->UsersObj = $this->db->getCollection('users');
    }
    
    private function PUT_files_process(){
        
    }
    
    private function DELETE_files_process(){
        $id   = new MongoId($this-verb);
        $data = $this->FilesObj->doFindOne('_id',$id);
        $file = new FilesSchema($data);
        
        if(file_exists($file->file['path'])){
            unlink($file->file['path']);
        }     
        
       $result = $this->FilesObj->doDelete($this->verb,"File Removed");
       
       if($result){
           return $this->FilesObj->getMessage();
       }
       return $this->error_result($this->FilesObj);
    }
    
    private function POST_files_process(){
        $upload = new uploader($this->upload['file'],$this->file['user']);
        $res    = $upload->upload();
        if(!$upload->error){
            $data    = array(
                             'file'=>$this->upload['file'],
                             'user'=>$this->file['user'],
                             'path'=>$upload->getPath()
                    );
            $files  = new filesSchema($data);
            $result = $this->FilesObj->doCreate($files,'Uploaded');
            if($result){
                return $res;
            }
            return $this->error_result($this->FilesObj);
        }
        return $res; 
    }  
    
    private function GET_files_process(){  
        $returns = array();
        $filters = new filters($this->args,$this->verb);
        $params  = $filters->getParameters();
        $result  = $this->FilesObj->doQuery($params);
       // die(print_r($params));
        
        if(!$result){
           return $this->error_result($this->FilesObj);
        }
        
        foreach ($result as $k => $value ){
          $file = new filesSchema($value);
          array_push($returns,$file->getArray()); 
        }
        
        if($params['ct'] == 1){
          return array('total'=> count($returns));
        }
              
        if(!$returns){
            // empty response returns array.
            return array('message'=>'No data available');
        }
        
        if($this->verb == 'count'){
            return array('total'=>count($returns));
        }
        return $returns;
    }
    
    function files(){
        switch($this->method){
            case self::PUT:
                return $this->PUT_files_process();
            case self::DELETE:
                return $this->DELETE_files_process();
            case self::POST:
                return $this->POST_files_process();
            case self::GET:
                return $this->GET_files_process();

        }
    }  
}