import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = ({ config, setConfig, onClose }) => {
    const [tempConfig, setTempConfig] = useState(config);
    const [view, setView] = useState('home'); // home, sections, navbar, footer, design
    const [isChangingView, setIsChangingView] = useState(false);
    const [transitionLabel, setTransitionLabel] = useState('');
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [editLang, setEditLang] = useState('es');

    const handleSave = () => {
        setConfig(tempConfig);
        localStorage.setItem('siteConfig', JSON.stringify(tempConfig));
        onClose();
    };

    const handleViewChange = (newView, label = '') => {
        setTransitionLabel(label);
        setIsChangingView(true);
        setTimeout(() => {
            setView(newView);
            setIsChangingView(false);
        }, 1200);
    };

    const updateGlobal = (path, value) => {
        const newConfig = { ...tempConfig };
        const keys = path.split('.');
        let current = newConfig;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setTempConfig(newConfig);
        setConfig(newConfig);
    };

    const handleUpdateSection = (id, field, value) => {
        const targetField = editLang === 'en' ? `${field}_en` : field;
        const updatedSections = tempConfig.sections.map(s =>
            s.id === id ? { ...s, content: { ...s.content, [targetField]: value } } : s
        );
        const newCfg = { ...tempConfig, sections: updatedSections };
        setTempConfig(newCfg);
        setConfig(newCfg);
    };

    const handleAddSection = (type) => {
        const newId = `${type}-${Date.now()}`;
        const newSection = {
            id: newId,
            type,
            page: 'landing',
            content: {
                sectionTitle: 'Nueva Sección',
                sectionTitle_en: 'New Section',
                sectionSubtitle: 'Subtítulo del Módulo',
                sectionSubtitle_en: 'Module Subtitle',
                animationsEnabled: true,
                title: 'Título Principal',
                title_en: 'Main Title',
                subtitle: 'Descripción corta o subtítulo',
                subtitle_en: 'Short description or subtitle',
                text: 'Descripción del contenido...',
                text_en: 'Content description...',
                highlight: 'Premium',
                highlight_en: 'Premium',
                image: '',
                buttonAction: 'landing',
                layout: 'text-left',
                ...(type === 'grid' ? {
                    items: [
                        { icon: 'Zap', title: 'Característica 1', title_en: 'Feature 1', text: 'Descripción...', text_en: 'Description...' }
                    ]
                } : {}),
                ...(type === 'pricing' ? {
                    tiers: [
                        { name: 'Básico', price: '8', desc: 'Ideal para inicio', features: ['Característica A'], popular: false, buttonAction: 'landing' }
                    ]
                } : {}),
                ...(type === 'faq' ? {
                    questions: [
                        { q: '¿Cómo funciona?', a: 'Funciona de forma automática y sencilla.' }
                    ]
                } : {})
            }
        };
        const newCfg = { ...tempConfig, sections: [...tempConfig.sections, newSection] };
        setTempConfig(newCfg);
        setConfig(newCfg);
        setEditingSectionId(newId);
    };

    const handleRemoveSection = (id) => {
        if (confirm('¿Eliminar esta sección permanentemente?')) {
            const newCfg = { ...tempConfig, sections: tempConfig.sections.filter(s => s.id !== id) };
            setTempConfig(newCfg);
            setConfig(newCfg);
            if (editingSectionId === id) setEditingSectionId(null);
        }
    };

    const moveSection = (index, direction) => {
        const newSections = [...tempConfig.sections];
        if (direction === 'up' && index > 0) {
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
        } else if (direction === 'down' && index < newSections.length - 1) {
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        }
        const newCfg = { ...tempConfig, sections: newSections };
        setTempConfig(newCfg);
        setConfig(newCfg);
    };

    // --- HELPERS ---
    const LangToggle = () => (
        <div style={{ display: 'flex', gap: '8px', padding: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {['es', 'en'].map(lang => (
                <button
                    key={lang}
                    onClick={() => setEditLang(lang)}
                    style={{
                        padding: '6px 16px',
                        borderRadius: '8px',
                        fontSize: '9px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        background: editLang === lang ? 'var(--primary)' : 'transparent',
                        color: editLang === lang ? 'black' : 'rgba(255,255,255,0.4)'
                    }}
                >
                    {lang}
                </button>
            ))}
        </div>
    );

    const FileUploader = ({ label, value, onChange }) => {
        const [isDragOver, setIsDragOver] = useState(false);
        const handleDrop = (e) => { e.preventDefault(); setIsDragOver(false); const file = e.dataTransfer.files[0]; if (file) processFile(file); };
        const handleClick = () => document.getElementById(`file-input-${label}`).click();
        const processFile = (file) => { const reader = new FileReader(); reader.onloadend = () => onChange(reader.result); reader.readAsDataURL(file); };

        return (
            <div className="prime-form-group">
                <label className="prime-label">{label}</label>
                <div
                    className="file-uploader-prime"
                    style={{ background: isDragOver ? 'rgba(0, 242, 255, 0.05)' : 'transparent', borderColor: isDragOver ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onClick={handleClick}
                >
                    {value ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '28px' }}>
                            <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ) : (
                        <>
                            <div className="prime-icon-box square">
                                <Icons.UploadCloud size={32} style={{ color: 'var(--primary)' }} />
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <p style={{ fontSize: '10px', fontWeight: '900', color: 'white', textTransform: 'uppercase', marginBottom: '4px' }}>Cargar Asset</p>
                                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Click o arrastra aquí</p>
                            </div>
                        </>
                    )}
                    <input id={`file-input-${label}`} type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => e.target.files[0] && processFile(e.target.files[0])} />
                </div>
            </div>
        );
    };

    // --- DASHBOARD VIEWS ---
    const PrimeCardComp = ({ title, subtitle, icon: Icon, color, onClick, badge }) => (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -5, scale: 1.02 }}
            className="prime-card"
            style={{ minHeight: '220px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div className="prime-icon-box square" style={{ borderColor: `${color}33`, width: '64px', height: '64px' }}>
                    <Icon size={24} style={{ color: color }} />
                </div>
                {badge && <div className="prime-badge" style={{ color: color }}>{badge}</div>}
            </div>

            <div style={{ marginTop: 'auto' }}>
                <p className="prime-subtitle" style={{ marginBottom: '4px' }}>{subtitle}</p>
                <h3 className="prime-title" style={{ fontSize: '24px' }}>{title}</h3>
            </div>
        </motion.div>
    );

    const DashboardHome = () => (
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
            <Icons.Atom size={400} className="react-node-decoration" style={{ top: '-100px', right: '-150px', color: 'var(--primary)', opacity: 0.1 }} />
            <Icons.Cpu size={200} className="react-node-decoration" style={{ bottom: '-50px', left: '-100px', color: 'var(--secondary)', opacity: 0.05 }} />

            <div className="prime-header">
                <div>
                    <h2 className="prime-subtitle" style={{ color: 'var(--primary)', marginBottom: '8px' }}>Sistema Centralizado</h2>
                    <h1 className="prime-title">Infraestructura</h1>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                        <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', color: 'white' }}>En Línea</span>
                    </div>
                </div>
            </div>

            <div className="prime-grid-dashboard">
                <PrimeCardComp
                    title="Secciones"
                    subtitle="Gestión de Bloques"
                    icon={Icons.Layers}
                    color={tempConfig.colors.primary}
                    badge="V4.0"
                    onClick={() => handleViewChange('sections', 'Secciones')}
                />
                <PrimeCardComp
                    title="Navegación"
                    subtitle="Menú Superior"
                    icon={Icons.Menu}
                    color={tempConfig.colors.secondary}
                    badge="Header"
                    onClick={() => handleViewChange('navbar', 'Navegación')}
                />
                <PrimeCardComp
                    title="Footer"
                    subtitle="Social & Legal"
                    icon={Icons.PanelBottom}
                    color={tempConfig.colors.accent}
                    badge="Sitio"
                    onClick={() => handleViewChange('footer', 'Pie de Página')}
                />
                <PrimeCardComp
                    title="Diseño"
                    subtitle="Identidad Visual"
                    icon={Icons.Palette}
                    color="#00ffaa"
                    badge="ADN"
                    onClick={() => handleViewChange('design', 'Diseño Hub')}
                />
                <PrimeCardComp
                    title="Legales"
                    subtitle="TyC & Políticas"
                    icon={Icons.FileText}
                    color="#ff6b6b"
                    badge="TyQ"
                    onClick={() => handleViewChange('legales', 'Legales')}
                />
                <PrimeCardComp
                    title="Contacto"
                    subtitle="Canales & Info"
                    icon={Icons.MessageSquare}
                    color="#4dabf7"
                    badge="Directo"
                    onClick={() => handleViewChange('contact_info', 'Info Contacto')}
                />
            </div>

            <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'white', textTransform: 'uppercase', margin: 0, fontStyle: 'italic' }}>Resumen de Configuración</h3>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>Gestionando {tempConfig.sections.length} módulos de contenido activo.</p>
                </div>
                <div className="prime-icon-box square" style={{ width: '100px', height: '100px', borderRadius: '24px' }}>
                    <Icons.Activity size={40} style={{ color: 'var(--primary)', opacity: 0.5 }} />
                </div>
            </div>
        </div>
    );

    const RedirectionLoader = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100000, background: '#050109', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '40px' }}
        >
            <div className="prime-icon-box square" style={{ width: '180px', height: '180px', borderRadius: '40px' }}>
                <div style={{ position: 'absolute', inset: '-20px', background: 'var(--primary)', opacity: `calc(0.1 * ${tempConfig.gradientIntensity || 1})`, filter: `blur(calc(40px * ${tempConfig.gradientIntensity || 1}))`, borderRadius: '50%' }} />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0 }}>
                    <Icons.Atom size={180} style={{ color: 'var(--primary)', opacity: 0.1 }} />
                </motion.div>
                {transitionLabel.includes('Secciones') && <Icons.Layers size={80} style={{ color: 'white', position: 'relative', zIndex: 2 }} />}
                {transitionLabel.includes('Navegación') && <Icons.Menu size={80} style={{ color: 'white', position: 'relative', zIndex: 2 }} />}
                {transitionLabel.includes('Pie') && <Icons.PanelBottom size={80} style={{ color: 'white', position: 'relative', zIndex: 2 }} />}
                {transitionLabel.includes('Diseño') && <Icons.Palette size={80} style={{ color: 'white', position: 'relative', zIndex: 2 }} />}
                {!transitionLabel.includes('Secciones') && !transitionLabel.includes('Navegación') && !transitionLabel.includes('Pie') && !transitionLabel.includes('Diseño') && <Icons.Atom size={80} style={{ color: 'white', position: 'relative', zIndex: 2 }} />}
            </div>
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.4em', fontStyle: 'italic', marginBottom: '8px' }}>
                    {transitionLabel.startsWith('Regresando') ? transitionLabel : `ACCEDIENDO A ${transitionLabel}`}
                </p>
                <p style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>PROTOCOLO SEGURO PRIME v4.2</p>
                <div style={{ width: '240px', height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', margin: '30px auto', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.2 }}
                        style={{ height: '100%', background: 'var(--primary)' }}
                    />
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="prime-panel">
            <AnimatePresence>
                {isChangingView && <RedirectionLoader />}
            </AnimatePresence>

            <div className="prime-hud-layout" style={{ opacity: isChangingView ? 0 : 1, filter: isChangingView ? 'blur(10px)' : 'none', transition: 'all 0.5s' }}>
                {/* SIDEBAR */}
                <aside className="prime-sidebar" style={{ width: view === 'home' ? '280px' : '90px', transition: 'width 0.5s ease' }}>
                    <div style={{ padding: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: view === 'home' ? 'flex-start' : 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div className="prime-icon-box square" style={{ width: '44px', height: '44px', borderRadius: '12px' }}>
                                <Icons.Terminal size={20} style={{ color: 'var(--primary)' }} />
                            </div>
                            {view === 'home' && (
                                <div>
                                    <p style={{ fontSize: '11px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, fontStyle: 'italic' }}>Terminal_Admin</p>
                                    <p style={{ fontSize: '8px', fontWeight: '900', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', margin: 0 }}>v4.2 PRO</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: view === 'home' ? 'stretch' : 'center', gap: '8px' }}>
                        {[
                            { id: 'home', label: 'Inicio', icon: Icons.LayoutDashboard },
                            { id: 'sections', label: 'Secciones', icon: Icons.Layers },
                            { id: 'navbar', label: 'Navegación', icon: Icons.Menu },
                            { id: 'footer', label: 'Pie de Página', icon: Icons.PanelBottom },
                            { id: 'design', label: 'Diseño Hub', icon: Icons.Palette },
                            { id: 'legales', label: 'Legales', icon: Icons.FileText }
                        ].map(item => (
                            <div
                                key={item.id}
                                className={`prime-nav-item ${view === item.id ? 'active' : ''}`}
                                onClick={() => handleViewChange(item.id, item.label)}
                                style={{ justifyContent: view === 'home' ? 'flex-start' : 'center', padding: view === 'home' ? '14px 20px' : '14px' }}
                                title={item.label}
                            >
                                <item.icon size={18} />
                                {view === 'home' && <span>{item.label}</span>}
                            </div>
                        ))}
                    </nav>

                    <div className="prime-sidebar-footer" style={{ padding: view === 'home' ? '24px' : '16px' }}>
                        {view === 'home' ? (
                            <>
                                <button className="prime-btn-close-sidebar" onClick={onClose} style={{ marginBottom: '12px' }}>
                                    <Icons.Power size={14} />
                                    <span>Cerrar Sesión</span>
                                </button>
                                <button className="prime-btn-save-sidebar" onClick={handleSave}>
                                    <Icons.Save size={16} />
                                    <span>Guardar Cambios</span>
                                </button>
                            </>
                        ) : (
                            <button onClick={() => handleViewChange('home', 'Regresando...')} style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icons.Home size={20} />
                            </button>
                        )}
                    </div>
                </aside>

                <main className="prime-main">
                    <div className="prime-scroll">
                        <AnimatePresence mode="wait">
                            {view === 'home' && (
                                <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <DashboardHome />
                                </motion.div>
                            )}

                            {view === 'sections' && (
                                <motion.div key="sections" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', height: '100%', margin: '-4rem' }}>
                                    <div className="prime-sections-sidebar">
                                        <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <p className="prime-label" style={{ marginBottom: '1.5rem' }}>Módulos React</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                                {['hero', 'grid', 'split', 'pricing', 'faq', 'contact'].map(type => (
                                                    <button key={type} onClick={() => handleAddSection(type)} style={{ padding: '12px 4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', transition: '0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <div style={{ marginBottom: '4px' }}>
                                                            {type === 'hero' && <Icons.Zap size={12} style={{ color: 'var(--primary)' }} />}
                                                            {type === 'grid' && <Icons.LayoutGrid size={12} style={{ color: 'var(--secondary)' }} />}
                                                            {type === 'split' && <Icons.Columns size={12} style={{ color: 'var(--accent)' }} />}
                                                            {type === 'pricing' && <Icons.DollarSign size={12} style={{ color: '#00ffaa' }} />}
                                                            {type === 'faq' && <Icons.HelpCircle size={12} style={{ color: '#ffcc00' }} />}
                                                            {type === 'contact' && <Icons.Mail size={12} style={{ color: '#4dabf7' }} />}
                                                        </div>
                                                        <span style={{ fontSize: '7px', fontWeight: '900', textTransform: 'uppercase' }}>{type}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                                            {(tempConfig.sections || []).map((section, idx) => (
                                                <div
                                                    key={section.id}
                                                    onClick={() => setEditingSectionId(section.id)}
                                                    className={`prime-section-card ${editingSectionId === section.id ? 'active' : ''}`}
                                                >
                                                    <div className="prime-icon-box" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--primary)' }}>
                                                        {section.type === 'hero' && <Icons.Zap size={16} />}
                                                        {section.type === 'grid' && <Icons.LayoutGrid size={16} />}
                                                        {section.type === 'split' && <Icons.Columns size={16} />}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: 'white', display: 'block' }}>
                                                            {section.content.title || 'Sin Título'}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <Icons.ChevronUp size={12} style={{ cursor: 'pointer', opacity: 0.2 }} onClick={(e) => { e.stopPropagation(); moveSection(idx, 'up'); }} />
                                                        <Icons.ChevronDown size={12} style={{ cursor: 'pointer', opacity: 0.2 }} onClick={(e) => { e.stopPropagation(); moveSection(idx, 'down'); }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, overflowY: 'auto', padding: '4rem', position: 'relative' }}>
                                        <Icons.Atom size={300} className="react-node-decoration" style={{ bottom: '-50px', right: '-50px', color: 'var(--secondary)', opacity: 0.05 }} />

                                        <div className="prime-header">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                <h2 className="prime-title">Módulos</h2>
                                                <p className="prime-subtitle">Protocolos de Estructura</p>
                                            </div>
                                            <LangToggle />
                                        </div>

                                        {editingSectionId ? (
                                            <div style={{ maxWidth: '800px', position: 'relative', zIndex: 5 }}>
                                                {(() => {
                                                    const section = tempConfig.sections.find(s => s.id === editingSectionId);
                                                    if (!section) return null;
                                                    const val = (key) => editLang === 'en' ? (section.content[`${key}_en`] || section.content[key] || '') : (section.content[key] || '');

                                                    return (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                                            <div style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '40px' }}>
                                                                <div className="prime-form-group" style={{ marginBottom: '32px' }}>
                                                                    <label className="prime-label" style={{ color: 'var(--primary)' }}>Ubicación (Ruta)</label>
                                                                    <div className="toggle-group" style={{ width: '100%', background: 'rgba(0,0,0,0.3)' }}>
                                                                        {(tempConfig.pages || []).map(p => (
                                                                            <button
                                                                                key={p.id}
                                                                                className={(section.page || 'landing') === p.id ? 'active' : ''}
                                                                                onClick={() => {
                                                                                    const updated = tempConfig.sections.map(s => s.id === section.id ? { ...s, page: p.id } : s);
                                                                                    updateGlobal('sections', updated);
                                                                                }}
                                                                                style={{ flex: 1, fontSize: '10px' }}
                                                                            >
                                                                                {p.label}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {(section.type === 'contact') && (
                                                                    <div className="prime-form-group" style={{ marginTop: '20px' }}>
                                                                        <label className="prime-label" style={{ color: 'var(--primary)' }}>Ubicación de Ruta (Contacto)</label>
                                                                        <select
                                                                            className="prime-input"
                                                                            value={section.page || 'landing'}
                                                                            onChange={(e) => {
                                                                                const updated = tempConfig.sections.map(s => s.id === section.id ? { ...s, page: e.target.value } : s);
                                                                                updateGlobal('sections', updated);
                                                                            }}
                                                                        >
                                                                            {(tempConfig.pages || []).map(p => (
                                                                                <option key={p.id} value={p.id}>{p.label}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                )}

                                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                                                                    <div className="prime-form-group">
                                                                        <label className="prime-label">Título de Sección ({editLang})</label>
                                                                        <input className="prime-input" value={val('sectionTitle')} onChange={(e) => handleUpdateSection(section.id, 'sectionTitle', e.target.value)} />
                                                                    </div>
                                                                    <div className="prime-form-group">
                                                                        <label className="prime-label">Subtítulo de Sección ({editLang})</label>
                                                                        <input className="prime-input" value={val('sectionSubtitle')} onChange={(e) => handleUpdateSection(section.id, 'sectionSubtitle', e.target.value)} />
                                                                    </div>
                                                                </div>

                                                                <div className="prime-form-group" style={{ marginBottom: '32px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <label className="prime-label">Animaciones de Framer Motion</label>
                                                                        <button
                                                                            onClick={() => handleUpdateSection(section.id, 'animationsEnabled', !section.content.animationsEnabled)}
                                                                            style={{ padding: '8px 16px', borderRadius: '10px', background: section.content.animationsEnabled !== false ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: section.content.animationsEnabled !== false ? 'black' : 'white', border: 'none', fontSize: '9px', fontWeight: '900', cursor: 'pointer' }}
                                                                        >
                                                                            {section.content.animationsEnabled !== false ? 'ACTIVADAS' : 'DESACTIVADAS'}
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="prime-form-group">
                                                                    <label className="prime-label">Título Principal del Bloque ({editLang})</label>
                                                                    <input className="prime-input" style={{ fontSize: '32px', fontWeight: '900' }} value={val('title')} onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)} />
                                                                </div>

                                                                {(section.type === 'hero' || section.type === 'pricing') && (
                                                                    <div className="prime-form-group">
                                                                        <label className="prime-label" style={{ color: 'var(--accent)' }}>Highlight / Resaltado</label>
                                                                        <input className="prime-input" value={val('highlight') || val('highlightTitle')} onChange={(e) => handleUpdateSection(section.id, section.type === 'hero' ? 'highlightTitle' : 'highlight', e.target.value)} />
                                                                    </div>
                                                                )}

                                                                {(section.type === 'hero' || section.type === 'split' || section.type === 'pricing' || section.type === 'contact') && (
                                                                    <div className="prime-form-group">
                                                                        <label className="prime-label">Descripción / Subtítulo ({editLang})</label>
                                                                        <textarea
                                                                            className="prime-input"
                                                                            style={{ height: '120px', resize: 'none' }}
                                                                            value={editLang === 'en' ? (section.content.text_en || section.content.subtitle_en || section.content.description_en || '') : (section.content.text || section.content.subtitle || section.content.description || '')}
                                                                            onChange={(e) => {
                                                                                const v = e.target.value;
                                                                                handleUpdateSection(section.id, 'text', v);
                                                                                handleUpdateSection(section.id, 'subtitle', v);
                                                                                handleUpdateSection(section.id, 'description', v);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}

                                                                {(section.type === 'hero' || section.type === 'split') && (
                                                                    <div className="prime-form-group">
                                                                        <label className="prime-label">Acción del Botón (Scroll a Sección)</label>
                                                                        <select
                                                                            className="prime-input"
                                                                            value={section.content.buttonAction || 'landing'}
                                                                            onChange={(e) => handleUpdateSection(section.id, 'buttonAction', e.target.value)}
                                                                        >
                                                                            <option value="landing">Inicio (Home)</option>
                                                                            <option value="contacto">Contacto</option>
                                                                            {(tempConfig.sections || []).filter(s => s.id !== section.id).map(s => (
                                                                                <option key={s.id} value={s.id}>{s.content.sectionTitle || s.type} ({s.id})</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                )}

                                                                {section.type === 'pricing' && (
                                                                    <div className="special-editor">
                                                                        <p className="prime-label" style={{ color: 'var(--primary)', marginTop: '32px' }}>Gestión de Planes</p>
                                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                                                                            {(section.content.tiers || []).map((tier, i) => (
                                                                                <div key={i} style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                                                                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                                                                        <input className="prime-input" style={{ flex: 1 }} placeholder="Nombre" value={tier.name} onChange={(e) => { const newTiers = [...section.content.tiers]; newTiers[i].name = e.target.value; handleUpdateSection(section.id, 'tiers', newTiers); }} />
                                                                                        <input className="prime-input" style={{ width: '80px' }} placeholder="Precio" value={tier.price} onChange={(e) => { const newTiers = [...section.content.tiers]; newTiers[i].price = e.target.value; handleUpdateSection(section.id, 'tiers', newTiers); }} />
                                                                                        <select
                                                                                            className="prime-input"
                                                                                            style={{ width: '120px', fontSize: '10px' }}
                                                                                            value={tier.buttonAction || 'landing'}
                                                                                            onChange={(e) => { const newTiers = [...section.content.tiers]; newTiers[i].buttonAction = e.target.value; handleUpdateSection(section.id, 'tiers', newTiers); }}
                                                                                        >
                                                                                            <option value="landing">Scroll a...</option>
                                                                                            <option value="contacto">Contacto</option>
                                                                                            {(tempConfig.sections || []).map(s => <option key={s.id} value={s.id}>{s.content.sectionTitle || s.id}</option>)}
                                                                                        </select>
                                                                                        <button onClick={() => { const newTiers = [...section.content.tiers]; newTiers[i].popular = !newTiers[i].popular; handleUpdateSection(section.id, 'tiers', newTiers); }} style={{ padding: '0 15px', background: tier.popular ? 'var(--accent)' : 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', border: 'none', cursor: 'pointer' }}>
                                                                                            <Icons.Star size={14} fill={tier.popular ? 'white' : 'none'} />
                                                                                        </button>
                                                                                        <button onClick={() => { const newTiers = section.content.tiers.filter((_, idx) => idx !== i); handleUpdateSection(section.id, 'tiers', newTiers); }} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>
                                                                                            <Icons.Trash2 size={14} />
                                                                                        </button>
                                                                                    </div>
                                                                                    <textarea className="prime-input" style={{ height: '60px', fontSize: '11px', marginBottom: '12px' }} placeholder="Descripción corta" value={tier.desc} onChange={(e) => { const newTiers = [...section.content.tiers]; newTiers[i].desc = e.target.value; handleUpdateSection(section.id, 'tiers', newTiers); }} />
                                                                                    <div className="prime-form-group">
                                                                                        <p style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>Características (Separa con coma)</p>
                                                                                        <input className="prime-input" style={{ fontSize: '11px' }} value={tier.features?.join(', ')} onChange={(e) => { const newTiers = [...section.content.tiers]; newTiers[i].features = e.target.value.split(',').map(s => s.trim()); handleUpdateSection(section.id, 'tiers', newTiers); }} />
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                            <button onClick={() => { const newTiers = [...(section.content.tiers || []), { name: 'Nuevo Plan', price: '0', desc: '', features: [], popular: false }]; handleUpdateSection(section.id, 'tiers', newTiers); }} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '16px', color: 'white', cursor: 'pointer' }}>+ Añadir Plan</button>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {section.type === 'faq' && (
                                                                    <div className="special-editor">
                                                                        <p className="prime-label" style={{ color: 'var(--primary)', marginTop: '32px' }}>Preguntas Frecuentes</p>
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                                            {(section.content.questions || []).map((q, i) => (
                                                                                <div key={i} style={{ padding: '24px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                                                                                    <input className="prime-input" style={{ marginBottom: '12px' }} value={q.q} onChange={(e) => { const newQs = [...section.content.questions]; newQs[i].q = e.target.value; handleUpdateSection(section.id, 'questions', newQs); }} placeholder="Pregunta" />
                                                                                    <textarea className="prime-input" style={{ height: '80px' }} value={q.a} onChange={(e) => { const newQs = [...section.content.questions]; newQs[i].a = e.target.value; handleUpdateSection(section.id, 'questions', newQs); }} placeholder="Respuesta" />
                                                                                </div>
                                                                            ))}
                                                                            <button onClick={() => { const newQs = [...(section.content.questions || []), { q: 'Pregunta?', a: '' }]; handleUpdateSection(section.id, 'questions', newQs); }} className="prime-input" style={{ opacity: 0.5 }}>+ Más Preguntas</button>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {section.type === 'grid' && (
                                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                                        {(section.content.items || []).map((item, i) => (
                                                                            <div key={i} style={{ padding: '24px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                                                                                <input className="prime-input" style={{ height: '40px', fontSize: '11px', marginBottom: '12px' }} value={item.title || ''} onChange={(e) => { const newItems = [...section.content.items]; newItems[i].title = e.target.value; handleUpdateSection(section.id, 'items', newItems); }} />
                                                                                <textarea className="prime-input" style={{ height: '80px', fontSize: '11px' }} value={item.text || ''} onChange={(e) => { const newItems = [...section.content.items]; newItems[i].text = e.target.value; handleUpdateSection(section.id, 'items', newItems); }} />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {(section.type === 'hero' || section.type === 'split') && (
                                                                <FileUploader label="Media Asset" value={val('image') || val('bgImage')} onChange={(v) => handleUpdateSection(section.id, section.type === 'hero' ? 'bgImage' : 'image', v)} />
                                                            )}

                                                            <button onClick={() => handleRemoveSection(section.id)} style={{ width: '100%', padding: '20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '20px', color: '#f87171', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer' }}>
                                                                Eliminar Módulo
                                                            </button>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        ) : (
                                            <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                                                <Icons.Box size={100} />
                                                <p style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1em', marginTop: '20px' }}>Panel Vacío</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {view === 'navbar' && (
                                <motion.div key="navbar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="prime-header">
                                        <h2 className="prime-title">Navegación</h2>
                                    </div>
                                    <div style={{ maxWidth: '800px' }}>
                                        <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', marginBottom: '32px' }}>
                                            <label className="prime-label">Texto del Logo</label>
                                            <input className="prime-input" style={{ fontSize: '24px' }} value={tempConfig.logoText || ''} onChange={(e) => updateGlobal('logoText', e.target.value)} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                                    <p className="prime-label">Enlaces de Menú</p>
                                                    <button onClick={() => updateGlobal('navbarLinks', [...tempConfig.navbarLinks, { label_es: 'Nuevo Link', href: 'landing' }])} style={{ padding: '8px 16px', background: 'var(--primary)', color: 'black', borderRadius: '10px', fontSize: '9px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>+ AÑADIR</button>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    {tempConfig.navbarLinks.map((link, idx) => (
                                                        <div key={idx} style={{ padding: '24px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '20px', alignItems: 'center' }}>
                                                                <input className="prime-input" value={link.label_es} onChange={(e) => { const newLinks = [...tempConfig.navbarLinks]; newLinks[idx].label_es = e.target.value; updateGlobal('navbarLinks', newLinks); }} placeholder="Etiqueta" />
                                                                <select
                                                                    className="prime-input"
                                                                    value={link.href}
                                                                    onChange={(e) => { const newLinks = [...tempConfig.navbarLinks]; newLinks[idx].href = e.target.value; updateGlobal('navbarLinks', newLinks); }}
                                                                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                                                >
                                                                    {(tempConfig.pages || []).map(p => (
                                                                        <option key={p.id} value={p.id}>{p.label}</option>
                                                                    ))}
                                                                </select>
                                                                <button onClick={() => updateGlobal('navbarLinks', tempConfig.navbarLinks.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#ff5555', cursor: 'pointer' }}><Icons.Trash2 size={14} /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                                    <p className="prime-label">Páginas Dinámicas</p>
                                                    <button onClick={() => updateGlobal('pages', [...tempConfig.pages, { id: `page-${Date.now()}`, label: 'Nueva Página' }])} style={{ padding: '8px 16px', background: 'var(--secondary)', color: 'white', borderRadius: '10px', fontSize: '9px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>+ CREAR PÁGINA</button>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                    {tempConfig.pages.filter(p => !['tyc', 'politicas'].includes(p.id)).map((p, idx) => (
                                                        <div key={idx} style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                            <input className="prime-input" value={p.label} onChange={(e) => { const newPages = [...tempConfig.pages]; const targetIdx = newPages.findIndex(page => page.id === p.id); newPages[targetIdx].label = e.target.value; updateGlobal('pages', newPages); }} style={{ height: '36px', fontSize: '11px' }} />
                                                            {p.id !== 'landing' && (
                                                                <button onClick={() => {
                                                                    const newPages = tempConfig.pages.filter(page => page.id !== p.id);
                                                                    updateGlobal('pages', newPages);
                                                                    // Also clean up sections assigned to this page
                                                                    const newSections = tempConfig.sections.map(s => s.page === p.id ? { ...s, page: 'landing' } : s);
                                                                    updateGlobal('sections', newSections);
                                                                }} style={{ background: 'none', border: 'none', color: '#ff5555', cursor: 'pointer' }}><Icons.X size={14} /></button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {view === 'footer' && (
                                <motion.div key="footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="prime-header">
                                        <h2 className="prime-title">Sistema de Pie de Página</h2>
                                        <LangToggle />
                                    </div>
                                    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                        <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px' }}>
                                            <label className="prime-label">Texto de Copyright ({editLang})</label>
                                            <textarea
                                                className="prime-input"
                                                style={{ height: '120px' }}
                                                value={editLang === 'en' ? tempConfig.footer.text_en : tempConfig.footer.text}
                                                onChange={(e) => updateGlobal(`footer.${editLang === 'en' ? 'text_en' : 'text'}`, e.target.value)}
                                            />
                                        </div>

                                        <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                                <FileUploader
                                                    label="Badge / Logo Footer"
                                                    value={tempConfig.footer.badge}
                                                    onChange={(v) => updateGlobal('footer.badge', v)}
                                                />
                                                <div>
                                                    <label className="prime-label">Enlace del Badge</label>
                                                    <input
                                                        className="prime-input"
                                                        value={tempConfig.footer.badgeLink || ''}
                                                        onChange={(e) => updateGlobal('footer.badgeLink', e.target.value)}
                                                        placeholder="URL de destino"
                                                    />
                                                    <p style={{ marginTop: '12px', fontSize: '10px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
                                                        Este enlace se aplica al logo/badge de la esquina derecha.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px' }}>
                                            <label className="prime-label">Redes Sociales (URLs)</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                {Object.entries(tempConfig.footer.socials || {}).map(([key, social]) => (
                                                    <div key={key} style={{ display: 'flex', gap: '12px', marginBottom: '4px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                                        <div className="prime-icon-box square small" style={{ width: '36px', height: '36px' }}>
                                                            {key === 'instagram' && <Icons.Instagram size={14} />}
                                                            {key === 'whatsapp' && <Icons.MessageCircle size={14} />}
                                                            {key === 'tiktok' && <Icons.Music2 size={14} />}
                                                            {key === 'twitter' && <Icons.Twitter size={14} />}
                                                        </div>
                                                        <input
                                                            className="prime-input"
                                                            style={{ flex: 1, height: '36px', fontSize: '11px' }}
                                                            value={social.url}
                                                            onChange={(e) => updateGlobal(`footer.socials.${key}.url`, e.target.value)}
                                                        />
                                                        <button
                                                            onClick={() => updateGlobal(`footer.socials.${key}.visible`, !social.visible)}
                                                            style={{ width: '36px', height: '36px', borderRadius: '10px', background: social.visible ? 'var(--primary)' : '#111', color: social.visible ? 'black' : 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        >
                                                            {social.visible ? <Icons.Eye size={12} /> : <Icons.EyeOff size={12} />}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {view === 'design' && (
                                <motion.div key="design" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="prime-header">
                                        <h2 className="prime-title">Diseño Hub</h2>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                        <div style={{ padding: '32px', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px' }}>
                                            <p className="prime-label">Cromática</p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                {[
                                                    { id: 'primary', label: 'PRIMARIO', val: tempConfig.colors.primary },
                                                    { id: 'secondary', label: 'SECUNDARIO', val: tempConfig.colors.secondary },
                                                    { id: 'accent', label: 'ACENTO', val: tempConfig.colors.accent },
                                                    { id: 'embed', label: 'EMBED', val: tempConfig.colors.embed || '#5865F2' }
                                                ].map(c => (
                                                    <div key={c.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                                        <div
                                                            style={{
                                                                width: '100%',
                                                                height: '70px',
                                                                background: c.val,
                                                                borderRadius: '35px',
                                                                cursor: 'pointer',
                                                                position: 'relative',
                                                                border: '1px solid rgba(255,255,255,0.1)',
                                                                boxShadow: `0 10px 30px ${c.val}33`
                                                            }}
                                                        >
                                                            <input
                                                                type="color"
                                                                className="prime-input"
                                                                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                                                value={c.val}
                                                                onChange={(e) => updateGlobal(`colors.${c.id}`, e.target.value)}
                                                            />
                                                        </div>
                                                        <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: '12px', letterSpacing: '0.2em' }}>{c.label}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Minimalist HEX Preview per user reference */}
                                            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: '900', color: 'rgba(255,255,255,0.2)' }}>CUSTOM_COLOR_HEX:</span>
                                                    <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--primary)', fontStyle: 'italic' }}>{tempConfig.colors.embed}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                            <div style={{ padding: '32px', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px' }}>
                                                <p className="prime-label">Atmósfera & Font</p>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                                                    {['cyber', 'dark', 'light'].map(t => (
                                                        <button key={t} onClick={() => updateGlobal('themeMode', t)} style={{ padding: '16px', borderRadius: '12px', background: tempConfig.themeMode === t ? 'var(--primary)' : '#111', color: tempConfig.themeMode === t ? 'black' : 'white', border: 'none', cursor: 'pointer', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>{t}</button>
                                                    ))}
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                    {['sans', 'serif'].map(f => (
                                                        <button key={f} onClick={() => updateGlobal('fontStyle', f)} style={{ padding: '16px', borderRadius: '12px', background: tempConfig.fontStyle === f ? 'var(--primary)' : '#111', color: tempConfig.fontStyle === f ? 'black' : 'white', border: 'none', cursor: 'pointer', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>{f}</button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div style={{ padding: '32px', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px' }}>
                                                <p className="prime-label">Glow & Gradient</p>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                                                    {['primary', 'white', 'none'].map(s => (
                                                        <button key={s} onClick={() => updateGlobal('glowStyle', s)} style={{ padding: '16px', borderRadius: '12px', background: tempConfig.glowStyle === s ? 'var(--primary)' : '#111', color: tempConfig.glowStyle === s ? 'black' : 'white', border: 'none', cursor: 'pointer', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>{s}</button>
                                                    ))}
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                    {['nitro', 'simple'].map(s => (
                                                        <button key={s} onClick={() => updateGlobal('gradientStyle', s)} style={{ padding: '16px', borderRadius: '12px', background: tempConfig.gradientStyle === s ? 'var(--primary)' : '#111', color: tempConfig.gradientStyle === s ? 'black' : 'white', border: 'none', cursor: 'pointer', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>{s}</button>
                                                    ))}
                                                </div>

                                                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Dirección (º)</span>
                                                            <span style={{ fontSize: '9px', fontWeight: '900', color: 'var(--primary)' }}>{tempConfig.gradientAngle || 135}º</span>
                                                        </div>
                                                        <input
                                                            type="range" min="0" max="360"
                                                            value={tempConfig.gradientAngle || 135}
                                                            onChange={(e) => updateGlobal('gradientAngle', parseInt(e.target.value))}
                                                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Intensidad / Difuminado</span>
                                                            <span style={{ fontSize: '9px', fontWeight: '900', color: 'var(--primary)' }}>{(tempConfig.gradientIntensity || 1).toFixed(2)}</span>
                                                        </div>
                                                        <input
                                                            type="range" min="0" max="2" step="0.01"
                                                            value={tempConfig.gradientIntensity || 1}
                                                            onChange={(e) => updateGlobal('gradientIntensity', parseFloat(e.target.value))}
                                                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {view === 'legales' && (
                                <motion.div key="legales" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="prime-header">
                                        <h2 className="prime-title">Gestión Legal</h2>
                                        <LangToggle />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                        {['tyc', 'politicas'].map((key) => (
                                            <div key={key} style={{ padding: '32px', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                                    <div className="prime-icon-box square small" style={{ background: key === 'tyc' ? 'rgba(255,107,107,0.1)' : 'rgba(0,242,255,0.1)' }}>
                                                        {key === 'tyc' ? <Icons.Scale size={20} color="#ff6b6b" /> : <Icons.ShieldCheck size={20} color="#00f2ff" />}
                                                    </div>
                                                    <h3 style={{ fontSize: '14px', fontWeight: '900', color: 'white', textTransform: 'uppercase' }}>
                                                        {key === 'tyc' ? 'Términos & Condiciones' : 'Política de Servicios'}
                                                    </h3>
                                                </div>

                                                <div className="prime-form-group">
                                                    <label className="prime-label">Título ({editLang})</label>
                                                    <input
                                                        className="prime-input"
                                                        value={editLang === 'en' ? tempConfig.legalPages[key].title_en : tempConfig.legalPages[key].title}
                                                        onChange={(e) => updateGlobal(`legalPages.${key}.${editLang === 'en' ? 'title_en' : 'title'}`, e.target.value)}
                                                    />
                                                </div>

                                                <div className="prime-form-group">
                                                    <label className="prime-label">Contenido ({editLang})</label>
                                                    <textarea
                                                        className="prime-input"
                                                        style={{ height: '180px' }}
                                                        value={editLang === 'en' ? tempConfig.legalPages[key].content_en : tempConfig.legalPages[key].content}
                                                        onChange={(e) => updateGlobal(`legalPages.${key}.${editLang === 'en' ? 'content_en' : 'content'}`, e.target.value)}
                                                    />
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                                                    <div>
                                                        <label className="prime-label">Estilo</label>
                                                        <div className="toggle-group" style={{ width: '100%' }}>
                                                            <button
                                                                className={tempConfig.legalPages[key].style === 'crystal' ? 'active' : ''}
                                                                onClick={() => updateGlobal(`legalPages.${key}.style`, 'crystal')}
                                                                style={{ flex: 1 }}
                                                            >Cristalino</button>
                                                            <button
                                                                className={tempConfig.legalPages[key].style === 'classic' ? 'active' : ''}
                                                                onClick={() => updateGlobal(`legalPages.${key}.style`, 'classic')}
                                                                style={{ flex: 1 }}
                                                            >Clasico</button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="prime-label">Animación</label>
                                                        <div className="toggle-group" style={{ width: '100%' }}>
                                                            <button
                                                                className={tempConfig.legalPages[key].animation === 'enabled' ? 'active' : ''}
                                                                onClick={() => updateGlobal(`legalPages.${key}.animation`, 'enabled')}
                                                                style={{ flex: 1 }}
                                                            >On</button>
                                                            <button
                                                                className={tempConfig.legalPages[key].animation === 'disabled' ? 'active' : ''}
                                                                onClick={() => updateGlobal(`legalPages.${key}.animation`, 'disabled')}
                                                                style={{ flex: 1 }}
                                                            >Off</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            {view === 'contact_info' && (
                                <motion.div key="contact_info" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="prime-header">
                                        <h2 className="prime-title">Información de Contacto</h2>
                                        <LangToggle />
                                    </div>
                                    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                        <div className="prime-form-group">
                                            <label className="prime-label">Descripción General ({editLang})</label>
                                            <textarea className="prime-input" value={editLang === 'en' ? tempConfig.contact?.description_en : tempConfig.contact?.description} onChange={(e) => updateGlobal(`contact.${editLang === 'en' ? 'description_en' : 'description'}`, e.target.value)} />
                                        </div>

                                        {['email', 'phone', 'discord'].map(key => (
                                            <div key={key} style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                                    <h4 style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: '900', color: 'var(--primary)' }}>{key}</h4>
                                                    <button
                                                        onClick={() => updateGlobal(`contact.${key}.visible`, !tempConfig.contact[key].visible)}
                                                        style={{ padding: '8px 16px', borderRadius: '10px', background: tempConfig.contact[key].visible ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)', color: tempConfig.contact[key].visible ? '#00ff00' : '#ff5555', border: 'none', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}
                                                    >
                                                        {tempConfig.contact[key].visible ? 'VISIBLE' : 'OCULTO'}
                                                    </button>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                                                    <input className="prime-input" placeholder="Etiqueta" value={tempConfig.contact[key].label} onChange={(e) => updateGlobal(`contact.${key}.label`, e.target.value)} />
                                                    <input className="prime-input" placeholder="Valor" value={tempConfig.contact[key].value} onChange={(e) => updateGlobal(`contact.${key}.value`, e.target.value)} />
                                                </div>
                                            </div>
                                        ))}

                                        <div style={{ padding: '32px', background: 'rgba(37, 211, 102, 0.05)', border: '1px solid rgba(37, 211, 102, 0.2)', borderRadius: '32px' }}>
                                            <h4 style={{ color: '#25d366', textTransform: 'uppercase', fontSize: '12px', fontWeight: '900', marginBottom: '20px' }}>WhatsApp (Burbuja Flotante)</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                                                <input className="prime-input" placeholder="Número (incluye código país)" value={tempConfig.whatsapp?.number} onChange={(e) => updateGlobal('whatsapp.number', e.target.value)} />
                                                <input className="prime-input" placeholder="Mensaje Predeterminado" value={tempConfig.whatsapp?.message} onChange={(e) => updateGlobal('whatsapp.message', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
