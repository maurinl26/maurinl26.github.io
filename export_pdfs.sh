#!/bin/bash
# Generate both French and English PDFs

set -e

echo "🚀 Generating FR and EN PDFs..."
echo ""

# Check if Jekyll is running
if ! curl -s --head "http://127.0.0.1:4000" | grep "200 OK" > /dev/null; then
    echo "❌ Jekyll server is not running"
    echo "Please start it first: ./serve.sh"
    exit 1
fi

# Generate PDFs using Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

node export_pdfs_both.js

echo ""
echo "✅ Done! PDFs generated:"
echo "  📄 CV_Loic_Maurin_FR.pdf"
echo "  📄 CV_Loic_Maurin_EN.pdf"
