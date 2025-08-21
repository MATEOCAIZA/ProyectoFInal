import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Métricas personalizadas
export let errorRate = new Rate("errors");
export let timeoutRate = new Rate("timeouts");

// Configuración del escenario de spike
export let options = {
  stages: [
    { duration: "5m", target: 40 }, // ramp-up a 40 VUs
    { duration: "60m", target: 40 }, // mantener carga constante 60 min
    { duration: "5m", target: 0 }, // ramp-down
  ],
  thresholds: {
    "http_req_duration{expected_response:true}": ["p(95)<700"], // tolerancia mayor por duración
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
  },
};


const BASE_URL = "http://localhost:3000/api";


function randomLetters(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


const testUsers = Array.from({ length: 100 }, (_, i) => ({
  username: randomLetters(10),
  password: "Test1234!",
  email: `spike${i}_${Date.now()}@example.com`,
  phone_number: `+59398765432${i}`,
  role: "lector",
}));

export function setup() {
  console.log("=== CONFIGURANDO USUARIOS PARA SPIKE ===");
  const tokens = [];

  for (const user of testUsers) {
    let createResponse = http.post(
      `${BASE_URL}/accounts/create`,
      JSON.stringify(user),
      { headers: { "Content-Type": "application/json" }, timeout: "20s" }
    );

    if (createResponse.status === 201 || createResponse.status === 409) {
      let loginResponse = http.post(
        `${BASE_URL}/accounts/login`,
        JSON.stringify({ username: user.username, password: user.password }),
        { headers: { "Content-Type": "application/json" }, timeout: "15s" }
      );

      if (loginResponse.status === 200 && loginResponse.body) {
        let loginData = JSON.parse(loginResponse.body);
        let token = loginData.token || loginData.access_token;
        if (token) tokens.push(token);
      }
    }
    sleep(0.1);
  }

  if (tokens.length === 0) {
    console.error("🚨 No se pudieron obtener tokens. Verifica backend.");
    return { tokens: [], setupSuccessful: false };
  }

  console.log(`✅ Tokens obtenidos: ${tokens.length}`);
  return { tokens, setupSuccessful: true };
}

export default function (data) {
  if (!data.setupSuccessful || data.tokens.length === 0) {
    errorRate.add(1);
    return;
  }

  const token = data.tokens[Math.floor(Math.random() * data.tokens.length)];
  const headers = { Authorization: `Bearer ${token}` };

  let res = http.get(`${BASE_URL}/accounts/profile`, {
    headers,
    tags: { expected_response: true },
  });

  check(res, {
    "Perfil responde 200": (r) => r.status === 200,
    "Perfil responde <500ms": (r) => r.timings.duration < 500,
  });

  errorRate.add(res.status !== 200);
  sleep(1);
}

export function teardown(data) {
  console.log("=== PRUEBA SPIKE FINALIZADA ===");
  console.log(`Tokens usados: ${data.tokens?.length || 0}`);
}

import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export function handleSummary(data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return {
    [`reports/summarySoak-${timestamp}.json`]: JSON.stringify(data, null, 2),
    [`reports/summarySoak-${timestamp}.html`]: generateHTMLReport(data, timestamp),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

function generateHTMLReport(data, timestamp) {
  const passed = Object.values(data.thresholds || {}).every((t) => t.ok);

  // Construir tabla de thresholds
  const thresholdResults = Object.entries(data.thresholds || {})
    .map(
      ([name, t]) => `
        <tr class="${t.ok ? "pass" : "fail"}">
          <td>${name}</td>
          <td>${t.ok ? "PASSED" : "FAILED"}</td>
          <td>${t.values.map((v) => JSON.stringify(v)).join("<br>")}</td>
        </tr>
      `
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>🚀 K6 Spike Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; background: ${
          passed ? "#e8f5e8" : "#ffe8e8"
        }; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: ${passed ? "#2d5a2d" : "#8b0000"}; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0; }
        .metric-box { background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; border-radius: 4px; }
        .metric-box h3 { margin: 0 0 10px 0; color: #333; }
        .metric-box p { margin: 5px 0; color: #666; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background: #f8f9fa; font-weight: bold; }
        .pass { background: #d4edda; color: #155724; }
        .fail { background: #f8d7da; color: #721c24; }
        .summary { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="container">
        <div class="header">
            <h1>${passed ? "✅" : "❌"} K6 Spike Test Results</h1>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
            <p><strong>Pattern:</strong> 0→100 VUs en 15s, mantener 1.5min, bajar en 15s</p>
            <p><strong>Status:</strong> ${
              passed ? "ALL THRESHOLDS PASSED" : "SOME THRESHOLDS FAILED"
            }</p>
        </div>
        
        <div class="summary">
            <h2>📊 Resumen Ejecutivo</h2>
            <p><strong>Requests Totales:</strong> ${
              data.metrics.http_reqs?.values?.count || "N/A"
            }</p>
            <p><strong>Tasa de Error:</strong> ${(
              (data.metrics.http_req_failed?.values?.rate || 0) * 100
            ).toFixed(2)}%</p>
            <p><strong>P95 Response Time:</strong> ${(
              data.metrics.http_req_duration?.values?.p95 || 0
            ).toFixed(0)}ms</p>
            <p><strong>Checks Success:</strong> ${(
              (data.metrics.checks?.values?.rate || 0) * 100
            ).toFixed(2)}%</p>
        </div>

        <div class="metrics">
            <div class="metric-box">
                <h3>🕐 Response Times</h3>
                <p>Average: ${(
                  data.metrics.http_req_duration?.values?.avg || 0
                ).toFixed(0)}ms</p>
                <p>P95: ${(
                  data.metrics.http_req_duration?.values?.p95 || 0
                ).toFixed(0)}ms</p>
                <p>P99: ${(
                  data.metrics.http_req_duration?.values?.p99 || 0
                ).toFixed(0)}ms</p>
                <p>Max: ${(
                  data.metrics.http_req_duration?.values?.max || 0
                ).toFixed(0)}ms</p>
            </div>
            
            <div class="metric-box">
                <h3>📈 Request Statistics</h3>
                <p>Total: ${data.metrics.http_reqs?.values?.count || "N/A"}</p>
                <p>Rate: ${(data.metrics.http_reqs?.values?.rate || 0).toFixed(
                  1
                )}/s</p>
                <p>Failed: ${(
                  (data.metrics.http_req_failed?.values?.rate || 0) * 100
                ).toFixed(2)}%</p>
            </div>
            
            <div class="metric-box">
                <h3>✅ Quality Metrics</h3>
                <p>Checks: ${(
                  (data.metrics.checks?.values?.rate || 0) * 100
                ).toFixed(2)}%</p>
                <p>Errors: ${(
                  (data.metrics.errors?.values?.rate || 0) * 100
                ).toFixed(2)}%</p>
                <p>Timeouts: ${(
                  (data.metrics.timeouts?.values?.rate || 0) * 100
                ).toFixed(2)}%</p>
            </div>
        </div>

        <h2>🎯 Threshold Results</h2>
        <table>
            <tr><th>Threshold</th><th>Result</th><th>Values</th></tr>
            ${thresholdResults}
        </table>
        
        <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <p><em>Reporte generado por K6 Spike Test - ${timestamp}</em></p>
        </div>
    </div>
  </body>
  </html>`;
}
