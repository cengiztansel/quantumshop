package com.quantumshop.productservice.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class BasketEventConsumer {

    @RabbitListener(queues = "basket.queue")
    public void consume(String message) {

        System.out.println("EVENT RECEIVED FROM RABBITMQ:");
        System.out.println(message);
    }
}
