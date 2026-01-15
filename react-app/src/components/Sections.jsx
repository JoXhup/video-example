import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

// Helper for localized content
const t = (key, content, lang) => {
    if (!content) return '';
    if (lang === 'en' && content[`${key}_en`]) return content[`${key}_en`];
    return content[key] || content[`${key}_en`] || '';
};

// Helper for standardized Section Header (Title + Subtitle)
const SectionHeader = ({ content, lang }) => {
    const title = t('sectionTitle', content, lang);
    const subtitle = t('sectionSubtitle', content, lang);
    if (!title && !subtitle) return null;
    return (
        <div className="section-header-prime text-center mx-auto mb-8">
            {title && <h2 className="section-header-title elite-gradient-text">{title}</h2>}
            {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
        </div>
    );
};

export const HeroSection = ({ content, lang }) => {
    const isAnimated = content.animationsEnabled !== false;
    const MotionDiv = isAnimated ? motion.div : 'div';

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="hero-section" id={content.id} style={{ backgroundImage: `url(${content.bgImage})` }}>
            {content.bgVideo && (
                <video autoPlay loop muted className="hero-video-bg">
                    <source src={content.bgVideo} type="video/mp4" />
                </video>
            )}
            <MotionDiv
                initial={isAnimated ? { opacity: 0, y: 30 } : {}}
                animate={isAnimated ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="hero-content relative z-10"
            >
                <h1 className="hero-title">
                    {t('title', content, lang)} <br />
                    <span className="elite-gradient-text">{t('highlightTitle', content, lang)}</span>
                </h1>
                <p className="hero-subtitle">{t('subtitle', content, lang)}</p>

                <div className="hero-actions">
                    {content.action1 && (
                        <button
                            className="btn-elite pulse-action"
                            onClick={() => scrollToSection(content.buttonAction)}
                        >
                            {t('action1', content, lang)}
                        </button>
                    )}
                </div>
            </MotionDiv>
        </section>
    );
};

export const SplitSection = ({ content, lang }) => {
    const isAnimated = content.animationsEnabled !== false;
    const MotionDiv = isAnimated ? motion.div : 'div';

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={`split-section-wrapper`} id={content.id}>
            <div className={`split-section container-elite ${content.layout === 'image-left' ? 'reverse' : ''}`}>
                <MotionDiv
                    initial={isAnimated ? { opacity: 0, x: -50 } : {}}
                    whileInView={isAnimated ? { opacity: 1, x: 0 } : {}}
                    viewport={{ once: true }}
                    className="split-text"
                >
                    <h2>{t('title', content, lang)}</h2>
                    <p>{t('text', content, lang)}</p>
                    {content.buttonText && (
                        <button
                            className="btn-elite"
                            onClick={() => scrollToSection(content.buttonAction)}
                        >
                            {t('buttonText', content, lang)}
                        </button>
                    )}
                </MotionDiv>

                <MotionDiv
                    initial={isAnimated ? { opacity: 0, scale: 0.9 } : {}}
                    whileInView={isAnimated ? { opacity: 1, scale: 1 } : {}}
                    viewport={{ once: true }}
                    className="split-media"
                >
                    {content.image && <img src={content.image} alt="Split Media" className="media-fit" />}
                </MotionDiv>
            </div>
        </section>
    );
};

export const GridSection = ({ content, lang }) => {
    const isAnimated = content.animationsEnabled !== false;
    const MotionDiv = isAnimated ? motion.div : 'div';

    const Icon = ({ name }) => {
        const LucideIcon = LucideIcons[name] || LucideIcons.Star;
        return <LucideIcon size={40} className="text-primary mb-4" />;
    };

    return (
        <section className="grid-section text-center" id={content.id}>
            <SectionHeader content={content} lang={lang} />
            <div className="mb-12">
                <h2 className="text-4xl font-bold mb-4">{t('title', content, lang)}</h2>
                <p className="text-xl text-dim">{t('subtitle', content, lang)}</p>
            </div>

            <div className="elite-grid">
                {content.items.map((item, idx) => (
                    <MotionDiv
                        key={idx}
                        whileHover={isAnimated ? { y: -10 } : {}}
                        className="glass-card feature-box"
                    >
                        <Icon name={item.icon} />
                        <h3 className="text-xl font-bold mb-2">{t('title', item, lang)}</h3>
                        <p className="text-sm opacity-80">{t('text', item, lang)}</p>
                    </MotionDiv>
                ))}
            </div>
        </section>
    );
};

export const PricingSection = ({ content, lang }) => {
    const isAnimated = content.animationsEnabled !== false;
    const MotionDiv = isAnimated ? motion.div : 'div';

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="pricing-section py-24 px-6 text-center" id={content.id}>
            <SectionHeader content={content} lang={lang} />

            <div className="mb-16">
                <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">
                    {t('title', content, lang)} <span className="elite-gradient-text">{t('highlight', content, lang)}</span>
                </h2>
                <p className="text-dim text-lg max-w-2xl mx-auto">{t('subtitle', content, lang)}</p>
            </div>

            <div className="pricing-grid-prime">
                {(content.tiers || []).map((tier, idx) => (
                    <MotionDiv
                        key={idx}
                        whileHover={isAnimated ? { y: -10, scale: 1.02 } : {}}
                        className={`prime-pricing-card ${tier.popular ? 'popular' : ''}`}
                    >
                        {tier.popular && (
                            <div className="prime-popular-badge">
                                <LucideIcons.Star size={12} fill="currentColor" />
                                <span>{lang === 'es' ? 'Más Popular' : 'Most Popular'}</span>
                            </div>
                        )}
                        <h3 className="tier-name">{t('name', tier, lang)}</h3>
                        <p className="tier-desc">{t('desc', tier, lang)}</p>

                        <div className="tier-price-row">
                            <span className="currency">$</span>
                            <span className="price">{tier.price}</span>
                            <span className="suffix">USD</span>
                        </div>

                        <ul className="tier-features">
                            {(tier.features || []).map((f, fIdx) => (
                                <li key={fIdx}>
                                    <LucideIcons.Check size={16} className="check-icon" />
                                    <span>{lang === 'es' ? f : (tier.features_en?.[fIdx] || f)}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            className={`btn-prime-action ${tier.popular ? 'highlight' : ''}`}
                            onClick={() => scrollToSection(tier.buttonAction)}
                        >
                            {t('buttonText', tier, lang) || (lang === 'es' ? 'Comenzar Proyecto' : 'Start Project')}
                        </button>
                    </MotionDiv>
                ))}
            </div>
        </section>
    );
};

export const FAQSection = ({ content, lang }) => {
    const isAnimated = content.animationsEnabled !== false;
    const MotionDiv = isAnimated ? motion.div : 'div';

    return (
        <section className="faq-section-prime py-24 px-6" id={content.id}>
            <SectionHeader content={content} lang={lang} />

            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 uppercase">{t('title', content, lang)}</h2>
            </div>

            <div className="faq-grid-prime">
                {(content.questions || []).map((q, idx) => (
                    <MotionDiv
                        key={idx}
                        className="faq-card-prime glass-card"
                        whileHover={isAnimated ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
                    >
                        <h4 className="faq-question">{t('q', q, lang)}</h4>
                        <p className="faq-answer">{t('a', q, lang)}</p>
                    </MotionDiv>
                ))}
            </div>
        </section>
    );
};

export const ContactSection = ({ content, lang, config }) => {
    const contactData = config.contact || {};
    const items = [
        { key: 'email', icon: LucideIcons.Mail, label: 'Email' },
        { key: 'phone', icon: LucideIcons.Phone, label: 'Phone' },
        { key: 'discord', icon: LucideIcons.MessageSquare, label: 'Discord' }
    ];

    return (
        <section className="contact-section py-24 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black mb-4 uppercase">{t('title', content, lang)}</h2>
                    <p className="text-dim">{t('description', contactData, lang)}</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {items.map(item => {
                        const data = contactData[item.key];
                        if (!data || !data.visible) return null;
                        return (
                            <motion.div
                                key={item.key}
                                whileHover={{ x: 10 }}
                                className="glass-card p-10 flex items-center gap-8 group"
                            >
                                <div className="p-5 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                    <item.icon size={32} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h5 className="text-dim text-xs font-bold uppercase tracking-widest mb-1">{data.label || item.label}</h5>
                                    <p className="text-2xl font-bold tracking-tight">{data.value}</p>
                                </div>
                                <LucideIcons.ExternalLink size={20} className="text-dim opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export const SectionRenderer = ({ section, lang, config }) => {
    switch (section.type) {
        case 'hero': return <HeroSection content={section.content} lang={lang} />;
        case 'split': return <SplitSection content={section.content} lang={lang} />;
        case 'grid': return <GridSection content={section.content} lang={lang} />;
        case 'pricing': return <PricingSection content={section.content} lang={lang} />;
        case 'faq': return <FAQSection content={section.content} lang={lang} />;
        case 'contact': return <ContactSection content={section.content} lang={lang} config={config} />;
        default: return null;
    }
};
