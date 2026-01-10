/**
 * AUTH.JS - Authentication & Authorization System
 * Role-based access control for Citizen vs Admin users
 * Backend-ready architecture using localStorage (replace with API later)
 */

// ========================================
// CONFIGURATION
// ========================================

const AUTH_CONFIG = {
    mode: 'localStorage', // 'localStorage' or 'api' (future)
    apiBaseUrl: '', // Future backend endpoint
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    demoAdminCredentials: {
        username: 'admin',
        password: 'admin123'
    }
};

// ========================================
// STORAGE KEYS
// ========================================

const STORAGE_KEYS = {
    session: 'session',
    selectedRole: 'selectedRole',
    adminUsers: 'adminUsers',
    complaints: 'delhiComplaints' // Updated key for complaints
};

// ========================================
// DATA ACCESS LAYER (Replace with API calls)
// ========================================

class DataAccess {
    // Session Management
    static getSession() {
        try {
            const session = localStorage.getItem(STORAGE_KEYS.session);
            return session ? JSON.parse(session) : null;
        } catch (error) {
            console.error('Error reading session:', error);
            return null;
        }
    }

    static setSession(session) {
        // Replace localStorage with API call here
        try {
            localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
            return true;
        } catch (error) {
            console.error('Error saving session:', error);
            return false;
        }
    }

    static clearSession() {
        // Replace localStorage with API call here
        localStorage.removeItem(STORAGE_KEYS.session);
        localStorage.removeItem(STORAGE_KEYS.selectedRole);
    }

    // Admin Users Management
    static getAdminUsers() {
        try {
            const users = localStorage.getItem(STORAGE_KEYS.adminUsers);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('Error reading admin users:', error);
            return [];
        }
    }

    static saveAdminUsers(users) {
        // Replace localStorage with API call here
        try {
            localStorage.setItem(STORAGE_KEYS.adminUsers, JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Error saving admin users:', error);
            return false;
        }
    }

    // Role Selection
    static getSelectedRole() {
        return localStorage.getItem(STORAGE_KEYS.selectedRole);
    }

    static setSelectedRole(role) {
        localStorage.setItem(STORAGE_KEYS.selectedRole, role);
    }

    // Complaints (using updated key)
    static getComplaints() {
        try {
            // Try new key first, fallback to old key for migration
            let complaints = localStorage.getItem(STORAGE_KEYS.complaints);
            if (!complaints) {
                complaints = localStorage.getItem('complaints');
                if (complaints) {
                    // Migrate to new key
                    localStorage.setItem(STORAGE_KEYS.complaints, complaints);
                    localStorage.removeItem('complaints');
                }
            }
            return complaints ? JSON.parse(complaints) : [];
        } catch (error) {
            console.error('Error reading complaints:', error);
            return [];
        }
    }

    static saveComplaints(complaints) {
        try {
            localStorage.setItem(STORAGE_KEYS.complaints, JSON.stringify(complaints));
            return true;
        } catch (error) {
            console.error('Error saving complaints:', error);
            return false;
        }
    }
}

// ========================================
// CITIZEN AUTHENTICATION
// ========================================

class CitizenAuth {
    static signup(name, phone, pin, email = null) {
        // In localStorage mode, we don't store citizen accounts
        // They authenticate using phone + PIN stored in session
        // Replace with API call to create citizen account
        
        if (!name || !phone || !pin) {
            throw new Error('Name, phone, and PIN are required');
        }

        if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            throw new Error('Phone must be 10 digits');
        }

        if (pin.length < 4) {
            throw new Error('PIN must be at least 4 characters');
        }

        // Create session directly (in real app, verify phone via OTP)
        const session = {
            role: 'citizen',
            name: name,
            phone: phone,
            email: email,
            loginTime: new Date().toISOString(),
            pin: pin // In production, never store raw credentials in session
        };

        return session;
    }

    static login(phone, pin) {
        // In localStorage mode, verify against stored session or allow login
        // Replace with API call to verify credentials
        
        if (!phone || !pin) {
            throw new Error('Phone and PIN are required');
        }

        if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            throw new Error('Invalid phone number');
        }

        // For demo: Check if complaints exist for this phone
        const complaints = DataAccess.getComplaints();
        const hasComplaints = complaints.some(c => c.citizen.phone === phone);

        if (!hasComplaints && pin !== '1234') {
            throw new Error('Invalid phone or PIN. Use PIN: 1234 for demo or register first.');
        }

        const session = {
            role: 'citizen',
            name: 'Citizen User', // In production, fetch from backend
            phone: phone,
            email: null,
            loginTime: new Date().toISOString()
        };

        return session;
    }

    static verifyOTP(phone, otp) {
        // Simulate OTP verification (always accept 1234 for demo)
        // Replace with actual OTP verification API call
        
        if (otp === '1234') {
            return true;
        }
        
        throw new Error('Invalid OTP. Use 1234 for demo.');
    }
}

// ========================================
// ADMIN AUTHENTICATION
// ========================================

class AdminAuth {
    static signup(username, phone, password) {
        if (!username || !phone || !password) {
            throw new Error('All fields are required');
        }

        if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            throw new Error('Phone must be 10 digits');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Check if username exists
        const adminUsers = DataAccess.getAdminUsers();
        if (adminUsers.find(u => u.username === username)) {
            throw new Error('Username already exists');
        }

        // Create new admin user
        const newUser = {
            username: username,
            phone: phone,
            password: password, // In production: hash password before storing
            createdAt: new Date().toISOString()
        };

        adminUsers.push(newUser);
        DataAccess.saveAdminUsers(adminUsers);

        // Create session
        const session = {
            role: 'admin',
            name: 'Administrator',
            username: username,
            phone: phone,
            loginTime: new Date().toISOString()
        };

        return session;
    }

    static login(username, password) {
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        // Check demo credentials first
        if (username === AUTH_CONFIG.demoAdminCredentials.username && 
            password === AUTH_CONFIG.demoAdminCredentials.password) {
            const session = {
                role: 'admin',
                name: 'Administrator',
                username: username,
                phone: '9999999999',
                loginTime: new Date().toISOString()
            };
            return session;
        }

        // Check stored admin users
        const adminUsers = DataAccess.getAdminUsers();
        const user = adminUsers.find(u => u.username === username && u.password === password);

        if (!user) {
            throw new Error('Invalid username or password');
        }

        const session = {
            role: 'admin',
            name: 'Administrator',
            username: username,
            phone: user.phone,
            loginTime: new Date().toISOString()
        };

        return session;
    }

    static resetPassword(username, phone, newPassword) {
        if (!username || !phone || !newPassword) {
            throw new Error('All fields are required');
        }

        if (newPassword.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        const adminUsers = DataAccess.getAdminUsers();
        const userIndex = adminUsers.findIndex(u => 
            u.username === username && u.phone === phone
        );

        if (userIndex === -1) {
            throw new Error('No admin account found with this username and phone');
        }

        // Update password
        adminUsers[userIndex].password = newPassword;
        DataAccess.saveAdminUsers(adminUsers);

        return true;
    }
}

// ========================================
// SESSION MANAGEMENT
// ========================================

class SessionManager {
    static createSession(session) {
        return DataAccess.setSession(session);
    }

    static getSession() {
        const session = DataAccess.getSession();
        
        if (!session) return null;

        // Check session timeout
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const elapsed = now - loginTime;

        if (elapsed > AUTH_CONFIG.sessionTimeout) {
            this.destroySession();
            return null;
        }

        return session;
    }

    static destroySession() {
        DataAccess.clearSession();
    }

    static isAuthenticated() {
        return this.getSession() !== null;
    }

    static getRole() {
        const session = this.getSession();
        return session ? session.role : null;
    }
}

// ========================================
// ACCESS CONTROL
// ========================================

class AccessControl {
    static CITIZEN_ALLOWED_PAGES = [
        'portal.html',
        'auth.html',
        'citizen-home.html',
        'map.html',
        'complaint.html',
        'track.html',
        'my-complaints.html',
        'ward.html',
        'index.html'
    ];

    static ADMIN_ONLY_PAGES = [
        'admin-home.html',
        'admin-complaints.html',
        'authority.html'
    ];

    static isPageAllowed(pageName, role) {
        if (!role) return false;

        // Admin can access all pages
        if (role === 'admin') return true;

        // Citizen can only access citizen pages
        if (role === 'citizen') {
            return this.CITIZEN_ALLOWED_PAGES.some(page => pageName.includes(page));
        }

        return false;
    }

    static checkAccess() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Public pages that don't require auth
        const publicPages = ['portal.html', 'auth.html', 'index.html'];
        if (publicPages.some(page => currentPage.includes(page))) {
            return true;
        }

        const session = SessionManager.getSession();
        
        if (!session) {
            // Not logged in, redirect to portal
            window.location.href = 'portal.html';
            return false;
        }

        if (!this.isPageAllowed(currentPage, session.role)) {
            // Access denied
            this.showAccessDenied(session.role);
            return false;
        }

        return true;
    }

    static showAccessDenied(role) {
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; background: var(--bg-primary);">
                <div style="text-align: center; max-width: 500px;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🚫</div>
                    <h1 style="font-size: 2rem; margin-bottom: 1rem; color: var(--danger-red);">Access Denied</h1>
                    <p style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 2rem;">
                        You don't have permission to access this page.
                    </p>
                    <button onclick="window.location.href='${role === 'admin' ? 'admin-home.html' : 'citizen-home.html'}'" 
                            class="btn btn-primary" 
                            style="padding: 0.75rem 2rem; background: var(--primary-blue); color: white; border: none; border-radius: 0.5rem; font-size: 1rem; cursor: pointer;">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        `;
    }
}

// ========================================
// UI UTILITIES
// ========================================

function showToast(message, type = 'info') {
    // Create toast container if doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: start; gap: 0.75rem;">
            <span style="font-size: 1.25rem;">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <div style="flex: 1;">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// ========================================
// LOGOUT
// ========================================

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        SessionManager.destroySession();
        showToast('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'portal.html';
        }, 1000);
    }
}

// ========================================
// AUTO-INITIALIZE ACCESS CONTROL
// ========================================

// Run access control check on page load for protected pages
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Skip access control for public pages
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const publicPages = ['portal.html', 'auth.html', 'index.html'];
        
        if (!publicPages.some(page => currentPage.includes(page))) {
            AccessControl.checkAccess();
        }
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CitizenAuth,
        AdminAuth,
        SessionManager,
        AccessControl,
        DataAccess,
        AUTH_CONFIG
    };
}