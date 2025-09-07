# 🛡️ GitHub Repository Setup Guide

## 🔧 **Repository Settings Configuration**

### 1. **Basic Repository Settings**
Navigate to: `Settings` tab in your GitHub repository

#### General Settings:
- [x] ✅ **Repository name**: `Dashly-1.0`
- [x] ✅ **Description**: "📊 Dashly - Data Analytics & Visualization for Mobile"
- [x] ✅ **Website**: `https://dashly.app` (optional)
- [x] ✅ **Topics**: `react-native`, `expo`, `data-visualization`, `analytics`, `mobile-app`, `typescript`, `dashboard`, `charts`

#### Features to Enable:
- [x] ✅ **Wikis**: For additional documentation
- [x] ✅ **Issues**: For bug reports and feature requests
- [x] ✅ **Sponsorships**: For funding (optional)
- [x] ✅ **Preserve this repository**: Make it archivable
- [x] ✅ **Discussions**: For community interaction

#### Features to Disable:
- [ ] **Projects**: Can enable later for roadmap tracking
- [ ] **Security and analysis**: Will configure separately

### 2. **Branch Protection Rules**
Navigate to: `Settings` → `Branches` → `Add rule`

#### For `main` branch:
```
Branch name pattern: main

Protect matching branches:
☑️ Require a pull request before merging
  ☑️ Require approvals: 1
  ☑️ Dismiss stale PR approvals when new commits are pushed
  ☑️ Require review from CODEOWNERS

☑️ Require status checks to pass before merging
  ☑️ Require branches to be up to date before merging
  Required status checks:
    - 🔍 Lint & Test
    - 🔧 TypeScript Check
    - 📱 Expo Check
    - 🔒 Security Audit

☑️ Require conversation resolution before merging
☑️ Require signed commits (optional)
☑️ Require linear history
☑️ Include administrators

☐ Allow force pushes
☐ Allow deletions
```

### 3. **Issue Labels Setup**
Navigate to: `Issues` → `Labels`

#### Recommended Labels:
```yaml
# Type Labels
- name: "bug"
  color: "d73a4a"
  description: "Something isn't working"

- name: "enhancement"
  color: "a2eeef"
  description: "New feature or request"

- name: "documentation"
  color: "0075ca"
  description: "Improvements or additions to documentation"

- name: "good first issue"
  color: "7057ff"
  description: "Good for newcomers"

- name: "help wanted"
  color: "008672"
  description: "Extra attention is needed"

# Priority Labels
- name: "priority: high"
  color: "d93f0b"
  description: "High priority issue"

- name: "priority: medium"
  color: "fbca04"
  description: "Medium priority issue"

- name: "priority: low"
  color: "0e8a16"
  description: "Low priority issue"

# Component Labels
- name: "component: ui"
  color: "c2e0c6"
  description: "User interface related"

- name: "component: data"
  color: "f9d0c4"
  description: "Data processing related"

- name: "component: charts"
  color: "fef2c0"
  description: "Chart/visualization related"

# Status Labels
- name: "status: needs-triage"
  color: "ededed"
  description: "Needs initial review"

- name: "status: in-progress"
  color: "fbca04"
  description: "Currently being worked on"

- name: "status: blocked"
  color: "d93f0b"
  description: "Blocked by other issues"
```

### 4. **GitHub Actions Secrets**
Navigate to: `Settings` → `Secrets and variables` → `Actions`

#### Repository Secrets (Add later when needed):
```
EXPO_TOKEN          # For Expo builds
CODECOV_TOKEN       # For code coverage
PLAY_STORE_KEY      # For Play Store publishing
APP_STORE_KEY       # For App Store publishing
SLACK_WEBHOOK       # For notifications (optional)
```

### 5. **Security Settings**
Navigate to: `Settings` → `Security`

#### Enable:
- [x] ✅ **Private vulnerability reporting**: Allow security researchers to report issues
- [x] ✅ **Dependency graph**: Track dependencies
- [x] ✅ **Dependabot alerts**: Get notified of vulnerabilities
- [x] ✅ **Dependabot security updates**: Auto-fix security issues
- [x] ✅ **Dependabot version updates**: Keep dependencies updated

#### Dependabot Configuration:
Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    assignees:
      - "xt67"
    commit-message:
      prefix: "deps"
    labels:
      - "dependencies"
```

### 6. **GitHub Pages (Optional)**
Navigate to: `Settings` → `Pages`

#### For Documentation:
- **Source**: Deploy from a branch
- **Branch**: `main` / `docs` folder
- **Custom domain**: `docs.dashly.app` (optional)

### 7. **Discussions Setup**
Navigate to: `Discussions` tab

#### Categories to Create:
- **💡 Ideas**: Feature requests and suggestions
- **❓ Q&A**: Questions and help
- **📢 Announcements**: Project updates
- **🎉 Show and tell**: Community showcases
- **👥 General**: General discussion

### 8. **Repository Insights**
Navigate to: `Insights` tab

#### Configure:
- **Community Standards**: Ensure all files are present
- **Traffic**: Monitor repository visits
- **Contributors**: Track contributor activity
- **Dependency graph**: Monitor dependencies

## 🎯 **Action Items Checklist**

### Immediate Setup:
- [ ] Add repository description and topics
- [ ] Enable Issues, Wikis, and Discussions
- [ ] Set up branch protection for `main`
- [ ] Create issue labels
- [ ] Configure Dependabot

### Later Setup:
- [ ] Add repository secrets for CI/CD
- [ ] Set up GitHub Pages for documentation
- [ ] Configure discussions categories
- [ ] Add CODEOWNERS file

### Community Building:
- [ ] Pin important issues
- [ ] Create welcome message for new contributors
- [ ] Set up project boards for roadmap
- [ ] Add social media links

## 📋 **Files to Create**

### CODEOWNERS
```
# Global owners
* @xt67

# Specific areas
/src/components/ @xt67
/src/screens/ @xt67
/.github/ @xt67
/docs/ @xt67
```

### .github/FUNDING.yml (Optional)
```yaml
# Funding options
github: [xt67]
patreon: dashly
ko_fi: dashly
```

---

**Next Steps**: Follow this guide to configure your GitHub repository for professional open-source development! 🚀
