import { test as baseTest } from '@playwright/test';

// Global variable to aggregate durations within the worker process
let totalSuiteDuration = 0;

export const test = baseTest.extend<{ timer: void }>({
  timer: [async ({}, use, testInfo) => {
    const startTime = Date.now();
    
    await use();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Accumulate the time
    totalSuiteDuration += duration;
    
    console.log(`Test "${testInfo.title}" took ${duration}ms`);
    testInfo.annotations.push({ type: 'Duration', description: `${duration}ms` });
  }, { auto: true }],
});

// Print the consolidated total at the end of the worker's execution
test.afterAll(() => {
  console.log(`\n======================================`);
  console.log(`📊 Total Consolidated Test Duration: ${totalSuiteDuration}ms`);
  console.log(`======================================\n`);
});

export { expect } from '@playwright/test';
