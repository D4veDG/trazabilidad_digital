import { useState } from "react";

// ─── Ionic CSS (CDN via @import in style tag) ───────────────────────────────
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

    /* ─── PANEL (Home) ─────────────────────────────── */
    .panel-header {
      padding: 16px 20px 20px;
    }
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
    .lot-label {
      font-size: 10px; font-weight: 800; letter-spacing: 0.12em;
      text-transform: uppercase; color: var(--primary);
    }
    .page-title { font-size: 17px; font-weight: 800; }

    /* Timeline */
    .timeline-wrap { position: relative; display: flex; justify-content: space-between; align-items: flex-start; }
    .timeline-track {
      position: absolute;
      top: 16px; left: 0; right: 0; height: 2px;
      background: #ede9e4;
    }
    .timeline-progress {
      position: absolute;
      top: 16px; left: 0;
      height: 2px;
      background: var(--primary);
      transition: width 0.5s;
    }
    .day-node {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      position: relative; z-index: 1;
    }
    .day-circle {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 800;
      background: #ede9e4;
      color: var(--muted);
      transition: all 0.3s;
    }
    .day-circle.done { background: var(--primary); color: white; }
    .day-circle.current {
      width: 40px; height: 40px;
      background: var(--primary);
      color: white;
      box-shadow: 0 0 0 6px var(--primary-light);
    }
    .day-label { font-size: 10px; font-weight: 700; color: var(--muted); }
    .day-label.current-label { color: var(--primary); font-weight: 800; }

    /* Temperature gauge */
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
    .info-card {
      background: white;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 14px;
    }
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
    .action-card.muted {
      background: white;
      border-color: var(--border);
      opacity: 0.6;
    }
    .action-icon {
      width: 42px; height: 42px; border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .action-card.muted .action-icon { background: #f3f0ed; color: var(--muted); }
    .action-info { flex: 1; margin: 0 12px; }
    .action-name { font-size: 14px; font-weight: 700; }
    .action-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
    .action-btn {
      background: var(--primary);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      padding: 9px 16px;
      font-family: inherit;
      font-size: 13px; font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px var(--primary-glow);
      white-space: nowrap;
      transition: all 0.2s;
    }
    .action-btn:active { transform: scale(0.97); }
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
      background: var(--primary-light);
      color: var(--primary);
      border: 1px solid rgba(212,115,17,0.2);
      border-radius: 999px;
      font-size: 10px; font-weight: 800;
      padding: 5px 12px;
      letter-spacing: 0.06em;
    }
    .summary-card {
      background: #f8f7f6;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
    }
    .weight-card {
      background: white;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 16px;
      grid-column: span 2;
    }
    .weight-number { font-size: 44px; font-weight: 800; line-height: 1; }
    .weight-unit { font-size: 24px; font-weight: 700; color: var(--primary); }
    .sub-card {
      background: white;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 14px;
    }
    .sub-number { font-size: 28px; font-weight: 800; }

    .checklist-item {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px;
      background: white;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
    }
    .check-icon {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--primary-light);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; color: var(--primary);
      flex-shrink: 0;
    }
    .checklist-text { font-size: 14px; font-weight: 500; }

    .traceability-card {
      background: var(--primary-light);
      border: 1.5px solid rgba(212,115,17,0.15);
      border-radius: var(--radius);
      padding: 16px;
      display: flex; align-items: center; gap: 14px;
    }
    .qr-box {
      width: 64px; height: 64px;
      background: white;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      padding: 4px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
    }
    .qr-box img { width: 100%; height: 100%; object-fit: contain; }
    .trace-key { font-size: 10px; font-weight: 800; color: var(--primary); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
    .trace-lot { font-family: 'Space Mono', monospace; font-size: 13px; color: var(--muted); line-height: 1.4; }
    .trace-sync { font-size: 10px; color: var(--muted); margin-top: 4px; }

    .map-card { height: 96px; border-radius: var(--radius); overflow: hidden; position: relative; border: 1.5px solid var(--border); }
    .map-card img { width: 100%; height: 100%; object-fit: cover; }
    .map-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
      display: flex; align-items: flex-end; padding: 10px 12px;
      color: white; font-size: 12px; font-weight: 600;
      gap: 5px;
    }

    .footer-actions { padding: 16px 20px 8px; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--border); flex-shrink: 0; }
    .secondary-btn {
      width: 100%;
      background: white;
      color: var(--text);
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 13px;
      font-family: inherit;
      font-size: 14px; font-weight: 700;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
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
      width: 100%;
      background: #f8f7f6;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 14px 16px;
      font-family: inherit;
      font-size: 14px;
      color: var(--text);
      outline: none;
      transition: border-color 0.2s;
      appearance: none;
    }
    .field-input:focus, .field-select:focus { border-color: var(--primary); background: white; }
    .field-icon {
      position: absolute; right: 14px; top: 50%;
      transform: translateY(-50%);
      font-size: 18px; color: var(--muted);
      pointer-events: none;
    }

    .variety-grid { display: flex; gap: 8px; }
    .variety-btn {
      flex: 1;
      padding: 12px 8px;
      border-radius: var(--radius-sm);
      border: 1.5px solid var(--border);
      background: white;
      font-family: inherit;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .variety-btn.selected { border-color: var(--primary); background: var(--primary-light); }
    .variety-type { font-size: 9px; font-weight: 700; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; display: block; margin-bottom: 4px; }
    .variety-name { font-size: 13px; font-weight: 800; color: var(--text); }
    .variety-btn.selected .variety-name { color: var(--primary); }

    .check-label {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px;
      background: #f8f7f6;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .check-label input[type="checkbox"] {
      width: 20px; height: 20px; border-radius: 6px;
      accent-color: var(--primary);
      cursor: pointer; flex-shrink: 0;
    }
    .check-text { font-size: 13px; font-weight: 500; }

    .px { padding-left: 20px; padding-right: 20px; }
    .py { padding-top: 12px; padding-bottom: 12px; }
    .space-y > * + * { margin-top: 12px; }
    .space-y-sm > * + * { margin-top: 8px; }
    .mb-6 { margin-bottom: 20px; }
    .mb-4 { margin-bottom: 14px; }
    .mb-2 { margin-bottom: 8px; }
    .mt-4 { margin-top: 14px; }

    /* Transitions */
    .page-enter { animation: fadeSlideIn 0.3s ease both; }
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .material-icons { font-family: 'Material Icons'; font-style: normal; font-size: 20px; display: inline-block; vertical-align: middle; line-height: 1; }
  `}</style>
);

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, style }) => <span className="material-icons" style={style}>{name}</span>;

// ─── Status Bar ────────────────────────────────────────────────────────────────
const StatusBar = () => (
  <div className="status-bar">
    <span>9:41</span>
    <div className="status-icons">
      <Icon name="signal_cellular_alt" /><Icon name="wifi" /><Icon name="battery_full" />
    </div>
  </div>
);

// ─── Bottom Nav ────────────────────────────────────────────────────────────────
const BottomNav = ({ active, onChange }) => {
  const tabs = [
    { id: "panel", icon: "dashboard", label: "Inicio" },
    { id: "fermentacion", icon: "inventory_2", label: "Proceso" },
    { id: "inventario", icon: "analytics", label: "Almacén" },
    { id: "registro", icon: "agriculture", label: "Registro" },
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

// ─── PANEL (Home) ─────────────────────────────────────────────────────────────
const Panel = ({ navigate }) => {
  const stages = [
    { id: "registro", icon: "🌾", name: "Cosecha", status: "Listo para empezar" },
    { id: "registro", icon: "📦", name: "Desgrane", status: "Pendiente" },
    { id: "fermentacion", icon: "⚗️", name: "Fermentacion", status: "EN PROGRESO", active: true },
    { id: "panel", icon: "☀️", name: "Secado", status: "Próxima etapa" },
    { id: "panel", icon: "✨", name: "Limpieza", status: "Clasificación" },
    { id: "inventario", icon: "🏭", name: "Almacenamiento", status: "Embolsado" },
  ];
  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div className="page-scroll">
        {/* Header */}
        <div className="panel-header px">
          <div className="farmer-row">
            <div className="farmer-info">
              <div className="avatar">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZoU7OPDWsfM2M4980y9EO-lKzYTtt7oTRw3NC7vuQ3aYVYGIVKyxFajIspJvrsjzCqX9dbPEbrb3dpLa4WH3JntWHuE37x5xq5cU7CCyU2Tw6_0f7gwShgIhdIzYqin2KueCPaT9y5PqSV7BVFuo73yvc3puccyh2Ondh3nV_eH_XNpz0t5OTYtg-8pQmcx3NeNVhwQUwweeKNin3hUZqawNujwc83Vwv4GbenhUyWteW90M2Jk0n7M0TFClVp3RGHJebWM1PU8fs" alt="Yamit Genes" />
              </div>
              <div>
                <div className="farmer-name">Yamit Genes</div>
                <div className="farmer-loc"><Icon name="location_on" style={{fontSize:12}} /> Urabá, Antioquia</div>
              </div>
            </div>
            <button className="header-icon-btn"><Icon name="notifications_none" /></button>
          </div>
        </div>

        {/* CTA */}
        <div className="px mb-6">
          <button className="primary-btn" onClick={() => navigate("registro")}>
            <Icon name="add_circle_outline" /> Registrar nuevo lote
          </button>
        </div>

        {/* Active Lot */}
        <div className="px mb-6">
          <div className="section-title">Actividad reciente</div>
          <div className="active-lot-card" onClick={() => navigate("fermentacion")} style={{cursor:"pointer"}}>
            <div className="ring-progress">
              <svg viewBox="0 0 52 52" width="52" height="52">
                <circle cx="26" cy="26" r="22" fill="none" stroke="#ede9e4" strokeWidth="5"/>
                <circle cx="26" cy="26" r="22" fill="none" stroke="var(--primary)" strokeWidth="5"
                  strokeDasharray={`${2*Math.PI*22*0.65} ${2*Math.PI*22}`} strokeLinecap="round"/>
              </svg>
              <div className="ring-text">65%</div>
            </div>
            <div className="lot-badge">Lote #204-B</div>
            <div className="lot-title">Etapa de Fermentacion</div>
            <div className="lot-desc">La fermentación comenzó hace 36 horas. Se estima que finalizará en: Oct 24.</div>
            <div className="lot-chips">
              <div className="chip"><Icon name="thermostat" style={{fontSize:14}} /> 45°C</div>
              <div className="chip"><Icon name="water_drop" style={{fontSize:14}} /> 7.2 pH</div>
            </div>
          </div>
        </div>

        {/* Stages */}
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

// ─── FERMENTACION ─────────────────────────────────────────────────────────────
const Fermentacion = ({ goBack }) => {
  const total = 7;
  const maxTurns = 6;
  const [selectedDay, setSelectedDay] = useState(1);
  const [turns, setTurns] = useState(0);
  const [lastTurn, setLastTurn] = useState(null);
  const progressPct = ((selectedDay - 1) / (total - 1)) * 100;

  const handleRegisterTurn = () => {
    if (turns < maxTurns) {
      setTurns(t => t + 1);
      setLastTurn(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));
    }
  };

  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div className="page-header px">
        <button className="header-icon-btn" onClick={goBack}><Icon name="arrow_back_ios" /></button>
        <div style={{textAlign:"center"}}>
          <div className="page-title">Fermentación</div>
          <div className="lot-label">Lote #URB-2023-084</div>
        </div>
        <button className="header-icon-btn"><Icon name="more_horiz" /></button>
      </div>

      <div className="page-scroll px">
        {/* Timeline — días seleccionables */}
        <div className="mb-6">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:15}}>Proceso</div>
            <div style={{background:"var(--primary-light)",color:"var(--primary)",padding:"4px 12px",borderRadius:999,fontSize:11,fontWeight:700}}>
              Día {selectedDay} de {total}
            </div>
          </div>
          <div className="timeline-wrap">
            <div className="timeline-track" />
            <div className="timeline-progress" style={{width:`${progressPct}%`}} />
            {Array.from({length: total}, (_,i) => {
              const d = i + 1;
              const done = d < selectedDay;
              const current = d === selectedDay;
              return (
                <div className="day-node" key={d} onClick={() => setSelectedDay(d)} style={{cursor:"pointer"}}>
                  <div className={`day-circle${done?" done":""}${current?" current":""}`}>
                    {done ? <Icon name="check" style={{fontSize:14,color:"white"}} /> : d}
                  </div>
                  <div className={`day-label${current?" current-label":""}`}>{current ? "Hoy" : `D${d}`}</div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:10,fontSize:11,color:"var(--muted)",textAlign:"center"}}>
            Toca un día para seleccionarlo
          </div>
        </div>

        {/* Gauge */}
        <div className="gauge-card mb-6">
          <div className="gauge-label">Temperatura</div>
          <div className="gauge-svg-wrap">
            <svg viewBox="0 0 180 90" width="180" height="90">
              <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="#ede9e4" strokeWidth="14" strokeLinecap="round"/>
              <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="var(--primary)" strokeWidth="14" strokeLinecap="round"
                strokeDasharray="219.9" strokeDashoffset="60"/>
              <line x1="90" y1="90" x2="90" y2="18" stroke="#1a1208" strokeWidth="3" strokeLinecap="round"
                transform="rotate(40, 90, 90)"/>
              <circle cx="90" cy="90" r="7" fill="#1a1208"/>
            </svg>
          </div>
          <div style={{marginTop:8,textAlign:"center"}}>
            <span className="temp-value">48.2</span><span className="temp-unit"> °C</span>
          </div>
          <div className="temp-ok"><Icon name="check_circle" style={{fontSize:14}} /> Rango óptimo (45–50°C)</div>
        </div>

        {/* Info cards */}
        <div className="info-grid mb-6">
          <div className="info-card">
            <div className="info-card-label"><Icon name="calendar_today" style={{fontSize:14}} /> Fecha inicio</div>
            <div className="info-card-value">{new Date().toLocaleDateString("es-CO",{day:"numeric",month:"short",year:"numeric"})}</div>
          </div>
          <div className="info-card">
            <div className="info-card-label"><Icon name="cached" style={{fontSize:14}} /> Vueltas realizadas</div>
            <div className="info-card-value">
              {turns} <span className="info-card-sub">de {maxTurns} total</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="img-card mb-6">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC3aFH3Mny7AQrDQuFegufnP_QFrNJUrNEDDGQT4gHem6kbXgbEoUUGoH7yr9l7_teR70632xMyzGv7e94I5rSjNy9ACKzpxsBpKxumY6J4_zeTZu4PMBk3mIb35B7-05SolOg1wbu3wZ6p9Q7kqeBNBrWEj2YSVyWIoh-w-DdQcBm12y3ceSdx12uEDShN4VWqbUKiDxuqXFx33wqQPtSi0ft83TCQLcXPyb6ddbaueott5SQEmum3qZo8hK-xTzTGzjHRpsPD_UK" alt="Cocoa fermenting" />
          <div className="img-overlay"><span>Inspección de calidad visual: Buen desarrollo del color</span></div>
        </div>

        {/* Actions */}
        <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>Acciones diarias</div>
        <div className="space-y">
          <div className="action-card">
            <div className="action-icon"><Icon name="refresh" /></div>
            <div className="action-info">
              <div className="action-name">Volteo (giro)</div>
              <div className="action-sub">
                {lastTurn ? `Último giro registrado a las ${lastTurn}` : "Sin giros registrados aún"}
              </div>
            </div>
            <button
              className="action-btn"
              onClick={handleRegisterTurn}
              style={{opacity: turns >= maxTurns ? 0.5 : 1, cursor: turns >= maxTurns ? "not-allowed" : "pointer"}}
              disabled={turns >= maxTurns}
            >
              {turns >= maxTurns ? "Completado" : "Registrar giro"}
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

        {/* Reset */}
        <div style={{textAlign:"center",marginTop:20,marginBottom:8}}>
          <button
            onClick={() => { setSelectedDay(1); setTurns(0); setLastTurn(null); }}
            style={{background:"none",border:"1.5px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"8px 20px",fontSize:12,fontWeight:700,color:"var(--muted)",cursor:"pointer",fontFamily:"inherit"}}
          >
            <Icon name="restart_alt" style={{fontSize:14,marginRight:4}} /> Reiniciar proceso
          </button>
        </div>
        <div style={{height:20}}/>
      </div>
    </div>
  );
};

// ─── INVENTARIO ─────────────────────────────────────────────────────────────
const Inventario = ({ goBack }) => (
  <div className="page-enter" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
    {/* Header */}
    <div style={{padding:"8px 20px 16px", borderBottom:"1px solid var(--border)", flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <button className="header-icon-btn" onClick={goBack}><Icon name="arrow_back_ios_new" /></button>
        <div style={{fontWeight:800,fontSize:16}}>Resumen de Inventario</div>
        <div style={{width:40}}/>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",letterSpacing:"0.08em",textTransform:"uppercase"}}>Estado del lote</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
            <div className="status-dot"/>
            <span style={{color:"var(--success)",fontWeight:800,fontSize:13,letterSpacing:"0.03em"}}>LISTO PARA VENDER</span>
          </div>
        </div>
        <div className="region-tag">REGIÓN URABÁ</div>
      </div>
    </div>

    <div className="page-scroll px py">
      {/* Summary */}
      <div className="summary-card mb-6">
        <div className="grid-2">
          <div className="weight-card">
            <div style={{fontSize:11,fontWeight:600,color:"var(--muted)",marginBottom:6}}>Peso neto (cacao seco)</div>
            <div style={{display:"flex",alignItems:"baseline",gap:8}}>
              <span className="weight-number">450.5</span>
              <span className="weight-unit">kg</span>
            </div>
          </div>
          <div className="sub-card">
            <div style={{fontSize:11,fontWeight:600,color:"var(--muted)",marginBottom:6}}>Sacos (Fique)</div>
            <div style={{display:"flex",alignItems:"baseline",gap:6}}>
              <span className="sub-number">9</span>
              <span style={{fontSize:12,color:"var(--muted)"}}>unidades</span>
            </div>
          </div>
          <div className="sub-card">
            <div style={{fontSize:11,fontWeight:600,color:"var(--muted)",marginBottom:6}}>ID del productor</div>
            <div style={{fontWeight:800,fontSize:17,letterSpacing:"0.02em"}}>URB-8924</div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="mb-6">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase"}}>
            <Icon name="warehouse" style={{color:"var(--primary)",fontSize:18}} /> Condiciones de almacenamiento
          </div>
          <span style={{fontSize:10,fontWeight:700,color:"var(--muted)"}}>VERIFICADA</span>
        </div>
        <div className="space-y-sm">
          {["Almacenado en pallets","Colocado lejos de las paredes","No hay presencia de olores fuertes"].map(t => (
            <div className="checklist-item" key={t}>
              <div className="check-icon">✓</div>
              <div className="checklist-text">{t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Traceability */}
      <div className="traceability-card mb-6">
        <div className="qr-box">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsMw5qq9wSAzHvxnrMSdvOVmM_96tzNLZMqXry9X8PGA6s1AZvkZ0nmXoiokzZwm3F3VT6st4Yz3758HNW7MGd7Qz9U7crV4EpFyfWXu8BgFEVF3d1rStSzriyJEVdii_3Og_oJbBdnDkO0vhVCWJ2ShCxa0r7-KftT9OjxEH5i63iA0sKst6KxngltJ43TETckbXAgQsPBDbJdRbFMRyguM6vgSslYycXBawxzQPup06DOUWH0xCHR8Qa2O-qIKEvI5chpWGNdndO" alt="QR Code" />
        </div>
        <div>
          <div className="trace-key">Clave de trazabilidad</div>
          <div className="trace-lot">Lote: 2023-AUG-URB-042</div>
          <div className="trace-sync">Última sincronización: Hoy, 10:24 AM</div>
        </div>
      </div>

      {/* Map */}
      <div className="map-card mb-4">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4rj7Fh6iy4IWarf2vrQQtUEm7HVkM02RwhcfH1mgfWdzHvdRn-R7s3mNZ3yMdoXoqkDuC4XvM0IZ63u7Z86SmQ63nn8kj29G6iFSOE1i1pvQ5nWo7Cx6MrPYwhFsypQNPQXTJ1c8ia8JWzaYVvpg224ndf42luAdcJCIxTLvPxx1nEO1nqkmFWcUa48MAm2bcLiqjVZUS85N1G6HJFohbALQvGDhmFi5sJbB95rWzXfOZvIb1h_SETAq-eKmXF55O5HB9F6OrcAt4" alt="Location" />
        <div className="map-overlay">
          <Icon name="location_on" style={{fontSize:16}} /> Centro de Almacenamiento Urabá C-4
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="footer-actions">
      <button className="primary-btn"><Icon name="cloud_upload" /> FINALIZAR &amp; REGISTRAR</button>
      <button className="secondary-btn"><Icon name="share" /> RECIBO DE EXPORTACIÓN</button>
      <div style={{height:4}}/>
    </div>
  </div>
);

// ─── REGISTRO ─────────────────────────────────────────────────────────────────
const Registro = ({ goBack }) => {
  const [variety, setVariety] = useState("CCN51");
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(false);
  const varieties = [
    { key:"CCN51", type:"HÍBRIDO" },
    { key:"ICS95", type:"CLON" },
    { key:"Mezclado", type:"OTRO" },
  ];
  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div className="page-header px">
        <button className="header-icon-btn" onClick={goBack}><Icon name="chevron_left" /></button>
        <div style={{fontWeight:800,fontSize:16}}>Registrar Cosecha</div>
        <div style={{width:40}}/>
      </div>

      {/* Stepper */}
      <div className="px" style={{marginBottom:16}}>
        <div className="stepper">
          <div className="step-bar done"/><div className="step-bar"/><div className="step-bar"/><div className="step-bar"/>
        </div>
        <div className="step-label">Paso 1: Recolección de la cosecha</div>
      </div>

      <div className="page-scroll px">
        {/* Hero */}
        <div className="img-card mb-6" style={{height:120}}>
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBauwPrRfvqyp-MFsQfoPRhFL7KrlYRavesJJcKPmF1R8m-IQm2sx54TKZyG_Of4HX5aaHmUo5U87eTaz11e6fYlhs-xV3ZZKHcsZA1loxPjoT3cKRrcTNS2VGyUFgF1eh-JdIOEwaOM4-mKv98q3Gk0ApzDmbM1evYuW3jw2xYEfEavkN8to8YHd4xqM1e9t3P0ZPJ2tO5XIXsSpEYo4CWupY9fHev5_cn3mWN5Ek8Ob-VbSzPYCUg8Pisob8TdhWqXyXrX8ID40HJ" alt="Cocoa pod" />
          <div className="img-overlay"><span>Trazabilidad de la Región de Urabá</span></div>
        </div>

        {/* Fields */}
        <div className="space-y mb-6">
          <div>
            <div className="field-label">Fecha de cosecha</div>
            <div className="field-wrap">
              <input type="date" defaultValue="2023-10-27" className="field-input" style={{paddingRight:44}} />
              <Icon name="calendar_today" className="field-icon" />
            </div>
          </div>
          <div>
            <div className="field-label">Lote / Parcela ID</div>
            <div className="field-wrap">
              <select className="field-select" style={{paddingRight:44}}>
                <option>Parcela A - Aldea Genes</option>
                <option>Parcela B - parte alta</option>
                <option>Parcela C - llanura</option>
              </select>
              <Icon name="expand_more" className="field-icon" />
            </div>
          </div>
          <div>
            <div className="field-label">Variedad de cacao</div>
            <div className="variety-grid">
              {varieties.map(v => (
                <button key={v.key} className={`variety-btn${variety===v.key?" selected":""}`} onClick={() => setVariety(v.key)}>
                  <span className="variety-type">{v.type}</span>
                  <span className="variety-name">{v.key}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quality Checks */}
        <div className="mb-6">
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <Icon name="verified" style={{color:"var(--primary)",fontSize:16}} />
            <span style={{fontSize:12,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)"}}>Control de calidad</span>
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
        <div style={{height:100}}/>
      </div>

      {/* Footer */}
      <div className="footer-actions">
        <button className="primary-btn" onClick={goBack}>
          Registrar &amp; Continuar <Icon name="arrow_forward" style={{fontSize:16}} />
        </button>
        <div style={{height:4}}/>
      </div>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("panel");

  const navigate = (p) => setPage(p);
  const goBack = () => setPage("panel");

  const pages = {
    panel: <Panel navigate={navigate} />,
    fermentacion: <Fermentacion goBack={goBack} />,
    inventario: <Inventario goBack={goBack} />,
    registro: <Registro goBack={goBack} />,
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <IonicStyles />
      <div className="app-shell">
        <StatusBar />
        {pages[page]}
        <BottomNav active={page} onChange={navigate} />
      </div>
    </>
  );
}
