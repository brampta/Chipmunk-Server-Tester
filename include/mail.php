<?php


function send_mail($to, $toname, $from, $fromname, $subject, $message_html, $message_text){
    if(MAIL_SENDING_METHOD=='sendgrid'){
        global $sendgrid_api_key, $message;

        require_once (dirname(dirname(__FILE__)) . '/sendgrid-php/sendgrid-php.php');
        $email = new \SendGrid\Mail\Mail();

        $email->addTo($to,$toname);
        $email->setFrom($from,$fromname);
        $email->setSubject($subject);
        if($message_html){
            $email->addContent("text/html", $message_html);
        }
        if($message_text){
            $email->addContent("text/plain", $message_text);
        }

        $sendgrid = new \SendGrid($sendgrid_api_key);
        try {
            $response = $sendgrid->send($email);

            /*
            echo "<h4>status code</h4>";
            print $response->statusCode() . "\n";
            echo "<h4>headers</h4>";
            print_r($response->headers());
            echo "<h4>body</h4>";
            print $response->body() . "\n";
            echo "<hr>";
            */

            if(substr($response->statusCode(),0,1)=='2'){
                $message_type='success';
            }else{
                $message_type='notice';
            }
            $message->add_message($message_type,__('sendgrid responded with status code: %1',$response->statusCode()));

            return $response;
        } catch (Exception $e) {
            echo 'Caught exception: '. $e->getMessage() ."\n";
            $message->add_message('error',__('Caught exception: ').$e->getMessage());
        }
    }else if(MAIL_SENDING_METHOD=='custom'){
        global $customization_folder;
        $custom_mail_file=CUSTOM_MAILER_PATH;
        if(file_exists($custom_mail_file)){
            include $custom_mail_file;
            send_mail_custom($to, $toname, $from, $fromname, $subject, $message_html, $message_text);
        }
    }

}