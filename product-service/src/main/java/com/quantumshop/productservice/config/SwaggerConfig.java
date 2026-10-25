package com.quantumshop.productservice.config;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI quantumShopAPI() {
        return new OpenAPI().info(
                        new Info()
                                .title("QuantumShop Product Service API")
                                .version("1.0")
                                .description("Enterprise Product Microservice")
                                .contact(new Contact()
                                                .name("Cengiz Tansel")
                                                .email("cengiz_tansel@yahoo.com.tr")
                                )
                );
    }
}
