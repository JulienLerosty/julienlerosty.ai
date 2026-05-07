#!/usr/bin/env bash
set -e
echo "🔒 Running security checks..."
npm run secscan
echo "✅ Security checks passed"
