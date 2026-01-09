/**
 * DATA.JS - Dummy Data for Delhi Water-Logging Hotspot System
 * Contains simulated ward-level data for rainfall, drainage, and flood risk
 */

// Ward Data Array
// Each ward contains: name, rainfall (mm), drainage score (0-100), past incidents count
const wardsData = [
    // Critical Risk Wards (High rainfall + Poor drainage)
    {
        id: 1,
        name: "Moti Nagar",
        district: "West Delhi",
        rainfall: 95,
        drainageScore: 25,
        pastIncidents: 12,
        x: 250, // West
        y: 420,
        lat: 28.6602,
        lng: 77.1386
    },
    {
        id: 2,
        name: "Pul Prahladpur",
        district: "South Delhi",
        rainfall: 88,
        drainageScore: 30,
        pastIncidents: 15,
        x: 400, // South
        y: 680,
        lat: 28.5005,
        lng: 77.2756
    },
    {
        id: 3,
        name: "Sangam Vihar",
        district: "South Delhi",
        rainfall: 92,
        drainageScore: 20,
        pastIncidents: 18,
        x: 450, // South East
        y: 640,
        lat: 28.5004,
        lng: 77.2435
    },
    {
        id: 4,
        name: "Mundka",
        district: "West Delhi",
        rainfall: 82,
        drainageScore: 28,
        pastIncidents: 10,
        x: 200, // Far West
        y: 380,
        lat: 28.6832,
        lng: 77.0281
    },
    {
        id: 5,
        name: "Palam",
        district: "South West Delhi",
        rainfall: 78,
        drainageScore: 32,
        pastIncidents: 9,
        x: 280, // South West
        y: 600,
        lat: 28.5524,
        lng: 77.0734
    },

    // High Risk Wards
    {
        id: 6,
        name: "Najafgarh",
        district: "South West Delhi",
        rainfall: 72,
        drainageScore: 42,
        pastIncidents: 8,
        x: 220, // South West
        y: 560,
        lat: 28.6092,
        lng: 76.9798
    },
    {
        id: 7,
        name: "Mehrauli",
        district: "South Delhi",
        rainfall: 68,
        drainageScore: 45,
        pastIncidents: 7,
        x: 360, // South
        y: 620,
        lat: 28.5244,
        lng: 77.1855
    },
    {
        id: 8,
        name: "Dwarka",
        district: "South West Delhi",
        rainfall: 70,
        drainageScore: 40,
        pastIncidents: 6,
        x: 240, // South West
        y: 520,
        lat: 28.5921,
        lng: 77.0460
    },
    {
        id: 9,
        name: "Shahdara",
        district: "North East Delhi",
        rainfall: 65,
        drainageScore: 48,
        pastIncidents: 7,
        x: 530, // North East
        y: 220,
        lat: 28.6692,
        lng: 77.2868
    },
    {
        id: 10,
        name: "Rohini",
        district: "North West Delhi",
        rainfall: 62,
        drainageScore: 50,
        pastIncidents: 5,
        x: 280, // North West
        y: 180,
        lat: 28.7496,
        lng: 77.0674
    },

    // Medium Risk Wards
    {
        id: 11,
        name: "Model Town",
        district: "North Delhi",
        rainfall: 58,
        drainageScore: 55,
        pastIncidents: 4,
        x: 380, // North
        y: 160,
        lat: 28.7185,
        lng: 77.1910
    },
    {
        id: 12,
        name: "Karol Bagh",
        district: "Central Delhi",
        rainfall: 55,
        drainageScore: 60,
        pastIncidents: 4,
        x: 350, // Central
        y: 320,
        lat: 28.6519,
        lng: 77.1909
    },
    {
        id: 13,
        name: "Vasant Vihar",
        district: "South West Delhi",
        rainfall: 52,
        drainageScore: 62,
        pastIncidents: 3,
        x: 310, // South West
        y: 540,
        lat: 28.5672,
        lng: 77.1589
    },
    {
        id: 14,
        name: "Laxmi Nagar",
        district: "East Delhi",
        rainfall: 50,
        drainageScore: 58,
        pastIncidents: 3,
        x: 540, // East
        y: 350,
        lat: 28.6304,
        lng: 77.2777
    },
    {
        id: 15,
        name: "Janakpuri",
        district: "West Delhi",
        rainfall: 48,
        drainageScore: 65,
        pastIncidents: 2,
        x: 220, // West
        y: 450,
        lat: 28.6219,
        lng: 77.0834
    },

    // Low Risk Wards
    {
        id: 16,
        name: "Connaught Place",
        district: "Central Delhi",
        rainfall: 42,
        drainageScore: 78,
        pastIncidents: 1,
        x: 380, // Central
        y: 350,
        lat: 28.6315,
        lng: 77.2167
    },
    {
        id: 17,
        name: "Defence Colony",
        district: "South Delhi",
        rainfall: 38,
        drainageScore: 82,
        pastIncidents: 1,
        x: 430, // South
        y: 550,
        lat: 28.5706,
        lng: 77.2368
    },
    {
        id: 18,
        name: "Mayur Vihar",
        district: "East Delhi",
        rainfall: 35,
        drainageScore: 85,
        pastIncidents: 0,
        x: 550, // East
        y: 420,
        lat: 28.6079,
        lng: 77.2991
    },
    {
        id: 19,
        name: "Pitampura",
        district: "North West Delhi",
        rainfall: 32,
        drainageScore: 88,
        pastIncidents: 1,
        x: 320, // North West
        y: 200,
        lat: 28.6912,
        lng: 77.1314
    },
    {
        id: 20,
        name: "Greater Kailash",
        district: "South Delhi",
        rainfall: 30,
        drainageScore: 90,
        pastIncidents: 0,
        x: 410, // South
        y: 580,
        lat: 28.5494,
        lng: 77.2432
    }
];

/**
 * Calculate flood risk score for a ward
 * Formula: (Rainfall weight * 0.5) + (Drainage deficiency * 0.3) + (Past incidents * 0.2)
 * Returns a score from 0-100
 */
function calculateRiskScore(ward) {
    const rainfallWeight = ward.rainfall * 0.5;
    const drainageDeficiency = (100 - ward.drainageScore) * 0.3;
    const incidentWeight = Math.min(ward.pastIncidents * 2, 20) * 1; // Cap at 20
    
    const totalScore = rainfallWeight + drainageDeficiency + incidentWeight;
    return Math.min(Math.round(totalScore), 100);
}

/**
 * Determine risk level based on risk score
 */
function getRiskLevel(score) {
    if (score >= 71) return 'High';
    if (score >= 41) return 'Medium';
    return 'Low';
}

/**
 * Get risk color for visualization
 */
function getRiskColor(score) {
    if (score >= 71) return '#dc2626'; // Red
    if (score >= 41) return '#f59e0b'; // Orange
    return '#16a34a'; // Green
}

/**
 * Get rainfall intensity level
 */
function getRainfallLevel(rainfall) {
    if (rainfall >= 70) return 'Heavy';
    if (rainfall >= 40) return 'Medium';
    return 'Light';
}

/**
 * Get drainage status
 */
function getDrainageStatus(score) {
    if (score >= 70) return 'Good';
    if (score >= 40) return 'Moderate';
    return 'Poor';
}

/**
 * Generate historical incidents for a ward
 */
function generateIncidentHistory(ward) {
    const incidents = [];
    const months = ['January', 'February', 'March', 'June', 'July', 'August', 'September'];
    
    for (let i = 0; i < Math.min(ward.pastIncidents, 5); i++) {
        incidents.push({
            date: `${Math.floor(Math.random() * 28) + 1} ${months[Math.floor(Math.random() * months.length)]} 2026`,
            severity: ward.pastIncidents > 10 ? 'Severe' : ward.pastIncidents > 5 ? 'Moderate' : 'Minor',
            duration: `${Math.floor(Math.random() * 6) + 2} hours`,
            description: 'Water-logging on main road affecting traffic flow'
        });
    }
    
    return incidents;
}

/**
 * Enhanced ward data with calculated risk scores
 */
const enhancedWardsData = wardsData.map(ward => ({
    ...ward,
    riskScore: calculateRiskScore(ward),
    riskLevel: getRiskLevel(calculateRiskScore(ward)),
    riskColor: getRiskColor(calculateRiskScore(ward)),
    rainfallLevel: getRainfallLevel(ward.rainfall),
    drainageStatus: getDrainageStatus(ward.drainageScore),
    incidentHistory: generateIncidentHistory(ward)
}));

// Sort wards by risk score (highest first)
const sortedWards = [...enhancedWardsData].sort((a, b) => b.riskScore - a.riskScore);

// Export data for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { enhancedWardsData, sortedWards };
}