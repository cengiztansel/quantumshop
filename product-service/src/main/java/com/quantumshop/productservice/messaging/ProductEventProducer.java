package com.quantumshop.productservice.messaging;
import com.quantumshop.productservice.config.RabbitConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

//@Component
public class ProductEventProducer {

    private final RabbitTemplate rabbitTemplate;

    public ProductEventProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendProductCreatedEvent(String message) {
        rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE, RabbitConfig.ROUTING_KEY, message);
        System.out.println("RabbitMQ EVENT SENT -> " + message);
    }
}
