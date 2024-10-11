package com.fraise.fr.pear.broker.resolver.answer;

import com.fraise.fr.pear.broker.resolver.ResolverOrigin;

public class Answer {
    public String origin;
    public String destination;
    public ResolverOrigin source;

    public Answer(String origin, String destination, ResolverOrigin source) {
        this.origin = origin;
        this.destination = destination;
        this.source = source;
    }

    public boolean isValid() {
        return destination != null && source != null && source != ResolverOrigin.None;
    }

    @Override
    public String toString() {
        return "Routing Answered {" +
                "origin='" + origin + '\'' +
                ", destination='" + destination + '\'' +
                ", source='" + source + '\'' +
                '}';
    }
}
