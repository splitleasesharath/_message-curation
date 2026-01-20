# Split Lease Message Curation Internal Page

An internal administrative interface for Split Lease support staff to moderate, curate, and manage conversations between guests and hosts.

## Features

- **Thread Management**: View and navigate conversation threads between guests and hosts
- **Message Inspection**: Inspect individual messages with full metadata (guest, host, listing info)
- **Split Bot Messaging**: Send automated messages with predefined templates
- **Moderation Tools**: Delete messages or entire conversations
- **Message Forwarding**: Forward messages for review to internal support team
- **Lease Document Management**: Mark lease documents as signed via integrated workflows
- **Utility Functions**: Copy message IDs and user emails for operational use

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **External Services**:
  - Twilio (SMS)
  - SendGrid/Postmark (Email)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Twilio account (for SMS)
- SendGrid or Postmark account (for email)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/splitleasesharath/_message-curation.git
cd _message-curation
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your actual credentials.

4. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- **Message**: Individual messages in conversations
- **Thread**: Conversation threads between guests and hosts
- **User**: Guest, host, and system users (including Split Bot)
- **Proposal**: Lease proposals with document status
- **Listing**: Property listings
- **AuditLog**: Tracks all administrative actions

## API Endpoints

### Thread Management
- `GET /api/admin/threads` - Search and filter threads
- `GET /api/admin/threads/:id/messages` - Get all messages in a thread

### Message Operations
- `GET /api/admin/messages/:id` - Get single message with related data
- `POST /api/admin/messages` - Create new Split Bot message
- `DELETE /api/admin/messages/:id` - Delete single message
- `POST /api/admin/messages/:id/forward` - Forward message to support

### Thread Operations
- `DELETE /api/admin/threads/:id` - Delete entire conversation

### Proposal Operations
- `POST /api/admin/proposals/:id/mark-documents-signed` - Mark lease documents as signed

## Security

- All endpoints require admin authentication
- Role-based access control (admin/support_staff roles only)
- Audit logging for all mutations
- Rate limiting on deletion endpoints
- Soft delete for compliance and audit trails

## Development

### Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── message-curation/  # Main page
├── components/            # React components
├── lib/                   # Utility functions
├── services/              # External service integrations
└── types/                 # TypeScript types
prisma/
└── schema.prisma         # Database schema
```

### Running Tests

```bash
npm test
```

### Database Management

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## License

Private - Split Lease Internal Tool
