# CI/CD Setup Documentation

This document explains the GitHub Actions workflows configured for this repository.

## Overview

There are 3 GitHub Actions workflows:

1. **pages.yml** - Main GitHub Pages deployment
2. **build-cv-pdfs.yml** - Automated CV PDF generation
3. **scrape_talks.yml** - Talk locations scraper

## 1. GitHub Pages Deployment (pages.yml)

**Purpose:** Builds and deploys the Jekyll site to GitHub Pages

**Triggers:**
- Push to `master` branch
- Manual dispatch via GitHub UI

**What it does:**
1. Checks out the repository
2. Sets up Ruby 3.3 with bundler cache
3. Builds the Jekyll site with production settings
4. Uploads the built site as a Pages artifact
5. Deploys to GitHub Pages

**Ruby Version:** 3.3 (stable and compatible)
**Jekyll Version:** 4.4.1 (from Gemfile)

**Key Features:**
- Uses Ruby 3.3 instead of 4.0 for better stability in production
- Includes the Ruby 4.0 compatibility patch via `_plugins/ruby_4_compat.rb`
- Properly configured for Jekyll 4.x with all required plugins

## 2. CV PDF Generation (build-cv-pdfs.yml)

**Purpose:** Automatically generates French and English PDF versions of the CV

**Triggers:**
- Push to `master` when CV-related files change:
  - `_data/cv_*.yml`
  - `_pages/cv-bilingual.html`
  - `_layouts/cv.html`
  - `export_pdfs_both.js`
  - `package.json`
- Manual dispatch via GitHub UI

**What it does:**
1. Checks out the repository
2. Sets up Ruby 3.3 and Node.js 20
3. Installs dependencies (bundle and npm)
4. Builds the Jekyll site
5. Starts a local Jekyll server
6. Generates PDFs using Puppeteer:
   - `files/CV_Loic_Maurin_FR.pdf`
   - `files/CV_Loic_Maurin_EN.pdf`
7. Commits the PDFs back to the repository
8. Pushes changes (marked with `[skip ci]` to avoid loops)

**Dependencies:**
- **Ruby gems:** jekyll, jekyll-plugins (see Gemfile)
- **Node packages:** puppeteer (see package.json)

**Notes:**
- Removed npm cache since no lock file exists
- Uses `[skip ci]` in commit message to prevent infinite loops
- PDFs are committed to `files/` directory

## 3. Talk Locations Scraper (scrape_talks.yml)

**Purpose:** Updates talk locations from talks data

**Triggers:**
- Push to files in:
  - `talks/**`
  - `_talks/**`
  - `talkmap.ipynb`

**What it does:**
1. Runs Jupyter notebook to process talk locations
2. Commits and pushes changes

## GitHub Pages Configuration

### Required Settings

In your GitHub repository settings (Settings → Pages):
- **Source:** GitHub Actions (not "Deploy from a branch")
- **Custom domain:** (optional)

This allows the `pages.yml` workflow to deploy directly.

### Branch Protection

Consider setting up branch protection on `master`:
- Require status checks to pass before merging
- Select: "Deploy Jekyll site to Pages"

## Troubleshooting

### Build Failures

**Problem:** Ruby 4.0 compatibility errors
**Solution:** The `_plugins/ruby_4_compat.rb` file patches the missing `tainted?` methods. This should work automatically.

**Problem:** Missing dependencies
**Solution:** Ensure Gemfile includes all required gems:
```ruby
gem 'csv'
gem 'bigdecimal'
gem 'base64'
gem 'logger'
gem 'jekyll', '~> 4.3'
```

**Problem:** PDF generation fails
**Solution:**
- Check that Jekyll server starts successfully
- Verify the CV page is accessible at `/cv/`
- Check Puppeteer installation logs

### Workflow Not Running

**Pages workflow not deploying:**
1. Check Settings → Pages → Source is set to "GitHub Actions"
2. Verify the workflow file is in `.github/workflows/`
3. Check workflow logs for errors

**PDF workflow not running:**
1. Verify you're pushing changes to CV-related files
2. Try manual dispatch from Actions tab
3. Check permissions are set correctly

### Lock File Warning

If you see:
```
Dependencies lock file is not found in /home/runner/work/...
Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```

**Solution:** This is expected. We removed `cache: 'npm'` from the workflow since we don't have a lock file. To add caching:

```bash
# Generate lock file
npm install
git add package-lock.json
git commit -m "Add npm lock file"
```

Then update workflow to include `cache: 'npm'`.

## Local Testing

Before pushing, test locally:

```bash
# Test Jekyll build
bundle exec jekyll build

# Test Jekyll serve
bundle exec jekyll serve

# Test PDF generation (requires Jekyll server running)
npm install
npm run export
```

## Workflow Improvements

Potential enhancements:
1. Add PDF generation caching to speed up workflow
2. Add tests before deployment
3. Generate PDFs during main build instead of separate workflow
4. Add deployment status badges to README

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jekyll 4.x Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages + Jekyll 4](https://github.com/actions/starter-workflows/blob/main/pages/jekyll.yml)
- [Puppeteer Documentation](https://pptr.dev/)
