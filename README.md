# ThePlaylist 🎵

[![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3+-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.0+-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)

A modern web application for music streaming with social features, playlist management, and real-time playback.

## ✨ Main Features

### 🎶 **Advanced Music Playback**
- Full player with volume, progress, and navigation controls
- Automatic queuing and playback system
- Intelligent formatting of playback times
- Load states and error handling

### 📊 **Interactive Social System**
- Likes, dislikes, and loves with real-time statistics
- Play tracking
- Track and playlist rankings
- Scroll animations for long titles

### 🗂️ **Complete Content Management**
- Playlist creation and editing
- Uploading tracks from local storage or cloud storage
- Advanced real-time search
- Organization by categories and artists

### 👤 **User Management**
- Secure authentication with JWT
- Personalized profile with statistics
- Personal and public playlists
- Editable account settings

## 🏗️ Technical Architecture

### **Technology Stack**
- **Frontend**: React 18.2+ with TypeScript
- **Routing**: React Router v7 (File-based routing)
- **Styles**: Tailwind CSS with custom configurations
- **HTTP Client**: Axios with custom interceptors
- **Icons**: React Icons
- **Build Tool**: React Router App (Vite-based)

### **Project Structure**
```
src/
├── components/          
│   ├── add_item/        
│   ├── currentsong/     
│   ├── editablefield/    
│   ├── featurebox/       
│   ├── floatingbutton/   
│   ├── playlist/         
│   ├── searchbar/        
│   ├── sidebar/          
│   ├── socialstats/     
│   └── songbar/          
├── dtos/                
├── hooks/               
├── routes/              
├── services/            
├── types/               
└── utils/              
```

## 🚀 Installation and Configuration

### **Prerequisites**
- Node.js 18.0 or higher
- npm 9.0 or higher
- Environment variables configured

### **Environment Variables**
```bash
# .env
VITE_API_URL=http://localhost:8000
VITE_API_ACCESS_TOKEN_URL=/token
VITE_API_REGISTER_URL=/register
VITE_API_USERS_URL=/users
VITE_API_USERS_ME_URL=/users/me
VITE_API_PLAYLISTS_URL=/playlists
VITE_API_TRACKS_URL=/tracks
VITE_API_TRACK_UPLOAD_TIMEOUT=300
```

### **Installation**
```bash
git clone <repository-url>
cd theplaylist

npm install

npm run dev

npm run build
```

## 📁 Main Components

### **Player (`SongBar.tsx`)**
Full audio player with:
- Play/pause controls
- Interactive progress bar
- Volume control with mute
- Track navigation
- Loading status management

### **Status Management (`SocialStats.tsx`)**
Social interaction system using `useReducer`:
```typescript
const socialStatsReducer = (state: SocialStatsState, action: SocialStatsAction) => {
  switch (action.type) {
    case 'TOGGLE_LIKE':
        return { ...state, liked: !state.liked };
        // ...
  }
};
```

### **HTTP Services (`AxiosClient.ts`)**
Custom HTTP client with:
- Interceptors for centralized error handling
- Configurable timeouts
- Authentication handling
- Request cancellation

## 🎨 Styles and Design

### **Design System**
- **Colors**: Dark palette with vibrant accents
- **Typography**: Scalable system with Tailwind
- **Spacing**: Consistent 0.25rem scaling
- **Effects**: Background blur and smooth transitions

### **UI Components**
- **Responsive**: Adaptive design for mobile and desktop
- **Animations**: CSS transitions and native animations
- **Feedback**: Hover, active, and disabled states

## 🔒 Security and Authentication

### **Authentication Flow**
1. Log in with username/password
2. JWT token reception
3. Secure storage in HTTP-only cookies
4. Automatic inclusion in headers

### **Route Protection**
- Public routes: `/`, `/login`, `/register`
- Protected routes: All under `/account/*`
- Automatic redirect to login if not authenticated

## 📱 Advanced Features

### **Drag and Drop Upload**
```typescript
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  const droppedTracks = Array.from(e.dataTransfer.files);
  setTracks(prev => [...prev, ...droppedTracks]);
};
```

### **Real-Time Search**
- Search by track name
- Search by artist
- Filter by playlist
- Automatic pagination

### **Pagination System**
```typescript
const { tracks, nextPage, setPage } = useGetTracks(currentPage);
```