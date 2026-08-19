import express from 'express'
import { join } from 'path'
import { exec } from 'child_process'
import { existsSync, unlinkSync, readdirSync } from 'fs'
import { Client } from '.'
import { CommandTester } from '../test/CommandTester'

export class Server {
    constructor(private client: Client) {
        this.app.use('/assets', express.static(this.path))
        this.app.use(express.static(this.path))

        this.app.get('/qr', (req, res) => {
            if (!this.client.QR)
                return void res
                    .status(200)
                    .setHeader('Content-Type', 'text/plain')
                    .send(this.client.condition === 'connected' ? 'connected' : 'waiting')
                    .end()
            res.status(200).contentType('image/png').send(this.client.QR)
        })

        this.app.post('/pair', express.json(), async (req, res) => {
            const { phone } = req.body || {}
            if (!phone) return void res.status(400).json({ error: 'Phone number required' })
            try {
                const clean = String(phone).replace(/[^0-9]/g, '')
                if (clean.length < 7) return void res.status(400).json({ error: 'Invalid phone number' })

                // Set pairing phone — QR handler will intercept and call requestPairingCode
                client._pairingPhone = clean

                // Create a promise that resolves when pairing code arrives (max 30s)
                const codePromise = new Promise<string>((resolve, reject) => {
                    client._pairingCodeResolve = resolve
                    client._pairingCodeReject  = reject
                    setTimeout(() => reject(new Error('Pairing code timeout — try again')), 30_000)
                })

                // Force reconnect: close current socket so it restarts and fires a fresh QR event
                try { (client as any).end?.(new Error('pairing-restart')) } catch {}

                const code = await codePromise
                res.json({ code })
            } catch (e: any) {
                // Clean up on error
                client._pairingPhone        = null
                client._pairingCodeResolve  = null
                client._pairingCodeReject   = null
                res.status(500).json({ error: e?.message || 'Failed to get pairing code' })
            }
        })

        this.app.get('/', (req, res) => {
            const persona = this.client.config.persona || 'rias'
            const PERSONA_MAP: Record<string, {
                brandName: string; brandLabel: string; logo: string;
                accent1: string; accent2: string; accent1rgb: string; accent2rgb: string;
                bgBase: string; blob1c: string; blob2c: string; blob3c: string;
                textMain: string; textSub: string;
            }> = {
                rias: {
                    brandName: 'Rias Gremory', brandLabel: 'RIAS GREMORY',
                    logo: '/assets/RG.png',
                    accent1: '#e0317a', accent2: '#a020c8',
                    accent1rgb: '224,49,122', accent2rgb: '160,32,200',
                    bgBase: '#f5e8f2', blob1c: '#f0a0c8', blob2c: '#c870e8', blob3c: '#ff5fa0',
                    textMain: '#1a0628', textSub: '#5a1a40',
                },
                alya: {
                    brandName: 'Alya Kujou', brandLabel: 'ALYA KUJOU',
                    logo: '/assets/Alya.png',
                    accent1: '#38b6f0', accent2: '#7dd4f8',
                    accent1rgb: '56,182,240', accent2rgb: '125,212,248',
                    bgBase: '#e8f4fc', blob1c: '#90d4f7', blob2c: '#b8e8ff', blob3c: '#5ec8ff',
                    textMain: '#0a1e30', textSub: '#3a6080',
                },
                akino: {
                    brandName: 'Akino Himejima', brandLabel: 'AKINO HIMEJIMA',
                    logo: '/assets/Akino.png',
                    accent1: '#e8a0c0', accent2: '#9b4080',
                    accent1rgb: '232,160,192', accent2rgb: '155,64,128',
                    bgBase: '#f7eef4', blob1c: '#eebdd8', blob2c: '#d490b8', blob3c: '#f0c8e0',
                    textMain: '#28061a', textSub: '#6a2050',
                },
                hinata: {
                    brandName: 'Hinata Hyuga', brandLabel: 'HINATA HYUGA',
                    logo: '/assets/Hinata.png',
                    accent1: '#9b7fd4', accent2: '#c8b0f0',
                    accent1rgb: '155,127,212', accent2rgb: '200,176,240',
                    bgBase: '#f0ecfa', blob1c: '#c8b0f0', blob2c: '#ddd0f8', blob3c: '#b098e0',
                    textMain: '#1a1030', textSub: '#4a3870',
                },
                zerotwo: {
                    brandName: 'Zero Two', brandLabel: 'ZERO TWO',
                    logo: '/assets/ZeroTwo.png',
                    accent1: '#e8306a', accent2: '#ff8090',
                    accent1rgb: '232,48,106', accent2rgb: '255,128,144',
                    bgBase: '#fde8ed', blob1c: '#f8a0b8', blob2c: '#ffc8d4', blob3c: '#f06080',
                    textMain: '#2a0614', textSub: '#6a1830',
                },
                miku: {
                    brandName: 'Hatsune Miku', brandLabel: 'HATSUNE MIKU',
                    logo: '/assets/Miku.jpg',
                    accent1: '#39c5bb', accent2: '#86e8e0',
                    accent1rgb: '57,197,187', accent2rgb: '134,232,224',
                    bgBase: '#e6f9f8', blob1c: '#90e0d8', blob2c: '#b8f0e8', blob3c: '#5eccc0',
                    textMain: '#061e1c', textSub: '#1a5a56',
                },
            }
            const pm = PERSONA_MAP[persona] || PERSONA_MAP['rias']
            const brandName  = pm.brandName
            const brandLabel = pm.brandLabel
            const logo       = pm.logo
            const accent1    = pm.accent1
            const accent2    = pm.accent2
            const accent1rgb = pm.accent1rgb
            const accent2rgb = pm.accent2rgb
            const bgBase     = pm.bgBase
            const blob1c     = pm.blob1c
            const blob2c     = pm.blob2c
            const blob3c     = pm.blob3c
            const textMain   = pm.textMain
            const textSub    = pm.textSub
            const prefix   = this.client.config.prefix || '-'
            res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="${logo}" />
  <title>${brandName}</title>
  <style>
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html, body { height:100%; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; }

    /* ── BACKGROUND ── */
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: ${bgBase};
      position: relative;
      overflow: hidden;
    }

    /* soft light-leak blobs */
    .blob {
      position: fixed;
      border-radius: 50%;
      filter: blur(72px);
      pointer-events: none;
      z-index: 0;
    }
    .blob-1 {
      width: 480px; height: 480px;
      background: ${blob1c};
      top: -140px; left: -120px;
      opacity: 0.45;
      animation: blobFloat1 9s ease-in-out infinite alternate;
    }
    .blob-2 {
      width: 420px; height: 420px;
      background: ${blob2c};
      bottom: -100px; right: -100px;
      opacity: 0.38;
      animation: blobFloat2 11s ease-in-out infinite alternate;
    }
    .blob-3 {
      width: 280px; height: 280px;
      background: ${blob3c};
      top: 45%; left: 55%;
      opacity: 0.28;
      animation: blobFloat3 7s ease-in-out infinite alternate;
    }
    @keyframes blobFloat1 { to { transform: translate(30px,40px) scale(1.08); } }
    @keyframes blobFloat2 { to { transform: translate(-25px,-30px) scale(1.06); } }
    @keyframes blobFloat3 { to { transform: translate(-20px,25px) scale(0.94); } }

    /* ── LIQUID GLASS ── */
    .glass {
      background: rgba(255,255,255,0.52);
      border: 1px solid rgba(255,255,255,0.82);
      backdrop-filter: blur(22px) saturate(1.9) brightness(1.05);
      -webkit-backdrop-filter: blur(22px) saturate(1.9) brightness(1.05);
      box-shadow:
        0 2px 0 rgba(255,255,255,0.9) inset,
        0 20px 48px rgba(0,0,0,0.10),
        0 1px 2px rgba(0,0,0,0.06);
    }
    .glass-light {
      background: rgba(255,255,255,0.68);
      border: 1px solid rgba(255,255,255,0.88);
      backdrop-filter: blur(16px) saturate(1.7);
      -webkit-backdrop-filter: blur(16px) saturate(1.7);
      box-shadow:
        0 1.5px 0 rgba(255,255,255,0.95) inset,
        0 8px 24px rgba(0,0,0,0.08),
        0 1px 2px rgba(0,0,0,0.04);
    }

    /* ── CARD ── */
    .card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 390px;
      border-radius: 32px;
      padding: 30px 26px 26px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      animation: cardRise 0.6s cubic-bezier(0.22,1,0.36,1) both;
    }
    @keyframes cardRise {
      from { opacity:0; transform:translateY(22px) scale(0.96); }
      to   { opacity:1; transform:translateY(0)    scale(1);    }
    }

    /* ── HEADER ── */
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    .avatar-ring {
      position: relative;
      width: 76px; height: 76px;
      margin-bottom: 2px;
    }
    .avatar-ring img {
      width: 76px; height: 76px;
      border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.95);
      box-shadow:
        0 0 0 3px rgba(${accent1rgb},0.22),
        0 6px 22px rgba(0,0,0,0.14);
      position: relative; z-index: 1;
      transition: box-shadow 0.7s ease;
    }
    /* rotating accent ring */
    .avatar-ring::before {
      content: '';
      position: absolute;
      inset: -5px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, transparent 30%, ${accent1} 55%, ${accent2} 75%, transparent 100%);
      animation: ringRotate 3s linear infinite;
      opacity: 0.75;
    }
    .avatar-ring::after {
      content: '';
      position: absolute;
      inset: -5px;
      border-radius: 50%;
      background: conic-gradient(from 180deg, transparent 30%, ${accent2} 55%, ${accent1} 75%, transparent 100%);
      animation: ringRotate 3s linear infinite reverse;
      opacity: 0.35;
    }
    @keyframes ringRotate { to { transform: rotate(360deg); } }

    .bot-name {
      font-family: Georgia,'Times New Roman',serif;
      font-size: 1.18rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      color: ${textMain};
      transition: all 0.7s ease;
    }
    .bot-name.name-glow {
      color: ${accent1};
      text-shadow:
        0 0 10px rgba(${accent1rgb},0.5),
        0 0 28px rgba(${accent1rgb},0.3),
        0 0 56px rgba(${accent2rgb},0.2);
      animation: nameGlow 2.8s ease-in-out infinite;
    }
    @keyframes nameGlow {
      0%,100% { text-shadow: 0 0 10px rgba(${accent1rgb},0.5), 0 0 28px rgba(${accent1rgb},0.3), 0 0 56px rgba(${accent2rgb},0.2); }
      50%      { text-shadow: 0 0 16px rgba(${accent1rgb},0.75), 0 0 40px rgba(${accent1rgb},0.45), 0 0 72px rgba(${accent2rgb},0.30); }
    }
    .bot-tagline {
      font-size: 0.74rem;
      color: ${textSub};
      font-weight: 400;
      letter-spacing: 0.04em;
      opacity: 0.85;
    }

    /* ── INFO PILLS ROW ── */
    .info-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
    }
    .info-pill {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 13px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 500;
      color: ${textMain};
      letter-spacing: 0.02em;
      white-space: nowrap;
      user-select: none;
    }
    .info-pill .pill-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: ${accent1};
      opacity: 0.8;
      flex-shrink: 0;
    }

    /* ── DIVIDER ── */
    .divider {
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.08) 70%, transparent);
    }

    /* ── QR SECTION ── */
    .qr-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 100%;
    }
    .qr-label {
      font-size: 0.70rem;
      font-weight: 500;
      color: ${textSub};
      letter-spacing: 0.05em;
      text-transform: uppercase;
      opacity: 0.7;
    }

    /* conic spinning border wrapper */
    #qr-wrap {
      position: relative;
      width: 220px; height: 220px;
      display: flex; align-items: center; justify-content: center;
    }
    #qr-wrap::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 24px;
      background: conic-gradient(from 0deg,
        transparent 0%, ${accent1} 25%, ${accent2} 50%, ${accent1} 75%, transparent 100%);
      animation: conicSpin 2.6s linear infinite;
      opacity: 0.9;
    }
    @keyframes conicSpin { to { transform: rotate(360deg); } }
    /* soft glow behind the border */
    #qr-wrap::after {
      content: '';
      position: absolute;
      inset: -10px;
      border-radius: 28px;
      box-shadow: 0 0 22px rgba(${accent1rgb},0.30), 0 0 44px rgba(${accent2rgb},0.18);
      animation: qrGlow 2.4s ease-in-out infinite;
    }
    @keyframes qrGlow {
      0%,100% { opacity:0.6; }
      50%      { opacity:1.0; }
    }

    #qr-box {
      position: relative; z-index: 1;
      width: 220px; height: 220px;
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.88);
      border: 1px solid rgba(255,255,255,0.95);
      box-shadow:
        0 2px 0 rgba(255,255,255,1) inset,
        0 10px 32px rgba(0,0,0,0.10);
      overflow: hidden;
    }
    #qr-box img {
      width: 188px; height: 188px;
      border-radius: 10px;
      animation: imgIn 0.35s cubic-bezier(0.22,1,0.36,1);
    }
    @keyframes imgIn {
      from { opacity:0; transform:scale(0.94); }
      to   { opacity:1; transform:scale(1); }
    }
    #qr-box .msg {
      display: flex; flex-direction: column; align-items: center; gap: 10px;
      color: ${textSub};
      font-size: 0.78rem; font-weight: 500; text-align: center;
    }

    /* dual-ring spinner */
    .spinner {
      width: 30px; height: 30px;
      position: relative;
    }
    .spinner::before, .spinner::after {
      content: '';
      position: absolute; inset: 0;
      border-radius: 50%;
    }
    .spinner::before {
      border: 2.5px solid rgba(0,0,0,0.08);
      border-top-color: ${accent1};
      animation: spin1 0.7s linear infinite;
    }
    .spinner::after {
      inset: 6px;
      border: 2px solid rgba(0,0,0,0.05);
      border-bottom-color: ${accent2};
      animation: spin1 1.1s linear infinite reverse;
    }
    @keyframes spin1 { to { transform:rotate(360deg); } }

    /* connected state in qr-box */
    .check-wrap {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
    }
    .check-circle {
      width: 56px; height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(34,197,94,0.18), rgba(34,197,94,0.06));
      border: 1.5px solid rgba(34,197,94,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.6rem; color: #16a34a;
      box-shadow: 0 0 18px rgba(34,197,94,0.30);
      animation: checkBounce 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes checkBounce {
      from { transform:scale(0.3); opacity:0; }
      to   { transform:scale(1);   opacity:1; }
    }
    .check-label {
      font-size: 0.76rem; font-weight: 600;
      color: #15803d; letter-spacing: 0.04em;
    }

    /* ── STATUS PILL ── */
    #status {
      display: flex; align-items: center; gap: 7px;
      padding: 9px 20px;
      border-radius: 999px;
      width: 100%; justify-content: center;
      font-size: 0.78rem; font-weight: 500;
      color: ${textMain};
      letter-spacing: 0.02em;
      transition: all 0.5s ease;
    }
    #status .dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #f59e0b;
      box-shadow: 0 0 8px rgba(245,158,11,0.7);
      flex-shrink: 0;
      animation: dotBlink 1.4s ease-in-out infinite;
    }
    @keyframes dotBlink {
      0%,100% { opacity:1; transform:scale(1); }
      50%      { opacity:0.4; transform:scale(0.7); }
    }
    #status.connected .dot {
      background: #22c55e;
      box-shadow: 0 0 8px rgba(34,197,94,0.7), 0 0 16px rgba(34,197,94,0.3);
      animation: none;
    }
    #status.connected {
      background: rgba(34,197,94,0.14) !important;
      border-color: rgba(34,197,94,0.40) !important;
      color: #15803d;
    }

    /* ── HINT ── */
    .hint {
      font-size: 0.69rem;
      color: ${textSub};
      text-align: center;
      line-height: 1.65;
      opacity: 0.75;
      transition: opacity 0.5s ease;
    }
    .hint b { color: ${textMain}; font-weight: 600; opacity: 1; }

    /* ── FOOTER ── */
    .footer-row {
      display: flex; align-items: center; gap: 8px;
      width: 100%; justify-content: center;
    }
    .footer-badge {
      display: flex; align-items: center; gap: 4px;
      padding: 5px 11px;
      border-radius: 999px;
      font-size: 0.65rem;
      font-weight: 500;
      color: ${textSub};
      opacity: 0.75;
      letter-spacing: 0.03em;
    }
    .footer-badge .badge-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: ${accent1};
      opacity: 0.7;
    }

    /* ── ACTION BUTTONS ── */
    .action-row {
      display: flex;
      gap: 10px;
      width: 100%;
    }
    .btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 11px 14px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
      outline: none;
      user-select: none;
      white-space: nowrap;
    }
    .btn:active { transform: scale(0.96); }
    .btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    /* Download — indigo/violet */
    .btn-download {
      background: linear-gradient(135deg, rgba(139,92,246,0.78), rgba(79,70,229,0.65));
      border: 1px solid rgba(139,92,246,0.55);
      color: #2e1065;
      backdrop-filter: blur(14px) saturate(1.6);
      -webkit-backdrop-filter: blur(14px) saturate(1.6);
      box-shadow:
        0 1.5px 0 rgba(255,255,255,0.60) inset,
        0 6px 18px rgba(79,70,229,0.22);
    }
    .btn-download:hover:not(:disabled) {
      box-shadow:
        0 1.5px 0 rgba(255,255,255,0.60) inset,
        0 8px 24px rgba(79,70,229,0.34);
      transform: translateY(-1px);
    }

    .btn-icon { font-size: 0.9rem; line-height: 1; }

    /* ── OWNER BADGE ── */
    .owner-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 999px;
      width: 100%;
      justify-content: center;
      background: linear-gradient(135deg, rgba(${accent1rgb},0.18), rgba(${accent2rgb},0.12));
      border: 1px solid rgba(${accent1rgb},0.30);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 1px 0 rgba(255,255,255,0.7) inset, 0 4px 14px rgba(${accent1rgb},0.10);
    }
    .owner-crown {
      font-size: 0.85rem;
      filter: drop-shadow(0 1px 3px rgba(${accent1rgb},0.5));
    }
    .owner-label {
      font-size: 0.68rem;
      font-weight: 500;
      color: ${textSub};
      letter-spacing: 0.04em;
      opacity: 0.8;
    }
    .owner-name {
      font-size: 0.80rem;
      font-weight: 700;
      background: linear-gradient(135deg, ${accent1}, ${accent2});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 0.06em;
      font-family: Georgia,'Times New Roman',serif;
    }
    .owner-sep {
      width: 1px; height: 12px;
      background: rgba(${accent1rgb},0.30);
    }

    /* ── CONNECT TABS ── */
    .connect-tabs {
      display: flex;
      width: 100%;
      gap: 5px;
      padding: 4px;
      border-radius: 14px;
      background: rgba(0,0,0,0.06);
      border: 1px solid rgba(255,255,255,0.65);
    }
    .tab-btn {
      flex: 1;
      padding: 9px 10px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
      font-size: 0.74rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      background: transparent;
      color: ${textSub};
      transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
      white-space: nowrap;
    }
    .tab-btn.active {
      background: rgba(255,255,255,0.90);
      color: ${textMain};
      box-shadow: 0 2px 10px rgba(0,0,0,0.10);
    }
    .tab-btn:hover:not(.active) { background: rgba(255,255,255,0.42); }

    /* ── PAIR CODE SECTION ── */
    .pair-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
      animation: cardRise 0.3s cubic-bezier(0.22,1,0.36,1) both;
    }
    .pair-input-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 10px 16px;
      border-radius: 14px;
    }
    .pair-flag { font-size: 1.1rem; flex-shrink: 0; }
    .pair-input {
      flex: 1;
      border: none;
      background: transparent;
      font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
      font-size: 0.92rem;
      font-weight: 500;
      color: ${textMain};
      outline: none;
      letter-spacing: 0.04em;
      min-width: 0;
    }
    .pair-input::placeholder { color: ${textSub}; opacity: 0.45; }
    .btn-pair {
      width: 100%;
      padding: 12px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      background: linear-gradient(135deg, ${accent1}, ${accent2});
      color: #fff;
      box-shadow: 0 4px 18px rgba(${accent1rgb},0.35);
      transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    }
    .btn-pair:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 26px rgba(${accent1rgb},0.50);
    }
    .btn-pair:active { transform: scale(0.97); }
    .btn-pair:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
    .pair-result-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 100%;
      animation: cardRise 0.3s cubic-bezier(0.22,1,0.36,1) both;
    }
    .pair-code-label {
      font-size: 0.65rem;
      font-weight: 600;
      color: ${textSub};
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.6;
    }
    .pair-code-display {
      font-family: 'SF Mono','Fira Code','Consolas',monospace;
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: 0.20em;
      color: ${accent1};
      text-align: center;
      background: rgba(255,255,255,0.76);
      border: 2px solid rgba(${accent1rgb},0.28);
      border-radius: 16px;
      padding: 14px 20px;
      width: 100%;
      animation: codeGlow 2.5s ease-in-out infinite;
      cursor: pointer;
      user-select: all;
    }
    @keyframes codeGlow {
      0%,100% { box-shadow: 0 0 14px rgba(${accent1rgb},0.14); }
      50%      { box-shadow: 0 0 28px rgba(${accent1rgb},0.32); }
    }
    .pair-code-hint {
      font-size: 0.67rem;
      color: ${textSub};
      text-align: center;
      line-height: 1.65;
      opacity: 0.75;
    }
    .pair-code-hint b { color: ${textMain}; font-weight: 600; }
    .pair-copy-tip {
      font-size: 0.60rem;
      color: ${accent1};
      opacity: 0.6;
      letter-spacing: 0.02em;
    }

    /* ── SWITCH NUMBER BUTTON ── */
    .btn-switch {
      background: linear-gradient(135deg, rgba(239,68,68,0.72), rgba(220,38,38,0.60));
      border: 1px solid rgba(239,68,68,0.50);
      color: #450a0a;
      backdrop-filter: blur(14px) saturate(1.6);
      -webkit-backdrop-filter: blur(14px) saturate(1.6);
      box-shadow:
        0 1.5px 0 rgba(255,255,255,0.55) inset,
        0 6px 18px rgba(220,38,38,0.20);
    }
    .btn-switch:hover:not(:disabled) {
      box-shadow:
        0 1.5px 0 rgba(255,255,255,0.55) inset,
        0 8px 24px rgba(220,38,38,0.34);
      transform: translateY(-1px);
    }

    @media (max-width: 420px) {
      .card { padding: 24px 18px 20px; max-width: 100%; }
      #qr-wrap, #qr-box { width: 190px; height: 190px; }
      #qr-box img { width: 162px; height: 162px; }
      .btn { font-size: 0.72rem; padding: 10px 10px; }
    }
  </style>
</head>
<body>
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="blob blob-3"></div>

  <div class="card glass">

    <!-- header -->
    <div class="header">
      <div class="avatar-ring">
        <img src="${logo}" alt="${brandName}" />
      </div>
      <h1 class="bot-name" id="brand-name">${brandLabel}</h1>
      <p class="bot-tagline" id="brand-sub">WhatsApp AI Assistant</p>
    </div>

    <!-- info pills -->
    <div class="info-row">
      <div class="info-pill glass-light">
        <span class="pill-dot"></span>
        Prefix&nbsp;<strong>${prefix}</strong>
      </div>
      <div class="info-pill glass-light">
        <span class="pill-dot"></span>
        174 Commands
      </div>
      <div class="info-pill glass-light">
        <span class="pill-dot"></span>
        RedzeoX Bot
      </div>
    </div>

    <!-- owner badge -->
    <div class="owner-badge">
      <span class="owner-crown">👑</span>
      <span class="owner-label">Developer</span>
      <div class="owner-sep"></div>
      <span class="owner-name">RedzeoX</span>
    </div>

    <div class="divider"></div>

    <!-- ── CONNECT MODE TABS ── -->
    <div class="connect-tabs">
      <button class="tab-btn active" id="tab-qr" onclick="switchTab('qr')">📷 QR Scan</button>
      <button class="tab-btn" id="tab-pair" onclick="switchTab('pair')">🔢 Pair Code</button>
    </div>

    <!-- ── QR PANEL ── -->
    <div id="panel-qr">
      <div class="qr-section">
        <span class="qr-label" id="qr-label">Scan to Connect</span>
        <div id="qr-wrap">
          <div id="qr-box">
            <div class="msg"><div class="spinner"></div>Loading QR…</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── PAIR CODE PANEL ── -->
    <div id="panel-pair" style="display:none">
      <div class="pair-section">
        <span class="qr-label">Enter Phone Number</span>
        <div class="pair-input-wrap glass-light">
          <span class="pair-flag">📱</span>
          <input id="pair-phone" class="pair-input" type="tel"
            placeholder="91XXXXXXXXXX (with country code)"
            maxlength="15"
            onkeydown="if(event.key==='Enter') getPairCode()" />
        </div>
        <button class="btn-pair" id="btn-pair" onclick="getPairCode()">Get Pairing Code</button>
        <div class="pair-result-box" id="pair-result" style="display:none">
          <span class="pair-code-label">Your 8-digit code</span>
          <div class="pair-code-display" id="pair-code" title="Click to copy">--------</div>
          <span class="pair-copy-tip">tap code to copy</span>
          <p class="pair-code-hint">Enter in <b>WhatsApp → Linked Devices → Link with Phone Number</b></p>
        </div>
      </div>
    </div>

    <!-- status pill -->
    <div id="status" class="glass-light">
      <span class="dot"></span>
      <span id="status-text">Connecting…</span>
    </div>

    <!-- action buttons -->
    <div class="action-row">
      <button class="btn btn-download" id="btn-download" onclick="downloadZip()">
        <span class="btn-icon">⬇</span> Download Zip
      </button>
      <button class="btn btn-switch" id="btn-switch" onclick="switchNumber()" style="display:none">
        <span class="btn-icon">🔄</span> Switch Number
      </button>
    </div>

    <!-- hint -->
    <p class="hint" id="hint-text">
      Open <b>WhatsApp → Linked Devices → Link a Device</b><br>then scan the QR code above
    </p>

    <div class="divider"></div>

    <!-- footer -->
    <div class="footer-row">
      <div class="footer-badge glass-light">
        <span class="badge-dot"></span>
        Powered by RedzeoX
      </div>
      <div class="footer-badge glass-light">
        <span class="badge-dot"></span>
        Open Source
      </div>
    </div>

  </div>

  <script>
    const box = document.getElementById('qr-box');
    const status = document.getElementById('status');
    const statusText = document.getElementById('status-text');
    const brandNameEl = document.getElementById('brand-name');
    const brandSub = document.getElementById('brand-sub');
    const hintText = document.getElementById('hint-text');
    const qrLabel = document.getElementById('qr-label');
    let ts = Date.now();
    let connectedShown = false;

    // ── TAB SWITCHING ──
    let activeTab = 'qr';
    function switchTab(tab) {
      activeTab = tab;
      document.getElementById('panel-qr').style.display   = tab === 'qr'   ? '' : 'none';
      document.getElementById('panel-pair').style.display = tab === 'pair' ? '' : 'none';
      document.getElementById('tab-qr').classList.toggle('active',   tab === 'qr');
      document.getElementById('tab-pair').classList.toggle('active', tab === 'pair');
      if (tab === 'pair') {
        hintText.style.opacity = '0';
        hintText.style.pointerEvents = 'none';
        document.getElementById('pair-phone').focus();
      } else {
        if (!connectedShown) {
          hintText.style.opacity = '1';
          hintText.style.pointerEvents = '';
        }
      }
    }

    // ── PAIR CODE ──
    async function getPairCode() {
      const phone = document.getElementById('pair-phone').value.trim();
      if (!phone) {
        document.getElementById('pair-phone').focus();
        return;
      }
      const btn     = document.getElementById('btn-pair');
      const result  = document.getElementById('pair-result');
      const codeEl  = document.getElementById('pair-code');
      btn.disabled = true;
      btn.textContent = '⏳ Requesting…';
      result.style.display = 'none';
      try {
        const res  = await fetch('/pair', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        });
        const data = await res.json();
        if (data.code) {
          const raw = String(data.code).replace(/[^A-Z0-9]/gi, '');
          codeEl.textContent = raw.length >= 8
            ? raw.slice(0,4) + '-' + raw.slice(4,8)
            : raw;
          result.style.display = '';
          btn.textContent = '✓ Code Generated!';
          setTimeout(() => { btn.disabled = false; btn.textContent = 'Get Pairing Code'; }, 30000);
        } else {
          btn.disabled = false;
          btn.textContent = data.error || 'Failed — try again';
          setTimeout(() => { btn.textContent = 'Get Pairing Code'; }, 3000);
        }
      } catch(e) {
        btn.disabled = false;
        btn.textContent = '⚠ Error — try again';
        setTimeout(() => { btn.textContent = 'Get Pairing Code'; }, 3000);
      }
    }

    // copy code on click
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'pair-code') {
        const txt = e.target.textContent.replace(/-/g,'');
        navigator.clipboard.writeText(txt).then(() => {
          const orig = e.target.textContent;
          e.target.textContent = 'Copied!';
          setTimeout(() => { e.target.textContent = orig; }, 1500);
        }).catch(() => {});
      }
    });

    async function refresh() {
      try {
        const res = await fetch('/qr?t=' + ts);
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('image')) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          box.innerHTML = '<img src="' + url + '" />';
          status.classList.remove('connected');
          statusText.textContent = 'Scan this QR code in WhatsApp';
          brandNameEl.classList.remove('name-glow');
          qrLabel.textContent = 'Scan to Connect';
          connectedShown = false;
        } else {
          const text = await res.text();
          if (text === 'connected') {
            if (!connectedShown) {
              connectedShown = true;
              // Switch to QR tab so connected state is visible (even if user was on pair tab)
              switchTab('qr');
              box.innerHTML = '<div class="check-wrap"><div class="check-circle">✓</div><span class="check-label">Connected!</span></div>';
              status.classList.add('connected');
              statusText.textContent = 'Bot is live on WhatsApp';
              brandNameEl.classList.add('name-glow');
              brandSub.textContent = 'Online & Ready';
              qrLabel.textContent = 'Session Active';
              hintText.style.opacity = '0';
              hintText.style.pointerEvents = 'none';
              document.getElementById('btn-switch').style.display = '';
            }
            return;
          }
          box.innerHTML = '<div class="msg"><div class="spinner"></div>Waiting for QR…</div>';
          status.classList.remove('connected');
          statusText.textContent = 'Bot is starting up…';
          brandNameEl.classList.remove('name-glow');
          qrLabel.textContent = 'Scan to Connect';
          connectedShown = false;
        }
      } catch(e) {
        status.classList.remove('connected');
        statusText.textContent = 'Reconnecting…';
      }
      ts = Date.now();
      setTimeout(refresh, 6000);
    }
    refresh();

    async function switchNumber() {
      const btn = document.getElementById('btn-switch');
      const origText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-icon">⏳</span> Logging out…';
      try {
        await fetch('/logout', { method: 'POST' });
        // Reset UI to waiting state
        connectedShown = false;
        box.innerHTML = '<div class="msg"><div class="spinner"></div>Waiting for QR…</div>';
        status.classList.remove('connected');
        statusText.textContent = 'Bot is restarting…';
        brandNameEl.classList.remove('name-glow');
        brandSub.textContent = 'WhatsApp AI Assistant';
        qrLabel.textContent = 'Scan to Connect';
        hintText.style.opacity = '1';
        hintText.style.pointerEvents = '';
        btn.style.display = 'none';
        btn.disabled = false;
        btn.innerHTML = origText;
        // Resume polling
        ts = Date.now();
        setTimeout(refresh, 3000);
      } catch(e) {
        btn.disabled = false;
        btn.innerHTML = '⚠ Error — try again';
        setTimeout(() => { btn.innerHTML = origText; }, 3000);
      }
    }

    async function downloadZip() {
      const btn = document.getElementById('btn-download');
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-icon">⏳</span> Zipping…';
      try {
        const res = await fetch('/download');
        if (!res.ok) throw new Error('fail');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'rias-bot.zip'; a.click();
        URL.revokeObjectURL(url);
        btn.innerHTML = '<span class="btn-icon">✓</span> Downloaded!';
        setTimeout(() => { btn.disabled = false; btn.innerHTML = '<span class="btn-icon">⬇</span> Download Zip'; }, 3000);
      } catch(e) {
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-icon">⬇</span> Download Zip';
      }
    }
  </script>
</body>
</html>`)
        })

        this.app.get('/download', (_req, res) => {
            const root = join(__dirname, '..', '..')
            const out  = join(root, 'bot-backup.zip')
            const cmd = `cd "${root}" && zip -r "${out}" . -x "*.zip" -x "node_modules/*" -x ".git/*" -x "dist/*" -x "session/*" -x "auth_info*" -x "*.log" -x ".cache/*"`
            exec(cmd, (err) => {
                if (err) return res.status(500).json({ error: 'Failed to create zip' })
                res.download(out, 'rias-bot.zip', (dlErr) => {
                    if (existsSync(out)) unlinkSync(out)
                })
            })
        })

        // ── SSE log stream ──
        this.app.get('/logs', (req, res) => {
            res.setHeader('Content-Type', 'text/event-stream')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Connection', 'keep-alive')
            res.flushHeaders()
            for (const e of this.logBuffer)
                res.write(`data: ${JSON.stringify(e)}\n\n`)
            this.sseClients.push(res)
            req.on('close', () => { this.sseClients = this.sseClients.filter(c => c !== res) })
        })

        // ── Command Auto-Tester API ──
        this.app.post('/api/run-tests', (_req, res) => {
            try {
                const tester = new CommandTester()
                const report = tester.run()
                res.json(report)
            } catch (err: any) {
                res.status(500).json({ error: err?.message || 'Test runner failed' })
            }
        })

        // ── Command Tester Dashboard ──
        this.app.get('/test', (_req, res) => {
            res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Command Tester</title>
  <style>
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html, body { min-height:100%; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; background:#0d0f14; color:#e2e8f0; }

    /* ── BACKGROUND ── */
    body { min-height:100vh; position:relative; overflow-x:hidden; }
    .bg-blob { position:fixed; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:0; }
    .bg-blob-1 { width:600px;height:600px;background:#6d28d9;top:-200px;left:-200px;opacity:0.12; }
    .bg-blob-2 { width:500px;height:500px;background:#e0317a;bottom:-150px;right:-150px;opacity:0.10; }

    /* ── LAYOUT ── */
    .page { position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:32px 20px 60px; }

    /* ── HEADER ── */
    .page-header {
      display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;
      margin-bottom:28px;
    }
    .page-title { display:flex;align-items:center;gap:12px; }
    .page-title h1 { font-family:Georgia,'Times New Roman',serif;font-size:1.5rem;font-weight:600;letter-spacing:0.08em;
      background:linear-gradient(135deg,#c084fc,#e0317a);-webkit-background-clip:text;
      -webkit-text-fill-color:transparent;background-clip:text; }
    .page-title .icon { font-size:1.6rem; }
    .back-btn {
      display:flex;align-items:center;gap:6px;
      padding:8px 16px;border-radius:999px;
      background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);
      color:#94a3b8;font-size:0.78rem;font-weight:500;text-decoration:none;
      transition:background 0.18s,color 0.18s;cursor:pointer;
    }
    .back-btn:hover { background:rgba(255,255,255,0.10);color:#e2e8f0; }

    /* ── RUN BUTTON ── */
    #run-btn {
      display:flex;align-items:center;gap:8px;
      padding:11px 24px;border-radius:999px;border:none;cursor:pointer;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:0.85rem;font-weight:700;letter-spacing:0.03em;
      background:linear-gradient(135deg,#7c3aed,#e0317a);
      color:#fff;
      box-shadow:0 4px 20px rgba(124,58,237,0.40);
      transition:transform 0.15s,box-shadow 0.2s,opacity 0.2s;
    }
    #run-btn:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 6px 28px rgba(124,58,237,0.55); }
    #run-btn:active { transform:scale(0.97); }
    #run-btn:disabled { opacity:0.6;cursor:not-allowed;transform:none; }
    .spin { animation:spinA 0.8s linear infinite;display:inline-block; }
    @keyframes spinA { to { transform:rotate(360deg); } }

    /* ── SUMMARY CARDS ── */
    .summary { display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:24px; }
    .s-card {
      border-radius:16px;padding:16px 18px;
      background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
      display:flex;flex-direction:column;gap:4px;
    }
    .s-label { font-size:0.65rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;opacity:0.5; }
    .s-val { font-size:1.8rem;font-weight:700;line-height:1; }
    .s-card.total .s-val { color:#94a3b8; }
    .s-card.pass  .s-val { color:#22c55e; }
    .s-card.warn  .s-val { color:#f59e0b; }
    .s-card.fail  .s-val { color:#ef4444; }
    .s-card.time  .s-val { color:#818cf8;font-size:1.3rem; }

    /* ── FILTER BAR ── */
    .filter-bar {
      display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:18px;
    }
    .filter-label { font-size:0.72rem;color:#64748b;font-weight:500;letter-spacing:0.04em; }
    .filter-btn {
      padding:5px 14px;border-radius:999px;border:1px solid rgba(255,255,255,0.10);
      background:rgba(255,255,255,0.04);color:#94a3b8;font-size:0.72rem;font-weight:500;
      cursor:pointer;transition:background 0.15s,color 0.15s,border-color 0.15s;
    }
    .filter-btn.active { background:rgba(124,58,237,0.22);border-color:rgba(124,58,237,0.50);color:#c4b5fd; }
    .filter-btn:hover:not(.active) { background:rgba(255,255,255,0.08);color:#e2e8f0; }
    .search-wrap { margin-left:auto;position:relative; }
    .search-wrap input {
      background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);
      border-radius:999px;padding:6px 14px 6px 32px;color:#e2e8f0;
      font-size:0.75rem;outline:none;width:200px;
      transition:border-color 0.2s,background 0.2s;
    }
    .search-wrap input::placeholder { color:#475569; }
    .search-wrap input:focus { border-color:rgba(124,58,237,0.50);background:rgba(255,255,255,0.08); }
    .search-icon { position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#475569;font-size:0.8rem;pointer-events:none; }

    /* ── TABLE ── */
    .table-wrap {
      border-radius:18px;overflow:hidden;
      border:1px solid rgba(255,255,255,0.08);
      background:rgba(255,255,255,0.03);
    }
    table { width:100%;border-collapse:collapse; }
    thead th {
      padding:11px 16px;text-align:left;
      font-size:0.65rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
      color:#475569;border-bottom:1px solid rgba(255,255,255,0.06);
      background:rgba(255,255,255,0.02);
    }
    tbody tr {
      border-bottom:1px solid rgba(255,255,255,0.04);
      transition:background 0.12s;cursor:pointer;
    }
    tbody tr:last-child { border-bottom:none; }
    tbody tr:hover { background:rgba(255,255,255,0.04); }
    tbody td { padding:10px 16px;font-size:0.78rem;vertical-align:middle; }
    .cmd-name { font-family:'Fira Code',monospace;font-size:0.76rem;font-weight:500;color:#e2e8f0; }
    .cmd-category {
      display:inline-flex;align-items:center;padding:3px 9px;border-radius:999px;
      font-size:0.62rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
    }
    .cat-dev       { background:rgba(239,68,68,0.15); color:#fca5a5; }
    .cat-fun       { background:rgba(251,191,36,0.15); color:#fde68a; }
    .cat-games     { background:rgba(52,211,153,0.15); color:#6ee7b7; }
    .cat-nsfw      { background:rgba(239,68,68,0.20); color:#f87171; }
    .cat-utils     { background:rgba(99,102,241,0.15); color:#a5b4fc; }
    .cat-pokemon   { background:rgba(234,179,8,0.15);  color:#fde047; }
    .cat-moderation{ background:rgba(59,130,246,0.15); color:#93c5fd; }
    .cat-weeb      { background:rgba(236,72,153,0.15); color:#f9a8d4; }
    .cat-general   { background:rgba(148,163,184,0.15);color:#cbd5e1; }
    .cat-media     { background:rgba(14,165,233,0.15); color:#7dd3fc; }
    .cat-economy   { background:rgba(16,185,129,0.15); color:#6ee7b7; }
    .cat-characters{ background:rgba(168,85,247,0.15); color:#d8b4fe; }
    .cat-cards     { background:rgba(249,115,22,0.15); color:#fdba74; }
    .cat-coding    { background:rgba(99,102,241,0.15); color:#a5b4fc; }

    /* status badge */
    .badge {
      display:inline-flex;align-items:center;gap:5px;
      padding:4px 11px;border-radius:999px;font-size:0.68rem;font-weight:700;letter-spacing:0.04em;
    }
    .badge-pass { background:rgba(34,197,94,0.15); color:#4ade80; border:1px solid rgba(34,197,94,0.25); }
    .badge-warn { background:rgba(245,158,11,0.15); color:#fbbf24; border:1px solid rgba(245,158,11,0.25); }
    .badge-fail { background:rgba(239,68,68,0.15);  color:#f87171; border:1px solid rgba(239,68,68,0.25); }
    .badge-dot { width:5px;height:5px;border-radius:50%; }
    .badge-pass .badge-dot { background:#4ade80; }
    .badge-warn .badge-dot { background:#fbbf24; }
    .badge-fail .badge-dot { background:#f87171; }

    /* duration */
    .dur { font-family:'Fira Code',monospace;font-size:0.66rem;color:#475569; }

    /* checks count */
    .checks-mini { font-size:0.68rem;color:#64748b; }
    .checks-mini span.ok  { color:#4ade80; }
    .checks-mini span.w   { color:#fbbf24; }
    .checks-mini span.err { color:#f87171; }

    /* ── DETAIL PANEL (expandable row) ── */
    .detail-row { display:none; }
    .detail-row td { padding:0 16px 14px;background:rgba(0,0,0,0.15); }
    .detail-row.open { display:table-row; }
    .detail-inner {
      border-radius:12px;padding:14px 16px;
      background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);
      display:flex;flex-wrap:wrap;gap:20px;
    }
    .detail-section { min-width:200px; }
    .detail-section h4 { font-size:0.62rem;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:#475569;margin-bottom:8px; }
    .check-item { display:flex;align-items:flex-start;gap:7px;margin-bottom:5px;font-size:0.73rem; }
    .check-icon { flex-shrink:0;font-size:0.75rem;margin-top:1px; }
    .check-label { color:#94a3b8; }
    .check-detail { font-size:0.65rem;color:#64748b;margin-top:2px; }
    .alias-chip {
      display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;
      background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.25);
      font-family:'Fira Code',monospace;font-size:0.64rem;color:#c4b5fd;margin:2px;
    }

    /* ── EMPTY / LOADING STATES ── */
    .state-box {
      text-align:center;padding:60px 20px;color:#475569;
    }
    .state-box .state-icon { font-size:2.5rem;margin-bottom:12px; }
    .state-box p { font-size:0.85rem; }
    .state-box small { font-size:0.72rem;opacity:0.6;margin-top:6px;display:block; }
    .progress-bar-wrap { margin:20px auto;max-width:260px;height:3px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden; }
    .progress-bar { height:100%;background:linear-gradient(90deg,#7c3aed,#e0317a);border-radius:2px;
      animation:progressAnim 1.4s ease-in-out infinite alternate; }
    @keyframes progressAnim { from { width:20%;margin-left:0; } to { width:60%;margin-left:40%; } }

    /* ── TIMESTAMP ── */
    .run-meta { font-size:0.68rem;color:#475569;margin-bottom:14px;display:flex;align-items:center;gap:8px; }
    .run-meta .dot { width:5px;height:5px;border-radius:50%;background:#4ade80;display:inline-block;box-shadow:0 0 6px rgba(34,197,94,0.7); }

    @media(max-width:640px) {
      .page { padding:20px 12px 40px; }
      table thead th:nth-child(4), table tbody td:nth-child(4),
      table thead th:nth-child(5), table tbody td:nth-child(5) { display:none; }
      .search-wrap input { width:140px; }
    }
  </style>
</head>
<body>
  <div class="bg-blob bg-blob-1"></div>
  <div class="bg-blob bg-blob-2"></div>

  <div class="page">
    <!-- header -->
    <div class="page-header">
      <div class="page-title">
        <span class="icon">🧪</span>
        <div>
          <h1>Command Tester</h1>
          <div style="font-size:0.70rem;color:#64748b;margin-top:2px;">Auto-validate all bot commands</div>
        </div>
      </div>
      <div style="display:flex;gap:10px;align-items:center;">
        <a href="/" class="back-btn">← Dashboard</a>
        <button id="run-btn" onclick="runTests()">
          <span id="run-icon">▶</span> Run Tests
        </button>
      </div>
    </div>

    <!-- summary -->
    <div class="summary" id="summary" style="display:none;">
      <div class="s-card total"><span class="s-label">Total</span><span class="s-val" id="s-total">0</span></div>
      <div class="s-card pass" ><span class="s-label">Passed</span><span class="s-val" id="s-pass">0</span></div>
      <div class="s-card warn" ><span class="s-label">Warnings</span><span class="s-val" id="s-warn">0</span></div>
      <div class="s-card fail" ><span class="s-label">Failed</span><span class="s-val" id="s-fail">0</span></div>
      <div class="s-card time" ><span class="s-label">Duration</span><span class="s-val" id="s-dur">—</span></div>
    </div>

    <!-- filter bar -->
    <div class="filter-bar" id="filter-bar" style="display:none;">
      <span class="filter-label">Filter:</span>
      <button class="filter-btn active" data-filter="all" onclick="setFilter(this,'all')">All</button>
      <button class="filter-btn" data-filter="pass" onclick="setFilter(this,'pass')">✅ Pass</button>
      <button class="filter-btn" data-filter="warn" onclick="setFilter(this,'warn')">⚠️ Warn</button>
      <button class="filter-btn" data-filter="fail" onclick="setFilter(this,'fail')">❌ Fail</button>
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" id="search-box" placeholder="Search command…" oninput="applyFilters()">
      </div>
    </div>

    <!-- run meta -->
    <div class="run-meta" id="run-meta" style="display:none;">
      <span class="dot"></span>
      <span id="run-ts"></span>
    </div>

    <!-- table -->
    <div class="table-wrap" id="table-wrap" style="display:none;">
      <table>
        <thead>
          <tr>
            <th>Command</th>
            <th>Category</th>
            <th>Status</th>
            <th>Checks</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody id="tbl-body"></tbody>
      </table>
    </div>

    <!-- empty state -->
    <div class="state-box" id="empty-state">
      <div class="state-icon">🧪</div>
      <p>Click <strong>Run Tests</strong> to start</p>
      <small>All ${174} commands will be validated automatically</small>
    </div>

    <!-- loading state -->
    <div class="state-box" id="loading-state" style="display:none;">
      <div class="state-icon">⚙️</div>
      <p>Running tests on all commands…</p>
      <div class="progress-bar-wrap"><div class="progress-bar"></div></div>
      <small>This usually takes under 2 seconds</small>
    </div>
  </div>

  <script>
    let allResults = [];
    let currentFilter = 'all';

    async function runTests() {
      const btn = document.getElementById('run-btn');
      const icon = document.getElementById('run-icon');
      btn.disabled = true;
      icon.className = 'spin';
      icon.textContent = '↺';

      document.getElementById('empty-state').style.display = 'none';
      document.getElementById('loading-state').style.display = '';
      document.getElementById('summary').style.display = 'none';
      document.getElementById('filter-bar').style.display = 'none';
      document.getElementById('table-wrap').style.display = 'none';
      document.getElementById('run-meta').style.display = 'none';

      try {
        const res = await fetch('/api/run-tests', { method: 'POST' });
        const report = await res.json();
        allResults = report.results || [];

        // summary
        document.getElementById('s-total').textContent = report.total;
        document.getElementById('s-pass').textContent  = report.pass;
        document.getElementById('s-warn').textContent  = report.warn;
        document.getElementById('s-fail').textContent  = report.fail;
        document.getElementById('s-dur').textContent   = report.duration + 'ms';
        document.getElementById('run-ts').textContent  = 'Last run: ' + new Date(report.timestamp).toLocaleString();

        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('summary').style.display = '';
        document.getElementById('filter-bar').style.display = '';
        document.getElementById('table-wrap').style.display = '';
        document.getElementById('run-meta').style.display = '';

        currentFilter = 'all';
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');
        document.getElementById('search-box').value = '';
        renderTable(allResults);
      } catch(e) {
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('empty-state').style.display = '';
        document.getElementById('empty-state').innerHTML = '<div class="state-icon">❌</div><p>Test run failed</p><small>' + e.message + '</small>';
      }

      btn.disabled = false;
      icon.className = '';
      icon.textContent = '▶';
    }

    function setFilter(el, val) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      currentFilter = val;
      applyFilters();
    }

    function applyFilters() {
      const q = (document.getElementById('search-box').value || '').toLowerCase();
      const filtered = allResults.filter(r => {
        const matchStatus = currentFilter === 'all' || r.status === currentFilter;
        const matchSearch = !q || r.name.includes(q) || r.category.includes(q) || (r.aliases||[]).some(a => a.includes(q));
        return matchStatus && matchSearch;
      });
      renderTable(filtered);
    }

    function renderTable(results) {
      const tbody = document.getElementById('tbl-body');
      tbody.innerHTML = '';
      if (results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:32px;color:#475569;font-size:0.78rem;">No commands match this filter</td></tr>';
        return;
      }
      results.forEach((r, i) => {
        const passC = r.checks.filter(c => c.status === 'pass').length;
        const warnC = r.checks.filter(c => c.status === 'warn').length;
        const failC = r.checks.filter(c => c.status === 'fail').length;

        const statusBadge = r.status === 'pass'
          ? '<span class="badge badge-pass"><span class="badge-dot"></span>PASS</span>'
          : r.status === 'warn'
          ? '<span class="badge badge-warn"><span class="badge-dot"></span>WARN</span>'
          : '<span class="badge badge-fail"><span class="badge-dot"></span>FAIL</span>';

        const catClass = 'cat-' + (r.category || 'general');
        const catBadge = '<span class="cmd-category ' + catClass + '">' + (r.category || '?') + '</span>';

        const checksHtml = '<span class="checks-mini">'
          + (passC ? '<span class="ok">✓' + passC + '</span> ' : '')
          + (warnC ? '<span class="w">⚠' + warnC + '</span> ' : '')
          + (failC ? '<span class="err">✗' + failC + '</span>' : '')
          + '</span>';

        // main row
        const tr = document.createElement('tr');
        tr.id = 'row-' + i;
        tr.onclick = () => toggleDetail(i);
        tr.innerHTML =
          '<td><span class="cmd-name">' + escHtml(r.name) + '</span></td>' +
          '<td>' + catBadge + '</td>' +
          '<td>' + statusBadge + '</td>' +
          '<td>' + checksHtml + '</td>' +
          '<td><span class="dur">' + r.duration + 'ms</span></td>';
        tbody.appendChild(tr);

        // detail row
        const dr = document.createElement('tr');
        dr.className = 'detail-row';
        dr.id = 'detail-' + i;

        let checksDetail = r.checks.map(c => {
          const ic = c.status === 'pass' ? '✅' : c.status === 'warn' ? '⚠️' : '❌';
          return '<div class="check-item"><span class="check-icon">' + ic + '</span><div><div class="check-label">' +
            escHtml(c.label) + '</div>' +
            (c.detail ? '<div class="check-detail">' + escHtml(c.detail) + '</div>' : '') +
            '</div></div>';
        }).join('');

        let aliasesHtml = (r.aliases && r.aliases.length)
          ? r.aliases.map(a => '<span class="alias-chip">' + escHtml(a) + '</span>').join('')
          : '<span style="font-size:0.68rem;color:#475569;">No aliases</span>';

        dr.innerHTML = '<td colspan="5"><div class="detail-inner">' +
          '<div class="detail-section"><h4>Checks (' + r.checks.length + ')</h4>' + checksDetail + '</div>' +
          '<div class="detail-section"><h4>Aliases</h4>' + aliasesHtml + '</div>' +
          '<div class="detail-section"><h4>File</h4><span style="font-family:Fira Code,monospace;font-size:0.66rem;color:#64748b;">' + escHtml(r.file) + '</span></div>' +
          '</div></td>';
        tbody.appendChild(dr);
      });
    }

    function toggleDetail(i) {
      const dr = document.getElementById('detail-' + i);
      if (!dr) return;
      dr.classList.toggle('open');
    }

    function escHtml(str) {
      return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
  </script>
</body>
</html>`)
        })

        // ── Video API — protected by VIDEO_API_KEY ──
        const INTRO_VIDEO_DIR = join(__dirname, '..', '..', 'assets', 'videos')

        const checkVideoKey = (req: import('express').Request, res: import('express').Response): boolean => {
            const key = req.query.key as string
            if (!key || key !== client.config.videoApiKey) {
                res.status(401).json({ error: 'Unauthorized', hint: 'Pass ?key=VIDEO_API_KEY' })
                return false
            }
            return true
        }

        // GET /api/videos — list all available intro videos
        this.app.get('/api/videos', (req, res) => {
            if (!checkVideoKey(req, res)) return
            try {
                const files = readdirSync(INTRO_VIDEO_DIR)
                    .filter(f => /^intro-\d+\.mp4$/.test(f))
                    .sort((a, b) => {
                        const n1 = parseInt(a.match(/\d+/)![0])
                        const n2 = parseInt(b.match(/\d+/)![0])
                        return n1 - n2
                    })
                res.json({ count: files.length, videos: files })
            } catch {
                res.status(500).json({ error: 'Failed to list videos' })
            }
        })

        // GET /api/video/random — stream a random intro video
        this.app.get('/api/video/random', (req, res) => {
            if (!checkVideoKey(req, res)) return
            try {
                const files = readdirSync(INTRO_VIDEO_DIR).filter(f => /^intro-\d+\.mp4$/.test(f))
                if (!files.length) return void res.status(404).json({ error: 'No intro videos found' })
                const picked = files[Math.floor(Math.random() * files.length)]
                const videoPath = join(INTRO_VIDEO_DIR, picked)
                res.setHeader('Content-Type', 'video/mp4')
                res.setHeader('X-Video-Name', picked)
                res.sendFile(videoPath)
            } catch {
                res.status(500).json({ error: 'Failed to serve video' })
            }
        })

        // GET /api/video/:name — stream a specific intro video (e.g. intro-5)
        this.app.get('/api/video/:name', (req, res) => {
            if (!checkVideoKey(req, res)) return
            const name = req.params.name
            if (!/^intro-\d+$/.test(name)) return void res.status(400).json({ error: 'Invalid video name. Use format: intro-1' })
            const videoPath = join(INTRO_VIDEO_DIR, `${name}.mp4`)
            if (!existsSync(videoPath)) return void res.status(404).json({ error: `Video "${name}" not found` })
            res.setHeader('Content-Type', 'video/mp4')
            res.setHeader('X-Video-Name', `${name}.mp4`)
            res.sendFile(videoPath)
        })

        this.app.post('/logout', async (_req, res) => {
            try {
                if (typeof client.clearStateCallback === 'function') {
                    await client.clearStateCallback()
                    client.log('Session cleared via /logout')
                }
                client.QR = undefined as any
                client.condition = 'connecting'
                try { (client as any).end?.(new Error('logout')) } catch {}
                res.json({ ok: true })
            } catch (e: any) {
                res.status(500).json({ error: e?.message || 'Logout failed' })
            }
        })

        this.app.all('*', (req, res) => res.sendStatus(404))

        this.app.listen(client.config.PORT, '0.0.0.0', () => client.log(`Server started on PORT : ${client.config.PORT}`))

        // Intercept client.log → browser live stream
        const _orig = this.client.log.bind(this.client)
        this.client.log = (text: string, error: boolean = false): void => {
            const startupStage = !error ? this.client.getStartupStage(text) : null
            _orig(text, error)
            if (startupStage) {
                if (startupStage.name === 'whatsapp' &&
                    (startupStage.value === 'connected' || startupStage.value === 'waiting for QR')) {
                    this.captureLog(`✓ ${this.client.getStartupSummary()}`)
                }
                return
            }
            this.captureLog(text, error)
        }
    }

    private path = join(__dirname, '..', '..', 'public')
    private app = (() => {
        const a = express()
        a.set('trust proxy', 1)
        a.use((_req, res, next) => {
            res.removeHeader('X-Frame-Options')
            res.setHeader('X-Frame-Options', 'ALLOWALL')
            res.setHeader('Access-Control-Allow-Origin', '*')
            next()
        })
        return a
    })()

    // ── live log streaming ──
    private logBuffer: { time: string; text: string; error: boolean }[] = []
    private sseClients: import('express').Response[] = []

    public captureLog(text: string, error: boolean = false): void {
        const clean = text.replace(/\x1B\[[0-9;]*m/g, '').trim()
        if (!clean || this.shouldFilter(clean)) return
        const entry = {
            time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
            text: clean,
            error
        }
        this.logBuffer.push(entry)
        if (this.logBuffer.length > 80) this.logBuffer.shift()
        const data = `data: ${JSON.stringify(entry)}\n\n`
        this.sseClients = this.sseClients.filter(c => {
            try { c.write(data); return true } catch { return false }
        })
    }

    private shouldFilter(text: string): boolean {
        return false
    }
}
