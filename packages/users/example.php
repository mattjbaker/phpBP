<?php 
//concrete user command
// this is a test of the package command space.
class usersCommand extends Command {


    private $dependancies;
    public  $pack = 'users';
    function __construct() {
        $this->dependancies['_scripts'] = array(
                        'bower_components/moment/src/moment.min.js'
                        );
    }

    public function getDependancies(){
       return $this->dependancies;
    }
}