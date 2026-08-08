package com.flexserv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class FlexServApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlexServApiGatewayApplication.class, args);
	}

}
