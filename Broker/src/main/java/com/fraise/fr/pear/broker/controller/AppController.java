package com.fraise.fr.pear.broker.controller;

import com.fraise.fr.pear.broker.config.Config;
import com.fraise.fr.pear.broker.resolver.Resolver;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
public class AppController {
    @Autowired
    private Resolver resolver;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    @Qualifier("singletonWebClient")
    private final WebClient finalWebClient;

    public AppController(Resolver resolver, WebClient finalWebClient) {
        this.resolver = resolver;
        this.finalWebClient = finalWebClient;
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/")
    public String status() {
        String appName = Config.getProperty("spring.application.name");
        String version = Config.getProperty("spring.application.version");
        String port = Config.getProperty("server.port");
        int routesAvailable = resolver.getRoutes().size();
        return appName + " v" + version + " is available at http://localhost:" + port + " with " + routesAvailable + " routes";
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/pmoapistatus")
    public Mono<ObjectNode> pmoapistatus() {
        long startTime = System.currentTimeMillis();
        return finalWebClient.get()
                .uri(uriBuilder -> uriBuilder.path("/version").build())
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> {
                    ObjectNode json = objectMapper.createObjectNode();
                    json.put("status", "API is available");
                    json.put("version", response);
                    json.put("responseTime", System.currentTimeMillis() - startTime);
                    return Mono.just(json);
                })
                .onErrorResume(e -> {
                    ObjectNode json = objectMapper.createObjectNode();
                    json.put("status", "API is not available");
                    return Mono.just(json);
                });
    }
}
