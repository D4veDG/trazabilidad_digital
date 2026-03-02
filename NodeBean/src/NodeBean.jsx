import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";
import { Browser } from "@capacitor/browser";
import { App as CapApp } from "@capacitor/app";

// ─── Ionic CSS (CDN via @import in style tag) ──────────────────────────────
const IonicStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

    :root {
      --primary: #d47311;
      --primary-light: rgba(212,115,17,0.12);
      --primary-glow: rgba(212,115,17,0.25);
      --bg: #f8f7f6;
      --card: #ffffff;
      --border: rgba(0,0,0,0.07);
      --text: #1a1208;
      --muted: #7a6f63;
      --success: #16a34a;
      --success-bg: #f0fdf4;
      --radius: 16px;
      --radius-sm: 10px;
      --shadow: 0 4px 24px rgba(0,0,0,0.08);
      --shadow-primary: 0 8px 32px rgba(212,115,17,0.22);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .app-shell {
      width: 100%;
      max-width: 430px;
      min-height: 100dvh;
      background: var(--card);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      box-shadow: 0 0 80px rgba(0,0,0,0.18);
    }

    /* Status bar */
    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px 8px;
      font-size: 12px;
      font-weight: 700;
      color: var(--text);
      flex-shrink: 0;
    }
    .status-icons { display: flex; gap: 6px; align-items: center; font-size: 14px; }

    /* Navigation */
    .bottom-nav {
      position: sticky;
      bottom: 0;
      background: rgba(255,255,255,0.96);
      backdrop-filter: blur(20px);
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-around;
      padding: 10px 0 20px;
      flex-shrink: 0;
      z-index: 100;
    }
    .nav-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--muted);
      font-family: inherit;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.04em;
      padding: 6px 16px;
      border-radius: var(--radius-sm);
      transition: all 0.2s;
    }
    .nav-btn.active { color: var(--primary); }
    .nav-btn .icon { font-size: 22px; }

    /* Shared header */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 20px 16px;
      flex-shrink: 0;
    }
    .header-icon-btn {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: #f3f0ed;
      border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-size: 18px;
      color: var(--muted);
      transition: background 0.2s;
    }
    .header-icon-btn:hover { background: var(--primary-light); color: var(--primary); }

    /* Scrollable main */
    .page-scroll {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 12px;
    }
    .page-scroll::-webkit-scrollbar { display: none; }

    /* ─── LOGIN ──────────────────────────────────────── */
    .login-screen {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 32px;
      gap: 0;
    }
    .login-logo {
      width: 80px; height: 80px;
      background: var(--primary);
      border-radius: 24px;
      display: flex; align-items: center; justify-content: center;
      font-size: 40px;
      margin-bottom: 28px;
      box-shadow: var(--shadow-primary);
    }
    .login-title { font-size: 26px; font-weight: 800; text-align: center; margin-bottom: 8px; }
    .login-sub { font-size: 14px; color: var(--muted); text-align: center; margin-bottom: 48px; line-height: 1.6; }
    .google-btn {
      width: 100%;
      display: flex; align-items: center; justify-content: center; gap: 12px;
      background: white;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      font-family: inherit;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: var(--shadow);
      transition: all 0.2s;
      color: var(--text);
    }
    .google-btn:hover { border-color: var(--primary); box-shadow: var(--shadow-primary); }
    .google-btn:active { transform: scale(0.98); }
    .google-btn-icon {
      width: 22px; height: 22px;
    }
    .login-footer {
      margin-top: 32px;
      font-size: 11px;
      color: var(--muted);
      text-align: center;
      line-height: 1.6;
    }
    .login-error {
      background: #fef2f2;
      border: 1.5px solid rgba(220,38,38,0.2);
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      font-size: 13px;
      color: #dc2626;
      text-align: center;
      margin-bottom: 16px;
      width: 100%;
    }

    /* Loading overlay */
    .loading-screen {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--primary-light);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ─── PANEL (Home) ─────────────────────────────── */
    .panel-header { padding: 16px 20px 20px; }
    .farmer-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .farmer-info { display: flex; align-items: center; gap: 14px; }
    .avatar {
      width: 52px; height: 52px;
      border-radius: 50%;
      overflow: hidden;
      border: 2.5px solid var(--primary);
      flex-shrink: 0;
    }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-placeholder {
      width: 100%; height: 100%;
      background: var(--primary-light);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: 800; color: var(--primary);
    }
    .farmer-name { font-size: 17px; font-weight: 800; line-height: 1; }
    .farmer-loc {
      display: flex; align-items: center; gap: 4px;
      font-size: 10px; font-weight: 700;
      color: var(--muted);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-top: 4px;
    }

    .primary-btn {
      width: 100%;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: var(--radius);
      padding: 16px;
      font-family: inherit;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      box-shadow: var(--shadow-primary);
      transition: all 0.2s;
      letter-spacing: 0.01em;
    }
    .primary-btn:active { transform: scale(0.98); opacity: 0.9; }
    .primary-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .section-title {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 14px;
    }

    .active-lot-card {
      background: linear-gradient(135deg, #fef3e8 0%, #fff8f0 100%);
      border: 1.5px solid rgba(212,115,17,0.2);
      border-radius: var(--radius);
      padding: 20px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }
    .lot-badge {
      display: inline-block;
      background: var(--primary);
      color: white;
      font-size: 10px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 999px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .lot-title { font-size: 20px; font-weight: 800; margin: 8px 0 6px; }

    .ring-progress {
      position: absolute; top: 16px; right: 16px;
      width: 52px; height: 52px;
    }
    .ring-progress svg { transform: rotate(-90deg); }
    .ring-text {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 800;
      color: var(--primary);
    }

    .lot-desc { font-size: 13px; color: var(--muted); margin-bottom: 14px; line-height: 1.5; }
    .lot-chips { display: flex; gap: 8px; flex-wrap: wrap; }
    .chip {
      display: flex; align-items: center; gap: 5px;
      background: var(--success-bg);
      color: var(--success);
      border: 1px solid rgba(22,163,74,0.15);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 11px; font-weight: 700;
    }

    .empty-state {
      text-align: center;
      padding: 32px 20px;
      background: #f8f7f6;
      border-radius: var(--radius);
      border: 1.5px dashed var(--border);
    }
    .empty-state-icon { font-size: 48px; margin-bottom: 12px; }
    .empty-state-text { font-size: 14px; font-weight: 600; color: var(--muted); }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .stage-card {
      background: #f8f7f6;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 16px 12px;
      display: flex; flex-direction: column; align-items: center;
      text-align: center; gap: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .stage-card:hover { border-color: rgba(212,115,17,0.4); }
    .stage-card.active-stage {
      background: var(--primary-light);
      border-color: rgba(212,115,17,0.35);
    }
    .stage-icon {
      width: 48px; height: 48px; border-radius: 50%;
      background: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    }
    .stage-card.active-stage .stage-icon { background: var(--primary); color: white; }
    .stage-name { font-size: 13px; font-weight: 700; }
    .stage-status { font-size: 10px; font-weight: 700; color: var(--muted); letter-spacing: 0.04em; }
    .stage-card.active-stage .stage-status { color: var(--primary); }

    /* ─── FERMENTACION ─────────────────────────────── */
    .lot-label { font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--primary); }
    .page-title { font-size: 17px; font-weight: 800; }

    .timeline-wrap { position: relative; display: flex; justify-content: space-between; align-items: flex-start; }
    .timeline-track { position: absolute; top: 16px; left: 0; right: 0; height: 2px; background: #ede9e4; }
    .timeline-progress { position: absolute; top: 16px; left: 0; height: 2px; background: var(--primary); transition: width 0.5s; }
    .day-node { display: flex; flex-direction: column; align-items: center; gap: 6px; position: relative; z-index: 1; }
    .day-circle {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 800;
      background: #ede9e4; color: var(--muted);
      transition: all 0.3s; cursor: pointer;
    }
    .day-circle.done { background: var(--primary); color: white; }
    .day-circle.current { width: 40px; height: 40px; background: var(--primary); color: white; box-shadow: 0 0 0 6px var(--primary-light); }
    .day-label { font-size: 10px; font-weight: 700; color: var(--muted); }
    .day-label.current-label { color: var(--primary); font-weight: 800; }

    .gauge-card {
      background: #f8f7f6;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      display: flex; flex-direction: column; align-items: center;
    }
    .gauge-label { font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
    .gauge-svg-wrap { position: relative; width: 180px; height: 90px; overflow: hidden; }
    .temp-value { font-size: 42px; font-weight: 800; line-height: 1; }
    .temp-unit { font-size: 20px; font-weight: 500; color: var(--muted); }
    .temp-ok { font-size: 11px; font-weight: 700; color: var(--success); margin-top: 8px; display: flex; align-items: center; gap: 4px; }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-card { background: white; border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 14px; }
    .info-card-label { font-size: 10px; font-weight: 700; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 5px; }
    .info-card-value { font-size: 14px; font-weight: 700; }
    .info-card-sub { font-size: 10px; color: var(--muted); }

    .img-card { border-radius: var(--radius); overflow: hidden; height: 120px; position: relative; }
    .img-card img { width: 100%; height: 100%; object-fit: cover; }
    .img-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.65), transparent);
      display: flex; align-items: flex-end; padding: 12px;
    }
    .img-overlay span { color: white; font-size: 11px; font-weight: 600; }

    .action-card {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px;
      background: var(--primary-light);
      border: 1.5px solid rgba(212,115,17,0.2);
      border-radius: var(--radius);
    }
    .action-card.muted { background: white; border-color: var(--border); opacity: 0.6; }
    .action-icon {
      width: 42px; height: 42px; border-radius: 50%;
      background: var(--primary); color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }
    .action-card.muted .action-icon { background: #f3f0ed; color: var(--muted); }
    .action-info { flex: 1; margin: 0 12px; }
    .action-name { font-size: 14px; font-weight: 700; }
    .action-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
    .action-btn {
      background: var(--primary); color: white; border: none;
      border-radius: var(--radius-sm); padding: 9px 16px;
      font-family: inherit; font-size: 13px; font-weight: 700;
      cursor: pointer; box-shadow: 0 4px 12px var(--primary-glow);
      white-space: nowrap; transition: all 0.2s;
    }
    .action-btn:active { transform: scale(0.97); }
    .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .action-btn-text {
      background: none; border: none;
      color: var(--primary); font-family: inherit;
      font-size: 11px; font-weight: 800;
      letter-spacing: 0.06em; text-transform: uppercase;
      cursor: pointer;
    }

    /* ─── INVENTARIO ─────────────────────────────── */
    .status-dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--success);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.2); }
    }
    .region-tag {
      background: var(--primary-light); color: var(--primary);
      border: 1px solid rgba(212,115,17,0.2);
      border-radius: 999px; font-size: 10px; font-weight: 800;
      padding: 5px 12px; letter-spacing: 0.06em;
    }
    .summary-card { background: #f8f7f6; border: 1.5px solid var(--border); border-radius: var(--radius); padding: 16px; }
    .weight-card { background: white; border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 16px; grid-column: span 2; }
    .weight-number { font-size: 44px; font-weight: 800; line-height: 1; }
    .weight-unit { font-size: 24px; font-weight: 700; color: var(--primary); }
    .sub-card { background: white; border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 14px; }
    .sub-number { font-size: 28px; font-weight: 800; }

    .checklist-item {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px;
      background: white; border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
    }
    .check-icon { width: 28px; height: 28px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--primary); flex-shrink: 0; }
    .checklist-text { font-size: 14px; font-weight: 500; }

    .traceability-card {
      background: var(--primary-light); border: 1.5px solid rgba(212,115,17,0.15);
      border-radius: var(--radius); padding: 16px;
      display: flex; align-items: center; gap: 14px;
    }
    .qr-box { width: 64px; height: 64px; background: white; border-radius: var(--radius-sm); border: 1px solid var(--border); padding: 4px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .qr-box img { width: 100%; height: 100%; object-fit: contain; }
    .trace-key { font-size: 10px; font-weight: 800; color: var(--primary); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
    .trace-lot { font-family: 'Space Mono', monospace; font-size: 13px; color: var(--muted); line-height: 1.4; }
    .trace-sync { font-size: 10px; color: var(--muted); margin-top: 4px; }

    .map-card { height: 96px; border-radius: var(--radius); overflow: hidden; position: relative; border: 1.5px solid var(--border); }
    .map-card img { width: 100%; height: 100%; object-fit: cover; }
    .map-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent); display: flex; align-items: flex-end; padding: 10px 12px; color: white; font-size: 12px; font-weight: 600; gap: 5px; }

    .footer-actions { padding: 16px 20px 8px; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--border); flex-shrink: 0; }
    .secondary-btn {
      width: 100%; background: white; color: var(--text);
      border: 1.5px solid var(--border); border-radius: var(--radius);
      padding: 13px; font-family: inherit; font-size: 14px; font-weight: 700;
      cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: all 0.2s;
    }
    .secondary-btn:hover { border-color: var(--primary); color: var(--primary); }

    /* ─── REGISTRO ─────────────────────────────── */
    .stepper { display: flex; gap: 6px; }
    .step-bar { height: 5px; flex: 1; border-radius: 999px; background: var(--primary-light); }
    .step-bar.done { background: var(--primary); }
    .step-label { font-size: 10px; font-weight: 800; color: var(--primary); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 8px; }

    .field-label { font-size: 10px; font-weight: 700; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; margin-left: 2px; }
    .field-wrap { position: relative; }
    .field-input, .field-select {
      width: 100%; background: #f8f7f6;
      border: 1.5px solid var(--border); border-radius: var(--radius-sm);
      padding: 14px 16px; font-family: inherit; font-size: 14px;
      color: var(--text); outline: none; transition: border-color 0.2s; appearance: none;
    }
    .field-input:focus, .field-select:focus { border-color: var(--primary); background: white; }
    .field-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 18px; color: var(--muted); pointer-events: none; }

    .variety-grid { display: flex; gap: 8px; }
    .variety-btn {
      flex: 1; padding: 12px 8px; border-radius: var(--radius-sm);
      border: 1.5px solid var(--border); background: white;
      font-family: inherit; cursor: pointer; text-align: center; transition: all 0.2s;
    }
    .variety-btn.selected { border-color: var(--primary); background: var(--primary-light); }
    .variety-type { font-size: 9px; font-weight: 700; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; display: block; margin-bottom: 4px; }
    .variety-name { font-size: 13px; font-weight: 800; color: var(--text); }
    .variety-btn.selected .variety-name { color: var(--primary); }

    .check-label {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px; background: #f8f7f6;
      border: 1.5px solid var(--border); border-radius: var(--radius-sm); cursor: pointer;
    }
    .check-label input[type="checkbox"] { width: 20px; height: 20px; border-radius: 6px; accent-color: var(--primary); cursor: pointer; flex-shrink: 0; }
    .check-text { font-size: 13px; font-weight: 500; }

    .save-indicator {
      display: flex; align-items: center; gap: 6px;
      font-size: 11px; color: var(--success); font-weight: 700;
      opacity: 0; transition: opacity 0.3s;
    }
    .save-indicator.visible { opacity: 1; }

    .toast {
      position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
      background: #1a1208; color: white;
      border-radius: var(--radius-sm); padding: 10px 20px;
      font-size: 13px; font-weight: 600;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      z-index: 999; opacity: 0;
      transition: opacity 0.3s, bottom 0.3s;
      white-space: nowrap;
    }
    .toast.show { opacity: 1; bottom: 110px; }

    .px { padding-left: 20px; padding-right: 20px; }
    .py { padding-top: 12px; padding-bottom: 12px; }
    .space-y > * + * { margin-top: 12px; }
    .space-y-sm > * + * { margin-top: 8px; }
    .mb-6 { margin-bottom: 20px; }
    .mb-4 { margin-bottom: 14px; }
    .mb-2 { margin-bottom: 8px; }
    .mt-4 { margin-top: 14px; }

    .page-enter { animation: fadeSlideIn 0.3s ease both; }
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .material-icons { font-family: 'Material Icons'; font-style: normal; font-size: 20px; display: inline-block; vertical-align: middle; line-height: 1; }

    /* ─── MODAL VARIEDAD ─────────────────────────── */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      z-index: 200; display: flex; align-items: flex-end; justify-content: center;
    }
    .modal-sheet {
      background: white; border-radius: 24px 24px 0 0;
      padding: 0 20px 40px; width: 100%; max-width: 430px;
      animation: slideUp 0.28s ease;
      max-height: 92dvh; overflow-y: auto;
    }
    .modal-sheet::-webkit-scrollbar { display: none; }
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
    .modal-handle {
      width: 40px; height: 4px; background: #e5e5e5;
      border-radius: 999px; margin: 14px auto 18px;
    }
    .modal-title { font-size: 18px; font-weight: 800; margin-bottom: 22px; text-align: center; }

    /* ─── PARCELAS ─────────────────────────────── */
    .parcel-card {
      background: white; border: 1.5px solid var(--border);
      border-radius: var(--radius); padding: 16px 18px;
      display: flex; align-items: center; gap: 14px;
    }
    .parcel-icon {
      width: 46px; height: 46px; border-radius: 14px;
      background: var(--primary-light);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; flex-shrink: 0;
    }
    .parcel-info { flex: 1; min-width: 0; }
    .parcel-name { font-size: 15px; font-weight: 800; }
    .parcel-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
    .parcel-chip {
      background: #f3f0ed; border-radius: 8px;
      padding: 3px 10px; font-size: 11px; font-weight: 700; color: var(--muted);
      display: flex; align-items: center; gap: 4px;
    }
    .parcel-chip.primary { background: var(--primary-light); color: var(--primary); }
    .parcel-delete-btn {
      width: 34px; height: 34px; border-radius: 50%;
      background: #fef2f2; border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #dc2626; flex-shrink: 0;
    }
    .size-display { text-align: center; font-size: 38px; font-weight: 800; color: var(--primary); line-height: 1; }
    .size-unit { font-size: 13px; color: var(--muted); text-align: center; margin: 4px 0 14px; }
    .size-slider {
      width: 100%; -webkit-appearance: none; appearance: none;
      height: 6px; border-radius: 999px; outline: none; cursor: pointer;
      background: linear-gradient(to right, var(--primary) 0%, var(--primary) var(--pct,0%), #ede9e4 var(--pct,0%), #ede9e4 100%);
    }
    .size-slider::-webkit-slider-thumb {
      -webkit-appearance: none; width: 26px; height: 26px;
      border-radius: 50%; background: var(--primary);
      box-shadow: 0 2px 8px var(--primary-glow); cursor: pointer;
    }
    .size-row { display: flex; justify-content: space-between; font-size: 10px; color: var(--muted); font-weight: 600; margin-top: 6px; }
    .parcelas-summary {
      background: var(--primary-light); border: 1.5px solid rgba(212,115,17,0.2);
      border-radius: var(--radius); padding: 16px 20px;
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center; margin-top: 20px;
    }
    .summary-val { font-size: 22px; font-weight: 800; color: var(--primary); }
    .summary-lbl { font-size: 9px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

    /* ─── INVENTARIO FUNCIONAL ─────────────────── */
    .inv-field-row {
      display: flex; align-items: center; gap: 12px;
      background: #f8f7f6; border: 1.5px solid var(--border);
      border-radius: var(--radius-sm); padding: 14px 16px;
    }
    .inv-field-icon { color: var(--primary); flex-shrink: 0; }
    .inv-field-info { flex: 1; }
    .inv-field-label { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; }
    .inv-field-val { font-size: 15px; font-weight: 800; margin-top: 2px; }
    .inv-input {
      background: none; border: none; outline: none;
      font-family: inherit; font-size: 15px; font-weight: 800;
      color: var(--text); width: 100%;
    }
    .cond-check {
      display: flex; align-items: center; gap: 12px;
      padding: 13px 16px; background: white;
      border: 1.5px solid var(--border); border-radius: var(--radius-sm);
      cursor: pointer; transition: border-color 0.2s;
    }
    .cond-check.checked { border-color: var(--success); background: var(--success-bg); }
    .cond-box {
      width: 22px; height: 22px; border-radius: 6px;
      border: 2px solid var(--border); background: white;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.2s; font-size: 13px;
    }
    .cond-check.checked .cond-box { background: var(--success); border-color: var(--success); color: white; }
    .cond-text { font-size: 13px; font-weight: 600; }

    /* QR generado */
    .qr-generated {
      background: white; border: 1.5px solid var(--border);
      border-radius: var(--radius); padding: 20px;
      display: flex; flex-direction: column; align-items: center; gap: 12px;
    }
    .qr-canvas-wrap {
      width: 160px; height: 160px; background: white;
      display: flex; align-items: center; justify-content: center;
      border-radius: 12px; border: 1px solid var(--border);
      overflow: hidden;
    }
    .qr-canvas-wrap canvas { width: 160px !important; height: 160px !important; }
    .trace-key-big {
      font-family: 'Space Mono', monospace; font-size: 13px;
      color: var(--muted); text-align: center; letter-spacing: 0.04em;
      background: #f8f7f6; border-radius: 8px; padding: 8px 14px;
      border: 1px solid var(--border);
    }
  `}</style>
);

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, style }) => <span className="material-icons" style={style}>{name}</span>;

// ─── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message }) => (
  <div className={`toast${message ? " show" : ""}`}>{message}</div>
);

// ─── Status Bar ────────────────────────────────────────────────────────────────
const StatusBar = () => {
  const now = new Date();
  const time = now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="status-bar">
      <span>{time}</span>
      <div className="status-icons">
        <Icon name="signal_cellular_alt" /><Icon name="wifi" /><Icon name="battery_full" />
      </div>
    </div>
  );
};

// ─── Bottom Nav ────────────────────────────────────────────────────────────────
const BottomNav = ({ active, onChange }) => {
  const tabs = [
    { id: "panel", icon: "dashboard", label: "Inicio" },
    { id: "fermentacion", icon: "inventory_2", label: "Proceso" },
    { id: "inventario", icon: "analytics", label: "Almacén" },
    { id: "registro", icon: "agriculture", label: "Registro" },
    { id: "parcelas", icon: "grid_view", label: "Parcelas" },
  ];
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button key={t.id} className={`nav-btn${active === t.id ? " active" : ""}`} onClick={() => onChange(t.id)}>
          <Icon name={t.icon} className="icon" />
          {t.label}
        </button>
      ))}
    </nav>
  );
};

// ─── LOGIN SCREEN ──────────────────────────────────────────────────────────────
const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isNative = !!(window.Capacitor?.isNativePlatform?.());

  // El manejo del deep link está centralizado en App()

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isNative) {
        // Flujo móvil: abrir browser nativo
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'com.trazabilidad.app://login-callback',
            skipBrowserRedirect: true,
          },
        });
        if (error) throw error;
        if (data?.url) await Browser.open({ url: data.url });
        setTimeout(() => setLoading(false), 4000);
      } else {
        // Flujo web: redirección normal
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
      setLoading(false);
    }
  };

  return (
    <div className="login-screen page-enter">
      <div className="login-logo">🍫</div>
      <div className="login-title">Trazabilidad Digital</div>
      <div className="login-sub">
        Plataforma de trazabilidad para<br />productores de cacao de Urabá
      </div>
      {error && <div className="login-error">{error}</div>}
      <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
        {loading ? (
          <div className="spinner" style={{ width: 22, height: 22 }} />
        ) : (
          <svg className="google-btn-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {loading ? 'Conectando...' : 'Continuar con Google'}
      </button>
      <div className="login-footer">
        Al ingresar, aceptas que tus datos de lotes<br />
        se almacenarán de forma segura en nuestros servidores.
      </div>
    </div>
  );
};
// ─── PANEL (Home) ──────────────────────────────────────────────────────────────
const Panel = ({ navigate, profile, lots }) => {
  const activeLot = lots.find(l => l.status === "fermentacion") || lots[0];
  const stages = [
    { id: "registro", icon: "🌾", name: "Cosecha", status: "Registrar" },
    { id: "registro", icon: "📦", name: "Desgrane", status: "Pendiente" },
    { id: "fermentacion", icon: "⚗️", name: "Fermentación", status: "EN PROGRESO", active: true },
    { id: "panel", icon: "☀️", name: "Secado", status: "Próxima etapa" },
    { id: "panel", icon: "✨", name: "Limpieza", status: "Clasificación" },
    { id: "inventario", icon: "🏭", name: "Almacenamiento", status: "Embolsado" },
  ];

  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div className="page-scroll">
        <div className="panel-header px">
          <div className="farmer-row">
            <div className="farmer-info">
              <div className="avatar">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} />
                ) : (
                  <div className="avatar-placeholder">
                    {(profile?.full_name || "?")[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div className="farmer-name">{profile?.full_name || "Agricultor"}</div>
                <div className="farmer-loc"><Icon name="location_on" style={{ fontSize: 12 }} /> {profile?.region || "Urabá, Antioquia"}</div>
              </div>
            </div>
            <button className="header-icon-btn" onClick={() => supabase.auth.signOut()}>
              <Icon name="logout" />
            </button>
          </div>
        </div>

        <div className="px mb-6">
          <button className="primary-btn" onClick={() => navigate("registro")}>
            <Icon name="add_circle_outline" /> Registrar nuevo lote
          </button>
        </div>

        <div className="px mb-6">
          <div className="section-title">Actividad reciente</div>
          {activeLot ? (
            <div className="active-lot-card" onClick={() => navigate("fermentacion")}>
              <div className="ring-progress">
                <svg viewBox="0 0 52 52" width="52" height="52">
                  <circle cx="26" cy="26" r="22" fill="none" stroke="#ede9e4" strokeWidth="5" />
                  <circle cx="26" cy="26" r="22" fill="none" stroke="var(--primary)" strokeWidth="5"
                    strokeDasharray={`${2 * Math.PI * 22 * 0.65} ${2 * Math.PI * 22}`} strokeLinecap="round" />
                </svg>
                <div className="ring-text">65%</div>
              </div>
              <div className="lot-badge">Lote #{activeLot.lot_code}</div>
              <div className="lot-title">Etapa de {activeLot.status.charAt(0).toUpperCase() + activeLot.status.slice(1)}</div>
              <div className="lot-desc">
                Variedad: {activeLot.variety} · {activeLot.parcel_name}
              </div>
              <div className="lot-chips">
                <div className="chip"><Icon name="scale" style={{ fontSize: 14 }} /> {activeLot.weight_kg} kg</div>
                <div className="chip"><Icon name="calendar_today" style={{ fontSize: 14 }} /> {new Date(activeLot.harvest_date).toLocaleDateString("es-CO")}</div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🌱</div>
              <div className="empty-state-text">No hay lotes activos aún.<br />¡Registra tu primera cosecha!</div>
            </div>
          )}
        </div>

        <div className="px mb-4">
          <div className="section-title">Etapas de trazabilidad</div>
          <div className="grid-2">
            {stages.map((s, i) => (
              <div key={i} className={`stage-card${s.active ? " active-stage" : ""}`} onClick={() => navigate(s.id)}>
                <div className="stage-icon">{s.icon}</div>
                <div className="stage-name">{s.name}</div>
                <div className="stage-status">{s.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── FERMENTACION ──────────────────────────────────────────────────────────────
const Fermentacion = ({ goBack, activeLot, showToast }) => {
  const total = 7;
  const maxTurns = 6;
  const [selectedDay, setSelectedDay] = useState(1);
  const [dayLog, setDayLog] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const progressPct = ((selectedDay - 1) / (total - 1)) * 100;

  // Cargar log del día seleccionado desde Supabase
  const loadDayLog = useCallback(async (day) => {
    if (!activeLot) return;
    const { data } = await supabase
      .from("fermentation_logs")
      .select("*")
      .eq("lot_id", activeLot.id)
      .eq("day_number", day)
      .maybeSingle();
    setDayLog(data);
  }, [activeLot]);

  useEffect(() => {
    loadDayLog(selectedDay);
  }, [selectedDay, loadDayLog]);

  const handleRegisterTurn = async () => {
    if (!activeLot) return;
    setSaving(true);
    const newTurns = (dayLog?.turns_count || 0) + 1;
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("fermentation_logs")
      .upsert({
        lot_id: activeLot.id,
        day_number: selectedDay,
        turns_count: newTurns,
        last_turn_at: now,
        temperature_c: dayLog?.temperature_c || 48.2,
      }, { onConflict: "lot_id,day_number" })
      .select()
      .single();
    setSaving(false);
    if (!error) {
      setDayLog(data);
      setSaved(true);
      showToast("✓ Giro registrado");
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const turns = dayLog?.turns_count || 0;
  const lastTurn = dayLog?.last_turn_at
    ? new Date(dayLog.last_turn_at).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div className="page-header px">
        <button className="header-icon-btn" onClick={goBack}><Icon name="arrow_back_ios" /></button>
        <div style={{ textAlign: "center" }}>
          <div className="page-title">Fermentación</div>
          <div className="lot-label">Lote #{activeLot?.lot_code || "—"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div className={`save-indicator${saved ? " visible" : ""}`}>
            <Icon name="cloud_done" style={{ fontSize: 14 }} /> Guardado
          </div>
        </div>
      </div>

      <div className="page-scroll px">
        <div className="mb-6">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Proceso</div>
            <div style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
              Día {selectedDay} de {total}
            </div>
          </div>
          <div className="timeline-wrap">
            <div className="timeline-track" />
            <div className="timeline-progress" style={{ width: `${progressPct}%` }} />
            {Array.from({ length: total }, (_, i) => {
              const d = i + 1;
              const done = d < selectedDay;
              const current = d === selectedDay;
              return (
                <div className="day-node" key={d} onClick={() => setSelectedDay(d)}>
                  <div className={`day-circle${done ? " done" : ""}${current ? " current" : ""}`}>
                    {done ? <Icon name="check" style={{ fontSize: 14, color: "white" }} /> : d}
                  </div>
                  <div className={`day-label${current ? " current-label" : ""}`}>{current ? "Hoy" : `D${d}`}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="gauge-card mb-6">
          <div className="gauge-label">Temperatura</div>
          <div className="gauge-svg-wrap">
            <svg viewBox="0 0 180 90" width="180" height="90">
              <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="#ede9e4" strokeWidth="14" strokeLinecap="round" />
              <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="var(--primary)" strokeWidth="14" strokeLinecap="round"
                strokeDasharray="219.9" strokeDashoffset="60" />
              <line x1="90" y1="90" x2="90" y2="18" stroke="#1a1208" strokeWidth="3" strokeLinecap="round" transform="rotate(40, 90, 90)" />
              <circle cx="90" cy="90" r="7" fill="#1a1208" />
            </svg>
          </div>
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <span className="temp-value">{dayLog?.temperature_c || "48.2"}</span>
            <span className="temp-unit"> °C</span>
          </div>
          <div className="temp-ok"><Icon name="check_circle" style={{ fontSize: 14 }} /> Rango óptimo (45–50°C)</div>
        </div>

        <div className="info-grid mb-6">
          <div className="info-card">
            <div className="info-card-label"><Icon name="calendar_today" style={{ fontSize: 14 }} /> Fecha inicio</div>
            <div className="info-card-value">
              {activeLot ? new Date(activeLot.harvest_date).toLocaleDateString("es-CO", { day: "numeric", month: "short" }) : "—"}
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-label"><Icon name="cached" style={{ fontSize: 14 }} /> Vueltas realizadas</div>
            <div className="info-card-value">
              {turns} <span className="info-card-sub">de {maxTurns}</span>
            </div>
          </div>
        </div>

        <div className="img-card mb-6">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC3aFH3Mny7AQrDQuFegufnP_QFrNJUrNEDDGQT4gHem6kbXgbEoUUGoH7yr9l7_teR70632xMyzGv7e94I5rSjNy9ACKzpxsBpKxumY6J4_zeTZu4PMBk3mIb35B7-05SolOg1wbu3wZ6p9Q7kqeBNBrWEj2YSVyWIoh-w-DdQcBm12y3ceSdx12uEDShN4VWqbUKiDxuqXFx33wqQPtSi0ft83TCQLcXPyb6ddbaueott5SQEmum3qZo8hK-xTzTGzjHRpsPD_UK" alt="Cacao fermentando" />
          <div className="img-overlay"><span>Inspección de calidad visual: Buen desarrollo del color</span></div>
        </div>

        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Acciones diarias</div>
        <div className="space-y">
          <div className="action-card">
            <div className="action-icon"><Icon name="refresh" /></div>
            <div className="action-info">
              <div className="action-name">Volteo (giro)</div>
              <div className="action-sub">
                {lastTurn ? `Último giro a las ${lastTurn}` : "Sin giros registrados"}
              </div>
            </div>
            <button
              className="action-btn"
              onClick={handleRegisterTurn}
              disabled={turns >= maxTurns || saving || !activeLot}
              style={{ opacity: (turns >= maxTurns || !activeLot) ? 0.5 : 1 }}
            >
              {saving ? "..." : turns >= maxTurns ? "Completado" : "Registrar giro"}
            </button>
          </div>
          <div className="action-card muted">
            <div className="action-icon"><Icon name="thermostat" /></div>
            <div className="action-info">
              <div className="action-name">Registrar Temperatura</div>
              <div className="action-sub">Auto-registro via sensor</div>
            </div>
            <button className="action-btn-text">Manual</button>
          </div>
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
};

// ─── INVENTARIO ────────────────────────────────────────────────────────────────
const Inventario = ({ goBack, activeLot, profile, showToast }) => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Campos editables
  const [pesoNeto, setPesoNeto] = useState("");
  const [sacos, setSacos] = useState("");
  const [fechaEntrada, setFechaEntrada] = useState(new Date().toISOString().split("T")[0]);
  const [condPallets, setCondPallets] = useState(false);
  const [condParedes, setCondParedes] = useState(false);
  const [condOlores, setCondOlores] = useState(false);
  const [traceKey, setTraceKey] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!activeLot) { setLoading(false); return; }
      const { data } = await supabase
        .from("inventory")
        .select("*")
        .eq("lot_id", activeLot.id)
        .maybeSingle();
      if (data) {
        setInventory(data);
        setPesoNeto(data.net_weight_kg || "");
        setSacos(data.bag_count || "");
        setFechaEntrada(data.entry_date || new Date().toISOString().split("T")[0]);
        setCondPallets(data.storage_on_pallets || false);
        setCondParedes(data.away_from_walls || false);
        setCondOlores(data.no_strong_odors || false);
        if (data.traceability_key) {
          setTraceKey(data.traceability_key);
          generarQR(data.traceability_key);
        }
      } else {
        // Pre-llenar con datos del lote
        setPesoNeto(activeLot.weight_kg || "");
        setSacos(Math.ceil((activeLot.weight_kg || 0) / 50) || "");
      }
      setLoading(false);
    };
    load();
  }, [activeLot]);

  // Genera QR usando API pública (no requiere librerías)
  const generarQR = (text) => {
    const encoded = encodeURIComponent(text);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encoded}&color=1a1208&bgcolor=ffffff&margin=8`);
  };

  // Auto-calcular sacos cuando cambia el peso
  useEffect(() => {
    if (pesoNeto && !inventory) {
      setSacos(Math.ceil(parseFloat(pesoNeto) / 50) || "");
    }
  }, [pesoNeto]);

  const handleFinalizar = async () => {
    if (!activeLot) return;
    if (!pesoNeto) { showToast("Ingresa el peso neto"); return; }

    setSaving(true);
    const key = `${new Date().getFullYear()}-${activeLot.variety}-${profile?.producer_id || "URB"}-${activeLot.lot_code}`;
    const { data, error } = await supabase
      .from("inventory")
      .upsert({
        lot_id: activeLot.id,
        net_weight_kg: parseFloat(pesoNeto),
        bag_count: parseInt(sacos) || Math.ceil(parseFloat(pesoNeto) / 50),
        entry_date: fechaEntrada,
        storage_on_pallets: condPallets,
        away_from_walls: condParedes,
        no_strong_odors: condOlores,
        traceability_key: key,
        ready_to_sell: true,
        registered_at: new Date().toISOString(),
      }, { onConflict: "lot_id" })
      .select()
      .single();

    setSaving(false);
    if (!error) {
      setInventory(data);
      setTraceKey(key);
      generarQR(key);
      await supabase.from("lots").update({ status: "almacenamiento" }).eq("id", activeLot.id);
      showToast("✓ Lote registrado en almacén");
    } else {
      showToast("Error al guardar");
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
      <span style={{ color: "var(--muted)", fontSize: 14 }}>Cargando...</span>
    </div>
  );

  const yaRegistrado = inventory?.ready_to_sell;
  const condOk = condPallets && condParedes && condOlores;

  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "8px 20px 14px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <button className="header-icon-btn" onClick={goBack}><Icon name="arrow_back_ios_new" /></button>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Almacenamiento</div>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="status-dot" style={{ background: yaRegistrado ? "var(--success)" : "#f59e0b" }} />
            <span style={{ color: yaRegistrado ? "var(--success)" : "#d97706", fontWeight: 800, fontSize: 12 }}>
              {yaRegistrado ? "REGISTRADO" : "PENDIENTE"}
            </span>
          </div>
          <div className="region-tag">URABÁ</div>
        </div>
      </div>

      <div className="page-scroll px py">
        {!activeLot ? (
          <div className="empty-state" style={{ marginTop: 40 }}>
            <div className="empty-state-icon">📦</div>
            <div className="empty-state-text">No hay lotes activos.</div>
          </div>
        ) : (
          <>
            {/* Lote info */}
            <div style={{ background: "var(--primary-light)", border: "1.5px solid rgba(212,115,17,0.2)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Lote en proceso</div>
                <div style={{ fontWeight: 800, fontSize: 16, marginTop: 2 }}>#{activeLot.lot_code}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{activeLot.variety}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{activeLot.parcel_name}</div>
              </div>
            </div>

            {/* ── Campos editables ── */}
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Datos de entrada</div>
            <div className="space-y-sm mb-6">

              {/* Peso neto */}
              <div className="inv-field-row">
                <Icon name="scale" className="inv-field-icon" />
                <div className="inv-field-info">
                  <div className="inv-field-label">Peso neto cacao seco (kg)</div>
                  <input
                    className="inv-input"
                    type="number"
                    placeholder="Ej: 420.5"
                    value={pesoNeto}
                    onChange={e => setPesoNeto(e.target.value)}
                    disabled={yaRegistrado}
                  />
                </div>
              </div>

              {/* Sacos */}
              <div className="inv-field-row">
                <Icon name="inventory_2" className="inv-field-icon" />
                <div className="inv-field-info">
                  <div className="inv-field-label">Número de sacos / costales</div>
                  <input
                    className="inv-input"
                    type="number"
                    placeholder="Auto-calculado"
                    value={sacos}
                    onChange={e => setSacos(e.target.value)}
                    disabled={yaRegistrado}
                  />
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap" }}>~50 kg/saco</div>
              </div>

              {/* Fecha entrada */}
              <div className="inv-field-row">
                <Icon name="calendar_today" className="inv-field-icon" />
                <div className="inv-field-info">
                  <div className="inv-field-label">Fecha de entrada al almacén</div>
                  <input
                    className="inv-input"
                    type="date"
                    value={fechaEntrada}
                    onChange={e => setFechaEntrada(e.target.value)}
                    disabled={yaRegistrado}
                  />
                </div>
              </div>
            </div>

            {/* ── Condiciones ── */}
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
              Condiciones de almacenamiento
            </div>
            <div className="space-y-sm mb-6">
              {[
                { label: "Almacenado sobre pallets", val: condPallets, set: setCondPallets },
                { label: "Alejado de las paredes (mín. 50 cm)", val: condParedes, set: setCondParedes },
                { label: "Sin presencia de olores fuertes", val: condOlores, set: setCondOlores },
              ].map(({ label, val, set }) => (
                <div
                  key={label}
                  className={`cond-check${val ? " checked" : ""}`}
                  onClick={() => !yaRegistrado && set(!val)}
                >
                  <div className="cond-box">{val ? "✓" : ""}</div>
                  <div className="cond-text">{label}</div>
                </div>
              ))}
            </div>

            {/* ── QR / Trazabilidad ── */}
            {traceKey ? (
              <div className="qr-generated mb-6">
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Clave de trazabilidad generada
                </div>
                <div className="qr-canvas-wrap">
                  {qrUrl && <img src={qrUrl} alt="QR" style={{ width: 160, height: 160 }} />}
                </div>
                <div className="trace-key-big">{traceKey}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  Registrado: {inventory?.registered_at ? new Date(inventory.registered_at).toLocaleString("es-CO") : "—"}
                </div>
              </div>
            ) : (
              <div style={{ background: "#f8f7f6", border: "1.5px dashed var(--border)", borderRadius: "var(--radius)", padding: 20, textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>
                  El QR y la clave de trazabilidad<br />se generan al finalizar el registro.
                </div>
              </div>
            )}
          </>
        )}
        <div style={{ height: 10 }} />
      </div>

      {/* Footer */}
      {activeLot && (
        <div className="footer-actions">
          <button
            className="primary-btn"
            onClick={handleFinalizar}
            disabled={saving || yaRegistrado}
          >
            <Icon name={yaRegistrado ? "check_circle" : "cloud_upload"} />
            {saving ? "Guardando..." : yaRegistrado ? "Registrado ✓" : "Finalizar & Generar QR"}
          </button>
          {yaRegistrado && (
            <button className="secondary-btn" onClick={() => window.open(qrUrl, "_blank")}>
              <Icon name="share" /> Compartir comprobante
            </button>
          )}
          <div style={{ height: 4 }} />
        </div>
      )}
    </div>
  );
};

// ─── PARCELAS ──────────────────────────────────────────────────────────────────
const Parcelas = ({ userId, showToast }) => {
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nombre, setNombre] = useState("");
  const [hectareas, setHectareas] = useState(1);
  const [arboles, setArboles] = useState(100);

  const cargar = async () => {
    setLoading(true);
    const { data } = await supabase.from("parcelas").select("*").eq("farmer_id", userId).order("created_at", { ascending: false });
    setParcelas(data || []);
    setLoading(false);
  };
  useEffect(() => { cargar(); }, [userId]);

  const resetForm = () => { setNombre(""); setHectareas(1); setArboles(100); };

  const handleGuardar = async () => {
    if (!nombre.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.from("parcelas")
      .insert({ farmer_id: userId, nombre: nombre.trim(), hectareas: parseFloat(hectareas), num_arboles: parseInt(arboles) })
      .select().single();
    setSaving(false);
    if (!error) { setParcelas(prev => [data, ...prev]); showToast("✓ Parcela registrada"); setShowModal(false); resetForm(); }
    else showToast("Error al guardar");
  };

  const handleEliminar = async (id) => {
    await supabase.from("parcelas").delete().eq("id", id);
    setParcelas(prev => prev.filter(p => p.id !== id));
    showToast("Parcela eliminada");
  };

  const totalHa = parcelas.reduce((s, p) => s + (p.hectareas || 0), 0);
  const totalArboles = parcelas.reduce((s, p) => s + (p.num_arboles || 0), 0);
  const sliderHaPct = (((hectareas - 0.5) / 49.5) * 100).toFixed(1);
  const sliderArPct = (((arboles - 10) / 1990) * 100).toFixed(1);

  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div style={{ padding: "8px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17 }}>Mis Parcelas</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Terrenos de tu finca</div>
        </div>
        <button className="primary-btn" style={{ width: "auto", padding: "10px 18px", fontSize: 13, borderRadius: 12 }} onClick={() => setShowModal(true)}>
          <Icon name="add" /> Nueva
        </button>
      </div>

      <div className="page-scroll px">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}><div className="spinner" /></div>
        ) : parcelas.length === 0 ? (
          <div className="empty-state" style={{ marginTop: 32 }}>
            <div className="empty-state-icon">🌿</div>
            <div className="empty-state-text">Aún no tienes parcelas.<br />Agrega los terrenos de tu finca.</div>
          </div>
        ) : (
          <>
            <div className="space-y" style={{ paddingTop: 4 }}>
              {parcelas.map(p => (
                <div key={p.id} className="parcel-card">
                  <div className="parcel-icon">🌿</div>
                  <div className="parcel-info">
                    <div className="parcel-name">{p.nombre}</div>
                    <div className="parcel-chips">
                      <span className="parcel-chip primary"><Icon name="straighten" style={{ fontSize: 11 }} /> {p.hectareas} ha</span>
                      <span className="parcel-chip">🌱 {p.num_arboles?.toLocaleString("es-CO")} árboles</span>
                    </div>
                  </div>
                  <button className="parcel-delete-btn" onClick={() => handleEliminar(p.id)}>
                    <Icon name="delete_outline" style={{ fontSize: 18 }} />
                  </button>
                </div>
              ))}
            </div>
            <div className="parcelas-summary">
              <div><div className="summary-val">{parcelas.length}</div><div className="summary-lbl">Parcelas</div></div>
              <div><div className="summary-val">{totalHa.toFixed(1)}</div><div className="summary-lbl">Hectáreas</div></div>
              <div><div className="summary-val">{totalArboles >= 1000 ? (totalArboles / 1000).toFixed(1) + "k" : totalArboles}</div><div className="summary-lbl">Árboles</div></div>
            </div>
          </>
        )}
        <div style={{ height: 20 }} />
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); resetForm(); } }}>
          <div className="modal-sheet">
            <div className="modal-handle" />
            <div className="modal-title">Nueva Parcela</div>
            <div className="space-y mb-6">
              <div>
                <div className="field-label">Nombre o código</div>
                <div className="field-wrap">
                  <input className="field-input" placeholder='Ej: "Lote 1", "La Cañada"' value={nombre} onChange={e => setNombre(e.target.value)} autoFocus />
                  <Icon name="terrain" className="field-icon" />
                </div>
              </div>
              <div>
                <div className="field-label">Tamaño</div>
                <div className="size-display">{Number(hectareas).toFixed(1)}</div>
                <div className="size-unit">hectáreas</div>
                <input type="range" min="0.5" max="50" step="0.5" value={hectareas} onChange={e => setHectareas(e.target.value)} className="size-slider" style={{ "--pct": `${sliderHaPct}%` }} />
                <div className="size-row"><span>0.5 ha</span><span>50 ha</span></div>
              </div>
              <div>
                <div className="field-label">Número de árboles de cacao</div>
                <div className="size-display">{Number(arboles).toLocaleString("es-CO")}</div>
                <div className="size-unit">árboles · densidad ~{hectareas > 0 ? Math.round(arboles / hectareas) : 0} por ha</div>
                <input type="range" min="10" max="2000" step="10" value={arboles} onChange={e => setArboles(e.target.value)} className="size-slider" style={{ "--pct": `${sliderArPct}%` }} />
                <div className="size-row"><span>10</span><span>2,000</span></div>
              </div>
            </div>
            <button className="primary-btn" onClick={handleGuardar} disabled={saving || !nombre.trim()}>
              {saving ? "Guardando..." : "Registrar Parcela"} <Icon name="check" style={{ fontSize: 16 }} />
            </button>
            <button className="secondary-btn" style={{ marginTop: 10 }} onClick={() => { setShowModal(false); resetForm(); }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── REGISTRO ──────────────────────────────────────────────────────────────────
const Registro = ({ goBack, userId, showToast, onLotCreated, navigate }) => {
  const [variety, setVariety] = useState("CCN51");
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(false);
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split("T")[0]);
  const [parcelId, setParcelId] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [parcelas, setParcelas] = useState([]);
  const [loadingParcelas, setLoadingParcelas] = useState(true);

  // Variedades dinámicas
  const [varieties, setVarieties] = useState([
    { key: "CCN51", type: "HÍBRIDO" },
    { key: "ICS95", type: "CLON" },
    { key: "Mezclado", type: "OTRO" },
  ]);
  const [showAddVariety, setShowAddVariety] = useState(false);
  const [newVarietyName, setNewVarietyName] = useState("");
  const [newVarietyType, setNewVarietyType] = useState("CLON");

  useEffect(() => {
    setLoadingParcelas(true);
    supabase.from("parcelas").select("id,nombre,hectareas,num_arboles")
      .eq("farmer_id", userId).order("created_at", { ascending: false })
      .then(({ data }) => {
        const lista = data || [];
        setParcelas(lista);
        if (lista.length > 0) setParcelId(lista[0].id);
        setLoadingParcelas(false);
      });
  }, [userId]);

  const handleAddVariety = () => {
    const nombre = newVarietyName.trim().toUpperCase();
    if (!nombre) return;
    if (varieties.find(v => v.key === nombre)) {
      showToast("Esa variedad ya existe");
      return;
    }
    const nueva = { key: nombre, type: newVarietyType };
    setVarieties(prev => [...prev, nueva]);
    setVariety(nombre);
    setNewVarietyName("");
    setShowAddVariety(false);
    showToast(`✓ Variedad "${nombre}" agregada`);
  };

  const parcelaSeleccionada = parcelas.find(p => p.id === parcelId);

  const handleSubmit = async () => {
    if (!harvestDate || !weightKg) {
      setError("Por favor completa la fecha y el peso de la cosecha.");
      return;
    }
    if (!parcelId) {
      setError("Debes seleccionar una parcela.");
      return;
    }
    setSaving(true);
    setError(null);
    const lotCode = `${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`;
    const { data, error: dbError } = await supabase
      .from("lots")
      .insert({
        farmer_id: userId,
        lot_code: lotCode,
        variety,
        parcel_name: parcelaSeleccionada?.nombre || "",
        parcel_id: parcelId,
        harvest_date: harvestDate,
        weight_kg: parseFloat(weightKg),
        status: "fermentacion",
        quality_ripe: check1,
        quality_cut: check2,
      })
      .select()
      .single();
    setSaving(false);
    if (dbError) {
      setError("Error al guardar el lote: " + dbError.message);
    } else {
      showToast(`✓ Lote #${data.lot_code} registrado`);
      onLotCreated(data);
      goBack();
    }
  };

  const tiposVariedad = ["CLON", "HÍBRIDO", "NATIVO", "OTRO"];

  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div className="page-header px">
        <button className="header-icon-btn" onClick={goBack}><Icon name="chevron_left" /></button>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Registrar Cosecha</div>
        <div style={{ width: 40 }} />
      </div>

      <div className="px" style={{ marginBottom: 16 }}>
        <div className="stepper">
          <div className="step-bar done" /><div className="step-bar" /><div className="step-bar" /><div className="step-bar" />
        </div>
        <div className="step-label">Paso 1: Recolección de la cosecha</div>
      </div>

      <div className="page-scroll px">
        <div className="img-card mb-6" style={{ height: 120 }}>
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBauwPrRfvqyp-MFsQfoPRhFL7KrlYRavesJJcKPmF1R8m-IQm2sx54TKZyG_Of4HX5aaHmUo5U87eTaz11e6fYlhs-xV3ZZKHcsZA1loxPjoT3cKRrcTNS2VGyUFgF1eh-JdIOEwaOM4-mKv98q3Gk0ApzDmbM1evYuW3jw2xYEfEavkN8to8YHd4xqM1e9t3P0ZPJ2tO5XIXsSpEYo4CWupY9fHev5_cn3mWN5Ek8Ob-VbSzPYCUg8Pisob8TdhWqXyXrX8ID40HJ" alt="Cocoa pod" />
          <div className="img-overlay"><span>Trazabilidad de la Región de Urabá</span></div>
        </div>

        {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

        <div className="space-y mb-6">

          {/* Fecha */}
          <div>
            <div className="field-label">Fecha de cosecha</div>
            <div className="field-wrap">
              <input type="date" value={harvestDate} onChange={e => setHarvestDate(e.target.value)} className="field-input" style={{ paddingRight: 44 }} />
              <Icon name="calendar_today" className="field-icon" />
            </div>
          </div>

          {/* Peso */}
          <div>
            <div className="field-label">Peso aproximado (kg)</div>
            <div className="field-wrap">
              <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} placeholder="Ej: 450.5" className="field-input" />
              <Icon name="scale" className="field-icon" />
            </div>
          </div>

          {/* Parcela */}
          <div>
            <div className="field-label">Parcela de origen</div>
            {loadingParcelas ? (
              <div style={{ padding: "14px 0" }}><div className="spinner" style={{ width: 24, height: 24, margin: "0 auto" }} /></div>
            ) : parcelas.length === 0 ? (
              <div onClick={() => navigate && navigate("parcelas")} style={{ background: "#fef3e8", border: "1.5px dashed rgba(212,115,17,0.4)", borderRadius: "var(--radius-sm)", padding: "16px", fontSize: 13, color: "var(--primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <Icon name="add_circle_outline" style={{ fontSize: 20 }} />
                <div>
                  <div>No tienes parcelas registradas</div>
                  <div style={{ fontSize: 11, fontWeight: 500, marginTop: 2 }}>Toca aquí para agregar tus terrenos →</div>
                </div>
              </div>
            ) : (
              <>
                <div className="field-wrap">
                  <select className="field-select" value={parcelId} onChange={e => setParcelId(e.target.value)} style={{ paddingRight: 44 }}>
                    {parcelas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                  <Icon name="expand_more" className="field-icon" />
                </div>
                {parcelaSeleccionada && (
                  <div style={{ marginTop: 8, background: "var(--primary-light)", borderRadius: "var(--radius-sm)", padding: "10px 14px", display: "flex", gap: 16, fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>🌿 {parcelaSeleccionada.hectareas} ha</span>
                    <span style={{ color: "var(--muted)", fontWeight: 600 }}>🌱 {parcelaSeleccionada.num_arboles?.toLocaleString("es-CO")} árboles</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Variedad con botón + */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div className="field-label" style={{ margin: 0 }}>Variedad de cacao</div>
              <button
                onClick={() => setShowAddVariety(true)}
                style={{ background: "var(--primary-light)", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, color: "var(--primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                <Icon name="add" style={{ fontSize: 14 }} /> Nueva
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {varieties.map(v => (
                <button
                  key={v.key}
                  className={`variety-btn${variety === v.key ? " selected" : ""}`}
                  style={{ flex: "1 1 80px", minWidth: 80 }}
                  onClick={() => setVariety(v.key)}
                >
                  <span className="variety-type">{v.type}</span>
                  <span className="variety-name">{v.key}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Control calidad */}
        <div className="mb-6">
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Icon name="verified" style={{ color: "var(--primary)", fontSize: 16 }} />
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>Control de calidad</span>
          </div>
          <div className="space-y-sm">
            <label className="check-label">
              <input type="checkbox" checked={check1} onChange={e => setCheck1(e.target.checked)} />
              <span className="check-text">Solo se seleccionan frutas maduras</span>
            </label>
            <label className="check-label">
              <input type="checkbox" checked={check2} onChange={e => setCheck2(e.target.checked)} />
              <span className="check-text">Corte limpio (cojín floral protegido)</span>
            </label>
          </div>
        </div>
        <div style={{ height: 100 }} />
      </div>

      <div className="footer-actions">
        <button className="primary-btn" onClick={handleSubmit} disabled={saving || parcelas.length === 0}>
          {saving ? "Guardando..." : "Registrar & Continuar"} <Icon name="arrow_forward" style={{ fontSize: 16 }} />
        </button>
        <div style={{ height: 4 }} />
      </div>

      {/* Modal agregar variedad */}
      {showAddVariety && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowAddVariety(false); }}>
          <div className="modal-sheet">
            <div className="modal-handle" />
            <div className="modal-title">Nueva Variedad</div>

            <div className="space-y mb-6">
              <div>
                <div className="field-label">Nombre de la variedad</div>
                <div className="field-wrap">
                  <input
                    className="field-input"
                    placeholder='Ej: TSH565, ICS1, Amelonado...'
                    value={newVarietyName}
                    onChange={e => setNewVarietyName(e.target.value.toUpperCase())}
                    autoFocus
                  />
                  <Icon name="eco" className="field-icon" />
                </div>
              </div>
              <div>
                <div className="field-label">Tipo</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {tiposVariedad.map(t => (
                    <button
                      key={t}
                      onClick={() => setNewVarietyType(t)}
                      style={{
                        flex: 1, padding: "10px 4px", borderRadius: "var(--radius-sm)",
                        border: `1.5px solid ${newVarietyType === t ? "var(--primary)" : "var(--border)"}`,
                        background: newVarietyType === t ? "var(--primary-light)" : "white",
                        fontFamily: "inherit", fontSize: 11, fontWeight: 700,
                        color: newVarietyType === t ? "var(--primary)" : "var(--muted)",
                        cursor: "pointer"
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="primary-btn" onClick={handleAddVariety} disabled={!newVarietyName.trim()}>
              Agregar variedad <Icon name="check" style={{ fontSize: 16 }} />
            </button>
            <button className="secondary-btn" style={{ marginTop: 10 }} onClick={() => setShowAddVariety(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(undefined); // undefined = cargando
  const [profile, setProfile] = useState(null);
  const [lots, setLots] = useState([]);
  const [page, setPage] = useState("panel");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // Escuchar cambios de sesión (login / logout / deep link de OAuth)
  useEffect(() => {
    // 1. Sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Ignorar eventos que no cambian el estado real
      if (event === 'TOKEN_REFRESHED') return;
      if (event === 'INITIAL_SESSION') return;
      setSession(session);
    });

    // 3. Deep link Android: procesar código OAuth cuando regresa de Google
    const listenerPromise = CapApp.addListener('appUrlOpen', async ({ url }) => {
      if (!url.startsWith('com.trazabilidad.app://')) return;
      try {
        await Browser.close();
        const urlObj = new URL(url.replace('com.trazabilidad.app://', 'https://x.com/'));
        const code = urlObj.searchParams.get('code');
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error && data?.session) {
            setSession(data.session);
          }
        } else {
          const { data } = await supabase.auth.getSession();
          if (data?.session) setSession(data.session);
        }
      } catch (e) {
        console.error('Error en deep link:', e);
      }
    });

    return () => {
      subscription.unsubscribe();
      listenerPromise.then(l => l.remove()).catch(() => {});
    };
  }, []);

  // Cargar perfil y lotes al hacer login
  useEffect(() => {
    if (!session) { setProfile(null); setLots([]); return; }
    const userId = session.user.id;

    // Cargar perfil, crearlo si no existe
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle()
    .then(async ({ data }) => {
      if (data) {
        setProfile(data);
      } else {
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            full_name: session.user.user_metadata?.full_name || "Agricultor",
            avatar_url: session.user.user_metadata?.avatar_url || null,
            producer_id: "URB-" + Math.floor(Math.random() * 9999 + 1).toString().padStart(4, "0"),
          })
          .select()
          .single();
        setProfile(newProfile);
      }
    });

    // Lotes del agricultor, ordenados por fecha reciente
    supabase.from("lots").select("*").eq("farmer_id", userId).order("created_at", { ascending: false })
      .then(({ data }) => setLots(data || []));
  }, [session]);

  const navigate = (p) => setPage(p);
  const goBack = () => setPage("panel");
  const activeLot = lots.find(l => l.status === "fermentacion") || lots[0];

  // Pantalla de carga inicial
  if (session === undefined) {
    return (
      <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <IonicStyles />
        <div className="app-shell">
          <div className="loading-screen">
            <div className="login-logo">🍫</div>
            <div className="spinner" />
            <span style={{ color: "var(--muted)", fontSize: 14 }}>Iniciando...</span>
          </div>
        </div>
      </>
    );
  }

  // Pantalla de login
  if (!session) {
    return (
      <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <IonicStyles />
        <div className="app-shell">
          <StatusBar />
          <LoginScreen onLogin={setSession} />
        </div>
      </>
    );
  }

  // App principal
  const pages = {
    panel: <Panel navigate={navigate} profile={profile} lots={lots} />,
    fermentacion: <Fermentacion goBack={goBack} activeLot={activeLot} showToast={showToast} />,
    inventario: <Inventario goBack={goBack} activeLot={activeLot} profile={profile} showToast={showToast} />,
    parcelas: <Parcelas userId={session.user.id} showToast={showToast} />,
    registro: (
      <Registro
        goBack={goBack}
        navigate={navigate}
        userId={session.user.id}
        showToast={showToast}
        onLotCreated={(newLot) => setLots(prev => [newLot, ...prev])}
      />
    ),
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <IonicStyles />
      <div className="app-shell">
        <StatusBar />
        {pages[page]}
        <BottomNav active={page} onChange={navigate} />
        <Toast message={toast} />
      </div>
    </>
  );
}
