#!/usr/bin/env node

const https = require('https');
const http = require('http');

const REQUIRED_HEADERS = {
  'strict-transport-security': {
    required: true,
    description: 'HSTS - Forces HTTPS connections',
  },
  'x-frame-options': {
    required: true,
    description: 'Prevents clickjacking attacks',
  },
  'x-content-type-options': {
    required: true,
    description: 'Prevents MIME sniffing',
  },
  'content-security-policy': {
    required: true,
    description: 'Controls resource loading',
  },
  'referrer-policy': {
    required: false,
    description: 'Controls referrer information',
  },
  'permissions-policy': {
    required: false,
    description: 'Controls browser features',
  },
};

function checkHeaders(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const req = client.get(url, (res) => {
      const headers = res.headers;
      const results = {
        url,
        statusCode: res.statusCode,
        headers: {},
        missing: [],
        warnings: [],
      };

      // Check each required header
      Object.entries(REQUIRED_HEADERS).forEach(([header, config]) => {
        const headerValue = headers[header];
        
        if (headerValue) {
          results.headers[header] = {
            value: headerValue,
            present: true,
            description: config.description,
          };
        } else {
          results.headers[header] = {
            present: false,
            required: config.required,
            description: config.description,
          };
          
          if (config.required) {
            results.missing.push(header);
          } else {
            results.warnings.push(header);
          }
        }
      });

      resolve(results);
    });

    req.on('error', reject);
    req.end();
  });
}

function formatResults(results) {
  console.log('\n' + '='.repeat(60));
  console.log(`Security Headers Check: ${results.url}`);
  console.log('='.repeat(60));
  console.log(`Status Code: ${results.statusCode}\n`);

  console.log('✓ Present Headers:');
  Object.entries(results.headers).forEach(([header, info]) => {
    if (info.present) {
      console.log(`  ✓ ${header}: ${info.value.substring(0, 80)}${info.value.length > 80 ? '...' : ''}`);
    }
  });

  if (results.missing.length > 0) {
    console.log('\n✗ Missing Required Headers:');
    results.missing.forEach((header) => {
      const info = results.headers[header];
      console.log(`  ✗ ${header}: ${info.description}`);
    });
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠ Missing Optional Headers:');
    results.warnings.forEach((header) => {
      const info = results.headers[header];
      console.log(`  ⚠ ${header}: ${info.description}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  
  const score = ((Object.keys(results.headers).length - results.missing.length) / Object.keys(results.headers).length) * 100;
  console.log(`Security Score: ${score.toFixed(0)}%`);
  
  if (results.missing.length === 0) {
    console.log('Status: ✓ PASS - All required headers present');
  } else {
    console.log(`Status: ✗ FAIL - ${results.missing.length} required header(s) missing`);
  }
  console.log('='.repeat(60) + '\n');

  return results.missing.length === 0;
}

// Main execution
const targetUrl = process.argv[2] || 'https://rcbridge.co/';

console.log(`Checking security headers for: ${targetUrl}`);

checkHeaders(targetUrl)
  .then((results) => {
    const passed = formatResults(results);
    process.exit(passed ? 0 : 1);
  })
  .catch((error) => {
    console.error('Error checking headers:', error.message);
    process.exit(1);
  });
