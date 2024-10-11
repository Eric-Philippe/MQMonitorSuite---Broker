package com.fraise.fr.pear.broker.config;

import com.fraise.fr.pear.broker.resolver.APIRoutes;
import com.fraise.fr.pear.broker.resolver.PhysicalRoutes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.core.env.Environment;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class BeanConfig {
    @Autowired
    private Environment env;

    @Value( "${api.address}" )
    private String address;

    @Bean
    @Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
    public WebClient singletonWebClient() {
        return WebClient.create(address);
    }

    @Bean
    @Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
    public PhysicalRoutes physicalRoutes() {
        return new PhysicalRoutes();
    }

    @Bean
    @Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
    public APIRoutes apiRoutes(WebClient singletonWebClient) {
        return new APIRoutes(singletonWebClient);
    }
}