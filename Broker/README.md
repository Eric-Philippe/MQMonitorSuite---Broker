# Broker

This project is a MqMessage broker and its console that can be used to send and receive messages between different services.

## Getting Started

### Prerequisites

| Name | Version  |
|------|----------|
| Java | 21       |
| Maven| \>=3.6.x |

### Install Java

#### Windows

1. Download the latest version of Java from the [official website](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html).
2. Run the installer.
3. Set the JAVA_HOME environment variable to the path where Java is installed.
4. Add the Java bin directory to the PATH environment variable.
5. Open a new terminal and run `java -version` to verify the installation.

#### Linux

1. Open a terminal.
2. Run `sudo apt update`.
3. Run `sudo apt install openjdk-11-jdk`.
4. Run `java -version` to verify the installation.

### Installation

1. Clone the repository.
2. Open a terminal.
3. Navigate to the project directory.
4. Run `mvn clean install`.
5. Run `mvn spring-boot:run`.
6. The broker will start running on `localhost`.

## Development

The core application is a Spring Boot application, allowing to serve HTTP requests.

### Broker.java

This class is the main engine of the broker. It is responsible for handling the messages and the connections between the services.
You'll be able to find all the methods that are necessary to handle the messages, reroute them, and send them to the correct service.

### resolver/

This package contains the classes that are responsible for resolving the messages and the services. The `Resolver` class aggregates all the resolvers and is responsible for calling the correct resolver for the message when one of them is down.
The resolver rank the resolvers by this rank:
1. `ApiRoutes` - This resolver is responsible for handling the messages that are sent to another API having the most recent data.
2. `Memory` - If the `ApiRoutes` resolver is down, the `Resolver` singleton will use its own memory to resolve the message
3. `File` - If the `Memory` resolver is empty (can only happen at start), the `Resolver` singleton will use the json cache file to resolve the message

> The broker has a cooldown of 1 hour, where if the `ApiRoutes` is used, the File cache will be updated with the new data. So in theory the `File` resolver will always have the most recent data at 1 hour of delay maximum.

--- 

The `Resolver` gives its own `Answer` object that contains the destination, all the destination properties (Q, QM, Protocol, Host, Port) and also the source of the resolution. Check `resolver/answer/` package for further information.

### logs/

The second main job of the Broker is to be able to log everything that is happening, and also being able to normalize all the message written to be able to re-read them later. 

Based on `log4j2`, `BrokerLogger` gives all the necessary tools to log the whole life cycle of message going through the broker.

`BrokerRoutingStatus`, `BorkerLogsStatus` and `BrokerLogsMessages` provides static ressources in order to be able to write in a consistent way with the final aim to read them and categorize them further than just `INFO`, `ERROR` or `DEBUG`.

Logs are stored in two different location, one as `app` logs  and `system` logs. 
In `logs/app/` directory, you'll find all the human-readable logs that could be easily read in instances of errors or debug.
In `logs/system/` directory, you'll find all the logs that are written in a normalized way, in order to be able to re-read them later way easier.

> You can find all the patterns in the `ressources/log4j2.xml` file.

#### logs/routing/

This package provides all the necessary to read, parse and represent the logs read in the `logs/system/routing.log` directory.
This file contains the **whole** life-cycle of the messages that went through the broker.

#### logs/mqfile

The `logs/system/mqfile.log` is a sort of *database* that links the messages to the library dump files
This package provides also all the necessary to read, parse and represent the logs read in the `logs/system/mqfile.log` directory.

### controller/

This package contains the classes that are responsible for handling the HTTP requests.

`AppController.java` aims to handle the requests that gravitate around the Broker application itself like the status of the broker and its services.

`PropertiesController.java` aims to handle the requests that gravitate around the properties of the broker cf. `ressources/application.properties` etc.

`LogsController.java` gives all the necessary tools to read the logs that are read thanks to the (Logs Routing)[#logs-routing] package. It also provides the post method to reroute failed messages.

### config/

In the `config/` package, you'll find the `BeanConfig.java` class that is responsible for creating the beans that are necessary for the broker to run and also the `Config.java` that provides methods to easily access environment variables