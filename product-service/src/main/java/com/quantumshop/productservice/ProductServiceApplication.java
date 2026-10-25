package com.quantumshop.productservice;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.Arrays;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class ProductServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductServiceApplication.class, args);
    }

@Bean
CommandLineRunner debug(Environment env) {
    return args -> {
        System.out.println("====================================");
        System.out.println("Active Profiles : " + Arrays.toString(env.getActiveProfiles()));
        System.out.println("DB_HOST         : " + env.getProperty("DB_HOST"));
        System.out.println("DB_NAME         : " + env.getProperty("DB_NAME"));
        System.out.println("Datasource URL  : " + env.getProperty("spring.datasource.url"));
        System.out.println("====================================");
    };
}

}





