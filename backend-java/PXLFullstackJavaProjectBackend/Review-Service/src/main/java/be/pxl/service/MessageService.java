package be.pxl.service;

import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessageService {
    private static final Logger logger = LoggerFactory.getLogger(MessageService.class);

    private final RabbitTemplate rabbitTemplate;

    public MessageService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendRejectionMessage(String reviewId) {
        String rejectionMessage = "Review Rejected: " + reviewId;
        logger.info("Sending rejection message to RabbitMQ queue: {}", rejectionMessage);
        try {
            rabbitTemplate.convertAndSend("rejectionQueue", rejectionMessage);
            logger.debug("Rejection message successfully sent to RabbitMQ queue");
        } catch (Exception e) {
            logger.error("Error sending rejection message to RabbitMQ queue", e);
        }
    }
}