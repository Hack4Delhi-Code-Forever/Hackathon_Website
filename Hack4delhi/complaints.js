/**
 * COMPLAINTS.JS - Citizen Complaint System Logic
 * Handles complaint registration, tracking, and management
 */

// ========================================
// CONSTANTS & CONFIGURATION
// ========================================

const COMPLAINT_CATEGORIES = [
    'Water Logging',
    'Drain Blockage',
    'Sewer Overflow',
    'Garbage Overflow',
    'Road Damage',
    'Streetlight Issue',
    'Encroachment'
];

const DELHI_ZONES = [
    { zone: 'North Delhi', wards: ['Model Town', 'Civil Lines', 'Sadar Paharganj', 'Chandni Chowk', 'Karol Bagh'] },
    { zone: 'South Delhi', wards: ['Mehrauli', 'Vasant Vihar', 'Defence Colony', 'Greater Kailash', 'Kalkaji', 'Ambedkar Nagar'] },
    { zone: 'East Delhi', wards: ['Shahdara', 'Gandhi Nagar', 'Laxmi Nagar', 'Mayur Vihar', 'Patparganj'] },
    { zone: 'West Delhi', wards: ['Moti Nagar', 'Rajouri Garden', 'Punjabi Bagh', 'Janakpuri', 'Hari Nagar'] },
    { zone: 'Central Delhi', wards: ['Connaught Place', 'Daryaganj', 'Jama Masjid', 'Kotwali', 'Karol Bagh'] },
    { zone: 'North East Delhi', wards: ['Shahdara', 'Seelampur', 'Karawal Nagar', 'Yamuna Vihar', 'Mustafabad'] },
    { zone: 'North West Delhi', wards: ['Rohini', 'Pitampura', 'Narela', 'Kanjhawala', 'Bawana'] },
    { zone: 'South West Delhi', wards: ['Dwarka', 'Najafgarh', 'Palam', 'Vasant Kunj', 'Kapashera'] },
    { zone: 'South East Delhi', wards: ['Kalkaji', 'Sarita Vihar', 'Badarpur', 'Tughlakabad', 'Sangam Vihar'] },
    { zone: 'New Delhi', wards: ['Parliament Street', 'Barakhamba Road', 'Mandir Marg', 'Gole Market'] },
    { zone: 'Shahdara', wards: ['Vivek Vihar', 'Jhilmil', 'Dilshad Garden', 'Seemapuri', 'Nand Nagri'] }
];

const SEVERITY_LEVELS = ['Low', 'Medium', 'High'];

const STATUS_FLOW = [
    'Pending Verification',
    'Verified',
    'In Progress',
    'Resolved',
    'Rejected'
];

const DEPARTMENTS = ['MCD', 'PWD', 'DJB'];

// ========================================
// STORAGE UTILITIES
// ========================================

function getComplaints() {
    // Use new key 'delhiComplaints' for consistency with auth system
    let complaints = localStorage.getItem('delhiComplaints');
    
    // Migration: Check old key if new key doesn't exist
    if (!complaints) {
        complaints = localStorage.getItem('complaints');
        if (complaints) {
            // Migrate to new key
            localStorage.setItem('delhiComplaints', complaints);
            localStorage.removeItem('complaints');
        }
    }
    
    return complaints ? JSON.parse(complaints) : [];
}

function saveComplaints(complaints) {
    // Replace localStorage with API call here
    localStorage.setItem('delhiComplaints', JSON.stringify(complaints));
}

function getComplaint(id) {
    const complaints = getComplaints();
    return complaints.find(c => c.id === id);
}

function updateComplaint(id, updates) {
    const complaints = getComplaints();
    const index = complaints.findIndex(c => c.id === id);
    
    if (index !== -1) {
        complaints[index] = { ...complaints[index], ...updates };
        saveComplaints(complaints);
        return complaints[index];
    }
    
    return null;
}

// ========================================
// COMPLAINT ID GENERATION
// ========================================

function generateComplaintId() {
    const year = new Date().getFullYear();
    const complaints = getComplaints();
    
    // Get the latest complaint number for this year
    const thisYearComplaints = complaints.filter(c => c.id.includes(year.toString()));
    const nextNumber = thisYearComplaints.length + 1;
    
    return `DLG-${year}-${nextNumber.toString().padStart(5, '0')}`;
}

// ========================================
// AUTO SEVERITY CALCULATION
// ========================================

function calculateAutoSeverity(ward, rainfall) {
    // If ward data available from main system
    if (typeof enhancedWardsData !== 'undefined') {
        const wardData = enhancedWardsData.find(w => w.name === ward);
        
        if (wardData) {
            if (wardData.riskScore >= 70) return 'High';
            if (wardData.riskScore >= 40) return 'Medium';
            return 'Low';
        }
    }
    
    // Fallback to rainfall-based calculation
    if (rainfall > 70) return 'High';
    if (rainfall > 40) return 'Medium';
    return 'Low';
}

// ========================================
// TIMELINE MANAGEMENT
// ========================================

function createInitialTimeline() {
    return [
        {
            step: 'Submitted',
            status: 'completed',
            date: new Date().toISOString()
        },
        {
            step: 'Pending Verification',
            status: 'current',
            date: null
        },
        {
            step: 'Verified',
            status: 'pending',
            date: null
        },
        {
            step: 'In Progress',
            status: 'pending',
            date: null
        },
        {
            step: 'Resolved',
            status: 'pending',
            date: null
        }
    ];
}

function updateTimeline(complaint, newStatus) {
    const timeline = complaint.timeline || createInitialTimeline();
    
    // Find and update the timeline step
    const stepIndex = timeline.findIndex(t => t.step === newStatus || t.step.includes(newStatus));
    
    if (stepIndex !== -1) {
        // Mark all previous steps as completed
        for (let i = 0; i <= stepIndex; i++) {
            timeline[i].status = 'completed';
            if (!timeline[i].date) {
                timeline[i].date = new Date().toISOString();
            }
        }
        
        // Mark current step
        if (stepIndex < timeline.length - 1) {
            timeline[stepIndex + 1].status = 'current';
        }
    }
    
    return timeline;
}

// ========================================
// IMAGE HANDLING
// ========================================

function handleImageUpload(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            reject(new Error('Image size must be less than 5MB'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        
        reader.onerror = function() {
            reject(new Error('Failed to read image file'));
        };
        
        reader.readAsDataURL(file);
    });
}

// ========================================
// GEOLOCATION
// ========================================

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
}

// ========================================
// COMPLAINT SUBMISSION
// ========================================

async function submitComplaint(formData) {
    try {
        const complaintId = generateComplaintId();
        
        const complaint = {
            id: complaintId,
            category: formData.category,
            ward: formData.ward,
            zone: formData.zone,
            address: formData.address,
            lat: formData.lat || null,
            lng: formData.lng || null,
            description: formData.description,
            severity: formData.severity,
            photoBase64: formData.photoBase64 || null,
            citizen: {
                name: formData.citizenName,
                phone: formData.citizenPhone,
                email: formData.citizenEmail || null
            },
            createdAt: new Date().toISOString(),
            status: 'Pending Verification',
            department: null,
            officerComment: null,
            eta: null,
            escalated: false,
            timeline: createInitialTimeline()
        };
        
        const complaints = getComplaints();
        complaints.push(complaint);
        saveComplaints(complaints);
        
        return complaint;
    } catch (error) {
        throw error;
    }
}

// ========================================
// COMPLAINT SEARCH
// ========================================

function searchComplaint(searchTerm) {
    const complaints = getComplaints();
    
    // Search by ID or phone
    return complaints.filter(c => 
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.citizen.phone.includes(searchTerm)
    );
}

// ========================================
// ESCALATION
// ========================================

function canEscalate(complaint) {
    if (!complaint) return false;
    
    const createdDate = new Date(complaint.createdAt);
    const now = new Date();
    const hoursDiff = (now - createdDate) / (1000 * 60 * 60);
    
    return hoursDiff >= 48 && complaint.status !== 'Resolved' && !complaint.escalated;
}

function escalateComplaint(complaintId) {
    const complaint = updateComplaint(complaintId, { escalated: true });
    
    if (complaint) {
        showToast('Complaint escalated successfully', 'success');
        return true;
    }
    
    return false;
}

// ========================================
// ADMIN FUNCTIONS
// ========================================

function updateComplaintStatus(complaintId, status, comment, eta, department) {
    const complaint = getComplaint(complaintId);
    
    if (!complaint) return null;
    
    const timeline = updateTimeline(complaint, status);
    
    const updates = {
        status,
        timeline,
        officerComment: comment || complaint.officerComment,
        eta: eta || complaint.eta,
        department: department || complaint.department
    };
    
    return updateComplaint(complaintId, updates);
}

function verifyComplaint(complaintId, department, eta) {
    return updateComplaintStatus(complaintId, 'Verified', 'Complaint verified and assigned', eta, department);
}

function markInProgress(complaintId, comment) {
    return updateComplaintStatus(complaintId, 'In Progress', comment);
}

function resolveComplaint(complaintId, comment) {
    return updateComplaintStatus(complaintId, 'Resolved', comment);
}

function rejectComplaint(complaintId, reason) {
    return updateComplaintStatus(complaintId, 'Rejected', reason);
}

// ========================================
// FILTERS & SORTING
// ========================================

function filterComplaints(complaints, filters) {
    return complaints.filter(c => {
        if (filters.category && c.category !== filters.category) return false;
        if (filters.status && c.status !== filters.status) return false;
        if (filters.severity && c.severity !== filters.severity) return false;
        if (filters.ward && c.ward !== filters.ward) return false;
        if (filters.zone && c.zone !== filters.zone) return false;
        if (filters.escalated !== undefined && c.escalated !== filters.escalated) return false;
        
        return true;
    });
}

function sortComplaints(complaints, sortBy = 'date', order = 'desc') {
    return [...complaints].sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
            case 'date':
                comparison = new Date(a.createdAt) - new Date(b.createdAt);
                break;
            case 'severity':
                const severityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
                comparison = severityOrder[a.severity] - severityOrder[b.severity];
                break;
            case 'status':
                comparison = a.status.localeCompare(b.status);
                break;
            default:
                comparison = 0;
        }
        
        return order === 'desc' ? -comparison : comparison;
    });
}

// ========================================
// STATISTICS
// ========================================

function getComplaintStats() {
    const complaints = getComplaints();
    
    return {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending Verification').length,
        verified: complaints.filter(c => c.status === 'Verified').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
        rejected: complaints.filter(c => c.status === 'Rejected').length,
        escalated: complaints.filter(c => c.escalated).length,
        byCategory: COMPLAINT_CATEGORIES.reduce((acc, cat) => {
            acc[cat] = complaints.filter(c => c.category === cat).length;
            return acc;
        }, {}),
        bySeverity: {
            low: complaints.filter(c => c.severity === 'Low').length,
            medium: complaints.filter(c => c.severity === 'Medium').length,
            high: complaints.filter(c => c.severity === 'High').length
        }
    };
}

// ========================================
// NOTIFICATIONS (SIMULATED)
// ========================================

function simulateNotification(complaint, type = 'status_update') {
    const messages = {
        status_update: `📱 SMS/WhatsApp: Your complaint ${complaint.id} status updated to "${complaint.status}"`,
        new_complaint: `✅ SMS/WhatsApp: Complaint ${complaint.id} registered successfully`,
        escalated: `⚠️ SMS/WhatsApp: Your complaint ${complaint.id} has been escalated to higher authority`
    };
    
    showToast(messages[type] || messages.status_update, 'info');
}

// ========================================
// EXPORT / PRINT UTILITIES
// ========================================

function printReceipt(complaint) {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Complaint Receipt - ${complaint.id}</title>
            <link rel="stylesheet" href="styles.css">
            <style>
                body { padding: 2rem; }
                .receipt { max-width: 600px; margin: 0 auto; }
                .receipt-header { text-align: center; margin-bottom: 2rem; }
                .receipt-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0; }
                .qr-code { text-align: center; margin: 2rem 0; }
            </style>
        </head>
        <body>
            <div class="receipt">
                <div class="receipt-header">
                    <h1>💧 Delhi Water-Logging System</h1>
                    <h2>Complaint Receipt</h2>
                </div>
                
                <div class="receipt-row">
                    <strong>Complaint ID:</strong>
                    <span>${complaint.id}</span>
                </div>
                
                <div class="receipt-row">
                    <strong>Category:</strong>
                    <span>${complaint.category}</span>
                </div>
                
                <div class="receipt-row">
                    <strong>Ward:</strong>
                    <span>${complaint.ward}</span>
                </div>
                
                <div class="receipt-row">
                    <strong>Status:</strong>
                    <span>${complaint.status}</span>
                </div>
                
                <div class="receipt-row">
                    <strong>Date Filed:</strong>
                    <span>${new Date(complaint.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                
                <div class="receipt-row">
                    <strong>Citizen Name:</strong>
                    <span>${complaint.citizen.name}</span>
                </div>
                
                <div class="receipt-row">
                    <strong>Phone:</strong>
                    <span>${complaint.citizen.phone}</span>
                </div>
                
                <div style="margin-top: 2rem; padding: 1rem; background: #f1f5f9; border-radius: 0.5rem;">
                    <p><strong>Important:</strong></p>
                    <p>Please keep this receipt for tracking your complaint.</p>
                    <p>Track online at: ${window.location.origin}/track.html</p>
                </div>
                
                <div style="margin-top: 2rem; text-align: center; color: #64748b;">
                    <p>Municipal Corporation of Delhi (MCD)</p>
                    <p>Generated on ${new Date().toLocaleString('en-IN')}</p>
                </div>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// ========================================
// URL PARAMETER UTILITIES
// ========================================

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        ward: params.get('ward'),
        zone: params.get('zone'),
        lat: params.get('lat'),
        lng: params.get('lng'),
        category: params.get('category')
    };
}