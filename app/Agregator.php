<?php
// package files related to Angular single app
// TODO: add auto aggregation for css.
require_once('Minifier.php');
require_once('settings.php');

class PublicPackage  {
  
  private $dir;         // keyword directory
  private $package;     // keyword package name
  private $directories; // system directories to scan
  
  private $flat    = array();
  private $app     = array();
  private $configs = array();
  private $scripts = array();
  
  private $omit_scripts = array();

  private $styles  = array();
  private $globals = array();
  
  function __construct($dir){
      
     $settings       = new settings();
     $this->settings = $settings->getFrontSide(); 
     $this->dir      = $dir;
     $parts          = split('/',$dir);
     $this->package  = $parts[1];
     $this->directories = array('routes','services','directives',
                                'controllers','assets','filters',
                                'css');
                    
  }


  
  public function addLocalScripts($paths){
  
      if(!is_array($paths)){ return;}
      
      foreach($paths as $p){
      
           array_push($this->local_scripts,$p); 
      }
  }
  
  public function addLocalStyles($paths){
      if(!is_array($paths)){return;}
      
      foreach($paths as $p){
         
            array_push($this->local_styles,$p);
      }
  }
  
  private function aggregateScripts($p){

    $filepath = $this->dir."/$p"; 
    if(!is_dir($filepath)){return;}
    $files = array_diff(scandir($filepath), array('..', '.')); 
    
  
    
    foreach($files as $file){
     // ingore files taged as depreciated
     if(preg_match('/^.*\.(DEP.js)$/i', $file)||
        preg_match('/^.*\.(DEP.css)$/i',$file)){
         continue;
     }  
     if(preg_match('/^.*\.(js)$/i', $file)){
         
        array_push($this->scripts,$filepath."/".$file);
         $this->flat[] = $filepath."/".$file;
    }
    if(preg_match('/^.*\.(css)$/i', $file)){
        array_push($this->styles,$filepath."/".$file);
         //$this->app['styles']= $filepath."/".$file;
    }
   }
  }
 

  // locate the script directories fron the config files.
  // adds locations from comma array in config json, and or use
  // defaults.
  private function findDirs(){
        $src = ($this->settings['source_locations'])? 
        explode(',',$this->settings['source_locations']) : null;
        if(!is_null($src) & is_array($src)){
          
             $dirs        = array_merge($this->directories,$src);
             $directories = array_unique($dirs);
         }else{
             $directories = $this->directories;
         }
         return $directories;
  }
  

  public function init(){  
   
      $directories = $this->findDirs();
              
      foreach($directories as $dir){
         $this->aggregateScripts($dir);
      }
      
      if(file_exists($this->dir."/app.js")){
         // $this->flat[] = $this->dir."/app.js";
          $this->configs[]     = $this->dir."/app.js";
          $this->app['config'] = $this->dir."/app.js";
          $this->app['scripts']['app'] = $this->dir."/app.js";
          $this->app['app']    = $this->dir."/app.js";
      }        
  }
  
  public function addSource($sources){
      $this->flat = $sources;
      $this->app['glob'] = $sources;
  }
  
  public function addPack($dirarray){  
      $this->dir = 'sources';
        foreach($dirarray as $dir){
          $this->aggregateScripts($dir);
        }
  }
  
  // returns global configs.
  public function getConfigs(){
        echo'<script src="'.$this->app['scripts']['app'].'"></script>'."\n"; 
  }
  
  // returns global styles.
  public function getStyles(){
     foreach($this->styles as $s){
         echo '<link rel="stylesheet" type="text/css" href="'.$s.'" />'."\n";
     }
  }

    public function returnSource($key) {
      $ret = array();
      foreach ($this->$key as $s) {
          $source = file_get_contents($s);
          if($key == 'styles'){
            $source = preg_replace('!/\*.*?\*/!s', '', $source);
            $source = preg_replace('/\n\s*\n/', "\n", $source);  
            $source = str_replace('url("../images','url("../../packages/'.$this->package.'/images/',$source);
          }
          array_push($ret,$source);
          
      }
      return implode('',$ret);
    }
    
    public function getScripts($comp=false){
         if(!is_array($this->scripts)){return;}
          foreach($this->scripts as $s){
           echo '<script src="'.$s.'"></script>'."\n";
          }
      }
  
  public function getApp(){
      return $this->app;
  }
  
  // returns sub array of aggregated files for package.
  public function getFiles($id){
      return $this->app['scripts'][$id];
  }
}


class Agregator{
    
    private $root;
    private $packs          = array();
    private $global         = array();
    private $global_scripts = array();
    private $global_styles  = array();
    private $configs        = array();
    private $init_file      = "packages/system/init.js";
    private $compiled_path  = "app/compiled/source";
    
    function __construct(){

        $set = new settings();
        $this->configs = $set->getFrontSide();
       
        if(!file_exists($this->init_file)){
          echo "packages/system/init.js does not exist";
        }
        
        $this->root  = "packages";
        $this->init();
    }

    // add file exists for manually refrenced dependancies.
    public function add($obj){
        if(is_object($obj)){
           $vals = array('_local'=>$obj->getDependancies());
        }
        if(is_array($obj)){
            $vals = $obj;
        }
        
        if(!is_array($vals)){return;}  
        
        
        // idk seems ok
        if(array_key_exists('_local',$vals)){
           
            if(array_key_exists('_scripts', $vals['_local'])){
              $this->global_scripts =  array_merge($this->global_scripts,$vals['_local']['_scripts']);
            }
            
            if(array_key_exists('_styles',$vals['_local'])){
              $this->global_styles =  array_merge($this->global_styles,$vals['_local']['_styles']);
            }
        }
               
        if(array_key_exists('_global',$vals)){
            
            if(array_key_exists('_scripts',$vals['_global'])){
                $this->global_scripts = $vals['_global']['_scripts'];
            }
            if(array_key_exists('_styles',$vals['_global'])){
                $this->global_styles  = $vals['_global']['_styles'];
            }

            $this->global['scripts']  = $vals['_global'];
           
           return;
        }
        
        // add a directory as a direct path to the list.
        if(array_key_exists('_paths',$vals)){
            foreach($vals['_paths'] as $v){
               array_push( $this->global['scripts'],$v);
            }
        }
    }

    private function output($filepath,$type){
       if($type == '.css'){
           return "<link rel=\"stylesheet\" type=\"text/css\" href=\"$filepath\" />";
       }
       return "<script src=\"$filepath\"></script>";
    }
    
    // include dot in type 
    // array to minify and return. 
    private function compile($key,$type){

       $scripts = array();
       if($key == 'init'){
          $scripts[] = file_get_contents($this->init_file);
       }else{
           
            foreach($this->packs as $p){
                $scripts[] = $p->returnSource($key);
            }
            
       }
       
       $val = implode('',$scripts);
       $ret = \JShrink\Minifier::minify($val);
       return $ret;

    }

    // unset compressed file
    function unsetCompression($filepath){
         if(file_exists($filepath)){
            unlink($filepath);
         }
         return;
    }
    
    // populate the packs array.
    public function init(){
        $paths = array_diff(scandir($this->root), array('..', '.'));
        foreach($paths as $pack){   
            if(is_dir($this->root."/$pack")){
                $packObj = new PublicPackage($this->root."/$pack");
                $packObj->init();
                $this->packs[$pack] = $packObj;
            }
        }
    }

    public function loadGlobalPackages(){
       echo "\n<!-- System Global Dependancies Injection -->\n";
       foreach($this->global_scripts as $g){
           echo "<script src=\"$g\"></script> \n";
       }
    }
    
    public function loadGlobalStyles(){
        echo "\n<!-- System Global Styles Injection -->\n";
        foreach($this->global_styles as $s){
 
            echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"$s\" />\n";
        }
        return;
    }
    
    public function loadSources($comp=false){
        
        $content   = array();
        $filepath  = $this->compiled_path.".js";
        
        if($comp){
           if(!file_exists($filepath)){
                $content[0] = $this->compile('init','.js');
                $content[1] = $this->compile('configs','.js');
                $content[2] = $this->compile('scripts','.js');
                $ret = implode('',$content);
                file_put_contents($filepath,$ret);
                echo "\n<!-- Compiling -->\n";
           }
         
           echo "\n<!-- Compressed Scipts Inection -->\n";
           echo $this->output($filepath,'.js');   
           return;
        }
        
        if(file_exists($filepath)){
            $this->unsetCompression($filepath);
        }
        echo "\n<!-- System Init and Modules Injection -->\n";
        echo "<script src=\"$this->init_file\"></script> \n";
        foreach($this->packs as $p){
             $p->getConfigs(); 
        }
        echo "\n<!-- Angular Package files Injection -->\n";
        foreach($this->packs as $p){
             $p->getScripts();
        }
        return;
    }
    
    public function loadStyles($comp=false){
        
        $content   = array();
        $filepath  = $this->compiled_path.".css";
        if($comp){
            if(!file_exists($filepath)){
                $content[] =  $this->compile('styles','.css');
                $ret = implode('',$content);
                
                file_put_contents($filepath,$ret);
                echo "\n<!-- Compiling -->\n";
            }
            echo "\n<!-- Local Style CSS Injections -->\n";
            echo $this->output($filepath,'.css');
            return;
        }

        if(file_exists($filepath)){
            $this->unsetCompression($filepath);
        }
        echo "\n<!-- Local Style CSS Injections -->\n";
        foreach($this->packs as $s){
           $s->getStyles(); 
        }
        return;
    }
}