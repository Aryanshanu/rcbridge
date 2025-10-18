#!/usr/bin/env node

const https = require('https');
const http = require('http');

const ENDPOINTS = [
  { name: 'Homepage', url: 'https://rcbridge.co/' },
  { name: 'Properties', url: 'https://rcbridge.co/properties' },
  { name: 'Services', url: 'https://rcbridge.co/services' },
  { name: 'Contact', url: 'https://rcbridge.co/contact' },
];

const TIMEOUT = 10000; // 10 seconds
const CHECK_INTERVAL = 300000; // 5 minutes

function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const parsedUrl = new URL(endpoint.url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const req = client.get(endpoint.url, { timeout: TIMEOUT }, (res) => {
      const duration = Date.now() - startTime;
      const isUp = res.statusCode >= 200 && res.statusCode < 400;

      resolve({
        name: endpoint.name,
        url: endpoint.url,
        status: res.statusCode,
        duration,
        isUp,
        timestamp: new Date().toISOString(),
      });

      res.resume(); // Consume response data
    });

    req.on('error', (error) => {
      resolve({
        name: endpoint.name,
        url: endpoint.url,
        status: 0,
        duration: Date.now() - startTime,
        isUp: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: endpoint.name,
        url: endpoint.url,
        status: 0,
        duration: TIMEOUT,
        isUp: false,
        error: 'Request timeout',
        timestamp: new Date().toISOString(),
      });
    });

    req.end();
  });
}

async function runUptimeCheck() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Uptime Check - ${new Date().toISOString()}`);
  console.log('='.repeat(60));

  const results = [];

  for (const endpoint of ENDPOINTS) {
    const result = await checkEndpoint(endpoint);
    results.push(result);

    const statusIcon = result.isUp ? '✓' : '✗';
    const statusColor = result.isUp ? '\x1b[32m' : '\x1b[31m'; // Green or Red
    const resetColor = '\x1b[0m';

    console.log(
      `${statusColor}${statusIcon}${resetColor} ${result.name.padEnd(15)} ` +
      `[${result.status}] ${result.duration}ms` +
      (result.error ? ` - Error: ${result.error}` : '')
    );
  }

  console.log('='.repeat(60));

  const allUp = results.every((r) => r.isUp);
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;

  console.log(`Status: ${allUp ? '✓ All systems operational' : '✗ Some systems down'}`);
  console.log(`Average response time: ${avgDuration.toFixed(0)}ms`);
  console.log('='.repeat(60) + '\n');

  return { results, allUp, avgDuration };
}

// Check if running in continuous mode
const isContinuous = process.argv.includes('--continuous');

if (isContinuous) {
  console.log(`Starting continuous monitoring (every ${CHECK_INTERVAL / 60000} minutes)...`);
  console.log('Press Ctrl+C to stop\n');

  // Run immediately
  runUptimeCheck();

  // Then run at intervals
  setInterval(runUptimeCheck, CHECK_INTERVAL);
} else {
  // Single run
  runUptimeCheck().then(({ allUp }) => {
    process.exit(allUp ? 0 : 1);
  });
}
