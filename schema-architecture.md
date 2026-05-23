# Smart Clinic Management System - Architecture Design

---

## 1. Architecture Summary

The Smart Clinic Management System is designed as a **layered three-tier web application architecture** that separates concerns across the presentation layer, application layer, and data layer. This design ensures high **scalability, maintainability, modularity, and security**.

The system is implemented using **Spring Boot** as the core backend framework. It supports both:

- **Spring MVC with Thymeleaf** for server-side rendered administrative and doctor dashboards
- **RESTful APIs** for scalable, client-agnostic communication with external or frontend systems

The frontend layer is built using standard web technologies including **HTML, CSS, JavaScript, and Thymeleaf templates**, enabling dynamic server-side rendering where required.

The application layer enforces business logic and security using:
- Spring Boot Services
- Spring MVC Controllers
- REST Controllers
- Spring Security
- JWT-based authentication and authorization

The data layer is implemented using a **polyglot persistence approach**, integrating:
- **MySQL (via Spring Data JPA)** for structured relational data such as users, doctors, patients, and appointments
- **MongoDB (via Spring Data MongoDB)** for unstructured and flexible documents such as prescriptions and medical notes

This hybrid database design allows the system to maintain strong relational integrity for transactional data while also supporting flexible document-based healthcare records.

---

## 2. Three-Tier Architecture Overview

The system follows a strict **three-tier architecture model**, where each layer has a clearly defined responsibility and communicates through well-defined interfaces.

### 1. Presentation Layer

The Presentation Layer is responsible for all user interactions and UI rendering.

It consists of:

- Thymeleaf-based server-rendered pages
- HTML/CSS/JavaScript frontend components
- Admin, Doctor, and Patient dashboards
- API consumers (web or external clients)

Key responsibilities:
- Rendering dynamic UI content
- Capturing user input
- Sending HTTP requests to backend services
- Displaying API or server-rendered responses

This layer supports both traditional server-rendered web applications and modern API-based clients.

### 2. Application Layer

The Application Layer contains the core business logic of the system and is implemented using Spring Boot.

It consists of:
- MVC Controllers (Thymeleaf-based requests)
- REST Controllers (API endpoints)
- Service Layer (business logic)
- Spring Security configuration
- JWT authentication and authorization filters
- Validation and exception handling mechanisms

Key responsibilities:
- Processing incoming requests
- Enforcing business rules
- Handling authentication and authorization
- Coordinating workflows between entities
- Orchestrating communication between controllers and repositories

This layer ensures a clean separation between presentation logic and data access logic.

### 3. Data Layer

The Data Layer is responsible for persistent storage and database operations.

It consists of:

- MySQL database (relational storage)
- MongoDB database (document storage)
- Spring Data JPA repositories
- Spring Data MongoDB repositories
- Hibernate ORM

Key responsibilities:
- Persisting structured relational data
- Storing flexible document-based medical records
- Managing entity relationships
- Providing CRUD operations through repository abstractions

This dual-database approach enables efficient handling of both transactional and document-oriented healthcare data.

### 4. Request Processing Flow (End-to-End)

The system processes requests through a clearly defined sequence of steps:
1. The user interacts with the system via a web browser (Thymeleaf UI) or an external API client
2. The request is sent to the Presentation Layer and routed over HTTP to the backend application
3. The request is received by the appropriate Controller (either MVC Controller or REST Controller) based on the endpoint mapping
4. The Controller delegates the request to the Service Layer, which acts as the core business logic component
5. The Service Layer applies business rules, validation, and orchestration logic, and then communicates with the Repository Layer
6. The Repository Layer performs data operations by interacting with either MySQL (via Spring Data JPA) or MongoDB (via Spring Data MongoDB), and returns the result back through the Service Layer to the Controller
7. The Controller constructs the final response as either a Thymeleaf-rendered HTML view or a JSON payload, which is returned to the client

### 5. Model Mapping and Data Handling

The system uses object-relational and object-document mapping techniques:
- **JPA Entities (`@Entity`)** map relational MySQL tables to Java objects
- **MongoDB Documents (`@Document`)** map NoSQL collections to Java objects

These models provide a consistent and unified domain representation across the application layers.

### 6. Security Architecture

Security is implemented using Spring Security with JWT-based authentication.

Key features include:

- Stateless authentication using JWT tokens
- Role-based access control (RBAC)
- Endpoint-level authorization
- Password encryption using hashing algorithms
- Secure request filtering

Supported roles:
- `ADMIN`
- `DOCTOR`
- `PATIENT`

### 7. Architectural Characteristics

The system is designed with the following architectural principles:

- Separation of concerns (layered architecture)
- Modular service design
- Stateless authentication model
- Polyglot persistence (SQL + NoSQL)
- RESTful API communication
- Scalable backend structure
- Clean MVC + API hybrid design

### 8. Technology Stack

| Layer | Technology |
|------|------------|
| Presentation | HTML, CSS, JavaScript, Thymeleaf |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT |
| Database (Relational) | MySQL |
| Database (NoSQL) | MongoDB |
| ORM | Hibernate, Spring Data JPA |
| API Style | REST |
| Build Tool | Maven |
| Deployment | Docker |
| CI/CD | GitHub Actions |

### 9. Summary

The Smart Clinic Management System implements a modern enterprise-grade architecture using Spring Boot and a hybrid 
database model. By combining MVC-based server rendering with RESTful APIs and integrating both relational and NoSQL 
databases, the system achieves a balance between structured transactional processing and flexible data storage.

This architecture ensures scalability, maintainability, and extensibility for future enhancements such as microservices 
migration or cloud deployment.
