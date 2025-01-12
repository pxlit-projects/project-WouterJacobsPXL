package be.pxl.service;

import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessageService {
    private static final Logger logger = LoggerFactory.getLogger(MessageService.class);
    private static final String QUEUE_NAME = "statusInformationQueue";

    private final RabbitTemplate rabbitTemplate;

    public MessageService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendRejectionMessage(String rejectionReason) {
        String rejectionMessage = "Review Rejected: " + rejectionReason;
        logger.info("Sending rejection message to RabbitMQ queue: {}", rejectionMessage);
        try {
            rabbitTemplate.convertAndSend(QUEUE_NAME, rejectionMessage);
            logger.debug("Rejection message successfully sent to RabbitMQ queue");
        } catch (Exception e) {
            logger.error("Error sending rejection message to RabbitMQ queue", e);
        }
    }

    public void sendApprovalMessage(String approvalMessage) {
        String message = "Review Approved: " + approvalMessage;
        logger.info("Sending approval message to RabbitMQ queue: {}", message);
        try {
            rabbitTemplate.convertAndSend(QUEUE_NAME, message);
            logger.debug("Approval message successfully sent to RabbitMQ queue");
        } catch (Exception e) {
            logger.error("Error sending approval message to RabbitMQ queue", e);
        }
    }
}