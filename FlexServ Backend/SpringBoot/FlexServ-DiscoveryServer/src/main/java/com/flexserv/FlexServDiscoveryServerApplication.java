package com.flexserv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@EnableEurekaServer
@SpringBootApplication
public class FlexServDiscoveryServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlexServDiscoveryServerApplication.class, args);
	}

}
