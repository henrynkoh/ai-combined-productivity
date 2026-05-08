#!/usr/bin/env node
/**
 * launch-all.js — Unified launcher for all AFH projects
 *
 * Starts all projects on their correct schedules:
 *   AFHP  : every 60 min  (24/7/365 property table)
 *   AFH   : every 120 min (provider/placement intel)
 *
 * Usage:
 *   node launch-all.js             # run once immediately, then loop
 *   node launch-all.js --once      # run all once and exit
 *   node launch-all.js --status    # print status and exit
 */
const { spawn } = require("child_process");
const path = require("path");
const fs   = require("fs");

const BASE = __dirname;
const PROJECTS = [
  {
    name:        "AFHP Property Scout",
    dir:         path.join(BASE, "AFHP"),
    script:      "src/orchestrator.js",
    intervalMin: 60,
    emoji:       "🏠",
    lastRun:     null,
    running:     false,
  },
  {
    name:        "AFH Intel (Providers & Leads)",
    dir:         path.join(BASE, "AFH"),
    script:      "src/orchestrator.js",
    intervalMin: 120,
    emoji:       "👥",
    lastRun:     null,
    running:     false,
  },
];

const LOG = path.join(BASE, "data/launcher.log");
fs.mkdirSync(path.join(BASE, "data"), { recursive: true });

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + "\n");
}

function runProject(project) {
  if (project.running) { log(`⏳ ${project.name} already running, skipping`); return; }
  project.running = true;
  project.lastRun = new Date();
  log(`${project.emoji} Starting ${project.name}...`);

  const proc = spawn("node", [project.script], {
    cwd: project.dir,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env },
  });

  proc.stdout.on("data", d => process.stdout.write(`[${project.emoji}] ${d}`));
  proc.stderr.on("data", d => process.stderr.write(`[${project.emoji}] ${d}`));
  proc.on("close", code => {
    project.running = false;
    log(`${project.emoji} ${project.name} finished (exit ${code})`);
  });
}

function printStatus() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║     AFH Project Suite — Status           ║");
  console.log("╠══════════════════════════════════════════╣");
  PROJECTS.forEach(p => {
    const last = p.lastRun ? p.lastRun.toISOString().slice(11, 19) : "never";
    const next = p.lastRun
      ? new Date(p.lastRun.getTime() + p.intervalMin * 60000).toISOString().slice(11, 19)
      : "now";
    console.log(`║ ${p.emoji} ${p.name.padEnd(30)} ║`);
    console.log(`║   Interval: every ${p.intervalMin}m  Last: ${last}  Next: ${next} ║`);
  });

  // Property counts
  const afhpHourly = path.join(BASE, "AFHP/data/reports/hourly");
  const afhLeads   = path.join(BASE, "AFH/data/leads");
  const todayStr   = new Date().toISOString().slice(0, 10);
  const hourlyToday = fs.existsSync(afhpHourly)
    ? fs.readdirSync(afhpHourly).filter(f => f.startsWith(todayStr)).length : 0;
  const leadFiles = fs.existsSync(afhLeads)
    ? fs.readdirSync(afhLeads).filter(f => f.endsWith(".json")).length : 0;

  console.log("╠══════════════════════════════════════════╣");
  console.log(`║ 🏠 AFHP hourly tables today: ${String(hourlyToday).padEnd(13)}║`);
  console.log(`║ 👥 AFH lead files: ${String(leadFiles).padEnd(23)}║`);
  console.log(`║ 📋 Log: data/launcher.log${" ".repeat(17)}║`);
  console.log("╚══════════════════════════════════════════╝\n");
}

const args = process.argv.slice(2);

if (args.includes("--status")) {
  printStatus();
  process.exit(0);
}

// Run all immediately on startup
log("🚀 AFH Project Suite launching...");
PROJECTS.forEach(p => runProject(p));

if (args.includes("--once")) {
  log("--once mode: exiting after first run.");
  process.exit(0);
}

// Continuous loop — check every minute if any project is due
printStatus();
setInterval(() => {
  const now = Date.now();
  PROJECTS.forEach(p => {
    const due = !p.lastRun || (now - p.lastRun.getTime()) >= p.intervalMin * 60 * 1000;
    if (due && !p.running) runProject(p);
  });
}, 60 * 1000);

log("🔄 Loop active. AFHP runs every 60m, AFH every 120m. Ctrl+C to stop.");
