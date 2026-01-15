import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

const LegalPage = ({ title, content, style, animation, onBack, config }) => {
    const isCrystal = style === 'crystal';
    const isAnimated = animation === 'enabled';

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial={isAnimated ? "hidden" : "visible"}
            animate="visible"
            variants={containerVariants}
            className={`legal-page-container ${isCrystal ? 'crystal-theme' : 'classic-theme'}`}
        >
            <div className="legal-page-content">
                <motion.button
                    variants={itemVariants}
                    onClick={onBack}
                    className="back-button glass-card"
                    whileHover={{ scale: 1.05, x: -5 }}
                >
                    <LucideIcons.ChevronLeft size={20} />
                    <span>Volver</span>
                </motion.button>

                <motion.div variants={itemVariants} className="legal-header">
                    <h1 className="legal-title elite-gradient-text">{title}</h1>
                    <div className="legal-subtitle-line" />
                </motion.div>

                <div className="legal-content-wrapper">
                    {/* Primary content card */}
                    <motion.div
                        variants={itemVariants}
                        className={`legal-main-card ${isCrystal ? 'crystal-glass' : 'glass-card'}`}
                    >
                        <div className="legal-card-header">
                            <div className="prime-icon-box square small">
                                <LucideIcons.Shield size={20} className="text-primary" />
                            </div>
                            <h3>Información Oficial</h3>
                        </div>
                        <div className="legal-text-content">
                            {content.split('\n\n').map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>
                    </motion.div>

                    {/* Info cards moved to bottom */}
                    <div className="legal-bottom-info">
                        <motion.div
                            variants={itemVariants}
                            className={`legal-info-card ${isCrystal ? 'crystal-glass' : 'glass-card'}`}
                        >
                            <LucideIcons.Info size={24} className="info-icon" />
                            <div>
                                <h4>Importante</h4>
                                <p>Esta información es vinculante para todos los usuarios de la plataforma.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className={`legal-info-card ${isCrystal ? 'crystal-glass' : 'glass-card'}`}
                        >
                            <LucideIcons.Clock size={24} className="info-icon" />
                            <div>
                                <h4>Actualizado</h4>
                                <p>{new Date().toLocaleDateString()}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Background elements to match main app */}
            <div className="nitro-mesh"></div>
            <div className="bg-glow bg-glow-1"></div>
            <div className="bg-glow bg-glow-2"></div>
        </motion.div>
    );
};

export default LegalPage;
