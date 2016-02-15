<?php //

require_once('PHPMailer/PHPMailerAutoload.php');
//require_once('simple_mail.php');

class sendMail{
//    
    private static $que = array();
    
    // options hash and toName
    public static function mailPasswordReset($options){

        $mail = new PHPMailer();   
        // from address

        $mail->From     = "matjbaker@gmail.com";
        $mail->FromName = "Admin";
        $mail->addAddress("matjbaker@gmail.com","User");
        $mail->addReplyTo("matjbaker@gmail.com","Admin");
        
        //Send HTML or Plain Text email
        $mail->isHTML(true);      
        $request = new passwordResetRequest($options);

        $mail->Subject = "Reset Password Request";
        $mail->Body    =  $request->getBodyHtml();
        $mail->AltBody =  $request->getBodyText();
        
        array_push(self::$que,$mail);  
       
    }
   
   static function send(){

        foreach(self::$que as $k=>$mail){
            if(!$mail->send()) {
                return "Mailer Error: " . $mail->ErrorInfo;
            } else {
                return "Message has been sent successfully";
            }
        }
    }
}

class passwordResetRequest{

    private $template;
    private $replace = array();
    
    function __construct($options){
        $this->replace = array(
                'HASH'=>$options['hash'],
              'TONAME'=>$options['toName']);
        $this->template = file_get_contents('lib/mail/reset-request.html');
    }
    
    public function getBodyHtml(){
        foreach($this->replace as $k=>$v){
           $this->template = str_replace('{'.$k.'}',$v,$this->template);
        }
        return $this->template;
    }
    
    public function getBodyText(){
      return "mail text";  
    }   
}
