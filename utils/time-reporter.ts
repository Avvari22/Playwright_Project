import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class TimeReporter implements Reporter {
  private totalSuiteDuration = 0;
  private suiteStartTime = 0;

  // Triggers once when the entire test run begins
  onBegin() {
    this.suiteStartTime = Date.now();
  }

  // Triggers as each individual test case completes
  onTestEnd(test: TestCase, result: TestResult) {
    // Collect cumulative duration data provided by Playwright's engine
    this.totalSuiteDuration += result.duration;
  }

  // Triggers once after ALL spec files and tests are completely finished
  onEnd(result: FullResult) {
    const realElapsedTime = Date.now() - this.suiteStartTime;

    console.log('\n==================================================');
    console.log(`📊 TOTAL CONSOLIDATED TEST TIME SUMMARY`);
    console.log(`==================================================`);
    console.log(`   ⏱️  Cumulative Test Time : ${this.totalSuiteDuration}ms`);
    console.log(`   ⏳ Real Wall-Clock Time : ${realElapsedTime}ms`);
    console.log(`   ✅ Overall Run Status   : ${result.status.toUpperCase()}`);
    console.log('==================================================\n');
  }
}

export default TimeReporter;
