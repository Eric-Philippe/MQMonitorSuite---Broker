package com.fraise.fr.pear.broker.controller;

import com.fraise.fr.pear.broker.resolver.Resolver;
import com.fraise.fr.pear.broker.resolver.ResolverOrigin;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Properties;

@RestController
public class PropertiesController {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private Resolver resolver;

    public PropertiesController(Resolver resolver) {
        this.resolver = resolver;
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/properties")
    public ObjectNode getAllRoutesProperties() {
        Properties properties = new Properties();
        ObjectNode json = objectMapper.createObjectNode();

        try {
            properties.load(getClass().getClassLoader().getResourceAsStream("routes.properties"));
            ObjectNode finalJson1 = json;
            properties.forEach((key, value) -> finalJson1.put(key.toString(), value.toString()));
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Sort the properties by key
        json = objectMapper.createObjectNode();
        ObjectNode finalJson = json;
        properties.entrySet().stream()
                .sorted((e1, e2) -> e1.getKey().toString().compareTo(e2.getKey().toString()))
                .forEach(e -> finalJson.put(e.getKey().toString(), e.getValue().toString()));

        return json;
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/app-properties")
    public ObjectNode getAllAppProperties() {
        Properties properties = new Properties();
        ObjectNode json = objectMapper.createObjectNode();

        try {
            properties.load(getClass().getClassLoader().getResourceAsStream("application.properties"));
            ObjectNode finalJson1 = json;
            properties.forEach((key, value) -> finalJson1.put(key.toString(), value.toString()));
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Sort the properties by key
        json = objectMapper.createObjectNode();
        ObjectNode finalJson = json;
        properties.entrySet().stream()
                .sorted((e1, e2) -> e1.getKey().toString().compareTo(e2.getKey().toString()))
                .forEach(e -> finalJson.put(e.getKey().toString(), e.getValue().toString()));

        return json;
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/app-routes")
    public ObjectNode getAllRoutes() {
        ResolverOrigin origin = this.resolver.loadRoutes(false);
        Map<String, String> routes = this.resolver.getRoutes();

        ObjectNode json = objectMapper.createObjectNode();
        ObjectNode finalJson = json;
        routes.forEach((key, value) -> finalJson.put(key, value));
        // Add the origin of the routes
        finalJson.put("source", String.valueOf(origin));

        return json;
    }
}
