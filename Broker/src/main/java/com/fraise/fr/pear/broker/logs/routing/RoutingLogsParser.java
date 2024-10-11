package com.fraise.fr.pear.broker.logs.routing;

import com.fraise.fr.pear.broker.config.Config;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class RoutingLogsParser {
    private final Logger appLogger = LogManager.getLogger("broker");

    private List<String> getAllLines() {
        try (Stream<String> lines = Files.lines(Paths.get(Config.getProperty("app.log.system.routingPath")))) {
            return lines.collect(Collectors.toList());
        } catch (IOException e) {
            appLogger.error("Failed to read routing log: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<String> getLines(int limit) {
        String routingPath = Config.getProperty("app.log.system.routingPath");
        try (Stream<String> lines = Files.lines(Paths.get(routingPath))) {
            return lines.skip(Math.max(0, Files.lines(Paths.get(routingPath)).count() - limit)).collect(Collectors.toList());
        } catch (IOException e) {
            appLogger.error("Failed to read routing log when getting the last {} lines: {}", limit, e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<List<String>> filterAndMerge(List<String> lines) {
        return new ArrayList<>(lines.stream().filter(line -> line.contains("ID:")).collect(Collectors.groupingBy(line -> line.split(" ")[2].split("ID:")[1])).values());
    }

    public List<MessageRoutingHistory> getRoutingLogs() {
        return filterAndMerge(getAllLines()).stream().map(MessageRoutingHistory::new).collect(Collectors.toList());
    }
}