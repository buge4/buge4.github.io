# Veriton Messaging System

A complete employee messaging frontend interface built with React, TypeScript, and Supabase.

## Features

### 🔥 Core Messaging Features
- **Real-time messaging** - Instant message delivery using Supabase realtime subscriptions
- **Channel-based communication** - Support for both group channels and direct messages
- **Employee directory** - Browse and search all employees in the organization
- **Message history** - Persistent chat history across sessions
- **Online presence** - Track who's currently online

### 🎨 User Interface
- **Modern chat interface** - Clean, responsive design similar to Slack/Discord
- **Sidebar navigation** - Easy access to channels and employee directory
- **Message grouping** - Smart message grouping by sender and time
- **Search and filters** - Find employees by name, department, or role
- **Mobile responsive** - Works seamlessly on desktop and mobile devices

### 🔧 Technical Features
- **TypeScript support** - Full type safety throughout the application
- **Real-time subscriptions** - Live updates without page refresh
- **Error handling** - Robust error handling and loading states
- **Performance optimized** - Efficient rendering and data management

## Architecture

### Components Structure
```
src/
├── pages/
│   └── ChatPage.tsx          # Main chat page
├── components/
│   └── chat/
│       ├── ChatSidebar.tsx    # Sidebar with channels and directory
│       ├── ChatWindow.tsx     # Main chat interface
│       ├── MessageList.tsx    # Scrollable message list
│       ├── MessageItem.tsx    # Individual message component
│       ├── MessageInput.tsx   # Message composer
│       └── EmployeeDirectory.tsx # Employee browsing interface
├── hooks/
│   ├── useAuth.ts             # Authentication hook
│   └── useChatRealtime.ts     # Real-time messaging hooks
└── lib/
    ├── supabase.ts            # Supabase client configuration
    └── chatHelpers.ts         # Chat utility functions
```

### Database Schema

The messaging system uses the following Supabase tables:

#### `chat_channels`
- **id** (UUID) - Primary key
- **name** (TEXT) - Channel name
- **type** (TEXT) - 'dm' for direct messages, 'group' for channels
- **created_by** (UUID) - User who created the channel
- **created_at/updated_at** (TIMESTAMPTZ) - Timestamps

#### `chat_messages`
- **id** (UUID) - Primary key
- **channel_id** (UUID) - Reference to chat_channels
- **sender_id** (UUID) - Reference to auth.users
- **content** (TEXT) - Message content
- **sent_at** (TIMESTAMPTZ) - When message was sent
- **edited_at** (TIMESTAMPTZ) - When message was last edited
- **is_deleted** (BOOLEAN) - Soft delete flag

#### `channel_members`
- **id** (UUID) - Primary key
- **channel_id** (UUID) - Reference to chat_channels
- **user_id** (UUID) - Reference to auth.users
- **joined_at** (TIMESTAMPTZ) - When user joined
- **last_read_at** (TIMESTAMPTZ) - Last message read timestamp
- **is_online** (BOOLEAN) - Online status

#### `employees`
- **id** (UUID) - Primary key
- **user_id** (UUID) - Reference to auth.users
- **full_name** (TEXT) - Employee's full name
- **email** (TEXT) - Employee email
- **department** (TEXT) - Department name
- **position** (TEXT) - Job title
- **access_level** (TEXT) - Permission level
- **is_active** (BOOLEAN) - Active status

## Usage

### Navigation
Access the chat system by visiting `/chat` route in your application.

### Key Interactions

1. **Channel Selection**
   - Click on channels in the sidebar to switch between conversations
   - Channels are automatically sorted and grouped

2. **Employee Directory**
   - Click "Employee Directory" in the sidebar to browse all employees
   - Search by name, email, or position
   - Filter by department
   - Start direct messages from employee cards

3. **Sending Messages**
   - Type in the message input at the bottom of any channel
   - Press Enter to send, Shift+Enter for new line
   - Messages appear instantly for all channel members

4. **Real-time Updates**
   - New messages appear automatically without page refresh
   - Online status updates in real-time
   - Channel membership changes reflected instantly

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- Supabase project with required tables created

### Installation
1. The messaging system is already integrated into the main Veriton TVRF project
2. All dependencies are included in the existing package.json
3. Routes are configured in App.tsx

### Environment Configuration
The Supabase client is already configured in `src/lib/supabase.ts`:
```typescript
const supabaseUrl = 'https://xprtzodwutgskpdvyxwn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Database Setup
Ensure the following tables exist in your Supabase project:
- `chat_channels`
- `chat_messages` 
- `channel_members`
- `employees`

RLS policies should be configured to allow authenticated users to read/write their respective data.

## API Integration

### Real-time Subscriptions
The system uses Supabase realtime subscriptions for live updates:

```typescript
// Subscribe to new messages in a channel
const subscription = supabase
  .channel(`chat_messages:${channelId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages',
    filter: `channel_id=eq.${channelId}`,
  }, (payload) => {
    // Handle new message
  })
  .subscribe();
```

### Authentication
The system integrates with Supabase Auth:
- Users must be authenticated to access chat
- User profiles are linked via the `employees` table
- Online status tracking requires user authentication

## Development

### Adding New Features
1. **New Message Types**: Extend the `ChatMessage` interface and update rendering logic
2. **Channel Features**: Add to `ChatChannel` interface and sidebar logic  
3. **Real-time Features**: Use the `useChatRealtime` hook for live functionality

### Customization
- **Styling**: Modify Tailwind classes in component files
- **Icons**: Replace Lucide icons with your preferred icon set
- **Layout**: Adjust component structure and CSS Grid/Flexbox layouts

### Testing
- Use the existing Supabase development environment
- Create test users and channels via the Supabase dashboard
- Test real-time functionality with multiple browser sessions

## Production Considerations

### Performance
- Implement message pagination for large chat histories
- Add message caching for offline support
- Optimize real-time subscriptions to prevent memory leaks

### Security  
- Implement proper RLS policies for all chat tables
- Validate message content and user permissions
- Add rate limiting for message sending

### Scalability
- Consider implementing message archiving
- Add channel archiving/cleanup functionality
- Implement user presence optimization for large teams

## Browser Support
- Chrome/Edge 90+
- Firefox 88+ 
- Safari 14+
- Mobile browsers with modern JavaScript support

## License
Part of the Veriton TVRF project - all rights reserved.