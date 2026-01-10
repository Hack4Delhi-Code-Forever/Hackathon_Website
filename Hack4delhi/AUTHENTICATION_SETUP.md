# Authentication System Setup Guide

## Overview
This document outlines the complete role-based authentication system implementation for the Delhi Water-Logging Civic System.

## System Architecture

### Authentication Mode
- **Current**: localStorage (offline/local)
- **Future**: API-based (backend-ready code structure)
- **Config**: Located in `auth.js` - `AUTH_CONFIG` object

### Storage Keys
- `session` - User session data
- `selectedRole` - Portal type selection (citizen/admin)
- `adminUsers` - Admin account credentials
- `delhiComplaints` - Complaint data (migrated from old `complaints` key)

## User Roles

### 1. Citizen Role
**Access**: Limited to citizen-facing features

**Allowed Pages**:
- `portal.html` - Portal selection
- `auth.html` - Authentication
- `citizen-home.html` - Citizen dashboard
- `map.html` - Flood risk map
- `complaint.html` - Register complaint
- `track.html` - Track complaint
- `my-complaints.html` - View my complaints
- `ward.html` - Ward details
- `index.html` - Public homepage

**Blocked Pages**:
- `admin-home.html`
- `admin-complaints.html`
- `authority.html`

### 2. Admin Role
**Access**: Full access to ALL pages (citizen + admin)

**Additional Pages**:
- `admin-home.html` - Admin dashboard
- `admin-complaints.html` - Complaint management
- `authority.html` - Authority analytics

## File Structure

### New Files Created

#### 1. `auth.js` (Core Authentication)
- `CitizenAuth` class - Citizen login/signup
- `AdminAuth` class - Admin login/signup/password reset
- `SessionManager` class - Session management
- `AccessControl` class - Route guards
- `DataAccess` class - Data layer (backend-ready)

#### 2. `portal.html` (Entry Point)
- Role selection interface
- Two cards: Citizen Portal | Administrative Portal
- Sets `selectedRole` in localStorage
- Redirects to `auth.html`

#### 3. `auth.html` (Combined Authentication)
- Tabbed interface: Login | Sign Up
- Dynamic forms based on selected role
- Admin-only "Forgot Password" feature
- OTP simulation for citizens (demo: 1234)

#### 4. `citizen-home.html` (Citizen Dashboard)
- Quick stats display
- Access to all citizen tools
- Recent complaints view
- Important alerts

#### 5. `admin-home.html` (Admin Dashboard)
- Comprehensive overview
- Grouped navigation (Citizen Tools + Admin Tools dropdowns)
- Both citizen and admin dashboards accessible
- Recent activity monitoring
- Ward statistics

## Authentication Flow

### Citizen Flow
1. Visit `portal.html` → Select "Citizen Portal"
2. Redirect to `auth.html` (citizen mode)
3. **Sign Up**: Name + Phone + PIN + Email(optional)
4. **Login**: Phone + PIN (demo: any phone + PIN 1234)
5. Session created → Redirect to `citizen-home.html`

### Admin Flow
1. Visit `portal.html` → Select "Administrative Portal"
2. Redirect to `auth.html` (admin mode)
3. **Sign Up**: Username + Phone + Password (min 6 chars)
4. **Login**: Username + Password
   - Demo credentials: `admin` / `admin123`
5. Session created → Redirect to `admin-home.html`

### Forgot Password (Admin Only)
1. Click "Forgot Password?" on admin login
2. Enter username + registered phone
3. If match found → Show "Create New Password" fields
4. Update password in `adminUsers` localStorage
5. Success toast → Redirect to login

## Access Control Implementation

### Protected Pages
All pages except `portal.html`, `auth.html`, and `index.html` require authentication.

### Route Guard
- Automatically runs on page load
- Checks for valid session
- Validates page access based on role
- Shows "Access Denied" if unauthorized
- Redirects to appropriate dashboard

### Logout
- Available on all authenticated pages
- Clears session and selectedRole
- Redirects to `portal.html`
- Shows success toast

## Pages Requiring `auth.js`

### Must Include `<script src="auth.js"></script>`:
- ✅ `portal.html`
- ✅ `auth.html`
- ✅ `citizen-home.html`
- ✅ `admin-home.html`
- ✅ `complaint.html`
- ✅ `track.html`
- ✅ `my-complaints.html`
- ⚠️ `map.html` (add if not already)
- ⚠️ `ward.html` (add if not already)
- ⚠️ `admin-complaints.html` (add if not already)
- ⚠️ `authority.html` (add if not already)

## Navbar Modifications Required

### Citizen Navbar (citizen-home.html, etc.)
```html
<div class="nav-links">
    <a href="citizen-home.html">Home</a>
    <a href="map.html">Flood Risk Map</a>
    <a href="complaint.html">Register Complaint</a>
    <a href="track.html">Track Complaint</a>
    <a href="my-complaints.html">My Complaints</a>
</div>
<div class="nav-controls">
    <div>👤 <span id="user-name">Citizen</span></div>
    <button onclick="logout()">🚪 Logout</button>
</div>
```

### Admin Navbar (admin-home.html, etc.)
```html
<div class="nav-links">
    <a href="admin-home.html">Admin Home</a>
    
    <!-- Dropdown: Citizen Tools -->
    <div class="dropdown">
        <a href="#" class="dropdown-toggle">Citizen Tools ▾</a>
        <div class="dropdown-menu">
            <a href="map.html">🗺️ Flood Risk Map</a>
            <a href="complaint.html">📝 Register Complaint</a>
            <a href="track.html">🔍 Track Complaint</a>
            <a href="my-complaints.html">📋 My Complaints</a>
        </div>
    </div>
    
    <!-- Dropdown: Admin Tools -->
    <div class="dropdown">
        <a href="#" class="dropdown-toggle">Admin Tools ▾</a>
        <div class="dropdown-menu">
            <a href="admin-complaints.html">📊 Complaints Overview</a>
            <a href="authority.html">🏛️ Authority Dashboard</a>
        </div>
    </div>
</div>
<div class="nav-controls">
    <div>🏛️ <span id="admin-name">Administrator</span></div>
    <button onclick="logout()">🚪 Logout</button>
</div>
```

## Demo Credentials

### Citizen
- **Phone**: Any 10-digit number
- **PIN**: `1234` (for demo)

### Admin
- **Username**: `admin`
- **Password**: `admin123`

## Backend Migration Guide

### When integrating with backend:

1. **Update `AUTH_CONFIG` in `auth.js`**:
```javascript
const AUTH_CONFIG = {
    mode: 'api',  // Change from 'localStorage'
    apiBaseUrl: 'https://your-backend.com/api',
    sessionTimeout: 24 * 60 * 60 * 1000
};
```

2. **Replace `DataAccess` methods with API calls**:
- `getSession()` → `GET /auth/session`
- `setSession()` → `POST /auth/login`
- `getAdminUsers()` → `GET /admin/users`
- `getComplaints()` → `GET /complaints`

3. **Update authentication methods**:
- `CitizenAuth.login()` → `POST /auth/citizen/login`
- `AdminAuth.login()` → `POST /auth/admin/login`
- Send OTP via SMS gateway
- Implement JWT or session tokens

## Testing Checklist

### ✅ Citizen Access
- [ ] Can access citizen-home.html
- [ ] Can view map.html
- [ ] Can register complaint
- [ ] Can track complaints
- [ ] Cannot access admin-home.html (Access Denied)
- [ ] Cannot access authority.html (Access Denied)
- [ ] Logout works correctly

### ✅ Admin Access
- [ ] Can access admin-home.html
- [ ] Can access ALL citizen pages
- [ ] Can access admin-complaints.html
- [ ] Can access authority.html
- [ ] Dropdown menus work
- [ ] Can manage complaints
- [ ] Logout works correctly

### ✅ Authentication
- [ ] Citizen signup works
- [ ] Citizen login works (demo PIN 1234)
- [ ] Admin signup works
- [ ] Admin login works (demo credentials)
- [ ] Admin password reset works
- [ ] Session persists on page refresh
- [ ] Session expires after timeout
- [ ] Redirects work correctly

## Entry Point

**Starting URL**: `portal.html`

Users must start from the portal to select their role (Citizen or Admin), then proceed through authentication before accessing any protected features.

## Notes

1. **Data Migration**: Old `complaints` key automatically migrates to `delhiComplaints`
2. **Session Timeout**: 24 hours (configurable)
3. **No Admin Navbar Changes**: Existing admin pages (authority.html, admin-complaints.html) need navbar updates to add logout button
4. **Mobile Responsive**: All authentication pages are mobile-friendly
5. **Dark Mode**: Full dark mode support across all auth pages

## Support

For issues or questions about the authentication system, refer to the inline comments in `auth.js` which provide detailed explanations of each function and class.