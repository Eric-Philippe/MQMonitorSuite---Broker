package com.fraise.fr.pear.broker.logs.routing;

import com.fraise.fr.pear.broker.logs.BrokerLogsMessages;
import com.fraise.fr.pear.broker.logs.BrokerLogsStatus;
import com.fraise.fr.pear.broker.logs.BrokerRoutingStatus;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.ArrayList;
import java.util.List;

public class MessageRoutingHistory {

    public static final String BROKER_AUTHOR = "BROKER";

    private String mqMsgId;
    private String clientId;
    private String companyId;
    private BrokerRoutingStatus status;
    private String workId;
    private String exchangeId;
    private String destination;
    private String from;
    private long transfertTime;
    private String content;
    private final List<RoutingLog> logs;

    public MessageRoutingHistory(List<String> lines) {
        this.logs = new ArrayList<>();
        for (String line : lines) {
            try {
                parseLogLine(line);
            } catch (Exception e) {
                Logger appLogger = LogManager.getLogger("broker");
                appLogger.warn("A routing log line is corrupted: {}", line);
                this.logs.add(new RoutingLog(System.currentTimeMillis(), BrokerLogsStatus.WARN, "Corrupted log line", BROKER_AUTHOR));
            }
        }
    }

    /**
     * Parses a log line and updates the RoutingLogs object accordingly.
     * @param logLine The log line to parse
     */
    private void parseLogLine(String logLine) {
        if (logLine.contains(BrokerLogsMessages.MSG_RESENT)) {
            parseResentLog(logLine);
        } else if (logLine.contains(BrokerLogsMessages.MSG_COMPLETED)) {
            parseCompletedLog(logLine);
        } else if (logLine.contains(BrokerLogsMessages.MSG_FAILED)) {
            parseFailedLog(logLine);
        } else if (logLine.contains(BrokerLogsMessages.MSG_PENDING)) {
            parsePendingLog(logLine);
        } else if (logLine.contains(BrokerLogsMessages.MSG_RECEIVED)) {
            parseReceivedLog(logLine);
        }
    }

    private void parseReceivedLog(String logLine) {
        String[] parts = logLine.split(" ", 4);
        if (parts.length < 4) {
            throw new IllegalArgumentException("Invalid log line: " + logLine);
        }
        long timestamp = Long.parseLong(parts[0]);
        this.mqMsgId = parts[2];
        String[] details = parts[3].split(";", 6);
        this.clientId = extractParam(details[1]);
        this.companyId = extractParam(details[2]);
        this.workId = extractParam(details[3]);
        this.exchangeId = extractParam(details[4]);
        this.content = extractParam(details[5]);
        this.logs.add(new RoutingLog(timestamp, BrokerLogsStatus.INFO, BrokerLogsMessages.MSG_RECEIVED, BROKER_AUTHOR));
        this.status = BrokerRoutingStatus.RECEIVED;
    }

    private void parseCompletedLog(String logLine) {
        String[] parts = logLine.split(" ", 4);
        if (parts.length < 4) {
            throw new IllegalArgumentException("Invalid log line: " + logLine);
        }
        long timestamp = Long.parseLong(parts[0]);
        this.mqMsgId = parts[2];
        String[] details = parts[3].split(";", 5);
        this.transfertTime = Long.parseLong(extractParam(details[2]));
        this.destination = extractParam(details[3]);
        this.from = extractParam(details[4]);
        this.logs.add(new RoutingLog(timestamp, BrokerLogsStatus.INFO, BrokerLogsMessages.MSG_COMPLETED, BROKER_AUTHOR));
        this.status = BrokerRoutingStatus.COMPLETED;
    }

    private void parseFailedLog(String logLine) {
        String[] parts = logLine.split(" ", 4);
        if (parts.length < 4) {
            throw new IllegalArgumentException("Invalid log line: " + logLine);
        }
        long timestamp = Long.parseLong(parts[0]);
        String errorMsg = parts[3].split(":", 2)[1].trim();
        this.status = BrokerRoutingStatus.FAILED;
        this.destination = "";
        this.from = "";
        this.logs.add(new RoutingLog(timestamp, BrokerLogsStatus.ERROR, errorMsg, BROKER_AUTHOR));
    }

    private void parsePendingLog(String logLine) {
        String[] parts = logLine.split(" ", 4);
        if (parts.length < 4) {
            throw new IllegalArgumentException("Invalid log line: " + logLine);
        }
        long timestamp = Long.parseLong(parts[0]);
        String author = parts[3].split(": ", 2)[1];
        this.status = BrokerRoutingStatus.RESENT_PENDING;
        this.logs.add(new RoutingLog(timestamp, BrokerLogsStatus.INFO, parts[3], author));
    }

    private void parseResentLog(String logLine) {
        String[] parts = logLine.split(" ", 3);
        if (parts.length < 3) {
            throw new IllegalArgumentException("Invalid log line: " + logLine);
        }
        long timestamp = Long.parseLong(parts[0]);
        String details = parts[2].split(";", 2)[1];
        String[] detailsParts = details.split(";", 3);
        long transfertTime = Long.parseLong(detailsParts[0].split("=", 2)[1]);
        String destination = detailsParts[1].split("=", 2)[1];
        String from = detailsParts[2].split("=", 2)[1];
        this.status = BrokerRoutingStatus.RESENT_COMPLETED;
        this.logs.add(new RoutingLog(timestamp, BrokerLogsStatus.INFO, BrokerLogsMessages.MSG_RESENT, BROKER_AUTHOR));
        this.transfertTime = transfertTime;
        this.destination = destination;
        this.from = from;
    }

    private String extractParam(String keyValue) {
        return keyValue.split("=").length > 1 ? keyValue.split("=")[1] : "";
    }

    @Override
    public String toString() {
        return "Routing {" +
                "mqMsgId='" + mqMsgId + '\'' +
                ", clientId='" + clientId + '\'' +
                ", companyId='" + companyId + '\'' +
                ", status=" + status +
                ", workId='" + workId + '\'' +
                ", exchangeId='" + exchangeId + '\'' +
                ", destination='" + destination + '\'' +
                ", from='" + from + '\'' +
                ", transfertTime=" + transfertTime +
                ", content='" + content + '\'' +
                ", logs=" + logs +
                '}';
    }

    public String getMqMsgId() { return mqMsgId; }
    public String getClientId() { return clientId; }
    public String getCompanyId() { return companyId; }
    public BrokerRoutingStatus getStatus() { return status; }
    public String getWorkId() { return workId; }
    public String getExchangeId() { return exchangeId; }
    public String getDestination() { return destination; }
    public String getFrom() { return from; }
    public long getTransfertTime() { return transfertTime; }
    public String getContent() { return content; }
    public List<RoutingLog> getLogs() { return logs; }
}