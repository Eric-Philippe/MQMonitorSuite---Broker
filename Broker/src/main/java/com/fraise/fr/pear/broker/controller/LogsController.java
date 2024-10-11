package com.fraise.fr.pear.broker.controller;

import com.fraise.fr.echanges.MqDestination;
import com.fraise.fr.echanges.SendOptions;
import com.fraise.fr.echanges.common.MQTools;
import com.fraise.fr.pear.broker.Broker;
import com.fraise.fr.pear.broker.logs.BrokerLogger;
import com.fraise.fr.pear.broker.logs.mqfile.MqFile;
import com.fraise.fr.pear.broker.logs.mqfile.MqFileManager;
import com.fraise.fr.pear.broker.logs.routing.MessageRoutingHistory;
import com.fraise.fr.pear.broker.logs.routing.RoutingLogsParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/logs")
public class LogsController {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private Broker broker;

    @CrossOrigin(origins = "*")
    @GetMapping("/")
    public ObjectNode get() {
        List<MessageRoutingHistory> history = new RoutingLogsParser().getRoutingLogs();
        ArrayNode historyArray = objectMapper.valueToTree(history);
        ObjectNode response = objectMapper.createObjectNode();
        response.set("history", historyArray);
        return response;
    }

    /**
     * Je récupère {destination, Q, QM, Protocole...} et {MqMsgId}
     * -> Je récupère par l'intérmédiaire de MqFileManager le fichier correspondant
     * -> Paramètres MQ, MqMsgId, MgMsg Content, CorrelationId, File Path
     *
     * SendOptions sendOptions = new SendOptions().setCorrelationId(correlationId);
     * MqTools.putMessage(MqDestination: (Destination), File, SendOptions: sendOptions)
     */


    @CrossOrigin(origins = "*")
    @PostMapping("/reroute")
    public ObjectNode resend(@RequestBody ObjectNode body) {
        ObjectNode response = objectMapper.createObjectNode();

        // First we log the request for a new attempt to send the message
        String author = body.get("author").asText();
        String mqMsgId = body.get("mqMsgId").asText();

        if (author == null || mqMsgId == null) {
            response = objectMapper.createObjectNode();
            response.put("error", "Missing header parameters");
            return response;
        }

        BrokerLogger.routingResentPending(mqMsgId, author);

        // Then we check if the user requested an automatic reroute or a manual one
        String destination = body.get("destination").asText();
        String clientId = body.get("clientId").asText();

        if (destination == null || clientId == null) {
            response = objectMapper.createObjectNode();
            response.put("error", "Missing body parameters");
            return response;
        }

        if (destination.equals("AUTOMATIC")) {
            try {
                broker.automaticReroute(mqMsgId, clientId);
            } catch (Exception e) {
                response.put("error", e.getMessage());
            }
        } else {
            try {
                String q = body.get("q").asText();
                String qm = body.get("qm").asText();
                String protocol = body.get("protocole").asText();
                String host = body.get("host").asText();
                String port = body.get("port").asText();
                String channel = body.get("channel").asText();

                if (q == null || qm == null || protocol == null || host == null || channel == null) {
                    response = objectMapper.createObjectNode();
                    response.put("error", "Missing body parameters");
                    return response;
                }


                Broker.reroute(mqMsgId, destination, q, qm, protocol, host, port, channel);
                response.put("success", "Message resent");
            } catch (Exception e) {
                BrokerLogger.routingError(mqMsgId, "Something went wrong while resending the message, double check the parameters");
                response.put("error", e.getMessage());
            }
        }

        return response;
    }

}