
# assessment-websocket-api



## Description

This project integrates a WebSocket server with a Node.js REST API. It allows real-time communication using WebSockets and provides RESTful services for managing todo items. The project also includes a React-based front end, demonstrating how to consume these services.

![alt text](https://github.com/chinwut/assessment-websocket-api/blob/main/screenshot.png?raw=true)

## Table of Contents

- [Installation Instructions](#installation-instructions)

- [Usage](#usage)

- [Features](#features)

- [Contributing](#contributing)

- [Scripts](#scripts)

- [Environment Variables](#environment-variables)

- [Build Process](#build-process)

- [Tests](#tests)

  

## Installation Instructions

  

### Pre-requisites

- Node.js (version as per `package.json` dependencies)

- Docker (for containerization)

  

### Setup

1. Clone the repository:

```sh

git clone https://github.com/chinwut/nassessment-websocket-api.git

cd nassessment-websocket-api

```

### Install dependencies for the server:

```sh

cd  server

npm  install

```

### Install dependencies for the frontend:

```sh

cd ../frontend/secretary-sample

npm install

```

### Return to the root directory and use Docker to build and run the containers:

```sh

cd  ../..

docker-compose  up  --build

```

### Usage

#### Start the Node.js server and WebSocket server:

```sh

npm  start

```

### For the frontend React application:

```sh

cd  frontend/secretary-sample

npm  run  dev

```

### Features

Real-time messaging using WebSocket.

RESTful API for managing todo items.

React frontend for interacting with the WebSocket and REST API.

Containerized application with Docker.

Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct before making pull requests.

  

### Scripts

npm start: Runs both the Node.js server and WebSocket server concurrently.

npm test: Runs tests using Jest for both backend and frontend.

### Environment Variables

Set the following environment variables in a .env file in the server directory:

  

FIREBASE_API_KEY

FIREBASE_AUTH DOMAIN

FIREBASE_PROJECT_ID

... (other Firebase configurations)

### Build Process

For production builds:

```sh

docker-compose  up  --build

```

### Tests

Run backend tests:

```sh

cd  server

npm  test

```

Run frontend tests:

```sh

cd  frontend/secretary-sample

npm  test

```