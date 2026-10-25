
package com.quantumshop.orderservice.messaging;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import com.quantumshop.orderservice.model.BasketItem;
import com.quantumshop.orderservice.model.OrderEntity;
import com.quantumshop.orderservice.repository.OrderRepository;

@Component
public class BasketEventConsumer {

/*    @RabbitListener(queues = "basket.queue")
    public void consume(String message) {
        System.out.println("EVENT RECEIVED FROM RABBITMQ:");
        System.out.println(message);
    }
*/
    private final OrderRepository repository;

    public BasketEventConsumer(OrderRepository repository) {
        this.repository = repository;
    }

    @RabbitListener(queues = "order.queue")
    public void consume(BasketItem item) {
        System.out.println("Received basket event: " + item.getProductName());
        OrderEntity order = new OrderEntity(item.getProductName(), item.getQuantity(), "CREATED");
        repository.save(order);
        System.out.println("Order saved successfully");
    }

}
