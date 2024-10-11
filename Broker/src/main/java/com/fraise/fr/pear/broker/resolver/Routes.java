package com.fraise.fr.pear.broker.resolver;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Abstract class for implementing routes loading and resolving
 */

@Component
public abstract class Routes {
    Map<String, String> cacheRoutes = new HashMap<>();
    boolean isUp = false;

    @PostConstruct
    public abstract void init();

    public Map<String, String> getRoutes() {
        return cacheRoutes;
    }

    public String resolve(String origin) {
        return cacheRoutes.get(origin);
    }

    public void addRoute(String origin, String destination) {
        cacheRoutes.put(origin, destination);
    }

    public void addAll(Map<String, String> routes) {
        cacheRoutes.putAll(routes);
    }

    public void clear() {
        cacheRoutes.clear();
    }

    /**
     * Check if the routes are up
     * If the Routes is up, it means that there is as least one route
     * and the service did not encounter any error while trying to reach the routes
     * @return true if the routes are up
     */
    public boolean isUp() {
        return isUp && cacheRoutes != null && !cacheRoutes.isEmpty();
    }
}
