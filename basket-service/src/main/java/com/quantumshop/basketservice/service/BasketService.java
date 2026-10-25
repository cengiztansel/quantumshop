package com.quantumshop.basketservice.service;

import com.quantumshop.basketservice.model.BasketItem;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;

@Service
public class BasketService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RabbitTemplate rabbitTemplate;

    public BasketService(
            RedisTemplate<String, Object> redisTemplate,
            RabbitTemplate rabbitTemplate) {

        this.redisTemplate = redisTemplate;
        this.rabbitTemplate = rabbitTemplate;
    }
/*
    public BasketItem addItem(BasketItem item) {

        redisTemplate.opsForValue()
                .set(item.getProductName(), item);

        rabbitTemplate.convertAndSend(
                "basket.exchange",
                "basket.created",
               //item.getProductName()
                item  //Bütün BasketItem gönderilecek
        );

        return item;
    }
*/
    public BasketItem addItem(BasketItem item) {
        System.out.println("STEP-1 Redis save starting");
        redisTemplate.opsForValue()
                .set(item.getProductName(), item);
        System.out.println("STEP-2 Sending RabbitMQ message");
        rabbitTemplate.convertAndSend(
                "basket.exchange",
                "basket.created",
                item
        );
        System.out.println("STEP-3 RabbitMQ message sent");
        return item;
    }

}
