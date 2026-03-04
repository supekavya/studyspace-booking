export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0A0A0F; color: #E8E8F0; font-family: 'DM Sans', 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: #0A0A0F; }
  ::-webkit-scrollbar-thumb { background: #2A2A3A; border-radius: 2px; }
  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; }
  input, select, textarea { font-family: inherit; }

  .nav-btn { background: none; border: none; color: #888; cursor: pointer; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
  .nav-btn:hover { color: #E8E8F0; background: rgba(255,255,255,0.06); }
  .nav-btn.active { color: #E8E8F0; background: rgba(255,255,255,0.1); }

  .primary-btn { background: linear-gradient(135deg, #4ADE80, #22C55E); color: #0A150E; border: none; border-radius: 10px; padding: 12px 24px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .primary-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(74,222,128,0.35); }
  .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .secondary-btn { background: rgba(255,255,255,0.06); color: #E8E8F0; border: 1px solid #2A2A3A; border-radius: 10px; padding: 12px 24px; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .secondary-btn:hover { background: rgba(255,255,255,0.1); }
  .danger-btn { background: rgba(239,68,68,0.12); color: #F87171; border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .danger-btn:hover { background: rgba(239,68,68,0.22); }

  .input-field { background: #0F0F1A; border: 1px solid #2A2A3A; border-radius: 10px; padding: 11px 14px; color: #E8E8F0; font-size: 14px; width: 100%; outline: none; transition: border 0.2s; }
  .input-field:focus { border-color: #4ADE80; }
  .input-field::placeholder { color: #444; }
  select.input-field option { background: #12121A; }

  .card { background: #12121A; border: 1px solid #1E1E2E; border-radius: 16px; }
  .badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.06); border-radius: 6px; padding: 3px 8px; font-size: 11px; color: #888; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
  .modal-box { background: #12121A; border: 1px solid #2A2A3A; border-radius: 20px; padding: 28px; width: 100%; max-width: 440px; }

  .slot-btn { border: none; border-radius: 6px; padding: 6px 10px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .slot-free { background: rgba(74,222,128,0.12); color: #4ADE80; border: 1px solid rgba(74,222,128,0.2); }
  .slot-free:hover { background: rgba(74,222,128,0.22); transform: scale(1.05); }
  .slot-booked { background: rgba(255,255,255,0.04); color: #444; border: 1px solid #1A1A2A; cursor: not-allowed; }
  .slot-mine { background: rgba(96,165,250,0.15); color: #60A5FA; border: 1px solid rgba(96,165,250,0.25); cursor: default; }

  @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
  @keyframes toastIn { from { opacity:0; transform: translateX(100%); } to { opacity:1; transform: translateX(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-up { animation: fadeUp 0.4s ease both; }
  .spinner { width: 20px; height: 20px; border: 2px solid #2A2A3A; border-top-color: #4ADE80; border-radius: 50%; animation: spin 0.7s linear infinite; }

  .error-msg { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #F87171; border-radius: 10px; padding: 12px 16px; font-size: 13px; }
`

export const AMENITY_ICONS = {
  "Whiteboard": "⬜", "TV Screen": "📺", "Projector": "📽",
  "Video Call": "📹", "Dual Projector": "🎞", "Soundproof": "🎧",
}

export const TIME_SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"]
