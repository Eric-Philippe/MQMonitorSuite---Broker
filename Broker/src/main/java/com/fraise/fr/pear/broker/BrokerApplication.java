package com.fraise.fr.pear.broker;

import com.fraise.fr.pear.broker.config.Config;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jms.annotation.EnableJms;

@SpringBootApplication
@EnableJms
public class BrokerApplication {
	public static void main(String[] args) {
		System.out.println("This Jvm is Broker");

		try {
			SpringApplication.run(BrokerApplication.class, args);
			System.out.println(Config.getProperty("mq.queue"));
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Broker failed to start: " + e.getMessage());
			throw e;
		}

		String port = Config.getProperty("server.port");
		System.out.println("Broker API server is available at http://localhost:" + port);
	}
}
