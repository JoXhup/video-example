import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import AdminPanel from './AdminPanel';
import { SectionRenderer } from './components/Sections';
import LegalPage from './components/LegalPage';
import './App.css';

const DEFAULT_CONFIG = {
  themeMode: 'cyber', // 'light', 'dark', 'cyber'
  gradientStyle: 'nitro', // 'simple', 'nitro'
  glowStyle: 'white', // 'primary', 'white', 'none'
  fontStyle: 'sans', // 'sans', 'serif'
  colors: { primary: '#00f2ff', secondary: '#7000ff', accent: '#ff007a', embed: '#5865F2' },
  gradientAngle: 135,
  gradientIntensity: 1,
  lang: 'es', // 'es', 'en'
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      content: {
        sectionTitle: 'Inicio',
        sectionTitle_en: 'Home',
        sectionSubtitle: 'Protocolo de Entrada',
        sectionSubtitle_en: 'Entry Protocol',
        animationsEnabled: true,
        title: 'Transform your Reality',
        title_en: 'Transform your Reality',
        highlightTitle: 'GOD MODE',
        highlightTitle_en: 'GOD MODE',
        subtitle: 'Experience the next generation of web interaction.',
        subtitle_en: 'Experience the next generation of web interaction.',
        action1: 'Get Started',
        action1_en: 'Get Started',
        buttonAction: 'pricing-1',
        bgImage: ''
      }
    },
    {
      id: 'pricing-1',
      type: 'pricing',
      content: {
        sectionTitle: 'Precios',
        sectionTitle_en: 'Pricing',
        sectionSubtitle: 'Planes de Adquisición',
        sectionSubtitle_en: 'Acquisition Plans',
        animationsEnabled: true,
        title: 'Selecciona tu',
        title_en: 'Select your',
        highlight: 'Nivel',
        highlight_en: 'Level',
        subtitle: 'Escoge el plan que mejor se adapte a tus necesidades operativas.',
        subtitle_en: 'Choose the plan that best fits your operational needs.',
        tiers: [
          { name: 'Básico', price: '8', desc: 'Ideal para inicio personal', features: ['Característica 1', 'Soporte 24/7'], popular: false, buttonAction: 'contacto' },
          { name: 'Elite Pro', price: '35', desc: 'Máximo rendimiento', features: ['Acceso Total', 'Prioridad de Renderizado', 'Soporte Directo'], popular: true, buttonAction: 'contacto' }
        ]
      }
    },
    {
      id: 'faq-1',
      type: 'faq',
      content: {
        sectionTitle: 'FAQ',
        sectionTitle_en: 'FAQ',
        sectionSubtitle: 'Centro de Consultas',
        sectionSubtitle_en: 'Inquiry Center',
        animationsEnabled: true,
        title: 'Preguntas',
        title_en: 'Common',
        highlight: 'Frecuentes',
        highlight_en: 'Questions',
        questions: [
          { q: '¿Es compatible con todos los navegadores?', a: 'Sí, nuestra arquitectura está optimizada para cualquier ecosistema moderno.' },
          { q: '¿Cómo contacto al soporte?', a: 'Puedes hacerlo a través de nuestro botón de WhatsApp o el formulario de contacto.' }
        ]
      }
    }
  ],
  navbarLinks: [
    { label: 'Features', label_es: 'Características', href: '#features' },
    { label: 'Market', label_es: 'Mercado', href: '#market' },
    { label: 'About', label_es: 'Nosotros', href: '#about' }
  ],
  footer: {
    text: 'EliteWeb © 2026. Diseñado para liderar.',
    text_en: 'EliteWeb © 2026. Designed to lead.',
    badge: 'https://cdn-icons-png.flaticon.com/512/7641/7641727.png',
    badgeLink: '#',
    socials: {
      instagram: { url: 'https://instagram.com', visible: true },
      whatsapp: { url: 'https://wa.me/1234567890', visible: true },
      tiktok: { url: 'https://tiktok.com', visible: true },
      twitter: { url: 'https://twitter.com', visible: true }
    },
    legalLinks: [
      { label: 'Términos y Condiciones', label_en: 'Terms & Conditions', url: '#' },
      { label: 'Privacidad', label_en: 'Privacy', url: '#' }
    ]
  },
  legalPages: {
    tyc: {
      title: 'Términos & Condiciones',
      title_en: 'Terms & Conditions',
      content: 'Bienvenido a nuestra plataforma. Al utilizar nuestros servicios, aceptas cumplir con los siguientes términos...',
      style: 'crystal',
      animation: 'enabled'
    },
    politicas: {
      title: 'Política de Servicios',
      title_en: 'Service Policies',
      content: 'Nuestra política de servicios garantiza la mejor experiencia para todos nuestros usuarios...',
      style: 'crystal',
      animation: 'enabled'
    }
  },
  pages: [
    { id: 'landing', label: 'Inicio', label_en: 'Home' },
    { id: 'precios', label: 'Precios', label_en: 'Pricing' },
    { id: 'contacto', label: 'Contacto', label_en: 'Contact' }
  ],
  whatsapp: {
    enabled: true,
    number: '525647318945',
    message: 'Hola, me gustaría obtener más información sobre sus servicios.'
  },
  contact: {
    email: { value: 'abstractz0@icloud.com', visible: true, label: 'Email' },
    phone: { value: '+ 52 56 4731 8945', visible: true, label: 'Phone' },
    discord: { value: 'discord.gg/HyRe94Xyb2', visible: true, label: 'Discord' },
    description: 'Estamos aquí para ayudarte. Ponte en contacto con nosotros a través de cualquiera de estos canales.',
    description_en: 'We are here to help. Get in touch with us through any of these channels.'
  }
};

const UI_TEXT = {
  es: { login: 'Login', dashboard: 'Dashboard', features: 'Características', market: 'Mercado', about: 'Nosotros', settings: 'Ajustes' },
  en: { login: 'Login', dashboard: 'Dashboard', features: 'Features', market: 'Market', about: 'About', settings: 'Settings' }
};

function App() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('siteConfig');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Deep merge or specific missing checks to ensure new features appear
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          footer: { ...DEFAULT_CONFIG.footer, ...parsed.footer },
          legalPages: parsed.legalPages || DEFAULT_CONFIG.legalPages,
          colors: { ...DEFAULT_CONFIG.colors, ...parsed.colors }
        };
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [password, setPassword] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('landing'); // 'landing', 'tyc', 'politicas'

  // Ultra-Reliable Translation Engine
  const t = (key, data = null) => {
    const lang = config.lang || 'es';
    const isEn = lang === 'en';

    // 1. Static UI Text
    if (!data && UI_TEXT[lang] && UI_TEXT[lang][key]) {
      return UI_TEXT[lang][key];
    }

    // 2. Dynamic content objects (sections, footer)
    if (data) {
      if (typeof data === 'string') return data; // Fallback
      return isEn ? (data[`${key}_en`] || data[key]) : (data[key] || data[`${key}_en`]);
    }

    // 3. Fallback to key itself
    return key;
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', config.colors.primary);
    root.style.setProperty('--secondary', config.colors.secondary);
    root.style.setProperty('--accent', config.colors.accent || '#ff007a');
    root.style.setProperty('--embed-color', config.colors.embed || '#5865F2');
    root.style.setProperty('--gradient-angle', (config.gradientAngle || 135) + 'deg');
    root.style.setProperty('--gradient-intensity', config.gradientIntensity || 1);

    // Theme logic...
    if (config.themeMode === 'light') {
      root.style.setProperty('--bg-darker', '#f0f4f8');
      root.style.setProperty('--bg-dark', '#ffffff');
      root.style.setProperty('--text-main', '#1a202c');
      root.style.setProperty('--text-dim', '#4a5568');
      root.style.setProperty('--glass-bg', 'rgba(0,0,0,0.03)');
      root.style.setProperty('--glass-border', 'rgba(0,0,0,0.08)');
    } else if (config.themeMode === 'cyber') {
      root.style.setProperty('--bg-darker', '#05010d');
      root.style.setProperty('--bg-dark', '#0c021f');
      root.style.setProperty('--text-main', '#ffffff');
      root.style.setProperty('--text-dim', '#b094ff');
      root.style.setProperty('--glass-bg', 'rgba(112, 0, 255, 0.05)');
      root.style.setProperty('--glass-border', 'rgba(0, 242, 255, 0.2)');
    } else {
      root.style.setProperty('--bg-darker', '#020617');
      root.style.setProperty('--bg-dark', '#0f172a');
      root.style.setProperty('--text-main', '#f8fafc');
      root.style.setProperty('--text-dim', '#94a3b8');
      root.style.setProperty('--glass-bg', 'rgba(255,255,255,0.03)');
      root.style.setProperty('--glass-border', 'rgba(255,255,255,0.1)');
    }

    // Nitro Gradient Logic
    if (config.gradientStyle === 'nitro') {
      document.body.classList.add('nitro-mode');
    } else {
      document.body.classList.remove('nitro-mode');
    }

    if (config.glowStyle === 'white') {
      root.style.setProperty('--primary-glow', 'white');
      root.style.setProperty('--secondary-glow', 'white');
    } else if (config.glowStyle === 'none') {
      root.style.setProperty('--primary-glow', 'transparent');
      root.style.setProperty('--secondary-glow', 'transparent');
    } else {
      root.style.setProperty('--primary-glow', config.colors.primary);
      root.style.setProperty('--secondary-glow', config.colors.secondary);
    }

    root.style.fontFamily = config.fontStyle === 'serif' ? '"Playfair Display", serif' : '"Inter", sans-serif';
  }, [config]);

  const toggleLanguage = () => {
    setConfig({ ...config, lang: config.lang === 'es' ? 'en' : 'es' });
  };

  const toggleTheme = (mode) => {
    setConfig({ ...config, themeMode: mode });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '2304') {
      setIsLoadingDashboard(true);
      setShowLogin(false);
      setPassword('');

      // Premium loading delay
      setTimeout(() => {
        setIsLoadingDashboard(false);
        setIsAdmin(true);
        setShowAdminPanel(true);
        localStorage.setItem('isAdmin', 'true');
      }, 2200);
    } else {
      alert('Código de acceso incorrecto.');
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
    localStorage.removeItem('isAdmin');
  };

  const getBackgroundStyle = () => {
    if (config.gradientStyle === 'glass') return { background: 'var(--bg-darker)', backdropFilter: 'blur(100px)' };
    if (config.gradientStyle === 'solid') return { background: config.colors?.primary || '#000' };
    if (config.gradientStyle === 'simple') return { background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})` };
    return {}; // Nitro uses CSS classes
  };

  return (
    <div className={`app-container theme-${config.themeMode}`} style={getBackgroundStyle()}>
      {/* Visual background layers */}
      <div className="nitro-mesh"></div>
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-grid"></div>

      <AnimatePresence mode="wait">
        {!showAdminPanel ? (
          <motion.div
            key="main-web"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen relative"
          >
            <nav className="navbar glass-card floating">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="logo-container"
                onClick={() => setCurrentRoute('landing')}
                style={{ cursor: 'pointer' }}
              >
                <div className="logo elite-gradient-text">{config.logoText || 'EliteHub'}</div>
              </motion.div>

              <div className="nav-links">
                {config.navbarLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    whileHover={{ scale: 1.1, color: 'var(--primary)' }}
                    href={link.href.startsWith('#') ? link.href : '#'}
                    onClick={(e) => {
                      if (!link.href.startsWith('#')) {
                        e.preventDefault();
                        setCurrentRoute(link.href);
                        window.scrollTo(0, 0);
                      }
                    }}
                  >
                    {config.lang === 'es' ? link.label_es : link.label}
                  </motion.a>
                ))}

                <div className="settings-pill" onClick={() => setShowSettings(!showSettings)}>
                  <LucideIcons.Globe size={16} />
                  <span>{config.lang.toUpperCase()}</span>
                  {showSettings && (
                    <div className="settings-dropdown glass-card">
                      <div className="setting-row">
                        <span>Lang</span>
                        <button onClick={(e) => { e.stopPropagation(); toggleLanguage(); }}>
                          {config.lang === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
                        </button>
                      </div>
                      <div className="setting-row">
                        <span>Theme</span>
                        <div className="theme-toggles">
                          <div className={`dot ${config.themeMode === 'cyber' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleTheme('cyber'); }} style={{ background: '#7000ff' }} />
                          <div className={`dot ${config.themeMode === 'dark' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleTheme('dark'); }} style={{ background: '#0f172a' }} />
                          <div className={`dot ${config.themeMode === 'light' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleTheme('light'); }} style={{ background: '#fff' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {!isAdmin ? (
                  <motion.button whileHover={{ scale: 1.05 }} className="btn-login-small pulse-action" onClick={() => setShowLogin(true)}>
                    <LucideIcons.User size={18} />
                  </motion.button>
                ) : (
                  <motion.button whileHover={{ scale: 1.05 }} className="btn-admin-small pulse-action" onClick={() => setShowAdminPanel(true)}>
                    <LucideIcons.LayoutDashboard size={18} />
                  </motion.button>
                )}
              </div>
            </nav>

            <div className="sections-container">
              {['tyc', 'politicas'].includes(currentRoute) ? (
                <LegalPage
                  title={t('title', config.legalPages[currentRoute])}
                  content={t('content', config.legalPages[currentRoute])}
                  style={config.legalPages[currentRoute].style}
                  animation={config.legalPages[currentRoute].animation}
                  onBack={() => setCurrentRoute('landing')}
                  config={config}
                />
              ) : (
                config.sections
                  .filter(section => (section.page || 'landing') === currentRoute)
                  .map((section, index) => (
                    <SectionRenderer key={section.id} section={section} index={index} lang={config.lang} config={config} />
                  ))
              )}
            </div>

            {config.whatsapp?.enabled && (
              <a
                href={`https://wa.me/${config.whatsapp.number}?text=${encodeURIComponent(config.whatsapp.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-float pulse-action"
                style={{
                  position: 'fixed',
                  bottom: '40px',
                  right: '40px',
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #25d366, #128c7e)',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)',
                  zIndex: 1000,
                  cursor: 'pointer'
                }}
              >
                <LucideIcons.MessageCircle size={30} />
              </a>
            )}

            <footer className="footer-elite">
              <div className="footer-content">
                <div className="footer-col brand">
                  <h3 className="elite-gradient-text">{config.logoText}</h3>
                  <p>{t('text', { text: config.footer.text, text_en: config.footer.text_en })}</p>
                </div>
                <div className="footer-col social-center">
                  <div className="social-icons">
                    {config.footer.socials.instagram?.visible && <a href={config.footer.socials.instagram.url}><LucideIcons.Instagram /></a>}
                    {config.footer.socials.whatsapp?.visible && <a href={config.footer.socials.whatsapp.url}><LucideIcons.MessageCircle /></a>}
                    {config.footer.socials.tiktok?.visible && <a href={config.footer.socials.tiktok.url}><LucideIcons.Music2 /></a>}
                    {config.footer.socials.twitter?.visible && <a href={config.footer.socials.twitter.url}><LucideIcons.Twitter /></a>}
                  </div>
                </div>
                <div className="footer-col badge-col">
                  {config.footer.badge && (
                    <a href={config.footer.badgeLink || "#"} className="floating-badge-footer" title="Verified Creator">
                      <img src={config.footer.badge} alt="Creator" />
                    </a>
                  )}
                </div>
              </div>
              <div className="footer-bottom">
                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentRoute('tyc'); window.scrollTo(0, 0); }}>
                  {t('title', config.legalPages.tyc)}
                </a>
                <span className="dot" />
                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentRoute('politicas'); window.scrollTo(0, 0); }}>
                  {t('title', config.legalPages.politicas)}
                </a>
                <span className="dot" />
                <span>System v2.0</span>
              </div>
            </footer>

            {showLogin && (
              <div className="login-overlay-fixed crystal-glass" onClick={() => setShowLogin(false)}>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className="login-card-crystal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="mb-8">
                      <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 backdrop-blur-xl shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                        <LucideIcons.ShieldCheck size={48} className="text-white" />
                      </div>
                      <h2 className="text-white font-black text-2xl mb-1 tracking-tight leading-tight uppercase px-4">
                        Inicio de Sesión en el<br />Panel de Control
                      </h2>
                      <p className="text-white/30 text-[10px] font-bold tracking-[0.4em] uppercase">Acceso Pendiente</p>
                    </div>

                    <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
                      <input
                        type="password"
                        placeholder="••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input-crystal"
                        autoFocus
                      />
                      <button type="submit" className="btn-elite pulse-action mt-16 py-4 px-16 text-xs">
                        INGRESAR
                      </button>
                    </form>

                    <button onClick={() => setShowLogin(false)} className="btn-close-terminal mt-16">
                      SALIR
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="admin-page"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[10000]"
          >
            <AdminPanel
              config={config}
              setConfig={setConfig}
              onClose={() => setShowAdminPanel(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoadingDashboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loader-overlay-fixed z-[20000]"
          >
            <div className="gradient-spinner" />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 font-bold tracking-[0.2em] uppercase text-[10px] mt-4"
            >
              Cargando tu dashboard...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}

export default App;
