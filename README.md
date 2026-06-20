# 🌍 EcoTrace - Carbon Footprint Awareness Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Three.js-169-049ef4?style=for-the-badge&logo=three.js" alt="Three.js">
</p>

<p align="center">
  A production-grade carbon footprint calculator and awareness platform with 3D visualization,
  gamification, and personalized recommendations.
</p>

<p align="center">
  <a href="https://ecotrace.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel" alt="Live Demo">
  </a>
  <a href="https://github.com/yourusername/ecotrace" target="_blank">
    <img src="https://img.shields.io/badge/Source_Code-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub">
  </a>
</p>

---

## 🎯 Features

### Core Features
- **📊 Interactive Calculator** - 6-category carbon footprint calculator with real-time results
- **🌍 3D Earth Visualization** - Animated globe that changes color based on emissions
- **📈 Visual Dashboard** - Charts, graphs, and comparison with global averages
- **🎯 Personalized Recommendations** - AI-style tips based on your highest emission categories
- **🏆 Gamification System** - Badges, challenges, and leaderboards
- **📤 Export Results** - Download as PNG or PDF report

### Technical Features
- **⚡ Next.js 14 App Router** - Server-side rendering and optimal performance
- **🎨 Glassmorphism UI** - Modern, sleek design with blur effects
- **🌙 Dark/Light Mode** - Theme toggle with next-themes
- **📱 Fully Responsive** - Works on mobile, tablet, and desktop
- **🔒 100% Private** - All calculations happen locally, no data sent to servers
- **♿ Accessible** - WCAG compliant with keyboard navigation

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.6 |
| Styling | Tailwind CSS 3.4 |
| 3D Graphics | Three.js + React Three Fiber |
| Animations | Framer Motion |
| Charts | Recharts |
| State Management | Zustand |
| Icons | Lucide React |
| PDF Generation | jsPDF + html2canvas |

---

## 📁 Project Structure

```
EcoTrace/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page with 3D Earth
│   │   ├── calculator/        # Multi-step calculator
│   │   ├── dashboard/         # Visual dashboard
│   │   ├── recommendations/   # Personalized tips
│   │   ├── challenges/        # Weekly challenges
│   │   ├── badges/            # Badge collection
│   │   └── leaderboard/       # Community rankings
│   ├── components/
│   │   ├── earth/             # 3D Earth components
│   │   ├── ui/                # Reusable UI components
│   │   ├── calculator/        # Calculator wizard
│   │   ├── dashboard/         # Dashboard charts
│   │   └── layout/            # Navigation & layout
│   ├── lib/                   # Utilities & calculations
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Zustand state management
│   └── types/                 # TypeScript types
├── public/                    # Static assets
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended: 20.x)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ecotrace.git
cd ecotrace

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

---

## 📊 Carbon Calculation Formulas

All calculations are based on EPA, IPCC, and DEFRA emission factors:

| Category | Formula | Source |
|----------|---------|--------|
| Electricity | kWh × 12 × country_factor | IEA 2023 |
| Car Fuel | km/week × 52 × vehicle_factor | IPCC AR6 |
| Public Transport | km × factor (bus: 0.089, train: 0.041) | DEFRA 2023 |
| Flights | km × 0.156 × 1.9 (RFI) | ICAO |
| Diet | Annual total based on type | Poore & Nemecek 2018 |
| Waste | bags × 52 × 10kg × 0.5 | EPA WARM |

---

## 🎨 Design System

### Glassmorphism Components
- `GlassCard` - Reusable card with blur effect
- `GlassButton` - Animated button with gradient
- `GlassInput` - Styled form inputs
- `GlassSlider` - Range sliders with glow
- `GlassProgress` - Animated progress bars

### Color Palette
- Primary: `#22c55e` (Eco Green)
- Accent: `#06b6d4` (Cyan)
- Background: `#030712` (Dark)

---

## 🏆 Gamification

### Badges
| Badge | Requirement |
|-------|-------------|
| 🌱 First Step | Complete first calculation |
| ⚔️ Eco Warrior | Below global average |
| 🌍 Earth Guardian | Under 200 kg CO₂/month |
| 🦸 Net Zero Hero | Under 100 kg CO₂/month |
| 🎯 Challenge Master | Complete 3 challenges |

### Challenges
- 5% Reduction Challenge
- Car-Free Week
- Plant-Based Week
- Energy Saver
- Zero Waste Week

---

## 📱 Responsive Design

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 640px) | Single column, bottom nav |
| Tablet (640-1024px) | 2-column grid |
| Desktop (> 1024px) | Full dashboard with sidebar |

---

## 🔧 Configuration

### Environment Variables
No environment variables required - all calculations are client-side.

### Customization
Edit `src/lib/constants.ts` to customize:
- Emission factors
- Average values
- App configuration

---

## 📄 License

MIT License - feel free to use this project for hackathons and learning!

---

## 🙏 Acknowledgments

- [EPA](https://www.epa.gov/) for emission factors
- [IPCC](https://www.ipcc.ch/) for climate data
- [Our World in Data](https://ourworldindata.org/) for diet statistics
- [Three.js](https://threejs.org/) for 3D graphics

---

## 📧 Contact

For questions or feedback, open an issue on GitHub.

<p align="center">
  Made with ❤️ for our planet 🌍
</p>
