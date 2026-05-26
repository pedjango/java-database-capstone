package com.pedjango.smartclinic;

import org.springframework.boot.SpringApplication;

public class TestSmartclinicApplication {

	public static void main(String[] args) {
		SpringApplication.from(SmartclinicApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
