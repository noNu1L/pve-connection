package com.nonu1l.pvetool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableScheduling
@EnableTransactionManagement
public class PveToolApplication {

    public static void main(String[] args) {
        SpringApplication.run(PveToolApplication.class, args);
    }

}
