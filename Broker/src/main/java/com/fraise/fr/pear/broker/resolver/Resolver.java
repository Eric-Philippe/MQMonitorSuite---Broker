package com.fraise.fr.pear.broker.resolver;

import com.fraise.fr.pear.broker.resolver.answer.Answer;
import org.apache.logging.log4j.LogManager;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.apache.logging.log4j.Logger;

/**
 * <p>
 *     The Resolver shares technically two sources of routes for its resolving work, virtually 4:
 *      <ol>
 *          <li> API </li>
 *          <li> API/JSON Cache File </li>
 *          <li> JSON File Last Known Routes stored in PhysicalRoutes class Memory </li>
 *          <li> API Last Known Routes stored in APIRoutes class Memory </li>
 *      </ol>
 *
 *      The Resolver class will always be the master memory copying the most recent one
 * </p>
 *
 * <p>
 *      The APIRoutes class has not been made to make the use of its memory, each call from it,
 *      will send a request to the API in order to always prioritize the last and most recent routes
 *      at the cost of putting itself down if the API is down
 *      (letting in that case the JSON File / JSON Memory make the work) </p>
 *
 * <p>
 *     The Resolver will try to resolve the routes by all means with this order:
 *     <ol>
 *         <li> API </li>
 *         <li> Memory </li>
 *         <li> JSON Cache file </li>
 *      </ol>
 * </p>
 */
@Component
public class Resolver {
    private Map<String, String> routes = new HashMap<>();

    private final APIRoutes apiRoutes;
    private final PhysicalRoutes physicalRoutes;

    // Waiting for messages, at what frequency should we update the physical routes from the API
    private static final int UPDATE_INTERVAL = 60 * 60; // 1 hour
    private Date lastUpdate = new Date(System.currentTimeMillis() - UPDATE_INTERVAL * 1000);

    private final Logger appLogger = LogManager.getLogger("broker");

    /**
     * Main class for resolving routes for the Broker
     * It will try to reach the routes independently with its first choice being the API
     * then its memory, then the cache file
     * This class is only meant to be used as a Singleton with Spring (check config/BeanConfig.java)
     * Otherwise, creating a new Resolver will directly load the routes from the API then the JSON in its memory
     */
    public Resolver(APIRoutes apiRoutes, PhysicalRoutes physicalRoutes) {
        this.apiRoutes = apiRoutes;
        this.physicalRoutes = physicalRoutes;

        loadRoutes(true);
    }

    /**
     * Resolves the route eagerly, meaning it will prioritize an older route if it exists
     * using the memory directly
     * @param origin The origin of the route
     * @return The resolved route
     */
    public Answer resolveEager(String origin) {
        return new Answer(origin, routes.get(origin), ResolverOrigin.Memory);
    }

    /**
     * Resolves the route lazily, meaning it will try to resolve the route by all means
     * with this order 1. API 2. Memory 3. Cache
     * @param origin The origin of the route
     * @return The resolved route
     */
    public Answer resolveLazy(String origin) {
        ResolverOrigin source = loadRoutes(false);
        return new Answer(origin, routes.get(origin), source);
    }

    /**
     * Update the whole routes map prioritizing the API over the memory over a json file
     * @param firstLoad If it's the first load of the routes (mainly used for logging)
     * @return The source of the routes (API, Memory, Deprecated Memory, None)
     */
    public ResolverOrigin loadRoutes(boolean firstLoad) {
        if (apiRoutes.isUp()) {
            routes = apiRoutes.getRoutes();
            if (firstLoad) appLogger.info("{} routes loaded from API", routes.size());
            updatePhysicalRoutesFromAPI();
            return ResolverOrigin.API;
        } else if (physicalRoutes.isUp()) {
            routes = physicalRoutes.getRoutes();
            if (firstLoad) appLogger.info("API Routes are down, loaded {} routes from memory", routes.size());
            return ResolverOrigin.Memory;
        } else if (!routes.isEmpty()) {
            if (firstLoad) appLogger.warn("API and Memory Routes are down, using the last known routes");
            return ResolverOrigin.File;
        } else {
            // Should only be triggered for the first initialization of the broker
            // until we manage to reach the API
            if (firstLoad) {
                appLogger.warn("API and Memory Routes are down, cannot load routes");
                appLogger.warn("No routes could be loaded, the broker will try reloading the routes during the next request");
            }
            return ResolverOrigin.None;
        }
    }

    /**
     * Check if the routes are up-to-date and update them if needed
     */
    private void updatePhysicalRoutesFromAPI() {
        if ((LocalDateTime.now().getSecond() - lastUpdate.getTime()) > UPDATE_INTERVAL) {
            if (apiRoutes.isUp()) {
                lastUpdate = new Date();
                physicalRoutes.updateRoutes(apiRoutes.getRoutes());
            } else {
                appLogger.warn("API is down, cannot update physical routes");
            }
        }
    }

    public Map<String, String> getRoutes() {
        return routes;
    }
}
