# 📊 Dashly - Data Analytics & Visualization

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2053-000020.svg?style=flat&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.75-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE.txt)

A powerful and intuitive React Native mobile application for data visualization and analytics. Transform your Excel, CSV, and SQL data into beautiful, interactive dashboards with AI-powered insights.

> **🎯 Perfect for data analysts, business professionals, and students who need powerful data visualization on the go!**

## ✨ Key Features

### 📁 **Data Import & Processing**
- **Multi-format Support**: Excel (.xlsx, .xls), CSV, and SQL files
- **Local Processing**: All data processed securely on your device
- **Large File Support**: Handle substantial datasets efficiently

### 📊 **Visualization & Analytics**
- **Interactive Dashboards**: Touch-friendly, responsive charts and graphs
- **Multiple Chart Types**: Bar, line, pie, scatter, and more
- **Real-time Updates**: Dynamic data visualization as you explore

### 🤖 **AI-Powered Insights**
- **Natural Language Queries**: Ask questions about your data in plain English
- **Automated Analysis**: Get instant insights and recommendations
- **Smart Suggestions**: AI-driven data exploration tips

### 🛠️ **Professional Tools**
- **SQL Query Editor**: Built-in editor with syntax highlighting and autocomplete
- **Data Export**: Share visualizations and processed data
- **Custom Dashboards**: Create and save personalized dashboard layouts

### 🎨 **User Experience**
- **6 Beautiful Color Schemes**: Default, Ocean, Forest, Sunset, Purple, and Monochrome
- **Light/Dark Mode**: Automatic theme switching with system preferences
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: Full accessibility support for all users

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ ([Download here](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Expo CLI** (`npm install -g @expo/cli`)
- **Expo Go app** on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation & Setup

1. **Clone the repository**:
```bash
git clone https://github.com/xt67/Dashly-1.0.git
cd Dashly-1.0
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm start
```

4. **Run on your device**:
   - **Mobile**: Scan the QR code with Expo Go app
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal  
   - **Web Browser**: Press `w` in the terminal

### 🔧 Development Commands

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm test           # Run tests
npm run lint       # Run ESLint
```

## 📱 App Structure & Architecture

```
src/
├── components/          # Reusable UI components
│   ├── AboutModal.tsx      # App information modal
│   ├── ColorSchemeModal.tsx # Theme selector
│   ├── Chart.tsx          # Data visualization component
│   └── ...
├── screens/            # Main application screens
│   ├── DashboardScreen.tsx    # Main dashboard interface
│   ├── DataInputScreen.tsx    # Data import screen
│   ├── SQLEditorScreen.tsx    # SQL query interface
│   ├── AIInsightsScreen.tsx   # AI analytics screen
│   └── SettingsScreen.tsx     # App settings & preferences
├── navigation/         # App navigation setup
│   └── AppNavigator.tsx
├── services/          # Business logic & data services
│   └── DataService.ts
├── styles/           # Theme system & styling
│   ├── theme.ts           # Color schemes & design tokens
│   ├── ThemeProvider.tsx  # Context provider for theming
│   └── useTheme.ts       # Theme hook
├── types/            # TypeScript type definitions
├── utils/            # Utility functions & helpers
└── hooks/            # Custom React hooks
```

## 🎨 Design System

### Color Schemes
The app includes 6 professionally designed color schemes:

| Scheme | Primary | Secondary | Description |
|--------|---------|-----------|-------------|
| **Default** | `#3B82F6` | `#10B981` | Clean blue & green |
| **Ocean** | `#0EA5E9` | `#06B6D4` | Ocean-inspired blues |
| **Forest** | `#10B981` | `#059669` | Nature green tones |
| **Sunset** | `#F59E0B` | `#DC2626` | Warm orange & red |
| **Purple** | `#8B5CF6` | `#A855F7` | Rich purple palette |
| **Monochrome** | `#6B7280` | `#374151` | Professional grayscale |

### Typography
- **Primary Font**: Inter (system fallback: SF Pro, Roboto)
- **Code Font**: JetBrains Mono (monospace fallback)
- **Responsive Scaling**: Automatic text scaling for accessibility

## �️ Technology Stack

### Core Technologies
- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript 5.x
- **Navigation**: React Navigation 6
- **State Management**: React Context + AsyncStorage
- **Charts**: React Native Chart Kit + Victory Native

### Development Tools
- **Build System**: Expo Application Services (EAS)
- **Testing**: Jest + React Native Testing Library
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode

### Data Processing
- **Local Storage**: AsyncStorage for preferences, SQLite for data
- **File Processing**: XLSX.js for Excel, Papa Parse for CSV
- **AI Integration**: Open-source models for insights

## 📊 Features Deep Dive

### 🔍 **Data Import**
- Drag & drop file interface
- Support for large datasets (up to 50MB)
- Automatic data type detection
- Preview before import

### 📈 **Visualization Engine**
- 15+ chart types available
- Interactive touch gestures (zoom, pan, select)
- Export charts as images
- Customizable styling options

### 🤖 **AI Analytics**
- Natural language query processing
- Automated trend detection
- Statistical insights generation
- Recommendation engine

### ⚙️ **Settings & Customization**
- Theme preferences with persistence
- Data privacy controls
- Export/import app settings
- Accessibility options

## 🎯 Target Audience

### 👥 **Primary Users**
- **📊 Data Analysts**: Professional data analysis and visualization
- **💼 Business Professionals**: Quick insights from business data  
- **🎓 Students**: Learning data analysis and visualization concepts
- **🔬 Researchers**: Academic and scientific data exploration

### 💡 **Use Cases**
- Business reporting and KPI tracking
- Academic research data analysis
- Personal finance and expense tracking
- Sales and marketing analytics
- Project data visualization
- Educational data science projects

## 🚀 Roadmap

### 📅 **Version 1.2.0** (Coming Soon)
- [ ] Advanced chart customization
- [ ] Data collaboration features
- [ ] Enhanced AI insights
- [ ] Cloud data sync (optional)

### 📅 **Version 1.3.0** (Future)
- [ ] Real-time data streaming
- [ ] Advanced statistical functions
- [ ] Custom dashboard templates
- [ ] API integrations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### 🐛 **Bug Reports**
Found a bug? Please [open an issue](https://github.com/xt67/Dashly-1.0/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 💡 **Feature Requests**
Have an idea? We'd love to hear it! [Submit a feature request](https://github.com/xt67/Dashly-1.0/issues) with:
- Detailed description of the feature
- Use case and benefits
- Any relevant mockups or examples

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.txt](./LICENSE.txt) file for details.

## 🔒 Privacy & Security

- **Local Processing**: All data is processed locally on your device
- **No Cloud Storage**: Your sensitive data never leaves your device
- **Privacy Policy**: See [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) for full details
- **Security**: Regular security audits and updates

## 📞 Support & Contact

- **📧 Email**: support@dashly.app
- **🐛 Issues**: [GitHub Issues](https://github.com/xt67/Dashly-1.0/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/xt67/Dashly-1.0/discussions)
- **📱 App Store**: Coming soon to Google Play Store

## 🙏 Acknowledgments

- [Expo Team](https://expo.dev/) for the amazing development platform
- [React Native Community](https://reactnative.dev/) for the framework
- [Victory Charts](https://victory-charts.com/) for visualization components
- All our contributors and beta testers

---

<div align="center">

**⭐ If you find Dashly helpful, please give it a star! ⭐**

Made with ❤️ by the Dashly Team

[Download on Google Play Store](#) | [View Documentation](./docs/) | [Report Issues](https://github.com/xt67/Dashly-1.0/issues)

</div>
