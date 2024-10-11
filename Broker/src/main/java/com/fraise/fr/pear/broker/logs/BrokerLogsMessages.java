package com.fraise.fr.pear.broker.logs;

/**
 * =========================================================================
 * /!\ Touching this will de-synchronize the logs with the previous logs /!\
 * =========================================================================
 * Those messages allow to centralize the log messages in the Broker in order
 * to easily fetch them and have expected messages in the logs.
 */
public class BrokerLogsMessages {
    public static final String MSG_RECEIVED = "Broker received a message";
    public static final String MSG_FAILED = "Failed forwarding message with error:";
    public static final String MSG_COMPLETED = "Completed forwarding message";
    public static final String MSG_PENDING = "A new try attempt for routing this message has ben scheduled by:";
    public static final String MSG_RESENT = "Completed forwarding message after a new try attempt";
}
