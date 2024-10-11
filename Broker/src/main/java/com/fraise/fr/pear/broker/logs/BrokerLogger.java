package com.fraise.fr.pear.broker.logs;

import com.fraise.fr.pear.broker.resolver.ResolverOrigin;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import java.io.File;
import java.text.MessageFormat;

@Component
/*
  Contains all the methods written once in order to write
  logs always with the same format
 */
public class BrokerLogger {
    private static final Logger logger = LogManager.getLogger("broker.routing");

    public static void routingDebug(String mqMsgId, String msg, Object... args) {
        String formattedMsg = MessageFormat.format(msg, args);
        logger.debug("{} {}", mqMsgId, formattedMsg);
    }

    public static void routingError(String mqMsgId, Exception e) {
        logger.error("{} {} {}", mqMsgId, BrokerLogsMessages.MSG_FAILED, e);
    }

    public static void routingError(String mqMsgId, String msg, Object... args) {
        String formattedMsg = MessageFormat.format(msg, args);
        logger.error("{} {}", mqMsgId, formattedMsg);
    }

    public static void routingError(String mqMsgId, String msg) {
        logger.error("{} {} {}", mqMsgId, BrokerLogsMessages.MSG_FAILED, msg);
    }

    public static void routingReceived(String mqMsgId, String clientId, String companyId, String workId, String exchangeId, String content) {
        logger.info("{} {} ;clientId={};companyId={};workId={};exchangeId={};content={}", mqMsgId, BrokerLogsMessages.MSG_RECEIVED, clientId, companyId, workId, exchangeId, content);
    }

    public static void routingCompleted(String mqMsgId, String clientId, long transfertTime, String destination, ResolverOrigin from) {
        logger.info("{} {} ;clientId={};transfertTime={};destination={};from={}", mqMsgId, BrokerLogsMessages.MSG_COMPLETED, clientId, transfertTime, destination, from);
    }

    public static void routingResentPending(String mqMsgId, String author) {
        logger.info("{} {} {}", mqMsgId, BrokerLogsMessages.MSG_PENDING, author);
    }

    public static void routingResentCompleted(String mqMsgId, long transfertTime, String destination, ResolverOrigin from) {
        logger.info("{} {} ;transfertTime={};destination={};from={}", mqMsgId, BrokerLogsMessages.MSG_RESENT, transfertTime, destination, from);
    }
}
