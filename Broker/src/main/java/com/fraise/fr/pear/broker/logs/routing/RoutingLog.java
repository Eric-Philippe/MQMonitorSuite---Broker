package com.fraise.fr.pear.broker.logs.routing;

import com.fraise.fr.pear.broker.logs.BrokerLogsStatus;

/**
 * Represents a log entry in the routing logs.
 * @param date The date of the log entry
 * @param status The status of the log entry (Based on Log4j2)
 * @param msg The message of the log entry
 * @param author The author that could be related to the action that is logged
 */
public record RoutingLog (long date, BrokerLogsStatus status, String msg, String author) {}
