# Contributing to Dashly

Thank you for your interest in contributing to Dashly! We welcome contributions from developers of all skill levels.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- Git
- Expo CLI (`npm install -g @expo/cli`)

### Setup Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Dashly-1.0.git
   cd Dashly-1.0
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/xt67/Dashly-1.0.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Start development server**:
   ```bash
   npm start
   ```

## 📋 How to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/xt67/Dashly-1.0/issues) to avoid duplicates.

**Great bug reports include:**
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or GIFs if applicable
- Device/platform information
- App version and environment details

### 💡 Suggesting Features

We love feature suggestions! Please check existing issues first, then:

1. Open a new issue with the "enhancement" label
2. Describe the feature and its benefits
3. Explain the use case
4. Include mockups or examples if helpful

### 🔧 Code Contributions

#### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test thoroughly**:
   ```bash
   npm test
   npm run lint
   ```

4. **Commit with conventional format**:
   ```bash
   git commit -m "feat: add new chart type support"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with:
   - Clear title and description
   - Link to related issues
   - Screenshots/GIFs for UI changes
   - Testing notes

#### Commit Message Convention

We use [Conventional Commits](https://conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add dark mode support
fix: resolve chart rendering issue on Android
docs: update installation instructions
```

## 📏 Coding Standards

### TypeScript Guidelines
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use descriptive variable and function names

### React Native Best Practices
- Follow React hooks best practices
- Use functional components
- Implement proper error boundaries
- Optimize for performance (memoization, lazy loading)

### Code Style
- Use Prettier for formatting (configured in `.prettierrc`)
- Follow ESLint rules (configured in `.eslintrc.js`)
- Use meaningful component and variable names
- Add JSDoc comments for complex functions

### File Organization
```
src/
├── components/     # Reusable UI components
├── screens/       # Screen components
├── navigation/    # Navigation setup
├── services/      # Business logic
├── utils/         # Helper functions
├── types/         # TypeScript definitions
├── styles/        # Theme and styling
└── hooks/         # Custom React hooks
```

## 🧪 Testing

### Running Tests
```bash
npm test              # Run all tests
npm test -- --watch  # Run tests in watch mode
npm test -- --coverage  # Run with coverage report
```

### Writing Tests
- Write unit tests for utility functions
- Test components with React Native Testing Library
- Include integration tests for complex features
- Test edge cases and error scenarios

### Test Structure
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interactions', () => {
    // Test implementation
  });
});
```

## 🎨 Design Guidelines

### UI/UX Principles
- Follow React Native design patterns
- Ensure accessibility (screen readers, keyboard navigation)
- Maintain consistency with existing design system
- Support both light and dark themes
- Optimize for various screen sizes

### Color Schemes
Use the predefined color schemes in `src/styles/theme.ts`:
- Default, Ocean, Forest, Sunset, Purple, Monochrome
- Always use theme colors via `useTheme()` hook
- Ensure sufficient contrast for accessibility

## 📱 Platform Considerations

### iOS Specific
- Test on multiple iOS versions
- Follow iOS Human Interface Guidelines
- Handle safe areas properly
- Test on various device sizes

### Android Specific
- Test on multiple Android versions
- Follow Material Design principles
- Handle different screen densities
- Test hardware back button behavior

### Web Specific
- Ensure responsive design
- Test keyboard navigation
- Optimize for different browsers
- Handle touch vs mouse interactions

## 🔍 Code Review Process

### What We Look For
- Code quality and maintainability
- Performance implications
- Security considerations
- Accessibility compliance
- Test coverage
- Documentation updates

### Review Timeline
- Initial review within 2-3 business days
- Follow-up reviews within 1 business day
- Merge after approval from maintainers

## 🆘 Getting Help

### Where to Ask Questions
- **General questions**: [GitHub Discussions](https://github.com/xt67/Dashly-1.0/discussions)
- **Bug reports**: [GitHub Issues](https://github.com/xt67/Dashly-1.0/issues)
- **Development help**: Comment on your PR or issue

### Documentation
- [Project README](./README.md)
- [API Documentation](./docs/api.md)
- [Design Specifications](./docs/app-design-specification.md)

## 🏆 Recognition

Contributors are recognized in:
- GitHub contributors list
- App credits (Settings → About)
- Release notes for significant contributions

## 📜 License

By contributing to Dashly, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Dashly better! 🎉
