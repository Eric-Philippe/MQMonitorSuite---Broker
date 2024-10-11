package com.fraise.fr.pear.broker.resolver;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;

/**
 * First and preferred way to resolve routes
 * Directly access the database in order to have the most up-to-date routes
 */
public class APIRoutes extends Routes {
    private static final Logger logger = LogManager.getLogger(APIRoutes.class);

    @Autowired
    @Qualifier("singletonWebClient")
    private final WebClient finalWebClient;

    public APIRoutes(WebClient finalWebClient) {
        this.finalWebClient = finalWebClient;
    }

    @PostConstruct
    public void init() {
        ClientResponse response;
        try {

            response = finalWebClient.get().uri(uriBuilder ->
                            uriBuilder
                                    .path("/getallrouting")
                                    .build()
                    )
                    .exchange()
                    .block();

            if (response != null && response.statusCode().value() == 200){
                ObjectMapper objectMapper = new ObjectMapper();
                cacheRoutes.putAll(objectMapper.readValue(response.bodyToMono(String.class).block(), HashMap.class));

                isUp = !cacheRoutes.isEmpty();
            }
        } catch (Exception e) {
            logger.warn("API Server is not available");
        }
    }

    @Override
    public boolean isUp() {
        this.init(); // Will refresh the routes
        return isUp;
    }

}
