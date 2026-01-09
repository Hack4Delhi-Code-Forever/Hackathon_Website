/**
 * SCRIPT.JS - Main JavaScript Logic
 * Handles dynamic rendering, user interactions, theme management, and page-specific functionality
 */

// ============================================
// INTERNATIONALIZATION - Language Support
// ============================================
// NOTE: Translations object is loaded from translations.js

/**
 * Initialize language from localStorage or default to English
 */
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    const selector = document.getElementById('language-selector');
    if (selector) {
        selector.value = savedLanguage;
    }
    applyTranslations(savedLanguage);
}

/**
 * Change language
 */
function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    applyTranslations(lang);
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', lang);
    
    // Apply RTL for Urdu
    if (lang === 'ur') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
}

// ============================================
// THEME MANAGEMENT - Light/Dark Mode
// ============================================

/**
 * Initialize theme from localStorage or default to light mode
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

/**
 * Update theme toggle button UI
 */
function updateThemeButton(theme) {
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (themeIcon && themeText) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark';
        }
    }
}

// Initialize theme and language on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeLanguage();
    initializeAnimations();
});

// ============================================
// ANIMATION UTILITIES
// ============================================

/**
 * Animate number counter from 0 to target value
 */
function animateCounter(element, target, duration = 1500, suffix = '') {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    };
    
    updateCounter();
}

/**
 * Initialize scroll-based animations
 */
function initializeAnimations() {
    // Animate stat numbers on homepage
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        setTimeout(() => {
            statNumbers.forEach((stat, index) => {
                setTimeout(() => {
                    const text = stat.textContent;
                    const number = parseFloat(text.replace(/[^0-9.]/g, ''));
                    const suffix = text.replace(/[0-9.]/g, '');
                    
                    if (!isNaN(number)) {
                        animateCounter(stat, number, 1500, suffix);
                    }
                }, index * 100);
            });
        }, 300);
    }
    
    // Add stagger animation to hotspot items
    const hotspotItems = document.querySelectorAll('.hotspot-item');
    hotspotItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
    });
    
    // Add stagger animation to table rows
    const tableRows = document.querySelectorAll('.wards-table tbody tr');
    tableRows.forEach((row, index) => {
        row.style.animationDelay = `${index * 0.03}s`;
    });
    
    // Add stagger to recommendation cards
    const recCards = document.querySelectorAll('.recommendation-card');
    recCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add entrance animation to incident items
    const incidentItems = document.querySelectorAll('.incident-item');
    incidentItems.forEach((item, index) => {
        item.style.animation = 'fadeInUp 0.5s ease-out backwards';
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

/**
 * Add pulse animation to high-risk markers
 */
function addMarkerPulse() {
    const markers = document.querySelectorAll('.hotspot-marker');
    markers.forEach(marker => {
        const fill = marker.getAttribute('fill');
        if (fill === '#dc2626') { // High risk red
            marker.style.animation = 'pulse 1.5s ease-in-out infinite';
        }
    });
}

// ============================================
// MAP PAGE FUNCTIONS - Leaflet GIS Map
// ============================================

// Global map variable
let delhiMap = null;
let markersLayer = null;

/**
 * Initialize Leaflet map with Delhi centered
 */
function initializeLeafletMap() {
    const mapElement = document.getElementById('delhi-map');
    if (!mapElement) return;

    // Initialize map centered on Delhi
    delhiMap = L.map('delhi-map').setView([28.6139, 77.2090], 11);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 10
    }).addTo(delhiMap);

    // Create a layer group for markers
    markersLayer = L.layerGroup().addTo(delhiMap);

    // Add ward markers to the map
    renderLeafletMarkers();

    // Add map controls
    addMapControls();
}

/**
 * Render ward markers on Leaflet map
 */
function renderLeafletMarkers() {
    if (!markersLayer) return;

    // Clear existing markers
    markersLayer.clearLayers();

    // Add markers for each ward
    enhancedWardsData.forEach((ward, index) => {
        // Use ward coordinates (lat, lng)
        const marker = L.circleMarker([ward.lat, ward.lng], {
            radius: 10,
            fillColor: ward.riskColor,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Create popup content
        const popupContent = `
            <div style="font-family: Inter, sans-serif; padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #0f172a;">
                    ${ward.name}
                </h3>
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #475569;">
                    <strong>District:</strong> ${ward.district}
                </p>
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #475569;">
                    <strong>Risk Score:</strong> ${ward.riskScore}/100
                </p>
                <p style="margin: 0 0 8px 0;">
                    <span style="display: inline-block; padding: 4px 12px; background-color: ${ward.riskColor}; color: white; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase;">
                        ${ward.riskLevel} Risk
                    </span>
                </p>
                <button onclick="navigateToWard(${ward.id})" 
                        style="width: 100%; padding: 8px; background-color: #1560BD; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px;">
                    View Details →
                </button>
            </div>
        `;

        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
        });

        // Add hover effect
        marker.on('mouseover', function() {
            this.setStyle({
                radius: 13,
                fillOpacity: 1
            });
        });

        marker.on('mouseout', function() {
            this.setStyle({
                radius: 10,
                fillOpacity: 0.8
            });
        });

        // Add to layer group
        marker.addTo(markersLayer);

        // Add tooltip with ward name
        marker.bindTooltip(ward.name, {
            permanent: false,
            direction: 'top',
            className: 'ward-tooltip'
        });
    });
}

/**
 * Add custom map controls
 */
function addMapControls() {
    // Add custom control for filtering by risk level
    const filterControl = L.control({ position: 'topright' });

    filterControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'leaflet-control-filter');
        div.innerHTML = `
            <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-family: Inter;">
                <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #475569;">Filter by Risk</h4>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px;">
                        <input type="checkbox" checked onchange="filterMapMarkers('all')" id="filter-all" style="cursor: pointer;">
                        <span>All Wards</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px;">
                        <input type="checkbox" checked onchange="filterMapMarkers('high')" id="filter-high" style="cursor: pointer;">
                        <span style="color: #dc2626;">High Risk</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px;">
                        <input type="checkbox" checked onchange="filterMapMarkers('medium')" id="filter-medium" style="cursor: pointer;">
                        <span style="color: #f59e0b;">Medium Risk</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px;">
                        <input type="checkbox" checked onchange="filterMapMarkers('low')" id="filter-low" style="cursor: pointer;">
                        <span style="color: #16a34a;">Low Risk</span>
                    </label>
                </div>
            </div>
        `;
        return div;
    };

    filterControl.addTo(delhiMap);
}

/**
 * Filter map markers by risk level
 */
function filterMapMarkers(type) {
    const filterAll = document.getElementById('filter-all');
    const filterHigh = document.getElementById('filter-high');
    const filterMedium = document.getElementById('filter-medium');
    const filterLow = document.getElementById('filter-low');

    // If "All" is clicked, toggle all others
    if (type === 'all') {
        const checked = filterAll.checked;
        filterHigh.checked = checked;
        filterMedium.checked = checked;
        filterLow.checked = checked;
    } else {
        // Check if all are selected, then check "All"
        filterAll.checked = filterHigh.checked && filterMedium.checked && filterLow.checked;
    }

    // Re-render markers based on filter
    renderLeafletMarkers();

    // Remove markers that don't match filter
    if (!filterAll.checked) {
        markersLayer.eachLayer(function(layer) {
            const ward = enhancedWardsData.find(w => 
                layer.getLatLng().lat === w.lat && layer.getLatLng().lng === w.lng
            );
            
            if (ward) {
                const show = (
                    (filterHigh.checked && ward.riskLevel === 'High') ||
                    (filterMedium.checked && ward.riskLevel === 'Medium') ||
                    (filterLow.checked && ward.riskLevel === 'Low')
                );
                
                if (!show) {
                    markersLayer.removeLayer(layer);
                }
            }
        });
    }
}

/**
 * Render list of hotspots in sidebar
 */
function renderHotspotsList() {
    const listContainer = document.getElementById('hotspots-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    sortedWards.forEach((ward, index) => {
        // Add stagger animation delay
        const animationDelay = index * 0.05;
        const item = document.createElement('div');
        item.className = 'hotspot-item';
        item.innerHTML = `
            <div class="hotspot-rank">${index + 1}</div>
            <div class="hotspot-info">
                <div class="hotspot-name">${ward.name}</div>
                <div class="hotspot-district">${ward.district}</div>
            </div>
            <div class="hotspot-risk" style="background-color: ${ward.riskColor}">
                ${ward.riskLevel}
            </div>
        `;
        item.style.cursor = 'pointer';
        item.style.animationDelay = `${animationDelay}s`;
        item.addEventListener('click', () => navigateToWard(ward.id));
        listContainer.appendChild(item);
    });
}

/**
 * Navigate to ward detail page
 */
function navigateToWard(wardId) {
    window.location.href = `ward.html?id=${wardId}`;
}

// ============================================
// WARD DETAIL PAGE FUNCTIONS
// ============================================

/**
 * Load and display ward details
 */
function loadWardDetails() {
    // Get ward ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const wardId = parseInt(urlParams.get('id'));

    if (!wardId) {
        alert('Invalid ward ID');
        window.location.href = 'map.html';
        return;
    }

    // Find ward data
    const ward = enhancedWardsData.find(w => w.id === wardId);
    if (!ward) {
        alert('Ward not found');
        window.location.href = 'map.html';
        return;
    }

    // Populate ward information
    document.getElementById('ward-name').textContent = `${ward.name} - ${ward.district}`;
    
    // Risk badge
    const riskBadge = document.getElementById('risk-badge');
    riskBadge.textContent = `${ward.riskLevel} Risk`;
    riskBadge.style.backgroundColor = ward.riskColor;

    // Risk score with counter animation
    const riskScoreElement = document.getElementById('risk-score');
    animateCounter(riskScoreElement, ward.riskScore, 1500);
    
    const progressBar = document.getElementById('risk-progress');
    progressBar.style.setProperty('--progress-width', `${ward.riskScore}%`);
    progressBar.style.backgroundColor = ward.riskColor;
    
    // Trigger progress animation
    setTimeout(() => {
        progressBar.style.width = `${ward.riskScore}%`;
    }, 100);

    // Rainfall
    document.getElementById('rainfall').textContent = `${ward.rainfall} mm`;
    document.getElementById('rainfall-level').textContent = ward.rainfallLevel;

    // Drainage
    document.getElementById('drainage-score').textContent = `${ward.drainageScore}/100`;
    document.getElementById('drainage-status').textContent = ward.drainageStatus;

    // Past incidents
    document.getElementById('incidents').textContent = ward.pastIncidents;

    // Render incident history
    renderIncidentHistory(ward);

    // Render prediction logic
    renderPredictionLogic(ward);

    // Render recommendations
    renderRecommendations(ward);
}

/**
 * Render historical incidents
 */
function renderIncidentHistory(ward) {
    const list = document.getElementById('incidents-list');
    if (!list) return;

    if (ward.incidentHistory.length === 0) {
        list.innerHTML = '<p class="no-incidents">No water-logging incidents recorded in 2026</p>';
        return;
    }

    list.innerHTML = '';
    ward.incidentHistory.forEach(incident => {
        const item = document.createElement('div');
        item.className = 'incident-item';
        item.innerHTML = `
            <div class="incident-date">${incident.date}</div>
            <div class="incident-severity ${incident.severity.toLowerCase()}">${incident.severity}</div>
            <div class="incident-details">
                <strong>Duration:</strong> ${incident.duration}<br>
                ${incident.description}
            </div>
        `;
        list.appendChild(item);
    });
}

/**
 * Render prediction logic explanation
 */
function renderPredictionLogic(ward) {
    const container = document.getElementById('prediction-logic');
    if (!container) return;

    let prediction = '';
    let reasoning = '';

    if (ward.rainfall >= 70 && ward.drainageScore < 40) {
        prediction = '🔴 High Flood Risk Predicted';
        reasoning = `Heavy rainfall (${ward.rainfall}mm) combined with poor drainage capacity (${ward.drainageScore}/100) 
                     indicates high probability of severe water-logging.`;
    } else if (ward.rainfall >= 40 && ward.drainageScore < 60) {
        prediction = '🟠 Medium Flood Risk Predicted';
        reasoning = `Moderate rainfall (${ward.rainfall}mm) with average drainage (${ward.drainageScore}/100) 
                     suggests potential for localized water-logging.`;
    } else {
        prediction = '🟢 Low Flood Risk';
        reasoning = `Current rainfall levels (${ward.rainfall}mm) and drainage capacity (${ward.drainageScore}/100) 
                     indicate minimal risk of water-logging.`;
    }

    container.innerHTML = `
        <div class="prediction-result">${prediction}</div>
        <p class="prediction-reasoning">${reasoning}</p>
    `;

    // Render timeline actions
    renderTimelineActions(ward);
}

/**
 * Render timeline-based actions
 */
function renderTimelineActions(ward) {
    const beforeRain = document.getElementById('before-rain-actions');
    const duringRain = document.getElementById('during-rain-actions');
    const afterRain = document.getElementById('after-rain-actions');

    if (!beforeRain || !duringRain || !afterRain) return;

    // Before rain actions
    if (ward.riskScore >= 71) {
        beforeRain.innerHTML = `
            <li>Inspect and clear all drainage systems</li>
            <li>Deploy water pumps to critical locations</li>
            <li>Issue advance warning to residents</li>
            <li>Pre-position emergency response teams</li>
        `;
    } else {
        beforeRain.innerHTML = `
            <li>Monitor weather forecasts</li>
            <li>Routine drainage maintenance</li>
            <li>Check pump availability</li>
        `;
    }

    // During rain actions
    if (ward.riskScore >= 71) {
        duringRain.innerHTML = `
            <li>Activate water pumps immediately</li>
            <li>Implement traffic diversions</li>
            <li>Monitor water levels in real-time</li>
            <li>Deploy emergency response teams</li>
        `;
    } else {
        duringRain.innerHTML = `
            <li>Monitor situation continuously</li>
            <li>Be ready to deploy resources if needed</li>
            <li>Keep communication channels open</li>
        `;
    }

    // After rain actions
    afterRain.innerHTML = `
        <li>Assess damage and document incidents</li>
        <li>Clear remaining water and debris</li>
        <li>Repair damaged infrastructure</li>
        <li>Update risk assessment data</li>
    `;
}

/**
 * Render action recommendations
 */
function renderRecommendations(ward) {
    const container = document.getElementById('recommendations');
    if (!container) return;

    const recommendations = [];

    // Generate recommendations based on risk score
    if (ward.riskScore >= 71) {
        recommendations.push({
            icon: '🚰',
            title: 'Deploy Water Pumps',
            description: 'Immediate deployment of high-capacity pumps required',
            priority: 'Critical'
        });
        recommendations.push({
            icon: '🚦',
            title: 'Traffic Diversion',
            description: 'Activate alternate traffic routes and warning signage',
            priority: 'Critical'
        });
        recommendations.push({
            icon: '📱',
            title: 'Emergency Alerts',
            description: 'Send SMS alerts to residents and commuters',
            priority: 'Critical'
        });
        recommendations.push({
            icon: '👷',
            title: 'Deploy Response Teams',
            description: 'Position emergency response personnel in the area',
            priority: 'High'
        });
    } else if (ward.riskScore >= 41) {
        recommendations.push({
            icon: '🔍',
            title: 'Drain Inspection',
            description: 'Schedule comprehensive drainage system inspection',
            priority: 'High'
        });
        recommendations.push({
            icon: '🧹',
            title: 'Clear Blockages',
            description: 'Remove debris and blockages from drainage channels',
            priority: 'Medium'
        });
        recommendations.push({
            icon: '📊',
            title: 'Monitor Conditions',
            description: 'Increase monitoring frequency for this ward',
            priority: 'Medium'
        });
    } else {
        recommendations.push({
            icon: '✅',
            title: 'Routine Maintenance',
            description: 'Continue regular maintenance schedule',
            priority: 'Low'
        });
        recommendations.push({
            icon: '📈',
            title: 'Data Collection',
            description: 'Maintain data collection and monitoring',
            priority: 'Low'
        });
    }

    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
            <div class="rec-icon">${rec.icon}</div>
            <h3>${rec.title}</h3>
            <p>${rec.description}</p>
            <span class="priority-badge ${rec.priority.toLowerCase()}">${rec.priority} Priority</span>
        </div>
    `).join('');
}

// ============================================
// AUTHORITY DASHBOARD FUNCTIONS
// ============================================

/**
 * Initialize authority dashboard
 */
function initializeDashboard() {
    // Update timestamp
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleString('en-IN', { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
        });
    }

    // Calculate summary statistics
    const critical = sortedWards.filter(w => w.riskScore > 80).length;
    const highPriority = sortedWards.filter(w => w.riskScore >= 50 && w.riskScore <= 80).length;
    const monitoring = sortedWards.filter(w => w.riskScore < 50).length;

    // Update summary cards with counter animation
    setTimeout(() => {
        animateCounter(document.getElementById('critical-count'), critical, 1000);
        animateCounter(document.getElementById('high-priority-count'), highPriority, 1000);
        animateCounter(document.getElementById('monitoring-count'), monitoring, 1000);
        animateCounter(document.getElementById('total-wards'), sortedWards.length, 1000);
    }, 300);

    // Render wards table
    renderWardsTable();

    // Render action checklist
    renderActionChecklist();
    
    // Initialize animations
    initializeAnimations();
}

/**
 * Render wards table
 */
function renderWardsTable() {
    const tbody = document.getElementById('wards-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    sortedWards.forEach((ward, index) => {
        const row = document.createElement('tr');
        row.className = ward.riskScore > 80 ? 'critical-row' : ward.riskScore >= 50 ? 'warning-row' : '';
        row.innerHTML = `
            <td><strong>#${index + 1}</strong></td>
            <td><strong>${ward.name}</strong><br><small>${ward.district}</small></td>
            <td><strong>${ward.riskScore}</strong></td>
            <td><span class="risk-badge" style="background-color: ${ward.riskColor}">${ward.riskLevel}</span></td>
            <td>${ward.rainfall} mm</td>
            <td>${ward.drainageStatus}</td>
            <td>${ward.pastIncidents}</td>
            <td><button class="view-btn" onclick="navigateToWard(${ward.id})">View Details</button></td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Filter table based on risk level
 */
function filterTable(filter) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter wards
    let filtered = sortedWards;
    if (filter === 'critical') {
        filtered = sortedWards.filter(w => w.riskScore > 80);
    } else if (filter === 'high') {
        filtered = sortedWards.filter(w => w.riskScore >= 50 && w.riskScore <= 80);
    }

    // Re-render table
    const tbody = document.getElementById('wards-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    filtered.forEach((ward, index) => {
        const row = document.createElement('tr');
        row.className = ward.riskScore > 80 ? 'critical-row' : ward.riskScore >= 50 ? 'warning-row' : '';
        row.innerHTML = `
            <td><strong>#${index + 1}</strong></td>
            <td><strong>${ward.name}</strong><br><small>${ward.district}</small></td>
            <td><strong>${ward.riskScore}</strong></td>
            <td><span class="risk-badge" style="background-color: ${ward.riskColor}">${ward.riskLevel}</span></td>
            <td>${ward.rainfall} mm</td>
            <td>${ward.drainageStatus}</td>
            <td>${ward.pastIncidents}</td>
            <td><button class="view-btn" onclick="navigateToWard(${ward.id})">View Details</button></td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Render action checklist
 */
function renderActionChecklist() {
    const container = document.getElementById('action-checklist');
    if (!container) return;

    const criticalWards = sortedWards.filter(w => w.riskScore > 80);
    const highPriorityWards = sortedWards.filter(w => w.riskScore >= 50 && w.riskScore <= 80);

    let html = '<div class="checklist-section-title">Immediate Actions Required</div>';
    
    if (criticalWards.length > 0) {
        html += '<div class="checklist-group">';
        html += '<h4>🚨 Critical Wards (Risk > 80)</h4>';
        criticalWards.forEach(ward => {
            html += `
                <div class="checklist-item">
                    <input type="checkbox" id="ward-${ward.id}">
                    <label for="ward-${ward.id}">
                        <strong>${ward.name}:</strong> Deploy pumps, issue traffic alerts, activate emergency response
                    </label>
                </div>
            `;
        });
        html += '</div>';
    }

    if (highPriorityWards.length > 0) {
        html += '<div class="checklist-group">';
        html += '<h4>⚠️ High Priority Wards (Risk 50-80)</h4>';
        highPriorityWards.slice(0, 5).forEach(ward => {
            html += `
                <div class="checklist-item">
                    <input type="checkbox" id="ward-${ward.id}-hp">
                    <label for="ward-${ward.id}-hp">
                        <strong>${ward.name}:</strong> Schedule drain inspection and clear blockages
                    </label>
                </div>
            `;
        });
        html += '</div>';
    }

    container.innerHTML = html;
}