<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require_once('models/gallery.php');
require_once('models/users.php');
require_once('lib/uploader/uploader.php');
//require_once ("filters.php");
 
final class galleryApi extends API{
  
    private $GalleryObj;
    private $UsersObj;
    
    function galleryApi($request){
        parent::__construct($request);
        $this->GalleryObj  = $this->db->getCollection('gallery');
        $this->UsersObj    = $this->db->getCollection('users');
    }
     
   /**
   *@{
   *route:api/gallery/:_id,
   *method:DELETE,
   *"description:removes an existing file",
   *}@
   */
    private function DELETE_gallery_process(){ 
       if($this->verb == 'defrag'){
           return $this->DELETE_comment_fragments_process();
       }
       $result = $this->GalleryObj->doDelete($this->verb,"Article Removed");
       if($result){
           return $this->GalleryObj->getMessage();
       }
       return $this->error_result($this->GalleryObj);
    }
   /**
   *@{
   *route:api/gallery/,
   *method:PUT,
   *"description:updates an existing file",
   *}@
   */
    private function PUT_gallery_process(){   
       
        unset($this->file['udata']);
        $gallery = new gallerySchema($this->file); 
        $gallery->clear('created'); // retain the time of creation.
        $result  = $this->GalleryObj->doUpdate($gallery,'Article Updated');
        if($result){
            return $this->GalleryObj->getMessage();
        }
        return $this->error_result($this->GalleryObj);
    }
    
   /**
   *@{
   *route:api/gallery/,
   *method:POST,
   *"description:creates a new file",
   *}@
   */
    
    private function POST_gallery_process(){ 
        $gallery = new gallerySchema($this->file);
        $result  = $this->GalleryObj->doCreate($gallery,'Gallery Created');
        if($result){
            return $this->GalleryObj->getMessage();
        }
        return $this->error_result($this->GalleryObj);
    }
    
   /*@{
   *route:api/gallery/,
   *method:GET,
   *"description:performs get requests on galleries",
   *}@
   */
    private function GET_gallery_process(){   

        $filters = new filters($this->args,$this->verb);
        $params  = $filters->getParameters();
        
        // die(print_r($params));
        // returns a query for key value if verb is not exclusive.
        $returns = array();
        $result  = $this->GalleryObj->doQuery($params);
       // die(print_r($params));
        if(!$result){

           return $this->error_result($this->GalleryObj);
        }
        
        foreach ($result as $k => $value ){
          $gallery = new gallerySchema($value);
          array_push($returns,$gallery->getArray()); 
        }  
        
        if($params['ct'] == 1){
          return array('total'=> count($returns));
        }
              
        if(!$returns){
            // empty response returns array.
            //return array();
            return array('message'=>'No data available');
        }
        
        if($this->verb == 'count'){
           return array('total'=>$this->GalleryObj->doCount());
        }
        return $returns;
    }
    
    function gallery(){
        switch($this->method){
            case self::PUT:
                return $this->PUT_gallery_process();
            case self::DELETE:
                return $this->DELETE_gallery_process();
            case self::POST:
                return $this->POST_gallery_process();
            case self::GET:
                return $this->GET_gallery_process();

        }
    }  
}