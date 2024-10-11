package com.fraise.fr.pear.broker.logs;

// Reçu, échoué, terminé, reprogrammé en attente, reprogrammé terminé
public enum BrokerRoutingStatus {
    RECEIVED,
    FAILED,
    COMPLETED,
    RESENT_PENDING,
    RESENT_COMPLETED
}
