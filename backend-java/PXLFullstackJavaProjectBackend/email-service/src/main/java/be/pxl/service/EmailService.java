package be.pxl.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @RabbitListener(queues = "statusInformationQueue")
    public void listen(String in) {
        logger.info("Received message from RabbitMQ queue: {}", in);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("wouter.noreply@gmail.com");
            message.setTo("wouter.jacobs@student.pxl.be");

            if (in.startsWith("Review Approved:")) {
                message.setSubject("Post Approved");
                message.setText("Your post has been approved.\n\n" + in);
            } else {
                message.setSubject("Post Rejected");
                message.setText("Your post has been rejected.\n\n" + in);
            }

            mailSender.send(message);
            logger.info("Email sent successfully for message: {}", in);
        } catch (Exception e) {
            logger.error("Error sending email", e);
        }
    }
}