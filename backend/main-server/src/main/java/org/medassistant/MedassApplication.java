package org.medassistant;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.openfeign.EnableFeignClients;
import java.time.LocalDateTime;
import java.util.TimeZone;

@Slf4j
@EnableFeignClients
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class MedassApplication {

    public static void main(String[] args) {
        log.info("Starting NSI Application..." + LocalDateTime.now());
        TimeZone timeZone = TimeZone.getTimeZone("GMT+5:00");
        TimeZone.setDefault(timeZone);
        log.info("current LocalDateTime: {}", LocalDateTime.now());
        SpringApplication.run(MedassApplication.class, args);
    }

}