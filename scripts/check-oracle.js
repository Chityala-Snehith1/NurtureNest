#!/usr/bin/env node

// Health check script for Oracle backend
// Usage: node scripts/check-oracle.js

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function checkOracleHealth() {
  console.log('🔍 Checking Oracle backend health...');
  console.log(`📡 Backend URL: ${BACKEND_URL}`);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Oracle backend is healthy!');
    console.log(`📊 Status: ${data.status}`);
    console.log(`🗄️  Database: ${data.database}`);
    console.log(`⏰ Timestamp: ${data.timestamp}`);
    
    return true;
  } catch (error) {
    console.error('❌ Oracle backend health check failed:');
    console.error(`🔴 Error: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Suggestion: Make sure the Oracle backend server is running:');
      console.log('   npm run server');
    }
    
    return false;
  }
}

async function testOracleConnection() {
  console.log('\n🔗 Testing Oracle database connection...');
  
  const oracleConfig = {
    host: process.env.ORACLE_HOST || 'localhost',
    port: process.env.ORACLE_PORT || '1521',
    sid: process.env.ORACLE_SID || 'XE',
    user: process.env.ORACLE_USER || 'your_username',
    password: process.env.ORACLE_PASSWORD || 'your_password'
  };
  
  console.log(`📍 Oracle Host: ${oracleConfig.host}:${oracleConfig.port}`);
  console.log(`🗄️  Oracle SID: ${oracleConfig.sid}`);
  console.log(`👤 Oracle User: ${oracleConfig.user}`);
  
  if (oracleConfig.password === 'your_password') {
    console.log('⚠️  Warning: Oracle password not configured in .env file');
  } else {
    console.log('✅ Oracle password is configured');
  }
  
  console.log('\n💡 To configure Oracle:');
  console.log('1. Update .env file with your Oracle credentials');
  console.log('2. Run the database schema: @backend/schema.sql');
  console.log('3. Start the backend server: npm run server');
}

async function main() {
  console.log('🏥 NurtureNest Oracle Backend Health Check');
  console.log('==========================================\n');
  
  const isHealthy = await checkOracleHealth();
  
  if (!isHealthy) {
    await testOracleConnection();
  }
  
  console.log('\n📚 For more information, see the README.md file.');
  process.exit(isHealthy ? 0 : 1);
}

main().catch(console.error);
