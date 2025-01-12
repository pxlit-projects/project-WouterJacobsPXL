# Architecture

![Architecture](./assets/FullStackJavaArchitectureV2.drawio.svg)

## Backend
The backend is written with in java with the Spring Cloud Framework.
### Microservices
- Post-Service
- Review-Service
- Comment-Service
- Email-Service
- Discovery-Service
- Config-Service
- API-Gateway(-Service)
### Databases
The databases consists of 3 MariaDB instances running on seperate containers.

### Communication between microservices
For this I use RabbitMQ for asynchronous communication and OpenFeign for synchronous communication.

## Frontend
The frontend is written in Angular and TypeScript and will contain a website with a visual overview of the news/blogposts and will contain multiple pages with different functionalities. It will communicate back and forth with the API-Gateway of the backend.

## Deployment
Everything will be deployed with Docker.
