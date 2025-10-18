#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');

const URLS = [
  'http://localhost:8080/',
  'http://localhost:8080/properties',
  'http://localhost:8080/services',
  'http://localhost:8080/contact',
];

const BASE_URL = process.argv[2] || 'https://rcbridge.co';

console.log('================================');
console.log('Accessibility Audit with Pa11y');
console.log('================================\n');

function runPa11y(url) {
  return new Promise((resolve, reject) => {
    const command = `npx pa11y "${url}" --runner axe --reporter json`;
    
    exec(command, (error, stdout, stderr) => {
      if (stderr && !stderr.includes('Deprecation')) {
        console.error(`Error for ${url}:`, stderr);
      }
      
      try {
        const results = JSON.parse(stdout);
        resolve({ url, results });
      } catch (e) {
        // If parsing fails, it might still be valid but with warnings
        resolve({ url, results: [], error: e.message });
      }
    });
  });
}

async function auditAllPages() {
  console.log(`Testing ${URLS.length} pages...\n`);
  
  const results = [];
  
  for (const path of URLS) {
    const url = BASE_URL.includes('localhost') ? path : `${BASE_URL}${path.replace('http://localhost:8080', '')}`;
    console.log(`Auditing: ${url}`);
    
    const result = await runPa11y(url);
    results.push(result);
    
    if (result.results && result.results.length > 0) {
      console.log(`  ✗ Found ${result.results.length} issue(s)`);
      
      // Show first 3 issues
      result.results.slice(0, 3).forEach((issue, i) => {
        console.log(`    ${i + 1}. ${issue.message}`);
        console.log(`       Context: ${issue.context || 'N/A'}`);
      });
      
      if (result.results.length > 3) {
        console.log(`    ... and ${result.results.length - 3} more`);
      }
    } else {
      console.log('  ✓ No accessibility issues found');
    }
    console.log('');
  }
  
  // Generate summary
  const totalIssues = results.reduce((sum, r) => sum + (r.results?.length || 0), 0);
  
  console.log('================================');
  console.log('Audit Summary');
  console.log('================================');
  console.log(`Total pages tested: ${results.length}`);
  console.log(`Total issues found: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('Status: ✓ PASS - All pages accessible');
  } else {
    console.log('Status: ⚠ REVIEW NEEDED - Issues detected');
  }
  console.log('================================\n');
  
  // Save detailed report
  fs.writeFileSync(
    'accessibility-report.json',
    JSON.stringify(results, null, 2)
  );
  console.log('Detailed report saved to: accessibility-report.json');
  
  return totalIssues === 0;
}

// Check if Pa11y is installed
exec('npx pa11y --version', (error) => {
  if (error) {
    console.error('Pa11y is not installed. Installing...');
    exec('npm install -g pa11y', (installError) => {
      if (installError) {
        console.error('Failed to install Pa11y:', installError);
        process.exit(1);
      }
      auditAllPages().then(passed => process.exit(passed ? 0 : 1));
    });
  } else {
    auditAllPages().then(passed => process.exit(passed ? 0 : 1));
  }
});
