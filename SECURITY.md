# Security Policy

## 🔒 Supported Versions

We actively support the following versions of Dashly with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | ✅ Fully supported |
| 1.0.x   | ⚠️ Security fixes only |
| < 1.0   | ❌ No longer supported |

## 🚨 Reporting a Vulnerability

We take security seriously and appreciate responsible disclosure of security vulnerabilities.

### 📧 How to Report

**For security issues, please do NOT open a public GitHub issue.**

Instead, please report security vulnerabilities by emailing:
- **Email**: security@dashly.app
- **Subject**: [SECURITY] Brief description of the issue

### 📋 What to Include

When reporting a security vulnerability, please include:

1. **Description**: Clear description of the vulnerability
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Impact**: Potential impact and attack scenarios
4. **Affected Versions**: Which versions are affected
5. **Suggested Fix**: If you have ideas for mitigation
6. **Contact Info**: How we can reach you for follow-up

### 🔄 Response Process

1. **Acknowledgment**: We'll acknowledge receipt within 24 hours
2. **Initial Assessment**: Initial assessment within 72 hours
3. **Investigation**: Thorough investigation and fix development
4. **Disclosure**: Coordinated disclosure after fix is available
5. **Recognition**: Optional recognition in security hall of fame

### ⏱️ Timeline Expectations

- **Critical**: Fix within 7 days
- **High**: Fix within 14 days
- **Medium**: Fix within 30 days
- **Low**: Fix in next minor release

## 🛡️ Security Best Practices

### For Users

- **Keep Updated**: Always use the latest version of Dashly
- **Secure Device**: Keep your device OS updated
- **Data Privacy**: Be cautious with sensitive data uploads
- **App Permissions**: Review and understand app permissions

### For Developers

- **Code Review**: All code changes require security review
- **Dependencies**: Regular dependency security audits
- **Data Handling**: Follow secure coding practices
- **Testing**: Include security testing in CI/CD pipeline

## 🔐 Security Features

### Data Protection
- **Local Processing**: All data processing happens locally on device
- **No Cloud Storage**: User data is never stored on external servers
- **Encryption**: Sensitive data is encrypted at rest
- **Secure Transport**: All network communications use HTTPS/TLS

### Privacy Protection
- **Minimal Permissions**: App requests only necessary permissions
- **No Tracking**: No user tracking or analytics without consent
- **Data Isolation**: User data is isolated and sandboxed
- **Clear Policies**: Transparent privacy policy and data handling

### App Security
- **Code Obfuscation**: Production builds use code obfuscation
- **Certificate Pinning**: Network security with certificate pinning
- **Secure Storage**: Sensitive app data uses secure storage APIs
- **Regular Audits**: Regular security audits and penetration testing

## 🏆 Security Hall of Fame

We recognize security researchers who help make Dashly more secure:

*Currently empty - be the first contributor!*

## 📚 Security Resources

### Guidelines
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [React Native Security](https://reactnative.dev/docs/security)
- [Expo Security Best Practices](https://docs.expo.dev/guides/security/)

### Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [OWASP ZAP](https://www.zaproxy.org/)

## 📞 Contact

For any security-related questions or concerns:
- **Security Email**: security@dashly.app
- **General Contact**: support@dashly.app
- **Website**: https://dashly.app/security

---

**Thank you for helping keep Dashly and our users secure! 🙏**
