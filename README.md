# 📊 SoroOne - AI-Powered Data Analytics & Visualization

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2053-000020.svg?style=flat&logo=expo)](https://expo.## 🛠️ Technology Stack

### Core Technologies
- **Framework**: React Native 0.79.5 with Expo SDK 53
- **Language**: TypeScript 5.x with strict mode
- **Navigation**: React Navigation 6 with tab-based structure
- **State Management**: React Context + AsyncStorage for persistence
- **Charts**: React Native Chart Kit + Victory Native for visualizations

### AI & Data Processing
- **Local AI**: Ollama with Mistral 7B model for privacy-focused analysis
- **Data Storage**: SQLite for datasets, AsyncStorage for preferences
- **File Processing**: XLSX.js for Excel, Papa Parse for CSV
- **Network**: Platform-aware configuration with diagnostics

### Development Tools
- **Build System**: Expo Application Services (EAS)
- **Testing**: Jest + React Native Testing Library
- **Code Quality**: ESLint + Prettier with TypeScript strict mode
- **Bundling**: Metro bundler with custom configurationve](https://img.shields.io/badge/React%20Native-0.79.5-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE.txt)

A powerful React Native mobile application for data visualization and analytics with **integrated local AI capabilities**. Transform your Excel, CSV, and SQL data into beautiful, interactive dashboards while leveraging **Ollama Mistral AI** for intelligent insights and natural language data analysis.

> **🤖 Features local AI processing with Ollama Mistral for privacy-focused data analysis!**

## ✨ Key Features

### 📁 **Data Import & Processing**
- **Multi-format Support**: Excel (.xlsx, .xls), CSV, and SQL files
- **Local Processing**: All data processed securely on your device
- **Large File Support**: Handle substantial datasets efficiently
- **Real-time Data Preview**: Instant data visualization during import

### 📊 **Interactive Dashboards**
- **Smart Chart Generation**: Automatic chart type selection based on data
- **Touch-friendly Interface**: Zoom, pan, and interact with visualizations
- **Multiple Chart Types**: Bar, line, pie, scatter plots, and more
- **Real-time Updates**: Dynamic data visualization as you explore
- **Export & Share**: Save dashboards and export visualizations

### 🤖 **AI-Powered Analytics (Ollama Mistral)**
- **Local AI Processing**: Privacy-first AI using Ollama Mistral model
- **ChatGPT-style Interface**: Natural conversation about your data
- **Intelligent Insights**: AI-generated analysis and recommendations
- **Natural Language Queries**: Ask questions about your data in plain English
- **Report Generation**: AI-powered dashboard summaries and insights
- **Trend Analysis**: Automated pattern detection and forecasting

### 🛠️ **Professional SQL Editor**
- **Syntax Highlighting**: Full SQL syntax highlighting and formatting
- **Query Execution**: Run SQL queries against imported datasets
- **Interactive Results**: Browse and analyze query results
- **Query History**: Save and reuse favorite queries
- **SQLite Integration**: Built-in database for complex data operations

### 🎨 **Modern User Experience**
- **6 Beautiful Themes**: Default, Ocean, Forest, Sunset, Purple, and Monochrome
- **Dark/Light Mode**: Automatic theme switching with system preferences
- **Chart-based Logo**: Modern, data-focused branding
- **Responsive Design**: Optimized for all screen sizes and orientations
- **Accessibility**: Full accessibility support with screen readers

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ ([Download here](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Expo CLI** (`npm install -g @expo/cli`)
- **Expo Go app** on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **Ollama** (optional, for AI features): [Install Ollama](https://ollama.ai/)

### 🤖 AI Setup (Optional)

For AI-powered insights, install and run Ollama with Mistral:

```bash
# Install Ollama (follow instructions at https://ollama.ai/)
ollama pull mistral

# Start Ollama server (required for AI features)
ollama serve
```

**Note**: AI features work on web platform. Mobile devices will show diagnostic information and network troubleshooting tools.

### Installation & Setup

1. **Clone the repository**:
```bash
git clone https://github.com/xt67/SoroOne-main.git
cd SoroOne-main
```

2. **Install dependencies**:
```bash
npm install --legacy-peer-deps
```

3. **Start the development server**:
```bash
npm start
```

4. **Run on your device**:
   - **Mobile**: Scan the QR code with Expo Go app
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal  
   - **Web Browser**: Press `w` in the terminal (required for AI features)

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
│   ├── DashboardViewer.tsx # Interactive dashboard display
│   ├── SplashScreen.tsx   # App startup screen with chart logo
│   ├── Logo.tsx           # Chart-based logo component
│   └── ...
├── screens/            # Main application screens
│   ├── DashboardScreen.tsx    # Main dashboard with AI report generation
│   ├── DataInputScreen.tsx    # Data import and file management
│   ├── SQLEditorScreen.tsx    # SQL query interface with syntax highlighting
│   ├── AIInsightsScreen.tsx   # ChatGPT-style AI chat interface
│   └── SettingsScreen.tsx     # App settings & theme preferences
├── navigation/         # App navigation setup
│   └── AppNavigator.tsx
├── services/          # Business logic & data services
│   ├── DataService.ts      # Core data processing and storage
│   ├── OllamaService.ts    # Local AI integration with Mistral
│   └── NetworkConfig.ts    # Network diagnostics and configuration
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
- **File Support**: Excel, CSV, SQL files with automatic format detection
- **Data Preview**: Real-time preview with column analysis
- **Large Datasets**: Efficient handling of files up to 50MB
- **Data Validation**: Automatic type detection and quality assessment

### 📈 **Dashboard & Visualization**
- **Smart Charts**: AI-recommended chart types based on data characteristics
- **Interactive Controls**: Touch gestures for zoom, pan, selection
- **Real-time Analysis**: Live updates as you filter and explore data
- **Export Options**: Save charts as images, export data to various formats

### 🤖 **AI-Powered Analysis**
- **Local Processing**: Ollama Mistral runs entirely on your machine
- **Chat Interface**: Natural conversation about your data (ChatGPT-style)
- **Intelligent Reports**: AI-generated dashboard summaries and insights
- **Pattern Recognition**: Automatic trend detection and anomaly identification
- **Privacy-First**: All AI processing happens locally, data never leaves your device

### 💻 **SQL Editor**
- **Full SQL Support**: Complete SQL syntax with highlighting
- **Interactive Execution**: Run queries and browse results instantly
- **Query Management**: Save, organize, and reuse favorite queries
- **Database Integration**: Direct SQLite database operations

### 🎨 **User Interface**
- **Modern Design**: Clean, chart-focused branding and interface
- **Theme System**: 6 professional color schemes with dark/light mode
- **Responsive Layout**: Optimized for phones, tablets, and web browsers
- **Accessibility**: Full screen reader support and keyboard navigation

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

## 🚀 Roadmap & Future Enhancements

### 📅 **Version 1.2.0** (Next Release)
- [ ] **Enhanced AI Features**
  - Multi-model support (GPT, Claude, local models)
  - Voice-to-text data queries
  - Advanced statistical analysis
- [ ] **Dashboard Improvements**
  - Custom dashboard templates
  - Advanced chart customization
  - Interactive drill-down capabilities
- [ ] **Collaboration Features**
  - Dashboard sharing and export
  - Team workspaces (optional cloud sync)
  - Real-time collaborative analysis

### 📅 **Version 1.3.0** (Future)
- [ ] **Data Connectivity**
  - Database connectors (PostgreSQL, MySQL, MongoDB)
  - API data source integration
  - Real-time data streaming
- [ ] **Advanced Analytics**
  - Machine learning model integration
  - Predictive analytics and forecasting
  - Custom statistical functions
- [ ] **Enterprise Features**
  - Single sign-on (SSO) support
  - Advanced security and compliance
  - Custom branding and white-labeling

### 📅 **Long-term Vision**
- [ ] **Platform Expansion**
  - Desktop application (Electron)
  - Browser extension for quick analysis
  - API for third-party integrations
- [ ] **AI Advancements**
  - Fine-tuned models for specific industries
  - Automated report generation
  - Natural language data transformation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### 🐛 **Bug Reports**
Found a bug? Please [open an issue](https://github.com/xt67/SoroOne-main/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 💡 **Feature Requests**
Have an idea? We'd love to hear it! [Submit a feature request](https://github.com/xt67/SoroOne-main/issues) with:
- Detailed description of the feature
- Use case and benefits
- Any relevant mockups or examples

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.txt](./LICENSE.txt) file for details.

## 🔒 Privacy & Security

- **Local-First Processing**: All data analysis happens on your device
- **AI Privacy**: Ollama Mistral runs completely offline - no data sent to external servers
- **No Cloud Dependencies**: Your sensitive data never leaves your device unless you choose to export
- **Open Source**: Full transparency with open-source codebase
- **Privacy Policy**: Comprehensive privacy documentation in [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)
- **Data Control**: You own and control all your data and insights

## 📞 Support & Contact

- **📧 Email**: ssoroone@gmail.com
- **🐛 Issues**: [GitHub Issues](https://github.com/xt67/SoroOne-main/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/xt67/SoroOne-main/discussions)
- **📱 App Store**: Coming soon to Google Play Store

## 🙏 Acknowledgments

- [Expo Team](https://expo.dev/) for the amazing development platform
- [React Native Community](https://reactnative.dev/) for the framework
- [Victory Charts](https://victory-charts.com/) for visualization components
- All our contributors and beta testers

---

<div align="center">

**⭐ If you find SoroOne helpful, please give it a star! ⭐**

Made with ❤️ by the SoroOne Team

[Download on Google Play Store](#) | [View Documentation](./docs/) | [Report Issues](https://github.com/xt67/SoroOne-main/issues)

</div>
