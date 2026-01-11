# Bilingual CV Integration

This document explains the bilingual CV system integrated into your Academic Pages website.

## Overview

The CV section has been integrated from [cv_maurinl26](https://github.com/maurinl26/cv_maurinl26) with the following features:
- ✅ Bilingual support (French/English) with instant language switching
- ✅ PDF generation for both languages
- ✅ Integrated with Academic Pages theme and styling
- ✅ Print-optimized layout for 2-page A4 format
- ✅ Automatic PDF generation via GitHub Actions

## File Structure

```
├── _data/
│   ├── cv_fr.yml           # French CV content
│   ├── cv_en.yml           # English CV content
│   └── translations.yml    # UI labels (buttons, section titles)
├── _layouts/
│   └── cv.html             # CV layout with integrated styles
├── _pages/
│   ├── cv-bilingual.html   # Main CV page
│   └── cv-old.md.backup    # Backup of original CV
├── images/
│   └── profil.jpg          # Profile photo
├── files/
│   ├── CV_Loic_Maurin_FR.pdf   # Generated French PDF
│   └── CV_Loic_Maurin_EN.pdf   # Generated English PDF
├── .github/workflows/
│   └── build-cv-pdfs.yml   # Auto-generate PDFs on changes
├── export_pdfs_both.js     # Node.js script for PDF generation
├── export_pdfs.sh          # Bash wrapper for PDF generation
└── package.json            # Updated with puppeteer dependency
```

## How to Update Your CV

### 1. Edit CV Content

**French version:**
```bash
vim _data/cv_fr.yml
```

**English version:**
```bash
vim _data/cv_en.yml
```

### 2. Local Development

Start Jekyll server:
```bash
bundle exec jekyll serve
```

Visit: http://localhost:4000/cv/

### 3. Generate PDFs Locally

**Option 1: Using npm**
```bash
npm install  # First time only
npm run export
```

**Option 2: Using bash script**
```bash
./export_pdfs.sh
```

The PDFs will be generated in `files/`:
- `files/CV_Loic_Maurin_FR.pdf`
- `files/CV_Loic_Maurin_EN.pdf`

### 4. Automatic PDF Generation

When you push changes to the following files on the `master` branch:
- `_data/cv_*.yml`
- `_pages/cv-bilingual.html`
- `_layouts/cv.html`
- `export_pdfs_both.js`

GitHub Actions will automatically:
1. Build the Jekyll site
2. Generate both PDF versions
3. Commit them to the repository

You can also manually trigger the workflow from the Actions tab on GitHub.

## Features

### Language Switching
- Click the language button (top right) to switch between French and English
- All content updates instantly without page reload
- PDF download link updates to match selected language

### PDF Generation
- Professional A4 format optimized for 2 pages
- Print-friendly layout (hides navigation, buttons, etc.)
- Maintains gradient header with contact info
- Compressed spacing for maximum content density

### Styling
- Integrates seamlessly with Academic Pages "air" theme
- Responsive design (mobile-friendly)
- Dark/light mode compatible
- Print-optimized CSS with proper page breaks

## Customization

### Colors
The main colors are defined in `_layouts/cv.html`:
- Primary gradient: `#667eea` to `#764ba2`
- You can change these in the CSS section of the layout

### PDF Layout
Adjust PDF settings in `export_pdfs_both.js`:
```javascript
const pdfOptions = {
    format: 'A4',
    printBackground: true,
    margin: {
        top: '1.5cm',
        right: '1.5cm',
        bottom: '1.5cm',
        left: '1.5cm'
    }
};
```

### Profile Photo
Replace `images/profil.jpg` with your photo (square format recommended, 300x300px or larger)

## Navigation

The CV is accessible at:
- Local: http://localhost:4000/cv/
- Production: https://maurinl26.github.io/cv/

The old CV page has been backed up to `_pages/cv-old.md.backup`

## Troubleshooting

### PDFs not generating
1. Ensure Jekyll server is running: `bundle exec jekyll serve`
2. Check if puppeteer is installed: `npm install`
3. Verify the CV page loads at http://localhost:4000/cv/

### Language switching not working
1. Check browser console for JavaScript errors
2. Ensure both `cv_fr.yml` and `cv_en.yml` have the same structure
3. Verify translations.yml has all required keys

### Styling issues
1. Clear browser cache
2. Rebuild Jekyll: `bundle exec jekyll clean && bundle exec jekyll build`
3. Check that `_layouts/cv.html` is being used by the page

## Dependencies

**Ruby (Jekyll):**
- jekyll (~> 4.3)
- See Gemfile for full list

**Node.js:**
- puppeteer (^21.0.0) - for PDF generation
- See package.json for full list

## Resources

- Original CV repo: https://github.com/maurinl26/cv_maurinl26
- Academic Pages: https://github.com/academicpages/academicpages.github.io
- Jekyll documentation: https://jekyllrb.com/docs/
- Puppeteer documentation: https://pptr.dev/
