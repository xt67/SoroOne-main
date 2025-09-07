# GitHub Repository Configuration Guide

This guide will help you configure your GitHub repository with all the necessary settings for a professional open-source project.

## Step 1: Basic Repository Settings

1. Go to your repository's **Settings** tab
2. Under **General**:
   - Set repository visibility to **Public**
   - Enable **Issues**
   - Enable **Projects**
   - Enable **Wiki**
   - Enable **Discussions** (recommended for community)
   - Disable **Packages** (unless needed)

## Step 2: Branch Protection Rules

1. Go to **Settings** → **Branches**
2. Click **Add rule** for the `main` branch
3. Configure the following:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1
   - ✅ Dismiss stale reviews when new commits are pushed
   - ✅ Require review from code owners
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select status checks: `lint`, `type-check`, `expo-doctor`, `security-audit`
   - ✅ Require conversation resolution before merging
   - ✅ Include administrators
   - ✅ Allow force pushes (for maintainers only)
   - ✅ Allow deletions

## Step 3: Repository Labels

Go to **Issues** → **Labels** and add these labels:

### Priority Labels
- `priority: critical` - #d73a4a (red)
- `priority: high` - #ff9500 (orange)
- `priority: medium` - #fbca04 (yellow)
- `priority: low` - #0e8a16 (green)

### Type Labels
- `type: bug` - #d73a4a (red)
- `type: feature` - #0075ca (blue)
- `type: enhancement` - #a2eeef (light blue)
- `type: documentation` - #0052cc (dark blue)
- `type: question` - #d876e3 (purple)

### Status Labels
- `status: needs-triage` - #fbca04 (yellow)
- `status: in-progress` - #ff9500 (orange)
- `status: needs-review` - #0075ca (blue)
- `status: blocked` - #d73a4a (red)

### Area Labels
- `area: ui/ux` - #e99695 (light red)
- `area: data-processing` - #c2e0c6 (light green)
- `area: charts` - #bfd4f2 (light blue)
- `area: ai-insights` - #f9d0c4 (light orange)
- `area: sql-editor` - #d4c5f9 (light purple)

### Special Labels
- `good first issue` - #7057ff (purple)
- `help wanted` - #008672 (teal)
- `dependencies` - #0366d6 (blue)
- `automerge` - #0e8a16 (green)
- `breaking-change` - #b60205 (dark red)
- `duplicate` - #cfd3d7 (gray)
- `invalid` - #e4e669 (light yellow)
- `wontfix` - #ffffff (white)

## Step 4: Repository Secrets

Go to **Settings** → **Secrets and variables** → **Actions**

Add these secrets:
- `EXPO_TOKEN` - Your Expo access token for builds
- `ANDROID_KEYSTORE` - Base64 encoded Android keystore (for release builds)
- `ANDROID_KEYSTORE_PASSWORD` - Keystore password
- `ANDROID_KEY_ALIAS` - Key alias
- `ANDROID_KEY_PASSWORD` - Key password

## Step 5: Code Security and Analysis

1. Go to **Settings** → **Code security and analysis**
2. Enable:
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ CodeQL analysis (if available)

## Step 6: Repository Topics

Go to the main repository page and add these topics:
- `react-native`
- `expo`
- `typescript`
- `data-visualization`
- `analytics`
- `mobile-app`
- `dashboard`
- `charts`
- `sql-editor`
- `ai-insights`
- `csv-import`
- `excel-import`

## Step 7: Social Preview

1. Go to **Settings** → **General**
2. Upload a social preview image (1280x640px)
3. Add a description: "📊 Dashly - Modern mobile analytics app for data visualization, AI insights, and SQL editing"

## Step 8: Repository README

Ensure your README.md includes:
- ✅ Project description and features
- ✅ Screenshots/demo
- ✅ Installation instructions
- ✅ Usage guide
- ✅ Contributing guidelines
- ✅ License information
- ✅ Badges (build status, license, etc.)

## Step 9: Community Standards

Check **Insights** → **Community** to ensure you have:
- ✅ Description
- ✅ README
- ✅ Code of conduct
- ✅ Contributing guidelines
- ✅ License
- ✅ Issue templates
- ✅ Pull request template
- ✅ Security policy

## Step 10: Project Boards (Optional)

1. Go to **Projects** tab
2. Create a new project board with columns:
   - Backlog
   - To Do
   - In Progress
   - Review
   - Done

## Step 11: Discussions (Recommended)

1. Enable Discussions in repository settings
2. Create categories:
   - General
   - Ideas
   - Q&A
   - Show and tell
   - Announcements

## Final Checklist

Before announcing your repository:
- [ ] All CI/CD checks are passing
- [ ] Documentation is complete and accurate
- [ ] License is appropriate for your use case
- [ ] Contributing guidelines are clear
- [ ] Issue templates are helpful
- [ ] Security policy is in place
- [ ] Branch protection is configured
- [ ] Repository is properly tagged with topics
- [ ] README has clear installation and usage instructions
- [ ] Code quality tools are configured and running

## Maintenance Tasks

Set up regular maintenance:
- Monitor Dependabot PRs weekly
- Review and respond to issues promptly
- Update documentation as features change
- Tag releases with semantic versioning
- Maintain changelog with each release

---

Once you've completed these steps, your repository will be ready for community contributions and professional collaboration!
