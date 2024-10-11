package com.fraise.fr.pear.broker.resolver.answer;

import com.fraise.fr.pear.broker.config.Config;
import com.fraise.fr.pear.broker.resolver.ResolverOrigin;

public class RoutingAnswer extends Answer {
    public String serviceAsQueueName;
    public String host;
    public String port;
    public String sidAsChannel;
    public String rootPathAsQueueManagerName;
    public String sProtocoleAndVersion;

    public RoutingAnswer(String origin, String destination, ResolverOrigin source) {
        super(origin, destination, source);
    }

    public RoutingAnswer(Answer answer) {
        super(answer.origin, answer.destination, answer.source);
        setup();
    }

    private void setup() {
        this.serviceAsQueueName = Config.getProperty(destination + ".Q");
        this.host = Config.getProperty(destination + ".HOST");
        this.port = Config.getProperty(destination + ".PORT");
        this.sidAsChannel = Config.getProperty(destination + ".CHANNEL");
        this.rootPathAsQueueManagerName = Config.getProperty(destination + ".QM");
        this.sProtocoleAndVersion = Config.getProperty(destination +  ".PROTOCOL");
    }

    @Override
    public boolean isValid() {
        return super.isValid() && serviceAsQueueName != null && host != null && sidAsChannel != null && rootPathAsQueueManagerName != null && sProtocoleAndVersion != null;
    }

    @Override
    public String toString() {
        return "Routing Answered {" +
                "origin='" + origin + '\'' +
                ", destination='" + destination + '\'' +
                ", source='" + source + '\'' +
                ", serviceAsQueueName='" + serviceAsQueueName + '\'' +
                ", host='" + host + '\'' +
                ", port='" + port + '\'' +
                ", sidAsChannel='" + sidAsChannel + '\'' +
                ", rootPathAsQueueManagerName='" + rootPathAsQueueManagerName + '\'' +
                ", sProtocoleAndVersion='" + sProtocoleAndVersion + '\'' +
                '}';
    }
}
