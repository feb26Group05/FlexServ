# FlexServ

### Service Management Platform | Full-Stack Microservices Application

[![Java](https://img.shields.io/badge/Java-17+-orange?style=flat-square\&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat-square\&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square\&logo=react\&logoColor=black)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square\&logo=mysql\&logoColor=white)](https://www.mysql.com/)
[![REST API](https://img.shields.io/badge/API-REST-blue?style=flat-square)](#)
[![Architecture](https://img.shields.io/badge/Architecture-Microservices-purple?style=flat-square)](#)

**FlexServ** is a full-stack service management platform that connects **Customers, Service Providers, and Administrators** through a centralized system for service discovery, appointment booking, request management, and service tracking.

The application is built using **Java, Spring Boot, REST APIs, Microservices, React.js, Redux, and MySQL**, with **Generative AI** capabilities planned/integrated to improve the overall user experience.

---

## Overview

Managing local or professional services often involves multiple disconnected processes such as finding a provider, checking availability, requesting a service, scheduling an appointment, and tracking its progress.

**FlexServ addresses this problem by providing a single platform where:**

* Customers can discover and book services.
* Service Providers can manage their services and service requests.
* Administrators can monitor and manage the overall platform.
* REST APIs provide communication between frontend and backend services.
* Microservices provide separation of business responsibilities and scalability.
* Generative AI can be used to provide intelligent assistance to users.

---

## Core Features

### Customer

* User registration and authentication
* Profile management
* Browse available services
* View service details
* Book appointments
* Track service request status
* Manage bookings and service history

### Service Provider

* Provider registration and profile management
* Create and manage service listings
* Configure service availability
* View incoming service requests
* Accept or reject service requests
* Track ongoing service requests

### Administrator

* Manage customers
* Manage service providers
* Manage service listings
* Monitor service requests and appointments
* Oversee overall platform operations

### AI-Assisted Functionality

Generative AI can be leveraged to provide an intelligent conversational layer for the platform, such as:

* Understanding natural-language service queries
* Assisting users in discovering relevant services
* Providing contextual responses
* Improving the service discovery experience

---

# System Architecture

FlexServ follows a **layered full-stack architecture with microservice-based backend components**.

```text
                         ┌──────────────────────────┐
                         │       React.js UI         │
                         │     + Redux State         │
                         └────────────┬─────────────┘
                                      │
                                      │ HTTP / REST
                                      ▼
                         ┌──────────────────────────┐
                         │      Backend Services     │
                         │       Spring Boot         │
                         └────────────┬─────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
             ┌────────────┐   ┌──────────────┐   ┌────────────┐
             │ User       │   │ Service      │   │ Admin      │
             │ Management │   │ Provider /   │   │ Management │
             │ Service    │   │ Service      │   │ Service    │
             └─────┬──────┘   └──────┬───────┘   └─────┬──────┘
                   │                 │                  │
                   └─────────────────┼──────────────────┘
                                     ▼
                              ┌─────────────┐
                              │    MySQL    │
                              │  Database   │
                              └─────────────┘

                                     │
                                     ▼
                              ┌─────────────┐
                              │ Generative  │
                              │     AI      │
                              └─────────────┘
```

# Technology Stack

| Category             | Technology    |
| -------------------- | ------------- |
| Language             | Java          |
| Backend Framework    | Spring Boot   |
| API Architecture     | REST          |
| Backend Architecture | Microservices |
| Frontend             | React.js      |
| State Management     | Redux         |
| Database             | MySQL         |
| AI                   | Generative AI |
| Version Control      | Git / GitHub  |
| Build Tool           | Maven         |
| API Testing          | Postman       |

---

# Application Workflow

## Customer Journey

```text
Register / Login
       │
       ▼
Browse Services
       │
       ▼
Select Service
       │
       ▼
View Provider / Availability
       │
       ▼
Book Appointment
       │
       ▼
Service Request Created
       │
       ▼
Provider Accepts / Rejects
       │
       ▼
Track Service Status
       │
       ▼
Service Completed
```

## Service Provider Journey

```text
Register / Login
       │
       ▼
Create Service
       │
       ▼
Set Availability
       │
       ▼
Receive Service Request
       │
       ▼
Accept / Reject
       │
       ▼
Manage Service
       │
       ▼
Update Request Status
```

---

# Backend Design

The backend is implemented using **Spring Boot REST APIs**.

The application separates responsibilities into logical business components, making the system easier to develop, test, maintain, and extend.


```text
Controller
    │
    ▼
Service Layer
    │
    ▼
Repository / Data Access
    │
    ▼
MySQL
```

### Controller Layer

Responsible for:

* Handling HTTP requests
* Validating request data
* Returning appropriate HTTP responses
* Exposing REST endpoints

### Service Layer

Responsible for:

* Business logic
* Request processing
* Validation
* Service orchestration

### Repository Layer

Responsible for:

* Database operations
* Entity persistence
* Data retrieval

---


```
The database is responsible for maintaining information such as:

* User accounts
* Service providers
* Services
* Availability
* Appointments
* Service requests
* Request status
* Administrative information
---

# Role-Based Access

FlexServ is designed around three primary roles.

## 👥 Role-Based Access & Capabilities

## 👥 User Roles & Responsibilities

### 👤 Customer

| Capability | Description |
|:---|:---|
| 🔐 Authentication | Register and securely access the platform |
| 🔎 Service Discovery | Browse and explore available services |
| 📅 Appointment Booking | Book services based on availability |
| 📋 Request Tracking | Track the status of service requests |
| 👤 Profile Management | View and update personal information |
| 📜 Service History | View previous appointments and services |

### 🧑‍💼 Service Provider

| Capability | Description |
|:---|:---|
| 🔐 Authentication | Register and access provider account |
| 🛠️ Service Management | Create, update and manage service listings |
| 🕒 Availability Management | Define and update service availability |
| 📥 Request Management | View incoming customer requests |
| ✅ Request Handling | Accept or reject service requests |
| 📊 Service Tracking | Manage ongoing service requests |

### 🛡️ Administrator

| Capability | Description |
|:---|:---|
| 👥 User Management | Manage registered customers |
| 🧑‍💼 Provider Management | Manage service providers |
| 🛠️ Service Management | Monitor and manage platform services |
| 📅 Appointment Monitoring | Monitor bookings and service requests |
| 📊 Platform Monitoring | Oversee overall platform operations |
| ⚙️ Administration | Maintain platform-level data and configuration |

---

# Generative AI

Generative AI is considered as an intelligent assistance layer within FlexServ.

A typical interaction flow is:

```text
User
 │
 │ Natural Language Query
 ▼
React Frontend
 │
 ▼
Spring Boot API
 │
 ▼
AI Integration
 │
 ▼
Generated Response
 │
 ▼
React UI
```

This enables the platform to move beyond traditional CRUD-based functionality toward a more intelligent service discovery and assistance experience.

---

# Security Considerations

The application follows role-based access principles so that different users have access only to the functionality relevant to their role.

Security considerations include:

* Authentication
* Role-based authorization
* Input validation
* API-level access control
* Secure database configuration
* Environment-based secret management
---

# Project Structure

```text
FlexServ/
│
├── backend/
│   ├── auth-service/
│   ├── business-service/
│   ├── transaction-service/
│   ├── api-gateway/
│   └── discovery-server/
│  
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── services/
│   └── package.json
│
├── database/
│
├── docs/
│
└── README.md
```

---

# Getting Started

## Prerequisites

Install the following before running the project:

* Java JDK
* Maven
* Node.js and npm
* MySQL
* Git
* Postman

Verify your installation:

```bash
java -version
mvn -version
node -v
npm -v
mysql --version
git --version
```

---

## Clone Repository

```bash
git clone https://github.com/feb26Group05/FlexServ.git

cd FlexServ
```

---

## Backend Setup

Configure your MySQL connection in the Spring Boot configuration.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/flexserv
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

Build the backend:

```bash
mvn clean install
```

Run the application:

```bash
mvn spring-boot:run
```

---

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The React application will typically run at:

```text
http://localhost:3000
```

---

# Testing

Backend tests:

```bash
mvn test
```

Frontend tests:

```bash
npm test
```

REST APIs can be tested using **Postman**.

Recommended API testing flow:

```text
Authentication
      ↓
Create / Retrieve Services
      ↓
Create Appointment
      ↓
Provider Accepts / Rejects
      ↓
Update Service Status
      ↓
Verify User Status
```

---











