# Travel App Backend - Copilot Instructions

**Project:** Spring Boot 3.5.9 REST API for travel discovery mobile app  
**Java Version:** 21  
**Primary Database:** PostgreSQL 16 + PostGIS (geospatial queries)  
**Authentication:** JWT + Google OAuth  

---

## Quick Start Commands

```bash
# Build
./mvnw clean package

# Run locally (development)
./mvnw spring-boot:run

# Run with Docker Compose (PostgreSQL + pgAdmin + app)
docker-compose up

# Run tests
./mvnw test

# Clean build
./mvnw clean install
```

**Key Files:** [pom.xml](pom.xml) | [Dockerfile](Dockerfile) | [docker-compose.yml](docker-compose.yml)

---

## Architecture Overview

### Layered Structure
```
Controllers (8 REST endpoints)
    ↓
Services (14 business logic components)
    ↓
Repositories (8 JPA repositories + custom queries)
    ↓
Entities (8 domain models)
```

### Core Services
| Service | Purpose |
|---------|---------|
| **AuthService** | JWT token generation, user authentication, Google OAuth |
| **UserService** | User profile management, registration, role-based access |
| **AttractionService** | Attraction CRUD, geospatial search (PostGIS) |
| **ReviewService** | User reviews for attractions |
| **BookmarkService** | User-favorite attractions tracking |
| **EventService** | Travel events management |
| **NotificationService** | User notifications and alerts |
| **EmailService** | Verification & password reset emails (Gmail SMTP) |
| **GeminiAIService** | Intelligent recommendations via Gemini API |

### Controllers
| Controller | Endpoints |
|-----------|-----------|
| **AuthController** | `/api/auth/**` - Login, registration, token refresh, logout |
| **UserController** | `/api/users/**` - User profile, stats, interests |
| **AttractionController** | `/api/attractions/**` - Search, filter, details (public + private) |
| **ReviewController** | `/api/reviews/**` - Create, update, delete reviews |
| **BookmarkController** | `/api/bookmarks/**` - Add/remove favorites |
| **EventController** | `/api/events/**` - Event management |
| **NotificationController** | `/api/notifications/**` - Notification retrieval |
| **AttractionImageController** | `/api/attraction-images/**` - Image management |

### Data Models
- **User** - Authentication, profile, interests, roles (ADMIN, USER)
- **Attraction** - Travel destinations with geospatial data
- **Review** - Ratings and feedback for attractions
- **Event** - Travel events and activities
- **Bookmark** - User-saved attractions
- **Notification** - System and user notifications
- **Interest** - User travel preferences (e.g., cultural, adventure)
- **AttractionImage** - Media assets for attractions

---

## Technology Stack

| Component | Details |
|-----------|---------|
| **Framework** | Spring Boot 3.5.9 + Spring Data JPA |
| **Security** | Spring Security + JWT (JJWT 0.11.5) + Google OAuth |
| **Database** | PostgreSQL 16 + PostGIS (geospatial queries) |
| **ORM** | Hibernate + Hibernate Spatial |
| **Validation** | Spring Validation (JSR-380) |
| **Templating** | Thymeleaf (email templates) |
| **Email** | JavaMail 1.4.7 via Gmail SMTP |
| **AI** | Gemini API integration |
| **Build** | Maven (./mvnw wrapper) |
| **Containerization** | Docker + Docker Compose |
| **Java Version** | Java 21 |
| **Code Quality** | Lombok (reduce boilerplate) |

---

## Configuration & Environment

### Required Environment Variables
```
# Database
DB_URL=jdbc:postgresql://localhost:5432/travel_app
DB_USER=postgres
DB_PASSWORD=<your_password>

# JWT
JWT_SECRET=<your_jwt_secret_key>

# Email (Gmail SMTP)
SPRING_MAIL_USERNAME=<your_gmail>
SPRING_MAIL_PASSWORD=<your_app_password>

# Gemini AI
GEMINI_API_KEY=<your_gemini_key>

# URLs
BASE_URL=http://localhost:8080
BASE_URL_FRONTEND=http://localhost:3000
BASE_URL_IP=http://192.168.x.x:8080

# Google OAuth (Android, iOS, Web)
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...

# pgAdmin (Docker)
PGADMIN_MAIL=admin@example.com
PGADMIN_PASS=admin
```

**Configuration File:** [application.properties](src/main/resources/application.properties)

---

## Security & Authentication

### JWT Authentication
- Token-based, stateless authentication
- Token Expiry:** 60 minutes (configurable via `JWT_SECRET`)
- **Filter:** [JwtAuthenticationFilter](src/main/java/com/example/mobileApp/config/JwtAuthenticationFilter.java) - injected before Spring's chain
- **Config:** [SecurityConfig.java](src/main/java/com/example/mobileApp/config/SecurityConfig.java)

### Public Routes (No Auth Required)
```
/api/auth/**              - All authentication endpoints
/api/attractions/**       - Browse attractions
/api/attraction-images/** - View attraction images
/api/events/**           - Browse events
```

### Protected Routes (Auth Required)
```
/api/users/**            - User profile operations
/api/reviews/**          - Create/manage reviews
/api/bookmarks/**        - Manage bookmarks
/api/notifications/**    - View notifications
```

### Password & Encoding
- **Encoder:** BCryptPasswordEncoder (Spring Security default)
- **CORS:** Enabled

---

## Code Patterns & Conventions

### Entity Pattern
```java
@Entity
@Data              // Lombok: generates getters/setters
@RequiredArgsConstructor
public class Attraction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @CreationTimestamp  // Auto-set creation timestamp
    private LocalDateTime createdAt;
    
    // Geospatial support
    private Double latitude;
    private Double longitude;
}
```

### Service Pattern
```java
@Service
@RequiredArgsConstructor    // Lombok constructor injection
public class AttractionService {
    private final AttractionRepository repository;
    private final AttractionMapper mapper;
    
    public List<AttractionResponse> getAll() {
        return repository.findAll().stream()
            .map(mapper::toResponse)
            .collect(Collectors.toList());
    }
}
```

### Controller Pattern
```java
@RestController
@RequestMapping("/api/attractions")
@RequiredArgsConstructor
public class AttractionController {
    private final AttractionService service;
    
    @GetMapping
    public ResponseEntity<List<AttractionResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
```

### Mapper Pattern
```java
@Component
public class AttractionMapper {
    public AttractionResponse toResponse(Attraction entity) {
        // Manual mapping (no MapStruct dependency)
        return AttractionResponse.builder()
            .id(entity.getId())
            .name(entity.getName())
            .build();
    }
}
```

### Exception Handling
- **Custom Exception:** [ApiException](src/main/java/com/example/mobileApp/exception/ApiException.java)
- **Global Handler:** [GlobalExceptionHandler](src/main/java/com/example/mobileApp/exception/GlobalExceptionHandler.java)

**Pattern:**
```java
// In service
if (!found) {
    throw new ApiException("Resource not found", HttpStatus.NOT_FOUND);
}

// GlobalExceptionHandler catches and formats response
```

### DTO Organization
- **Request DTOs:** `dto/request/` - Input validation for API requests
- **Response DTOs:** `dto/response/` - Outbound data serialization

---

## Geospatial Features

### PostGIS Integration
- **Database:** PostgreSQL with PostGIS extension (already configured)
- **ORM Support:** Hibernate Spatial for geographic queries
- **Columns:** `latitude` and `longitude` on Attraction entity

### Example: Nearby Attractions Query
```java
// Find attractions within 10km of a point
@Query("SELECT a FROM Attraction a WHERE...")
List<Attraction> findNearby(Double lat, Double lon, Double radiusKm);
```

---

## Email & Templates

### Email Service
- **Provider:** Gmail SMTP (smtp.gmail.com:587)
- **Templates:** [email-verification.html](src/main/resources/templates/email-verification.html), [password-reset.html](src/main/resources/templates/password-reset.html)
- **Triggered by:** AuthService (registration, password reset)

### Gmail Setup for Development
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password (16 characters)
3. Use App Password in `SPRING_MAIL_PASSWORD`

---

## Docker Deployment

### docker-compose.yml Services
```yaml
postgresql:
  - Port: 5432
  - Image: postgis/postgis:16-3.4
  - Volumes: PostgreSQL data persistence
  
pgadmin:
  - Port: 5050
  - UI for PostgreSQL management
  
app (Spring Boot):
  - Port: 8080
  - Environment: Injects all .env variables
  - Volumes: Hot-reload for development
```

**Usage:**
```bash
docker-compose up          # Start all services
docker-compose down        # Stop all services
docker-compose logs -f app # View app logs
```

---

## Common Development Tasks

### Add a New Entity
1. Create entity in [entity/](src/main/java/com/example/mobileApp/entity/)
2. Create repository in [repository/](src/main/java/com/example/mobileApp/repository/)
3. Create service in [service/](src/main/java/com/example/mobileApp/service/)
4. Create mapper in [mapper/](src/main/java/com/example/mobileApp/mapper/)
5. Create controller in [controller/](src/main/java/com/example/mobileApp/controller/)
6. Define DTOs in [dto/request/](src/main/java/com/example/mobileApp/dto/request/) and [dto/response/](src/main/java/com/example/mobileApp/dto/response/)
7. Run migrations if using Flyway or update application.properties for auto-DDL

### Add a New API Endpoint
1. Add method to relevant controller
2. Add service method (if needed)
3. Add repository custom query (if needed)
4. Document endpoint in Swagger/controller javadoc
5. Write test case in [test/](src/test/java/com/example/mobileApp/)

### Database Schema Changes
- **DDL Mode:** `spring.jpa.hibernate.ddl-auto=update` (auto-creates/updates tables)
- **Manual:** Write SQL scripts to PostgreSQL directly via pgAdmin (port 5050)

### Test Execution
```bash
./mvnw test                           # Run all tests
./mvnw test -Dtest=AuthControllerTest # Run specific test class
./mvnw test -Dtest=*Service*         # Run tests matching pattern
```

---

## Debugging & Troubleshooting

### Logs
- **Log Level:** DEBUG for Spring + app code, TRACE for SQL bindings
- **Location:** Console output when running `./mvnw spring-boot:run`

### Common Issues

| Issue | Resolution |
|-------|-----------|
| Database connection fails | Check `DB_URL`, `DB_USER`, `DB_PASSWORD` env vars or `.env` file |
| JWT token expiration | Token expires in 60 min; implement refresh token logic in AuthService |
| Email sending fails | Verify Gmail App Password, enable "Less secure" or 2FA + App Password |
| PostGIS queries fail | Ensure PostGIS extension enabled: `CREATE EXTENSION IF NOT EXISTS postgis;` |
| Port 8080 already in use | `lsof -i :8080` (Mac/Linux) or use different port in application.properties |

### Enable Debug Logging
```properties
# In application.properties
logging.level.com.example.mobileApp=DEBUG
logging.level.org.springframework=DEBUG
logging.level.org.hibernate.SQL=TRACE
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

---

## Testing Strategy

### Test Framework
- **Framework:** JUnit 5 (Jupiter)
- **Base Test:** [MobileAppApplicationTests.java](src/test/java/com/example/mobileApp/MobileAppApplicationTests.java)

### Best Practices
1. Use `@SpringBootTest` for integration tests
2. Mock external services (Gemini API, Google OAuth, Gmail)
3. Use `@DataJpaTest` for repository tests
4. Use `@WebMvcTest` for controller tests
5. Keep test data fixtures minimal and focused

---

## Performance Considerations

- **Database Pooling:** HikariCP with max 10 connections (configurable via application.properties)
- **Geospatial Indexes:** Create spatial indexes on `latitude`/`longitude` for large datasets
- **JWT Caching:** Consider caching validated tokens to reduce CPU overhead
- **Email Async:** Email sending should be async (implement `@Async` on EmailService)

---

## Useful Links & Commands

| Task | Command |
|------|---------|
| Check Java version | `java -version` |
| View Maven version | `./mvnw --version` |
| Install dependencies | `./mvnw install` |
| Run in debug mode | `./mvnw spring-boot:run -Dspring-boot.run.arguments="--debug"` |
| Generate jar | `./mvnw package` |
| View jar contents | `jar tf target/mobile-app-0.0.1-SNAPSHOT.jar` |
| Run jar directly | `java -jar target/mobile-app-0.0.1-SNAPSHOT.jar` |

---

## Next Steps / Tips for Copilot

1. **Use this as context** - Reference this file for architecture questions
2. **Suggest entity validation** - When creating new entities, ensure `@Valid` annotations on controller inputs
3. **Async operations** - Recommend `@Async` for long-running operations (email, API calls)
4. **Security audits** - Review endpoints for RBAC enforcement, SQL injection via custom queries
5. **Test coverage** - Suggest unit tests for services, integration tests for controllers
6. **Documentation** - Keep Javadoc and controller method documentation updated for API clarity

---

**Last Updated:** 2026-03-28  
**Questions?** Refer to pom.xml for exact dependency versions, application.properties for configs
