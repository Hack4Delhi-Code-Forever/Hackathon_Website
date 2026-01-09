# 💧 Delhi Water-Logging Hotspot Mapping System

> A modern, beautiful civic-tech solution for mapping and predicting water-logging hotspots across Delhi NCT

## 🎨 Features

### ✨ Beautiful Modern UI
- **Light & Dark Mode** - Toggle between themes with persistent preference
- **Linear-inspired Design** - Clean, professional interface with modern aesthetics
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- **Smooth Transitions** - Polished animations and interactions
- **Modern Typography** - Using Inter font for optimal readability

### 🗺️ Interactive Map
- Color-coded risk visualization (Green/Orange/Red)
- Clickable ward markers with hover effects
- Sticky sidebar with ranked hotspots
- Real-time data display

### 📊 Ward-Level Analytics
- Detailed flood risk scores (0-100)
- Rainfall intensity tracking
- Drainage condition status
- Historical incident records
- AI-powered predictions

### 🤖 Authority Dashboard
- Priority-based ward monitoring
- AI-powered action recommendations
- Filterable data tables
- Action checklist system
- Real-time statistics

## 🚀 Quick Start

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or backend required!

### Running the Demo

1. **Download all files** to a folder on your computer
2. **Open `index.html`** in your web browser
3. That's it! The system is fully functional

### File Structure
```
delhi-waterlogging-system/
├── index.html          # Landing page
├── map.html           # Interactive map view
├── ward.html          # Ward detail page
├── authority.html     # MCD dashboard
├── styles.css         # Modern UI styles with theme support
├── data.js            # 20 wards with dummy data
├── script.js          # Dynamic rendering & theme logic
└── README.md          # This file
```

## 🎯 How to Use

### 1. Landing Page (index.html)
- View system overview and impact statistics
- Understand the problem and solution
- Navigate to the flood risk map

### 2. Map View (map.html)
- **Toggle Theme**: Click the theme button in navbar (🌙/☀️)
- **View Hotspots**: Explore color-coded markers on the map
- **Check Rankings**: Scroll through the sidebar list
- **Select Ward**: Click any marker or list item for details

### 3. Ward Details (ward.html)
- Review comprehensive ward analytics
- Check historical incidents
- View AI predictions and timeline
- See recommended actions

### 4. Authority Dashboard (authority.html)
- Monitor all wards in one view
- Filter by risk level (Critical/High/All)
- Review AI-powered recommendations
- Track priority actions

## 🎨 Design System

### Color Palette
- **Primary**: #1560BD (Tech Blue)
- **Success**: #16a34a (Green)
- **Warning**: #f59e0b (Orange)
- **Danger**: #dc2626 (Red)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 700-800 weight
- **Body**: 400-500 weight
- **Scale**: 0.75rem to 3rem

### Themes
- **Light Mode**: Clean white backgrounds with dark text
- **Dark Mode**: Dark backgrounds (#0f172a) with light text
- **Auto-persist**: Theme preference saved in browser

## 📱 Responsive Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## 🔧 Technical Details

### Technologies Used
- Pure HTML5
- Modern CSS3 with CSS Custom Properties (CSS Variables)
- Vanilla JavaScript (ES6+)
- SVG for map visualization
- LocalStorage for theme persistence

### Data Model
Each ward contains:
- Ward name and district
- Rainfall measurement (mm)
- Drainage score (0-100)
- Past incident count
- Calculated risk score

### Risk Calculation Formula
```
Risk Score = (Rainfall × 0.5) + (Drainage Deficiency × 0.3) + (Incidents × 0.2)
```

### Risk Levels
- **Low**: 0-40 (Green)
- **Medium**: 41-70 (Orange)
- **High**: 71-100 (Red)

## 🎯 For Hackathon Judges

### Key Highlights
1. **✅ Complete Working Prototype** - No backend or setup required
2. **✅ Modern Beautiful UI** - Professional government-ready design
3. **✅ Light/Dark Mode** - Accessibility and user preference
4. **✅ AI-Powered Insights** - Rule-based prediction system
5. **✅ Actionable Intelligence** - Clear recommendations for authorities
6. **✅ Mobile Responsive** - Works on all devices
7. **✅ Well-Commented Code** - Easy to understand and extend

### Demo Flow
1. Start at landing page → See problem statement
2. Click "Open Flood Risk Map" → View interactive map
3. Click any high-risk ward (red markers) → See detailed analytics
4. Navigate to Dashboard → View authority recommendations
5. Toggle theme → Experience both light and dark modes

## 📝 Future Enhancements (Post-Hackathon)

- [ ] Real weather API integration
- [ ] Live rainfall data from IMD
- [ ] Machine learning model for predictions
- [ ] Mobile app version
- [ ] SMS alert system integration
- [ ] Historical data visualization charts
- [ ] Export reports as PDF
- [ ] Multi-language support (Hindi, English)

## 👥 Credits

Developed for **HACK4DELHI** Government Hackathon
- Problem Statement: "Mapping Water-Logging Hotspots of Delhi"
- Target User: Municipal Corporation of Delhi (MCD)

## 📄 License

This project is developed for educational and demonstration purposes.

---

**Made with ❤️ for Delhi's monsoon preparedness**