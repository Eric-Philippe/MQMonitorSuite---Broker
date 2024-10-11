package com.fraise.fr.pear.broker.resolver;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Last fallback for routes resolving
 * It uses a JSON file to store the routes and easily put them in memory
 */
public class PhysicalRoutes extends Routes {
    private static final Logger logger = LogManager.getLogger(PhysicalRoutes.class);

    @Value("${app.routing.cache}")
    private String cacheFilePath;

    private ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        File file = new File(cacheFilePath);
        if (file.exists()) {
            try {
                cacheRoutes = objectMapper.readValue(file, HashMap.class);
                isUp = cacheRoutes.size() > 0;
            } catch (IOException e) {
                logger.error("Failed to load cache file", e);
            }
        } else {
            logger.warn("Cache file not found");
        }
    }

    @Override
    public void addRoute(String origin, String destination) {
        saveCache(cacheRoutes);
        cacheRoutes.put(origin, destination);
    }

    public void updateRoutes(Map<String, String> routes) {
        saveCache(routes);
        cacheRoutes = routes;
    }

    /**
     * Update manually the json file with the updated routes
     * @param routes the updated routes
     */
    private void saveCache(Map<String, String> routes) {
        // If the two are not the same
        if (!routes.equals(cacheRoutes)) {
            logger.info("Updating cache file ...");
            try {
                objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(cacheFilePath), routes);
                logger.info("Cache file updated");
            } catch (IOException e) {
                logger.error("Failed to save update file");
            }
        }
    }
}
