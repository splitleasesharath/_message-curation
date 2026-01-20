SPLIT LEASE MESSAGE CURATION PAGE  
COMPREHENSIVE REQUIREMENTS DOCUMENT

Page: \_message-curation  
Generated: January 13, 2026  
Purpose: Migration from Bubble to Code

═══════════════════════════════════════════════════

1\. EXECUTIVE SUMMARY

The \_message-curation page is an internal administrative interface for Split Lease support staff to moderate, curate, and manage conversations between guests and hosts. This page enables staff to:  
• View and navigate conversation threads  
• Inspect individual messages with full metadata  
• Send automated "Split Bot" messages with predefined templates  
• Delete messages or entire conversations  
• Forward messages for review  
• Mark lease documents as signed via integrated workflows  
• Copy message IDs and user emails for operational use

The page operates on a single Message (\~Message) as its primary data context, displaying related Guest, Host, Listing, and Thread/Conversation information.

═══════════════════════════════════════════════════

2\. DATA MODEL & PAGE STRUCTURE

2.1 Primary Data Type: \~Message

The page centers on a Group element "G: Messages" with Type of content: \~Message.

Key fields from \~Message:  
• unique id  
• Message Body (text)  
• Split Bot Warning (text) \- displays priority warnings  
• \-Guest User (relationship to User)  
• \-Host User (relationship to User)  
• \-Originator User (relationship to User)  
• Associated Thread/Conversation (relationship to Thread/Conversation)

2.2 Related Data Types

User:  
• Name \- First  
• Name \- Last  
• Profile Photo (image)  
• email

Thread/Conversation:  
• Listing (relationship to Listing)  
• Messages (list of \~Message)

Listing:  
• Name

Proposal (mentioned in workflows):  
• lease-documents-signed (boolean/field)

2.3 Page Layout Groups

Layers (top-level containers):  
• Corporate Header A \- Reusable header for internal/admin users  
• \*P: Delete Message \- Panel/popup for message deletion controls  
• D: Choose Thread \- Dropdown and controls for thread selection  
• T: Search for Threads \- Thread search input with count display  
• T: Show More \- Pagination control for thread list  
• G: Messages \- Main message display group (Type: \~Message)  
• GF: debug \- Debug information panel for staff

═══════════════════════════════════════════════════

3\. UI ELEMENTS & DISPLAY LOGIC

3.1 Thread Selection & Navigation

Dropdown: "Choose a thread..."  
• Element ID: cpBes  
• Type: Combobox  
• Purpose: Allows staff to select any conversation thread  
• Data source: Likely "Do a search for Thread/Conversation"

Search Input: "Search for \~Thread / Conversations:count threads"  
• Element ID: cpBey  
• Purpose: Filter threads by searchable criteria  
• Display: Shows total count of matching threads  
• Search fields: Guest email, Host email, Listing name, Message content (TBC)

"show more" Button  
• Element ID: cpZNK  
• Purpose: Load additional threads (pagination)  
• Behavior: Increments visible thread count in repeating group

3.2 Message Metadata Display

All text fields use expressions like:  
• "G: Messages's \~Message's \[field name\]"

Guest Information:  
• Label: "Guest : G: Messages's \~Message's \-Guest User's Name \- First \[Last\]"  
• Profile Photo: Parent group's \~Message's \-Guest User's Profile Photo  
• Email: "Guest Email : G: Messages's \~Message's \-Guest User's email"

Host Information:  
• Label: "Host: G: Messages's \~Message's \-Host User's Name \- First \[Last\]"  
• Email: "Host Email : G: Messages's \~Message's \-Host User's email"  
• Profile Photo: Parent group's \~Message's \-Host User's Profile Photo

Listing:  
• "Listing : G: Messages's \~Message's Associated Thread/Conversation's Listing's Name"

Originator:  
• "Originator: G: Messages's \~Message's \-Originator User's Name \- First"

Message ID (Debug):  
• "message unique id:      G: Messages's \~Message's unique id"  
• "(click to copy)" \- triggers copy-to-clipboard workflow

3.3 Split Bot Warning Display

• Text: "Parent group's \~Message's Split Bot Warning"  
• Icon: priority\_high (Material Icons)  
• Purpose: Display moderation warnings (e.g., redacted contact info)  
• Appears next to guest/host names when warning exists

3.4 Message Body Display

"Full Conversation History"  
• Subtitle: "(click on each message to update and forward)"  
• Contains a Repeating Group showing all messages in the thread  
• Each cell displays:  
  \- "Parent group's \~Message's Message Body"  
  \- "Parent group's \~Message's Split Bot Warning"  
  \- User name and profile photo  
  \- Checkmark or other status indicator  
• Clicking a message updates G: Messages to that message

Current Message Display:  
• Textarea showing "G: Messages's \~Message's Message Body"  
• Read-only display for viewing/copying

═══════════════════════════════════════════════════

4\. SPLIT BOT MESSAGING FUNCTIONALITY

4.1 Split Bot Messaging (Old Flow)

Elements:  
• Textarea: "Split Bot Messages go here" (read-only, ID: cnqYb0)  
• Radio buttons:  
  \- "Send to Guest" (ID: 1768315356556x1253189\_option\_0, default checked)  
  \- "Send to Host" (ID: 1768315356556x1253189\_option\_1)  
• Template buttons:  
  \- "say Split bot redacted contact info" (ID: cnSGa)  
  \- "say please limit number of messages" (ID: cnqXl0)  
• Send button: "Send as Split Bot (Old)" (ID: cnGue)

Behavior:  
1\. User clicks template button → populates message textarea  
2\. User selects Guest or Host recipient  
3\. User clicks "Send as Split Bot (Old)"  
4\. Workflow creates new \~Message with:  
   • Originator \= Split Bot system user  
   • Message Body \= textarea content  
   • Target \= selected user (guest/host)  
   • Associated Thread \= current thread  
5\. Backend workflow sends via SMS/email/push

4.2 Split Bot Messaging (New Flow)

Elements:  
• Dropdown: "Choose a call to action" (ID: cnqdC0)  
• Action button: "mark lease documents are signed and send message" (ID: cnqii0)  
• Send button: "Send as Split Bot (New)" (ID: cnqZS0)

Behavior:  
1\. User selects call-to-action from dropdown  
2\. System composes appropriate template message  
3\. For "mark lease documents are signed":  
   • Updates Proposal record (field: lease-documents-signed)  
   • Schedules backend workflow "split-bot-lease-documents-signed"  
   • Sends message confirming documents signed  
4\. User clicks "Send as Split Bot (New)" to execute

═══════════════════════════════════════════════════

5\. DELETION & MODERATION ACTIONS

5.1 Delete Message

• Button: "Delete Message" (ID: cnJrn)  
• Location: Bottom-right of message display area  
• Workflow: "B: delete is clicked-Deletes Mess..."  
• Behavior:  
  1\. User clicks "Delete Message"  
  2\. Workflow deletes the current \~Message record  
  3\. May show confirmation dialog first  
  4\. May log deletion action to audit trail

5.2 Delete Conversation

• Button: "Delete Conversation" (ID: cnqbW0)  
• Location: Top-right, red background  
• Workflow: "B: delete conversation is clicked..."  
• Behavior:  
  1\. User clicks "Delete Conversation"  
  2\. Workflow:  
     \- Deletes all Messages in current Thread (or marks as hidden)  
     \- May soft-delete or hard-delete Thread record  
     \- Requires confirmation (critical action)  
  3\. Logs deletion with user ID and timestamp

5.3 Forward Message

• Button: "Forward this message" (ID: cnGuH)  
• Location: Bottom-left, purple background  
• Workflow: "B: Forward this message is click..."  
• Behavior:  
  1\. User clicks "Forward this message"  
  2\. Composes email/internal message with:  
     \- Message body  
     \- Guest name/email  
     \- Host name/email  
     \- Listing name  
     \- Message ID  
  3\. Sends to internal support email or external system  
  4\. May mark message with "forwarded" flag

═══════════════════════════════════════════════════

6\. PAGE WORKFLOWS (22 Total)

6.1 Uncategorized (2 workflows)

1\. "B: mark lease documents is clicked- Mark Lease Documents are signed and send message."  
   • Trigger: Button click on "mark lease documents is clicked" element  
   • Condition: Click event  
   • Step 1: Schedule API Workflow "split-bot-lease-documents-signed"  
     \- Parameters: proposal (Proposal item)  
     \- Scheduled date: Current date/time  
   • Step 2: Make changes to Proposal  
     \- Sets field: lease-documents-signed \= true (or similar)

2\. "Page is loaded"  
   • Trigger: When page loads  
   • Purpose: Initialize page state, set default values  
   • Actions: (TBD \- need to inspect workflow details)

6.2 Messages Category (12 workflows)

1\. "B: delete conversation is clicked..."  
   • Deletes all messages in current thread

2\. "B: delete is clicked-Deletes Mess..."  
   • Deletes individual message

3\. "B: Delete is clicked-Deletes(Hide..."  
   • Soft-deletes/hides message

4\. "B: Forward this message is click..."  
   • Forwards message to support team

5\. "B: Send as Split Bot (New) is clic..."  
   • Sends new-style Split Bot message with call-to-action

6\. "B: Send as Split Bot (O is clicked-..."  
   • Sends old-style Split Bot message

7\. "D: Choose Thread value changed"  
   • Updates displayed message when thread selection changes

8\. "G: Guest Message is clicked- Dis..."  
   • Updates G: Messages when guest message clicked in history

9\. "G: Host Message is clicked-Displ..."  
   • Updates G: Messages when host message clicked in history

10\. "I: Check Message Forward Status..."  
    • Conditional workflow checking if message is forwarded  
    • Parent group's \~Message's is For... (field check)

11\. "I: fa fa-check-square guest user ..."  
    • Status indicator workflow  
    • Parent group's \~Message's is For... (field check)

12\. "T: unique id of the message is cl..."  
    • Copies message unique ID to clipboard  
    • Uses "Air copy to clipboard" plugin

6.3 Custom Events (4 workflows)

(Details TBD \- custom event definitions)

6.4 On Page Load (1 workflow)

"Page is loaded" \- Initializes page state

6.5 Set States (2 workflows)

(Details TBD \- custom state management)

6.6 Show/Hide Elements (1 workflow)

(Details TBD \- conditional visibility)

═══════════════════════════════════════════════════

7\. BACKEND WORKFLOWS (296 Total, 52 in Messaging System)

7.1 Key Backend Workflows Related to Message Curation

Messaging System Category (52 workflows):  
• CORE \- send-sms-basic  
• CORE \- send-SMS-basic-no-user  
• CORE create-new-thread-before...  
• CORE-cancel-scheduled-api-calls  
• core-contact-host-send-message  
• split-bot-lease-documents-signed (referenced in page workflow)  
• L3 \- Lease Documents Signed Internal Messaging (referenced in page workflow)

Other Relevant Categories:  
• Leases Workflows (11)  
• Core \- Notifications (1)  
• Core \- User Management (5)  
• Masking & Forwarding (11) \- likely contains message redaction logic  
• Masking and Forwarding (FRED) (4)

7.2 Backend Workflow: split-bot-lease-documents-signed

Purpose: Marks lease documents as signed and sends confirmation message

Parameters:  
• proposal (Proposal type)

Actions:  
1\. Update Proposal:  
   \- Set lease-documents-signed \= true  
2\. Create \~Message:  
   \- Originator \= Split Bot user  
   \- Message Body \= "Lease documents have been signed" (or template)  
   \- Associated Thread \= proposal's thread  
3\. Send message via:  
   \- SMS (Twilio API)  
   \- Email (SendGrid/Postmark)  
   \- Push notification (if applicable)

7.3 Backend Workflow: L3 \- Lease Documents Signed Internal Messaging

Scheduled by: "B: mark lease documents is clicked" workflow  
Purpose: Internal messaging for lease document signing event  
Actions: (TBD \- requires inspection of backend workflow)

═══════════════════════════════════════════════════

8\. TECHNICAL REQUIREMENTS FOR MIGRATION

8.1 Database Schema Requirements

Message Table:  
• id (UUID, primary key)  
• message\_body (TEXT)  
• split\_bot\_warning (TEXT, nullable)  
• guest\_user\_id (FK to Users)  
• host\_user\_id (FK to Users)  
• originator\_user\_id (FK to Users)  
• thread\_id (FK to Threads/Conversations)  
• created\_at (TIMESTAMP)  
• updated\_at (TIMESTAMP)  
• deleted\_at (TIMESTAMP, nullable for soft delete)  
• forwarded (BOOLEAN, default false)  
• forwarded\_at (TIMESTAMP, nullable)

Thread/Conversation Table:  
• id (UUID, primary key)  
• listing\_id (FK to Listings)  
• created\_at (TIMESTAMP)  
• deleted\_at (TIMESTAMP, nullable)

User Table (existing):  
• id (UUID, primary key)  
• first\_name (VARCHAR)  
• last\_name (VARCHAR)  
• email (VARCHAR)  
• profile\_photo\_url (VARCHAR)  
• is\_split\_bot (BOOLEAN) \- identifies Split Bot system user

Proposal Table (existing):  
• id (UUID, primary key)  
• lease\_documents\_signed (BOOLEAN)  
• thread\_id (FK to Threads, nullable)

Listing Table (existing):  
• id (UUID, primary key)  
• name (VARCHAR)

8.2 API Endpoints Required

GET /api/admin/threads  
• Search and filter threads  
• Query params: search (text), limit, offset  
• Returns: { threads: \[\], total\_count: N }

GET /api/admin/threads/:thread\_id/messages  
• Retrieve all messages for a thread  
• Returns: { messages: \[\], thread: {} }

GET /api/admin/messages/:message\_id  
• Retrieve single message with related data  
• Returns: { message: {}, guest: {}, host: {}, listing: {}, thread: {} }

POST /api/admin/messages  
• Create new message (Split Bot)  
• Body: { thread\_id, message\_body, recipient\_type, template\_name }  
• Triggers backend messaging pipeline

DELETE /api/admin/messages/:message\_id  
• Delete single message  
• Logs deletion action

DELETE /api/admin/threads/:thread\_id  
• Delete entire conversation  
• Cascades to all messages or soft-deletes

POST /api/admin/messages/:message\_id/forward  
• Forward message to support team  
• Body: { recipient\_email }  
• Sends email with message details

POST /api/admin/proposals/:proposal\_id/mark-documents-signed  
• Mark lease documents as signed  
• Triggers messaging workflow  
• Updates proposal record

8.3 External Integrations

SMS Provider (Twilio):  
• API endpoint for sending SMS  
• Credentials: Account SID, Auth Token  
• From number configuration

Email Provider (SendGrid or Postmark):  
• API endpoint for transactional emails  
• API key authentication  
• Template management for Split Bot messages

Clipboard API:  
• Browser Clipboard API for copying message IDs  
• Fallback for browsers without support

8.4 Security & Access Control

Authentication:  
• Page restricted to authenticated corporate/admin users  
• Role check: User must have 'admin' or 'support\_staff' role  
• Redirect to login if not authenticated

Authorization:  
• All API endpoints require admin role  
• Audit logging for all mutations (create, update, delete)  
• Rate limiting on deletion endpoints

Data Privacy:  
• PII (emails, names, message content) must be protected  
• Deletion actions logged with user ID and timestamp  
• Soft delete preferred for compliance/audit

═══════════════════════════════════════════════════

9\. PLUGINS & DEPENDENCIES

• Air copy to clipboard \- For copying message IDs  
• Material Icons \- For priority\_high icon  
• API Connector (Bubble) \- External API calls  
• Twilio integration \- SMS sending  
• Email service integration \- Email sending

═══════════════════════════════════════════════════

10\. UNKNOWNS & ITEMS REQUIRING DETAILED INSPECTION

The following items need additional analysis in Bubble:

10.1 Exact Data Source Expressions

• Thread search: Full "Do a search for Thread/Conversation" expression with constraints  
• Message history: Repeating Group data source and filters  
• Thread dropdown: Options and display field

10.2 Conditional Logic

• All "Conditional" tab settings for each element:  
  \- Visibility conditions (when to show/hide)  
  \- Dynamic styling (color changes, disabled states)  
  \- Text changes based on state

10.3 Complete Workflow Actions

• "Page is loaded" workflow \- all initialization steps  
• Custom Events (4) \- definitions and parameters  
• Set States (2) \- custom state definitions and usage  
• Show/Hide Elements (1) \- which elements, conditions

10.4 Backend Workflow Details

• Each of the 52 Messaging System backend workflows:  
  \- Parameters and types  
  \- Full action sequences  
  \- Error handling logic  
  \- External API calls and configurations

10.5 Split Bot Message Templates

• Complete list of all call-to-action options in dropdown  
• Message templates for each option  
• Variables used in templates  
• Conditions for when each template is available

10.6 Thread Selection Logic

• How thread is initially set on page load (URL parameter? Custom state?)  
• What happens when no thread is selected  
• Default message selection within a thread

═══════════════════════════════════════════════════

11\. DETAILED INSPECTION PROMPT

Use this prompt in Bubble editor for systematic extraction:

"On the '\_message-curation' page:

1\. DESIGN TAB:  
   • For G: Messages group: Copy the exact 'Data source' expression  
   • For each text element showing message data: Copy full dynamic expression  
   • For the conversation history Repeating Group:  
     \- Copy 'Type of content'  
     \- Copy 'Data source' expression  
     \- Note ':filtered' or ':sorted' modifiers  
   • For thread search elements:  
     \- Copy search input data source  
     \- Copy thread dropdown options source  
   • For each major element, open 'Conditional' tab:  
     \- List all conditions  
     \- Note which properties change  
     \- Copy the expressions used

2\. WORKFLOW TAB:  
   • For 'Page is loaded':  
     \- List all actions  
     \- Copy any 'Only when' conditions  
   • For each 'Custom Event':  
     \- Copy event name and parameters  
     \- List all actions  
   • For 'Set States' workflows:  
     \- Identify custom state names  
     \- Note initial values  
   • For 'Show/Hide Elements':  
     \- List elements affected  
     \- Copy visibility conditions  
   • For each message-related workflow:  
     \- Expand all action steps  
     \- Copy field names in 'Make changes to' actions  
     \- Copy any API call configurations

3\. BACKEND WORKFLOWS TAB:  
   • In 'Messaging System' category:  
     \- Click each workflow  
     \- Copy parameter definitions  
     \- List all action steps  
     \- Note any recursive calls or schedules  
   • Specifically for:  
     \- 'split-bot-lease-documents-signed'  
     \- 'L3 \- Lease Documents Signed Internal Messaging'  
     \- 'CORE \- send-sms-basic'  
     \- Any workflow with 'forward' or 'delete' in name

4\. DATA TAB:  
   • For \~Message type:  
     \- List all fields with types  
     \- Note any option sets  
     \- Check privacy rules  
   • For Thread/Conversation type:  
     \- Same as above  
   • Check if there's a 'Split Bot' user or system user defined"

═══════════════════════════════════════════════════

12\. IMPLEMENTATION RECOMMENDATIONS

12.1 Migration Strategy

Phase 1: Data Layer  
• Migrate database schema with all relationships  
• Ensure Message, Thread, User, Listing, Proposal tables exist  
• Add audit/logging tables for deletions and actions  
• Set up soft delete columns

Phase 2: API Layer  
• Implement all admin API endpoints  
• Add authentication/authorization middleware  
• Integrate with existing messaging backend  
• Set up external integrations (Twilio, email provider)

Phase 3: Frontend  
• Build message curation UI matching Bubble layout  
• Implement thread search and navigation  
• Add Split Bot messaging interfaces (Old & New)  
• Implement deletion and forwarding features

Phase 4: Testing & Validation  
• Test all workflows with production data  
• Validate Split Bot message templates  
• Verify audit logging captures all actions  
• Load test with multiple concurrent admin users

12.2 Key Risks & Mitigation

Risk: Incomplete backend workflow understanding  
Mitigation: Systematic inspection using provided prompt

Risk: Message delivery failures during migration  
Mitigation: Parallel run both systems, compare outputs

Risk: Data loss during deletion operations  
Mitigation: Implement soft deletes with restore capability

Risk: Missing conditional logic  
Mitigation: Document all conditionals before migration

═══════════════════════════════════════════════════

13\. SUMMARY

The \_message-curation page is a comprehensive internal tool for managing guest-host conversations at Split Lease. This document captures:

✅ Page structure and data model  
✅ All UI elements and their purposes  
✅ 22 page workflows organized by category  
✅ 52 messaging-related backend workflows  
✅ Split Bot functionality (Old and New flows)  
✅ Deletion and moderation capabilities  
✅ Technical requirements for migration  
✅ API endpoints needed  
✅ Security and access control requirements

❌ Items requiring detailed inspection:  
• Exact data source expressions  
• All conditional logic (visibility, styling)  
• Complete backend workflow action sequences  
• Split Bot message templates  
• Custom events and states

Next Steps:  
1\. Use the detailed inspection prompt (Section 11\) to extract remaining details  
2\. Document all backend workflow actions  
3\. Create frontend mockups based on screenshots  
4\. Begin Phase 1 implementation (Data Layer)

═══════════════════════════════════════════════════

Document Generated: January 13, 2026  
Bubble Page: \_message-curation  
App: Split Lease Production  
Purpose: Code migration requirements

