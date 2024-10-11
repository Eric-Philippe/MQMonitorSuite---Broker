# BrokerConsole

This project is the console for the Broker project. It is a web application that allows the user to manage the Broker behavior and to monitor the Broker's activity.

## Table of Contents

- [Requirements](#requirements)
  - [Install Node.js](#install-nodejs)
    - [Windows](#windows)
    - [Linux](#linux)
  - [Install Angular CLI](#install-angular-cli)
- [Installation and Build](#installation-and-build)
  - [Manual](#manual)
    - [Server](#server)
    - [Install](#install)
    - [Build](#build)
    - [Angular Client](#angular-client)
    - [Install](#install-1)
    - [Build](#build-1)
  - [Automatic (Linux only)](#automatic-linux-only)
- [Environment variables](#environment-variables)
  - [Server](#server-1)
  - [Angular Client](#angular-client-1)
- [Development environment](#development-environment)
  - [Angular Client](#angular-client)
  - [Code scaffolding](#code-scaffolding)
    - [Server](#server-2)
- [Production environment](#production-environment)
  - [Angular Client](#angular-client-2)
  - [Server](#server-3)

## Requirements

| Requirement | Version    |
| ----------- | ---------- |
| Node.js     | >= 20.12.2 |
| Angular CLI | >= 18.2.5  |
| Python      | >= 2.x.x   |

> Python is required for the `bcrypt` package for password hashing.

### Install Node.js

#### Information

> The project is cut into two parts, the server and the Angular client. The server is written with Typescript for NodeServer and the Angular client is written in Typescript for Browser with Angular (that's why they cant be in the same package.json).

> The angular project, after building won't need all its dependencies (frontend/node_modules) to run, but the server will need all its dependencies (server/node_modules) to run and can't be served using only the `server/dist/` directory only.

#### Windows

1. Download the Windows installer from the [Nodes.js® web site](https://nodejs.org/en/download/).
2. Run the installer (the .msi file you downloaded in the previous step.)
3. Follow the prompts in the installer (Accept the license agreement, click the NEXT button a bunch of times and accept the default installation settings).
4. Restart your computer. You won’t be able to run Node.js until you restart your computer.

#### Linux

1. Open a terminal window.

2. Install Node Version Manager (NVM) with the following command:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

3. Close the terminal window and open a new one.

4. Install Node.js with the following command:

```bash
nvm install node
```

### Install Angular CLI

1. Open a terminal window.

2. Install Angular CLI with the following command:

```bash
npm install -g @angular/cli
```

## Installation and Build

### Manual

#### Server

##### Install

Go to the `server/` directory and run `npm install` to install the required packages.

##### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

#### Angular Client

##### Install

Go to the `frontend/` directory and run `npm install` to install the required packages.

##### Build

Run `ng build` to build the project. The build artifacts will be stored **automatically** in the `server/public/` directory, ready to be served by either the dev server (src/) or the production server (dist/).

### Automatic (Linux only)

Run the `install.sh` script to install the required packages for the server and Angular client, it will also build the Angular client and the server.

```bash
./install.sh
```

---

## Environment variables

The server uses environment variables to configure the application. The following variables are required:

### Server

`server/.env`

```env
PORT=3000

PASSWORD=<your_hashed_password>
```

> The password must be hashed with bcrypt. the `server/src/server.ts` file provides a function to hash a password.

```typescript

...

const generatePassword = function (pass: string) {
  return bcryptjs.hashSync(pass, bcryptjs.genSaltSync(10));
};

console.log(generatePassword('your_super_secret_password'));

```

> The password is shared with all the users and is used to authenticate the users.

### Angular Client

`frontend/src/conf/env.ts`

```typescript
const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;

export const BROKER_API = "http://localhost:80";
export const REFRESH_TIME = 1000 * 30;
export const TRANSFERT_TIME_LEVELS = [FIVE_MINUTES, THIRTY_MINUTES];
export const RECENT_THRESHOLD = 1000 * 60 * 60 * 24 * 7 * 3; // 3 weeks

export const BROKER_ENV = "Zdr";
export const BROKER_VERSION = "2.0.0";

const ENV = {
  BROKER_API,
  REFRESH_TIME,
  TRANSFERT_TIME_LEVELS,
  RECENT_THRESHOLD,
};

export default ENV;
```

> WARNING - In order to take effect in production, the Angular client must be rebuilt.

---

## Development environment

### Angular Client

Go to the `frontend/` directory and run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Server

Run `npm run dev` to start the server in development mode. The server will automatically restart if you change any of the source files.

## Production environment

Please read first the [Environment variables](#environment-variables) section and the [Installation and Build](#installation-and-build) section.

> The two parts of the project must be built before being deployed. You can already find the latest project build in the `server/dist/` directory.

### Angular Client

In the `frontend/` directory, run `ng build` to build the project. The build artifacts will be stored in the `server/public/` directory.

### Server

In the `server/` directory, run `npm start` to start the server. The server will be available on `localhost`.
