// oxlint-disable no-console
import autocannon from "autocannon";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

// ============================================================
// Nitro Starter — Autocannon 压测脚本
// 使用: bun run bench/autocannon.ts
// ============================================================

const BASE_URL = "http://localhost:3000";

interface BenchmarkConfig {
  name: string;
  url: string;
  method?: "GET" | "POST";
  connections?: number;
  duration?: number;
  pipelining?: number;
}

interface BenchmarkResult {
  name: string;
  url: string;
  duration: number;
  errors: number;
  timeouts: number;
  requests: {
    total: number;
    average: number;
    mean: number;
    stddev: number;
    min: number;
    max: number;
    p99: number;
    p99_9: number;
  };
  latency: {
    average: number;
    mean: number;
    stddev: number;
    min: number;
    max: number;
    p99: number;
    p99_9: number;
  };
  throughput: {
    average: number;
    mean: number;
    stddev: number;
    min: number;
    max: number;
    total: number;
  };
}

const configs: BenchmarkConfig[] = [
  // 基础吞吐量 — 欢迎页（无 DB）
  {
    name: "GET / (基础)",
    url: `${BASE_URL}/`,
    connections: 10,
    duration: 10,
  },
  // 高并发 — 欢迎页
  {
    name: "GET / (高并发)",
    url: `${BASE_URL}/`,
    connections: 100,
    duration: 10,
  },
  // 基础吞吐量 — API（含 DB 查询）
  {
    name: "GET /api (基础)",
    url: `${BASE_URL}/api`,
    connections: 10,
    duration: 10,
  },
  // 高并发 — API
  {
    name: "GET /api (高并发)",
    url: `${BASE_URL}/api`,
    connections: 50,
    duration: 10,
  },
];

function formatMs(ms: number): string {
  return `${ms.toFixed(2)} ms`;
}

function formatRps(rps: number): string {
  if (rps >= 1000) {
    return `${(rps / 1000).toFixed(2)}k req/s`;
  }
  return `${rps.toFixed(0)} req/s`;
}

function printResult(result: BenchmarkResult): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  📊 ${result.name}`);
  console.log(`${"=".repeat(60)}`);

  console.log(`  🚀 总请求数:     ${result.requests.total.toLocaleString()}`);
  console.log(`  ⚡ 吞吐量:       ${formatRps(result.throughput.average)}`);
  console.log(`  ⏱️  平均延迟:     ${formatMs(result.latency.average)}`);
  console.log(`  🎯 P99 延迟:     ${formatMs(result.latency.p99)}`);
  console.log(`  🔴 P99.9 延迟:   ${formatMs(result.latency.p99_9)}`);
  console.log(`  ❌ 错误数:       ${result.errors}`);
  console.log(`  ⏰ 超时数:       ${result.timeouts}`);
  console.log(`  ⏳ 测试时长:     ${result.duration.toFixed(2)}s`);
  console.log();
}

function runBenchmark(config: BenchmarkConfig): Promise<BenchmarkResult> {
  return new Promise((resolve, reject) => {
    const instance = autocannon(
      {
        url: config.url,
        method: config.method || "GET",
        connections: config.connections || 10,
        duration: config.duration || 10,
        pipelining: config.pipelining || 1,
        headers: {
          accept: "application/json",
        },
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          name: config.name,
          url: config.url,
          duration: result.duration,
          errors: result.errors,
          timeouts: result.timeouts,
          requests: {
            total: result.requests.total,
            average: result.requests.average,
            mean: result.requests.mean,
            stddev: result.requests.stddev,
            min: result.requests.min,
            max: result.requests.max,
            p99: result.requests.p99 || 0,
            p99_9: result.requests.p99_9 || 0,
          },
          latency: {
            average: result.latency.average,
            mean: result.latency.mean,
            stddev: result.latency.stddev,
            min: result.latency.min,
            max: result.latency.max,
            p99: result.latency.p99 || 0,
            p99_9: result.latency.p99_9 || 0,
          },
          throughput: {
            average: result.throughput.average,
            mean: result.throughput.mean,
            stddev: result.throughput.stddev,
            min: result.throughput.min,
            max: result.throughput.max,
            total: result.throughput.total,
          },
        });
      },
    );

    // 进度追踪
    autocannon.track(instance, {
      renderProgressBar: true,
      renderResultsTable: true,
      renderLatencyTable: true,
    });
  });
}

async function main(): Promise<void> {
  console.log("🔥 Nitro Starter — 性能压测");
  console.log(`🌐 目标: ${BASE_URL}`);
  console.log(`📋 测试场景: ${configs.length} 个\n`);

  const results: BenchmarkResult[] = [];

  for (const config of configs) {
    console.log(`⏳ 正在运行: ${config.name}...`);
    try {
      const result = await runBenchmark(config);
      results.push(result);
      printResult(result);
    } catch (err) {
      console.error(`❌ ${config.name} 测试失败:`, err);
    }
    // 间隔 2 秒，避免端口耗尽
    await new Promise((r) => setTimeout(r, 2000));
  }

  // 输出汇总
  console.log(`\n${"=".repeat(60)}`);
  console.log("  📋 压测汇总");
  console.log(`${"=".repeat(60)}\n`);

  console.log("┌──────────────────────┬──────────┬──────────┬──────────┬──────────┬──────────┐");
  console.log(
    "│ 场景                   │ 总请求     │ 吞吐量      │ 平均延迟   │ P99       │ 错误      │",
  );
  console.log("├──────────────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤");
  for (const r of results) {
    const name = r.name.padEnd(20);
    const total = r.requests.total.toLocaleString().padStart(8);
    const rps = formatRps(r.throughput.average).padStart(8);
    const avg = formatMs(r.latency.average).padStart(8);
    const p99 = formatMs(r.latency.p99).padStart(8);
    const err = String(r.errors).padStart(8);
    console.log(`│ ${name} │ ${total} │ ${rps} │ ${avg} │ ${p99} │ ${err} │`);
  }
  console.log("└──────────────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘");

  // 保存 JSON 报告
  const reportPath = join(import.meta.dirname, "..", "bench-report.json");
  writeFileSync(reportPath, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\n📄 详细报告已保存至: ${reportPath}`);
}

main().catch(console.error);
