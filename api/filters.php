<?php

// eventually will auto load library code 
// in accordance with database mode.
// require_once("lib/parser/APIParse.php");

class filters {
      
    private $query    = array();
    private $options  = array();
    private $KEYS     = array('limit','ct','(-)','q','start','sort','fields','sub','where','&','count');
    
    function __construct($args,$verb){  
       
        $this->query = array_merge(array($verb),$args); 

    }
    // splits del, sets value on array and iterates param
    private function subset($del,$value,$param){
        $pas   = preg_split($del,$param);
        $new   = array();
        foreach($pas as $p){
            $new[$p] = 1;
        }
        //print_r($new);
        return $this->options[$value] = $new;
    }
    
    private function sorts($param){
        $params = split(',',$param);
        foreach($params as $p){
            $rep   = array('/\(.*\)/');
            $clean = trim(preg_replace($rep,'',$p));
            if(strstr($p,'(a)')){
               array_push($this->options['sort'],array($clean=>1));
            }else if(strstr($p,'(d)')){
                array_push($this->options['sort'],array($clean=>-1));
            }else{
                array_push($this->options['sort'],array($clean=>1));
            }
        }
    } 
 
    // search for known filter values.
    private function index($val){
       $s = array_search($val, $this->query) + 1;
        if (in_array($val, $this->query)) {
            
            if ($val == 'fields') {
                $this->options['fields'] = array();
                $this->subset(',', 'fields', $this->query[$s]);
            }else if ($val == 'ct'){
                $this->options['ct'] = '1';
            } else if ($val == 'sort') {
                $this->options['sort'] = array();
                $this->sorts($this->query[$s]);
            } else {
                $this->options[$val] = $this->query[$s];
            }
        }
    }
    
    // build up the query parameters array.
    public function getParameters(){
 
      if( count($this->query) == 1 ){
          if(!$this->query[0]){
              return null;
          }
        if(!in_array($this->query[0],$this->KEYS)){
            $this->options['query']['_id'] = $this->query[0];
        }
      }
      
      for($i = 0; $i < count($this->query); $i++){
          $n = array_search($this->query[$i],$this->query) + 1;
          if(!in_array($this->query[$i],$this->KEYS)){
              if(!$this->query[$n]){continue;}

                 $this->options['query'][$this->query[$i]] = $this->query[$n];
                 $i++;

            }else{
              $this->index($this->query[$i]);
              $i++;
            }
          }
        
        return $this->options;
    }
}
