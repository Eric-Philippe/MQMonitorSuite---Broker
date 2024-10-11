package com.fraise.fr.pear.broker.logs.mqfile;

public class MqFile {
    private String mqId;
    private String filePath;
    private String correlationId;
    private long JMSTimestamp;

    public MqFile(String mqId, String filePath, String correlationId, long JMSTimestamp) {
        this.mqId = mqId;
        this.filePath = filePath;
        this.correlationId = correlationId == "EMPTY" ? null : correlationId;
        this.JMSTimestamp = JMSTimestamp;
    }

    public static MqFile fromLogLine(String logLine) {
        String[] parts = logLine.split(" ", 4);

        if (parts.length < 4) {
            throw new IllegalArgumentException("Invalid log line: " + logLine);
        }

        return new MqFile(parts[0], parts[1], parts[2], Long.parseLong(parts[3]));
    }

    public String getMqId() {
        return mqId;
    }

    public String getFilePath() {
        return filePath;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public long getJMSTimestamp() {
        return JMSTimestamp;
    }
}
