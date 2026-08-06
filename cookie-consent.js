/**
 * cookie-consent.js — B-Life
 * Bandeau informatif + page politique de confidentialité
 * Usage : <script src="cookie-consent.js"></script>  (avant </body>)
 * Config : window.COOKIE_CONFIG = { ... } avant le script
 *
 * Site 100% statique, sans formulaire, sans analytics tiers → bandeau
 * informatif simple (pas d'opt-in requis). Couverture : RGPD (info) +
 * Ley 21.096 Chile.
 */

(function () {
  // ─── Configuration par défaut (surcharger via window.COOKIE_CONFIG) ───────
  const defaults = {
    siteName:    'B-Life',
    companyName: 'B-Life',
    whatsapp:    '56996158125',   // sans "+", format wa.me
    accentColor: '#2196F3',
    textColor:   '#ffffff',
    bgColor:     '#0D1B2A',
    policyPageId: 'politica-privacidad',
    policyUrl: null,
  };

  const cfg = Object.assign({}, defaults, window.COOKIE_CONFIG || {});

  // ─── Textes (site 100% en espagnol, pas de switch de langue) ─────────────
  const t = {
    bannerText: `Este sitio utiliza una cookie técnica para recordar que ya viste este aviso. No usamos cookies de seguimiento, análisis ni publicidad.`,
    learnMore:  'Más información',
    accept:     'Entendido',
    policyTitle: 'Política de Privacidad',
    policySubtitle: 'Última actualización: agosto 2026',
    s1title: '¿Qué información recopilamos?',
    s1text:  `Este sitio no utiliza herramientas de análisis de terceros (Google Analytics, Meta Pixel, etc.) ni cookies de seguimiento o publicidad.\n\nNo hay formulario de contacto: las consultas de compra se hacen directamente por WhatsApp, fuera de este sitio. No recopilamos ni almacenamos ningún dato personal a través de ${cfg.siteName}.`,
    s2title: 'Cookies utilizadas',
    s2text:  `— Consentimiento de este aviso (localStorage, sin expiración)\n\nEsta es la única cookie del sitio. No identifica al usuario ni se comparte con terceros.`,
    s3title: 'Tus derechos',
    s3text:  `De acuerdo con el RGPD (si eres residente en la UE) y la Ley 21.096 de Chile, tienes derecho a acceder, rectificar o eliminar tus datos personales. Como este sitio no recopila datos mediante formularios, cualquier consulta puede hacerse directamente por WhatsApp:`,
    s4title: 'Alojamiento',
    s4text:  `Este sitio está alojado en Vercel (vercel.com). Puedes consultar su política de privacidad en su sitio web.`,
    back: '← Volver',
  };

  // ─── Cookie banner ────────────────────────────────────────────────────────
  const CONSENT_KEY = 'cookie_consent_v1';

  function injectBanner() {
    if (localStorage.getItem(CONSENT_KEY)) return;

    const banner = document.createElement('div');
    banner.id = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.style.cssText = `
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 99999;
      background: ${cfg.bgColor}; color: ${cfg.textColor};
      padding: 16px 24px; display: flex; align-items: center;
      gap: 16px; flex-wrap: wrap;
      box-shadow: 0 -2px 12px rgba(0,0,0,0.25);
      font-family: 'DM Sans', system-ui, sans-serif; font-size: 14px; line-height: 1.5;
    `;

    banner.innerHTML = `
      <p style="margin:0;flex:1;min-width:220px;">${t.bannerText}</p>
      <div style="display:flex;gap:10px;flex-shrink:0;">
        <button id="cc-more" style="
          background:transparent;border:1px solid ${cfg.accentColor};
          color:${cfg.accentColor};padding:8px 16px;border-radius:4px;
          cursor:pointer;font-size:13px;white-space:nowrap;
        ">${t.learnMore}</button>
        <button id="cc-accept" style="
          background:${cfg.accentColor};border:none;
          color:#fff;padding:8px 20px;border-radius:4px;
          cursor:pointer;font-size:13px;font-weight:600;white-space:nowrap;
        ">${t.accept}</button>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('cc-accept').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, '1');
      banner.remove();
    });

    document.getElementById('cc-more').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, '1');
      banner.remove();
      showPolicy();
    });
  }

  // ─── Page politique de confidentialité ────────────────────────────────────
  function showPolicy() {
    if (cfg.policyUrl) {
      window.location.href = cfg.policyUrl;
      return;
    }

    const existing = document.getElementById(cfg.policyPageId);
    if (existing) {
      existing.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'cc-policy-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 99998;
      background: #fff; overflow-y: auto;
      font-family: 'DM Sans', system-ui, sans-serif; color: #0D1B2A;
    `;

    const sections = [
      { title: t.s1title, text: t.s1text },
      { title: t.s2title, text: t.s2text },
      { title: t.s3title, text: t.s3text, whatsapp: true },
      { title: t.s4title, text: t.s4text },
    ];

    const sectionsHTML = sections.map(s => `
      <div style="margin-bottom:28px;">
        <h2 style="font-size:17px;font-weight:700;color:${cfg.bgColor};margin:0 0 8px;">${s.title}</h2>
        <p style="margin:0;line-height:1.7;white-space:pre-line;">${s.text}</p>
        ${s.whatsapp ? `<p style="margin:8px 0 0;"><a href="https://wa.me/${cfg.whatsapp}" target="_blank" style="color:${cfg.accentColor};font-weight:600;">WhatsApp +56 9 9615 8125</a></p>` : ''}
      </div>
    `).join('');

    overlay.innerHTML = `
      <div style="max-width:720px;margin:0 auto;padding:40px 24px 60px;">
        <button id="cc-back" style="
          background:transparent;border:none;color:${cfg.accentColor};
          font-size:14px;cursor:pointer;padding:0;margin-bottom:28px;
          font-weight:600;
        ">${t.back}</button>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
          <div style="width:4px;height:36px;background:${cfg.accentColor};border-radius:2px;"></div>
          <h1 style="margin:0;font-size:26px;font-weight:700;color:${cfg.bgColor};">${t.policyTitle}</h1>
        </div>
        <p style="margin:0 0 36px;color:#888;font-size:13px;">${t.policySubtitle} · ${cfg.companyName}</p>
        ${sectionsHTML}
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('cc-back').addEventListener('click', function () {
      overlay.remove();
    });
  }

  // ─── Lien "Política de privacidad" dans le footer ─────────────────────────
  function bindPolicyLinks() {
    document.querySelectorAll('[data-cc-policy]').forEach(el => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        showPolicy();
      });
    });
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  function init() {
    injectBanner();
    bindPolicyLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.cookieConsent = { showPolicy };

})();
