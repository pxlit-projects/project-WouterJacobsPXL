# Architecture

![Architecture](./assets/FullStackJavaArchitectureV1.drawio.svg)

## Backend
The backend is written with in java with the Spring Cloud Framework.
### Microservices
- Post-Service
- Review-Service
- Comment-Service
- Discovery-Service
- Config-Service
- API-Gateway(-Service)
### Databases
The databases are not yet a solid choice, depending on the flow of the program they still might change to just 3 SQL-databases but for now the most suitable solution is a mix of MongoDB and MariaDB like shown in the diagram.
### Communication between microservices
For this I use RabbitMQ for asynchronous communication and OpenFeign for synchronous communication.

## Frontend
The frontend is written in Angular and TypeScript and will contain a website with a visual overview of the news/blogposts and will contain multiple pages with different functionalities. It will communicate back and forth with the API-Gateway of the backend.

## Deployment
Everything will be deployed with Docker.
