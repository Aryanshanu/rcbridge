#!/bin/bash

echo "=================================="
echo "Dependency Security Audit"
echo "=================================="
echo ""

# Run npm audit
echo "Running npm audit..."
npm audit --json > audit-results.json

# Check audit results
if [ $? -eq 0 ]; then
  echo "✓ No vulnerabilities found"
else
  echo "⚠ Vulnerabilities detected"
  
  # Parse and display summary
  if command -v jq &> /dev/null; then
    echo ""
    echo "Vulnerability Summary:"
    jq '.metadata.vulnerabilities' audit-results.json
    echo ""
    echo "High severity issues:"
    jq '.vulnerabilities | to_entries[] | select(.value.severity == "high")' audit-results.json
  fi
fi

echo ""
echo "Full report saved to: audit-results.json"
echo ""

# Check for outdated packages
echo "Checking for outdated packages..."
npm outdated || echo "All packages up to date"

echo ""
echo "=================================="
echo "Audit complete"
echo "=================================="
