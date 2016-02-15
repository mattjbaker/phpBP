<?php


//require_once('cssparser.php');
require_once('cssmin.php');
//require_once('CSS-Parser-master/parser.php');

class find_stylesheets{
    
    private $parser;
    private $keep;
    private $held;
    private $parsed;
    private $missed = 0;
    private $css_files = array();
    private $css_mash;
    private $html_content;
    
    function __construct($url,$flags=false){
       // flags to set the opotions on the output and selections.
//       $this->parser = new CSSParser(); // create a new parser instance.
       $page = file_get_contents($url);
       preg_match_all('/href=\"([^\"]*)\"/', $page, $matches);
       foreach($matches[0] as $k=>$v){
           if(strstr($v,'.css')){ 
               $file = str_replace("/phpBp/","",$v);
               $file = str_replace("href=",'',$file);
               $file = str_replace('"','',$file);
               
               if(file_exists($file)){
           
                    $this->css_files[] = $file;
                    $content = file_get_contents($file);
                    $path = dirname($file);
                    $content = str_replace('../fonts/','../../'.$path.'/fonts/',$content);
                  
                    
                    $this->css_mash .=  $content;
                    echo $this->css_mash;
                  
               }else{ $this->missed++; }
           }
       }  
       

       
//       $ag = new agregateViews();
//       $this->html_content = $ag->getRaw();
//       $this->parsed = $this->parser->parseCSS($this->css_mash);
//       $this->findUnused();
    }

    function getLocalCSS(){
        
       //echo $this->css_mash;
        $filters = array
        (
        "ImportImports"                 => false,
        "RemoveComments"                => true, 
        "RemoveEmptyRulesets"           => true,
        "RemoveEmptyAtBlocks"           => true,
        "ConvertLevel3AtKeyframes"      => false,
        "ConvertLevel3Properties"       => false,
        "Variables"                     => true,
        "RemoveLastDelarationSemiColon" => true
        );
// Minification WITH filter or plugin configuration 

$plugins = array
        (
        "Variables"                     => true,
        "ConvertFontWeight"             => true,
        "ConvertHslColors"              => true,
        "ConvertRgbColors"              => true,
        "ConvertNamedColors"            => true,
        "CompressColorValues"           => true,
        "CompressUnitValues"            => true,
        "CompressExpressionValues"      => true
        );
// Minify via CssMin adapter function
//$result = CssMin::minify($this->css_mash, $filters, $plugins);
// Minify via CssMinifier class

$minifier = new CssMinifier($this->css_mash, $filters, $plugins);
return $minifier->getMinified();
//file_put_contents('app/compiled/compiled.css',$result);
    }
    
    function getTrash(){
        return print_r(array_keys($this->trash));
    }
    
    function getCssFiles() {
        return print_r($this->css_files);
    }

    function getCounts(){
       return "TOTAL: ".
//                count($this->parser->getCSSArray($this->parsed)).
                "<br>".
                "USED: ".
                count($this->keep);
    }

    function getAll(){
//        return $this->parser->getCSSArray($this->parsed);
    }
    
    function getParsed(){
        return $this->keep;
    }

    function createFile(){
//        file_put_contents("testmaster.css",$this->parser->convert($this->keep));   
    }
    
    function findSubs($css,$val){
        
        foreach($css as $k=>$v){
            $rules = array($val);
            $regex = '/(' .implode('|', $rules) .')/i'; 
            if(@preg_match($regex,$k)){
                 $this->keep[$k] = $v; 
//                 $this->findSubs($css,$k);
            }
        }
    }
//    
//    function findUnused(){
//      
////        $css = $this->parser->GetCSSArray($this->parsed);
//
//        foreach($css as $k=>$v){   
//            if((substr($k, 0, 1) === '.') ||
//               (substr($k,0,1)  === '#'))  {
//                $x      = str_replace('.','',$k);
//                $x      = str_replace('#','',$x);
//                $rules = array($x);
//                $regex = '/(' .implode('|', $rules) .')/i'; 
//                if(preg_match_all($regex,$this->html_content,$matches)){
//                 
//                   $this->keep[$k] = $v;
//                   $this->findSubs($css,$k);
//                }
//                $this->trash[$k] = $k;
//                
//            }
//
//        }
//     
//    }

    function totalRules(){
//       return $this->parsed->cssCounter;
    }
    
    function getRules(){
//        return $this->parser->parsed;
    }
    
    function getInUse(){
       return  array_keys($this->keep);
    }
    
    function getUnused(){
       return array_keys($this->remove);
    }
    
    function getTotal(){
       echo "IDS: ".count($this->ids[0]);
       echo "<br> Classes: ".count($this->classes[0]);
        
    }
    
    function listMatches(){
        print_r($this->parsed);
    }    
}


class agregateViews{
    
    
    private $files = array();
    private $paths = array();
    private $html_mash;
    
    function __construct(){
       $this->agregate();
    }
    
    function getRaw(){
        return $this->html_mash;
    }
    
    function getFiles(){
        return $this->files;
    }
    
    function agregate($dir=false){
        if(!$dir){$dir = 'packages'; }
        
        foreach(new DirectoryIterator($dir) as $file){

             if(!$file->isDot()){
                 if($file->isDir()){  
                     $this->agregate($file->getPathname());
                 }else if($file->getExtension() == 'html'){
                      $this->files[] = $file->getPathname();
                      $this->html_mash .= file_get_contents($file->getPathname());
                   
                 }      
             }
        }
    }
}

