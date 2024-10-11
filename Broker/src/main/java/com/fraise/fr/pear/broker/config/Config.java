package com.fraise.fr.pear.broker.config;

import com.fraise.fr.echanges.EchangesOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Configuration
@Component
public class Config {

    private static Environment env;

    @Autowired
    public Config(Environment env) {
        Config.env = env;
    }

    public static String getProperty(String key) {
        return env.getProperty(key);
    }

    public static String getAllProperties() {
        return env.toString();
    }
}