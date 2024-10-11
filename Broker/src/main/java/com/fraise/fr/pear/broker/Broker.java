package com.fraise.fr.pear.broker;

import com.fraise.fr.echanges.*;
import com.fraise.fr.echanges.common.MQTools;
import com.fraise.fr.pear.broker.logs.BrokerLogsMessages;
import com.fraise.fr.pear.broker.logs.BrokerLogger;
import com.fraise.fr.pear.broker.logs.mqfile.MqFile;
import com.fraise.fr.pear.broker.logs.mqfile.MqFileManager;
import com.fraise.fr.pear.broker.resolver.Resolver;
import com.fraise.fr.pear.broker.resolver.ResolverOrigin;
import com.fraise.fr.pear.broker.resolver.answer.RoutingAnswer;
import jakarta.jms.BytesMessage;
import jakarta.jms.JMSException;
import jakarta.jms.Message;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;

import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class Broker {
    public static final int MAX_SIZE_MSG = 200;

    @Autowired
    Resolver resolver;

    @JmsListener(destination = "${mq.queue}")
    public void onMessage(Message msg) {
        String mqMsgId = "NOT_EXTRACTED"; // Instantiated with a default value because getJMSMessageID can produce an exception
        try {
            // File routine storage with Zxx
            File file = MQTools.storeReceivedMsgIfNeeded(msg, null);
            String filePath = file.getAbsolutePath();
            mqMsgId = msg.getJMSMessageID();

            // Log the main information about the incoming message
            WrappedMessage wrappedMsg = CommunicationMQ.parseMessage(msg);
            HeaderEchange header = wrappedMsg.getHeaderEchange();
            String clientId = header.getClientId();
            String companyId = header.getCompanyId();
            String workId = header.getWorkId();
            String exchangeId = header.getEchangeId();
            String content = wrappedMsg.getMessageData().getStringContent().substring(0, Math.min(wrappedMsg.getMessageData().getStringContent().length(), MAX_SIZE_MSG));

            BrokerLogger.routingReceived(mqMsgId, clientId, companyId, workId, exchangeId, content);

            // Store the relation between the message and the file and the correlationId
            String correlationId = "EMPTY";
            if (wrappedMsg.hasCorrelationId()) {
                correlationId = wrappedMsg.getCorrelationIdAsString();
            }
            MqFileManager.write(mqMsgId, filePath, correlationId, msg.getJMSTimestamp());

            if (msg instanceof TextMessage) {
                onMessage((TextMessage) msg, mqMsgId);
            } else if (msg instanceof BytesMessage) {
                onMessage((BytesMessage) msg, mqMsgId);
            } else {
                BrokerLogger.routingError(mqMsgId, "Received message of unknown type: " + msg.getClass().getName());
            }
        } catch (Exception e) {
            BrokerLogger.routingError(mqMsgId, e);
        }
    }

    public void onMessage(TextMessage msg, String mqMsgId) {
        try {
            BrokerLogger.routingDebug(mqMsgId, "The received message is a TextMessage: {0}", msg.getText());
            route(msg, mqMsgId);
        } catch (JMSException e) {
            BrokerLogger.routingError(mqMsgId, e);
        }
    }

    public void onMessage(BytesMessage msg, String mqMsgId) {
        try {
            byte[] bytes = new byte[(int)msg.getBodyLength()];
            msg.readBytes(bytes);
            BrokerLogger.routingDebug(mqMsgId, "Received BytesMessage: {0}", new String(bytes));
            route(msg, mqMsgId);
        } catch (JMSException e) {
            BrokerLogger.routingError(mqMsgId, e);
        }
    }

    public void route(Message msg, String mqMsgId) {
        try {
            WrappedMessage wrappedMsg = CommunicationMQ.parseMessage(msg);

            HeaderEchange header = wrappedMsg.getHeaderEchange();
            String clientId = header.getClientId();
            String companyId = header.getCompanyId();

            if (clientId == null && companyId != null) {
                // TODO: Can't resolve this at the moment
                BrokerLogger.routingError(mqMsgId, "{0} with companyId but no clientId: {1}", BrokerLogsMessages.MSG_FAILED, wrappedMsg);
                return;
            }

            RoutingAnswer a = new RoutingAnswer(resolver.resolveLazy(clientId));

            if (!a.isValid()) {
                if (a.destination == null) {
                    BrokerLogger.routingError(mqMsgId, "{0} No route found for the message with the clientId={1}", BrokerLogsMessages.MSG_FAILED, clientId);
                } else if (a.host == null) {
                    BrokerLogger.routingError(mqMsgId, "{0} Missing entry in configuration for clientId={1} and destination={2}", BrokerLogsMessages.MSG_FAILED, clientId, a.destination);
                } else {
                    BrokerLogger.routingError(mqMsgId, "{0} Entry configuration is corrupted for clientId={1} and destination={2}", BrokerLogsMessages.MSG_FAILED, clientId, a.destination);
                }
                return;
            }

            MqDestination mqDestination = new MqDestination(a.serviceAsQueueName, a.host, a.port, a.sidAsChannel, a.rootPathAsQueueManagerName, a.sProtocoleAndVersion);
            CommunicationMQ.forwardMessage(mqDestination, msg);

            long transfertTime = System.currentTimeMillis() - msg.getJMSTimestamp();
            BrokerLogger.routingCompleted(mqMsgId, clientId, transfertTime, a.destination, a.source);

        } catch (EchangeException | JMSException e) {
            BrokerLogger.routingError(mqMsgId, e);
        }
    }

    public void automaticReroute(String mqMsgId, String clientId) throws EchangeException {
        RoutingAnswer a = new RoutingAnswer(resolver.resolveLazy(clientId));

        if (!a.isValid()) {
            BrokerLogger.routingError(mqMsgId, "{0} No route found for the message with the clientId={1}", BrokerLogsMessages.MSG_FAILED, clientId);
            throw new EchangeException("No route found for the message with the clientId=" + clientId);
        }

        MqFile mqFile = MqFileManager.get(mqMsgId);

        try {
            Broker.reroute(mqMsgId, a.destination, a.serviceAsQueueName, a.rootPathAsQueueManagerName, a.sProtocoleAndVersion, a.host, a.port, a.sidAsChannel);
            BrokerLogger.routingResentCompleted(mqMsgId, System.currentTimeMillis() - mqFile.getJMSTimestamp(), a.destination, a.source);
        } catch (Exception e) {
            BrokerLogger.routingError(mqMsgId, e);
            throw new EchangeException(e);
        }
    }

    public static void reroute(String mqMsgId, String destination, String q, String qm, String protocol, String host, String port, String channel) throws EchangeException {
        MqDestination mqDestination = new MqDestination(q, host, port, channel, qm, protocol);
        MqFile mqFile = MqFileManager.get(mqMsgId);
        File file = new File(mqFile.getFilePath());
        SendOptions sendOptions = new SendOptions();
        if (mqFile.getCorrelationId() != null) {
            sendOptions.setCorrelationId(mqFile.getCorrelationId());
        }

        try {
            MQTools.putMessage(mqDestination, file, sendOptions);
            BrokerLogger.routingResentCompleted(mqMsgId, System.currentTimeMillis() - mqFile.getJMSTimestamp(), destination, ResolverOrigin.Manual);
        } catch (Exception e) {
            BrokerLogger.routingError(mqMsgId, e);
            throw new EchangeException(e);
        }
    }

}
