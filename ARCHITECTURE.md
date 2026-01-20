# Architecture Documentation

## System Overview

The Split Lease Message Curation application is a Next.js-based internal administrative tool for managing conversations between guests and hosts. It provides a comprehensive interface for viewing, moderating, and sending automated messages.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: TailwindCSS
- **State Management**: React Hooks, TanStack Query
- **Authentication**: NextAuth.js

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database ORM**: Prisma
- **Database**: PostgreSQL

### External Services
- **SMS**: Twilio
- **Email**: SendGrid or Postmark
- **Image Hosting**: Configurable (Next.js Image Optimization)

## Architecture Patterns

### 1. Three-Tier Architecture

```
┌─────────────────────────────────────┐
│     Presentation Layer (React)      │
│  - Components                       │
│  - Pages                            │
│  - Client-side state                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Application Layer (Next.js API)   │
│  - API Routes                       │
│  - Business Logic                   │
│  - Authentication                   │
│  - External Service Integration     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Data Layer (PostgreSQL)        │
│  - Prisma ORM                       │
│  - Database Models                  │
│  - Relationships                    │
└─────────────────────────────────────┘
```

### 2. Data Flow

**Message Display Flow**:
1. User selects thread → ThreadSelector component
2. Component calls `/api/admin/threads/{id}/messages`
3. API validates auth, queries database via Prisma
4. Returns messages with all relations (guest, host, thread, listing)
5. Components render message list and details

**Message Creation Flow** (Split Bot):
1. User composes message → SplitBotMessaging component
2. Component calls `/api/admin/messages` (POST)
3. API creates message record in database
4. API triggers external services (Twilio SMS, Email)
5. API creates audit log
6. Returns success response

**Message Deletion Flow**:
1. User clicks delete → ModerationActions component
2. Shows confirmation modal
3. Component calls `/api/admin/messages/{id}` (DELETE)
4. API soft-deletes message (sets deletedAt)
5. API creates audit log
6. Component refreshes message list

## Database Schema

### Core Entities

**User**
- Represents guests, hosts, and system users (Split Bot)
- Fields: id, firstName, lastName, email, profilePhotoUrl, isSplitBot, role
- Role-based access control (USER, SUPPORT_STAFF, ADMIN)

**Listing**
- Property listings
- Relationship: belongs to host (User)

**Thread**
- Conversation thread between guest and host about a listing
- Relationships: belongs to listing, has many messages

**Message**
- Individual message in a conversation
- Relationships: belongs to thread, has guest/host/originator users
- Soft delete support (deletedAt field)

**Proposal**
- Lease proposal linked to a thread
- Tracks lease document status

**AuditLog**
- Tracks all administrative actions
- Records: user, action type, entity, timestamp, metadata

**SplitBotTemplate**
- Predefined message templates for Split Bot
- Categories: contact info redaction, message limits, lease documents

### Key Relationships

```
User ──┬─ messages as guest
       ├─ messages as host
       ├─ messages as originator
       ├─ listings (as host)
       └─ audit logs

Listing ── threads

Thread ──┬─ messages
         └─ proposals

Message ── thread
```

## API Endpoints

### Authentication Required (Admin/Support Staff Only)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/threads` | GET | Search/list threads |
| `/api/admin/threads/{id}/messages` | GET | Get all messages in thread |
| `/api/admin/threads/{id}` | DELETE | Delete thread (soft delete) |
| `/api/admin/messages` | POST | Create Split Bot message |
| `/api/admin/messages/{id}` | GET | Get single message |
| `/api/admin/messages/{id}` | DELETE | Delete message (soft delete) |
| `/api/admin/messages/{id}/forward` | POST | Forward message to support |
| `/api/admin/proposals/{id}/mark-documents-signed` | POST | Mark lease docs signed |

## Component Architecture

### Layout Components

**CorporateHeader**
- Top navigation bar
- User session display
- Sign out functionality

### Feature Components

**ThreadSelector**
- Search and filter threads
- Dropdown thread selection
- Pagination ("Show More")
- Props: onThreadSelect, selectedThreadId

**ConversationHistory**
- Displays all messages in selected thread
- Click to select individual message
- Visual indicators (warnings, forwarded status)
- Props: messages, selectedMessageId, onMessageClick

**MessageDisplay**
- Shows detailed message information
- Guest/Host/Listing metadata
- Message body
- Copy message ID functionality
- Profile photos/avatars
- Props: message, onMessageSelect

**SplitBotMessaging**
- Old Flow: Manual template selection, recipient choice
- New Flow: Call-to-action based templates
- Template buttons for common messages
- Send functionality
- Props: threadId, onMessageSent

**ModerationActions**
- Delete message (with confirmation)
- Delete thread (with confirmation)
- Forward message to support
- Props: messageId, threadId, callbacks

## Security Architecture

### Authentication
- NextAuth.js session-based authentication
- JWT tokens for session management
- Middleware protects all admin routes

### Authorization
- Role-based access control (RBAC)
- Only ADMIN and SUPPORT_STAFF can access
- Checked at middleware and API route level

### Audit Logging
- All mutations logged with:
  - User ID
  - Action type
  - Entity type and ID
  - Timestamp
  - Metadata (additional context)

### Data Protection
- Soft deletes (data retained for audit)
- PII handling (emails, names, messages)
- Input validation with Zod (can be added)
- SQL injection prevention (Prisma parameterized queries)

## External Service Integration

### Twilio (SMS)
- File: `src/services/sms.ts`
- Function: `sendSMS({ to, message })`
- Used for: Split Bot notifications

### Email (SendGrid/Postmark)
- File: `src/services/email.ts`
- Functions:
  - `sendEmail({ to, subject, html, text })`
  - `sendForwardedMessageEmail({ ... })`
- Used for: Split Bot notifications, message forwarding

## State Management

### Client-Side State
- React useState for component-local state
- No global state management (kept simple)
- TanStack Query for server state caching (configured but minimal usage)

### Server-Side State
- Database as source of truth
- Prisma client caching
- No in-memory caching (can be added with Redis)

## Error Handling

### API Routes
- Try-catch blocks around all operations
- Consistent error response format:
  ```json
  {
    "success": false,
    "error": "Error message"
  }
  ```
- Console logging for debugging
- HTTP status codes (401, 404, 500)

### Frontend
- Error states in components
- User-friendly error messages
- Alert dialogs for critical failures

## Performance Considerations

### Database
- Indexes on foreign keys
- Indexes on frequently queried fields (email, deletedAt)
- Pagination for large lists
- Soft deletes to avoid cascading hard deletes

### Frontend
- Lazy loading of messages (load per thread)
- Image optimization (Next.js Image component)
- Component memoization opportunities (can be added)

### API
- Efficient Prisma queries (includes only needed relations)
- Parallel operations where possible (Promise.all)

## Scalability Paths

### Current Bottlenecks
1. Database queries without caching
2. Synchronous external service calls (SMS/email)
3. No background job processing

### Scaling Strategies

**Short-term** (1-100 concurrent users):
- Current architecture sufficient
- Add database connection pooling
- Optimize Prisma queries

**Medium-term** (100-1000 concurrent users):
- Add Redis caching layer
- Implement background job queue (BullMQ, Redis)
- Separate read replicas for database
- CDN for static assets

**Long-term** (1000+ concurrent users):
- Microservices architecture
- Separate messaging service
- Elasticsearch for search
- Horizontal scaling with load balancer

## Testing Strategy

### Unit Tests
- Component tests (React Testing Library)
- API route tests (Jest)
- Service function tests

### Integration Tests
- API endpoint tests with test database
- Authentication flow tests

### E2E Tests
- Playwright for full user flows
- Test critical paths:
  - Login → Select thread → View message → Delete
  - Send Split Bot message
  - Forward message

## Monitoring & Observability

### Recommended Tools
- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics or New Relic
- **Database**: PgAnalyze for PostgreSQL
- **Logging**: Structured logging with Winston or Pino

### Metrics to Track
- API response times
- Database query performance
- Authentication success/failure rates
- Message send success rates (Twilio, email)
- Audit log entries per day

## Future Enhancements

### Planned Features
1. **Advanced Search**: Full-text search on messages
2. **Bulk Operations**: Delete/forward multiple messages
3. **Message Templates Management**: UI for creating/editing templates
4. **Real-time Updates**: WebSocket for live message updates
5. **Analytics Dashboard**: Message volume, response times, moderation stats
6. **Export Functionality**: Export conversations to PDF/CSV
7. **Message Scheduling**: Schedule Split Bot messages
8. **Automated Moderation**: AI-powered content filtering

### Technical Debt
1. Add comprehensive TypeScript types for all API responses
2. Implement proper input validation with Zod
3. Add rate limiting to prevent abuse
4. Implement proper logging infrastructure
5. Add comprehensive test coverage
6. Optimize images and assets
7. Implement proper error boundaries

## Deployment Architecture

### Development
- Local PostgreSQL database
- Local development server (Next.js dev)
- Mock external services (optional)

### Staging
- Hosted PostgreSQL (Supabase, Railway, etc.)
- Vercel preview deployment
- Test Twilio/SendGrid accounts

### Production
- Production PostgreSQL with backups
- Vercel production deployment
- Production Twilio/SendGrid accounts
- CDN for assets
- Monitoring and logging enabled

## Conclusion

This architecture provides a solid foundation for the Split Lease Message Curation tool, balancing simplicity with scalability. The modular design allows for incremental improvements and feature additions without major refactoring.
