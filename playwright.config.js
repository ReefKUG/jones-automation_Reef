const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',                 
  timeout: 30_000,                    
  reporter: [['list'], ['html', { open: 'never' }]], 
  use: {
    baseURL: 'https://test.netlify.app', 
    screenshot: 'only-on-failure',      
    trace: 'retain-on-failure',          
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }, 
  ],
});