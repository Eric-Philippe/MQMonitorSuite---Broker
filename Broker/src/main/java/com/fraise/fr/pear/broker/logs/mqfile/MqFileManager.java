package com.fraise.fr.pear.broker.logs.mqfile;

import com.fraise.fr.pear.broker.config.Config;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MqFileManager {
    private final static Logger appLogger = LogManager.getLogger("broker");
    private static final Logger loggerStorageMqIdFilePath = LogManager.getLogger("broker.storage.mqFile");

    public static List<MqFile> get() {
        String filePath = Config.getProperty("app.log.system.mqFilePath");
        List<MqFile> values = new ArrayList<>();

        if (filePath == null || filePath.isEmpty()) {
            return values;
        }

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                MqFile mqFile = MqFile.fromLogLine(line);
                values.add(mqFile);
            }
        } catch (IOException e) {
            appLogger.error("Failed to read mq file log: {}", e.getMessage());
        }

        return values;
    }

    public static MqFile write(String mqMsgId, String filePath, String correlationId, long JMSTimestamp) {
        if (!filePath.contains(File.separator)) {
            throw new IllegalArgumentException("Invalid file path: " + filePath);
        }
        loggerStorageMqIdFilePath.info("{} {} {} {}", mqMsgId, filePath, correlationId, JMSTimestamp);
        return new MqFile(mqMsgId, filePath, correlationId, JMSTimestamp);
    }

    public static MqFile get(String mqMsgId) {
        List<MqFile> values = get();

        return values.stream()
                .filter(mq -> mq.getMqId().equals(mqMsgId))
                .findFirst()
                .orElse(null);
    }
}
