#!/usr/bin/env node
// Script to generate both French and English PDFs using Puppeteer

const puppeteer = require('puppeteer');
const fs = require('fs');

const URL = 'http://127.0.0.1:4000/cv/';
const OUTPUT_FR = 'files/CV_Loic_Maurin_FR.pdf';
const OUTPUT_EN = 'files/CV_Loic_Maurin_EN.pdf';

const pdfOptions = {
    format: 'A4',
    printBackground: true,
    margin: {
        top: '1.5cm',
        right: '1.5cm',
        bottom: '1.5cm',
        left: '1.5cm'
    },
    preferCSSPageSize: true
};

async function generatePDF(lang, outputPath) {
    console.log(`\n📄 Generating ${lang.toUpperCase()} PDF...`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

        // Navigate to the page
        await page.goto(URL, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Switch language if needed
        if (lang === 'en') {
            await page.evaluate(() => {
                if (typeof switchLanguage === 'function') {
                    switchLanguage('en');
                }
            });
            // Wait for content to update
            await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
            // Wait a bit for French version to fully load
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Generate PDF
        await page.pdf({
            ...pdfOptions,
            path: outputPath
        });

        if (fs.existsSync(outputPath)) {
            const stats = fs.statSync(outputPath);
            const fileSizeInBytes = stats.size;
            const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
            console.log(`✓ ${lang.toUpperCase()} PDF generated: ${outputPath} (${fileSizeInMB} MB)`);
        } else {
            console.log(`✗ Failed to generate ${lang.toUpperCase()} PDF`);
        }
    } catch (error) {
        console.error(`Error generating ${lang.toUpperCase()} PDF:`, error.message);
    } finally {
        await browser.close();
    }
}

async function main() {
    console.log('🚀 CV PDF Export Tool - Bilingual\n');

    // Check if server is running
    try {
        const http = require('http');
        await new Promise((resolve, reject) => {
            const req = http.get(URL, (res) => {
                if (res.statusCode === 200) {
                    console.log('✓ Jekyll server is running');
                    resolve();
                } else {
                    reject(new Error('Server not responding'));
                }
            });
            req.on('error', reject);
            req.end();
        });
    } catch (error) {
        console.error('❌ Jekyll server is not running at', URL);
        console.error('Please start Jekyll server first: ./serve.sh');
        process.exit(1);
    }

    // Generate both PDFs
    await generatePDF('fr', OUTPUT_FR);
    await generatePDF('en', OUTPUT_EN);

    // Copy to _site/files if it exists
    if (fs.existsSync('_site/files')) {
        const frBasename = OUTPUT_FR.split('/').pop();
        const enBasename = OUTPUT_EN.split('/').pop();
        fs.copyFileSync(OUTPUT_FR, `_site/files/${frBasename}`);
        fs.copyFileSync(OUTPUT_EN, `_site/files/${enBasename}`);
        console.log('\n✓ PDFs copied to _site/files/');
    }

    console.log('\n✅ Done! Generated PDFs:');
    console.log(`  📄 ${OUTPUT_FR}`);
    console.log(`  📄 ${OUTPUT_EN}`);
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
