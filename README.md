# 🎙️ Superstar Podcast Hub

A professional full-stack podcast broadcasting and streaming platform built with React, Vite, Tailwind CSS, and Lovable Cloud (Supabase).

**Project URL**: https://lovable.dev/projects/e26d25d9-58fa-4c06-b7c1-21a80933bc17

## ✨ Features

### 🔐 Authentication & Roles
- **User Registration & Login** with email/password
- **Role-Based Access Control**:
  - 👂 **Listener**: Browse live channels, watch streams, chat
  - 📡 **Broadcaster**: Create channels, manage streams, upload podcasts
  - 🛡️ **Admin**: Platform analytics, user management, moderation

### 📺 Live Streaming
- **Channel Creation**: Broadcasters can create and manage their own channels
- **Stream Management**: Go live/offline with real-time status updates
- **Stream Keys**: Secure RTMP keys for OBS/streaming software
- **Viewer Count**: Live viewer tracking and analytics
- **Live Directory**: Browse all active live streams

### 💬 Real-Time Chat
- **Live Chat**: Real-time messaging using Supabase Realtime
- **Message Persistence**: Chat history stored in database
- **Per-Channel Chats**: Each channel has its own chat room
- **User Authentication**: Only logged-in users can chat

### 🎵 Content Management
- **Multi-Channel Support**: Users can create and manage channels
- **Subscription System**: Follow favorite channels
- **Category Organization**: Technology, Business, Gaming, Music, etc.
- **File Storage**: Secure storage for podcasts, thumbnails, avatars

### 📊 Admin Dashboard
- **Platform Stats**: Users, channels, streams, views
- **Top Channels**: See most popular live streams
- **System Health**: Monitor backend status
- **User Management**: Admin controls for moderation

## 🚀 Quick Start

### Using Lovable (Recommended)

Simply visit [Lovable Project](https://lovable.dev/projects/e26d25d9-58fa-4c06-b7c1-21a80933bc17) and start prompting. Changes made via Lovable will be committed automatically.

### Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📱 Usage Guide

### For Listeners

1. **Sign Up**
   - Create an account with email/password
   - Default role is "Listener"

2. **Browse Live Streams**
   - Click the "Listener" role button
   - See all currently live channels
   - Click any channel to watch

3. **Watch & Chat**
   - Join a channel to see the stream
   - Participate in live chat
   - Subscribe to channels you like

### For Broadcasters

1. **Get Broadcaster Role**
   - Contact an admin to upgrade your account
   - Admins can assign broadcaster role via edge function

2. **Create Your Channel**
   - Click "Broadcaster" role button
   - Fill in channel name, description, category
   - Get your unique stream key

3. **Set Up Streaming Software**
   - Download OBS Studio or similar
   - Copy your stream key from the dashboard
   - Configure OBS with the RTMP server URL and stream key
   - Click "Go Live" in the app
   - Start streaming in OBS

4. **Manage Your Stream**
   - See live viewer count
   - Monitor chat activity
   - End stream when finished

### For Admins

1. **Access Admin Panel**
   - Must have admin role assigned
   - Click "Admin" role button
   - View platform statistics
   - Manage users and content

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **React Router** for navigation

### Backend (Lovable Cloud / Supabase)
- **PostgreSQL** database
- **Row Level Security** for data protection
- **Supabase Auth** for authentication
- **Supabase Storage** for file uploads
- **Supabase Realtime** for live chat
- **Edge Functions** for business logic

### Database Schema

**Tables:**
- `profiles` - User profile data
- `user_roles` - Role assignments (separate for security)
- `channels` - Broadcasting channels
- `subscriptions` - Channel subscriptions
- `podcasts` - On-demand content
- `clips` - Short-form clips
- `chat_messages` - Real-time chat

**Storage Buckets:**
- `podcasts` - Audio files
- `thumbnails` - Channel/content images
- `avatars` - User avatars
- `clips` - Video clips

## 🔌 API Reference

### Edge Functions

#### Create Channel
```typescript
POST /functions/v1/create-channel
Authorization: Bearer <token>

Body: {
  displayName: string,
  description?: string,
  category?: string
}
```

#### Update Stream Status
```typescript
POST /functions/v1/update-stream-status
Authorization: Bearer <token>

Body: {
  channelId: string,
  isLive: boolean,
  viewerCount?: number
}
```

#### Admin Stats
```typescript
GET /functions/v1/admin-stats
Authorization: Bearer <token>
```

#### Assign Role
```typescript
POST /functions/v1/assign-role
Authorization: Bearer <token>

Body: {
  userId: string,
  role: 'listener' | 'broadcaster' | 'admin'
}
```

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- **Separate roles table** prevents privilege escalation
- **Security definer functions** for safe role checks
- **Auth-based policies** for data access
- **Storage policies** for file access control

## 🎨 Design System

The app uses a comprehensive design system with:
- **Semantic tokens** for colors
- **Glassmorphism** effects
- **Smooth animations** and transitions
- **Responsive design** (mobile-first)
- **Dark mode** support
- **Accessibility** features (ARIA labels, focus states)

## 🚀 Deployment

Simply open [Lovable](https://lovable.dev/projects/e26d25d9-58fa-4c06-b7c1-21a80933bc17) and click on **Share → Publish**.

### Custom Domain

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 📝 Roadmap

### Phase 1 (Current) ✅
- [x] Authentication system
- [x] Role-based access
- [x] Channel management
- [x] Live directory
- [x] Real-time chat
- [x] Admin dashboard
- [x] Channel view page
- [x] Edge functions API

### Phase 2 (Next)
- [ ] Podcast upload functionality
- [ ] Audio player component
- [ ] RSS feed import
- [ ] Clip creation from streams
- [ ] Search functionality
- [ ] Channel thumbnails/banners
- [ ] User avatars

### Phase 3 (Future)
- [ ] Video streaming support
- [ ] Advanced analytics
- [ ] Notifications system
- [ ] Recommendations engine
- [ ] Mobile apps
- [ ] Playlists

## 🧪 Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Role switching works correctly per user role
- [ ] Channel creation works for broadcasters
- [ ] Stream status toggle works
- [ ] Live directory updates in real-time
- [ ] Chat messages send and receive
- [ ] Subscriptions work (subscribe/unsubscribe)
- [ ] Admin panel loads stats
- [ ] Channel view page displays correctly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License

## 💬 Support

- **Lovable**: Edit via [Project URL](https://lovable.dev/projects/e26d25d9-58fa-4c06-b7c1-21a80933bc17)
- **Issues**: Report bugs on GitHub
- **Discussions**: Ask questions in discussions

---

**Built with ❤️ using Lovable & Supabase**

## Technologies

This project is built with:
- Vite
- TypeScript
- React 18
- Shadcn-ui
- Tailwind CSS
- Supabase (Lovable Cloud)
- Supabase Realtime
- Supabase Storage
- Edge Functions (Deno)