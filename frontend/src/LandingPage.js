import React, { useEffect } from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
    useEffect(() => {
        // The Intersection Observer watches for elements entering the viewport
        const observerOptions = {
            root: null, // use browser viewport
            rootMargin: '0px',
            threshold: 0.15 // trigger when 15% of element is visible
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                // If element is in view
                if (entry.isIntersecting) {
                    // Add 'visible' class to trigger CSS transition
                    entry.target.classList.add('visible');
                    // Stop watching this element once animated
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Select all elements with the 'scroll-animate' class
        const targets = document.querySelectorAll('.scroll-animate');
        targets.forEach(target => {
            observer.observe(target);
        });

        // Force trigger hero section on load immediately just in case
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            setTimeout(() => {
                heroContent.classList.add('visible');
            }, 100);
        }

        return () => {
            observer.disconnect();
        }
    }, []);

    return (
        <div className="landing-body">
            <div className="particle-container">
                <div className="nano-orb orb-1"></div>
                <div className="nano-orb orb-2"></div>
                <div className="nano-orb orb-3"></div>
                <div className="nano-orb orb-4"></div>
            </div>

            <section className="hero-section">
                <div className="landing-container hero-content scroll-animate">
                    <h1 className="hero-headline">
                        The Future is <br />
                        <span className="gradient-text">Nano-Engineered.</span>
                    </h1>

                    <p className="hero-subtext">
                        Experience the next generation of digital interfaces.
                        Seamless, aesthetic, and powered by advanced nano-textures.
                    </p>

                    <div>
                        <button onClick={onGetStarted} className="btn-primary">Explore the Platform</button>
                    </div>
                </div>
            </section>

            <section id="features" className="section-padding">
                <div className="landing-container">
                    <div className="features-header scroll-animate">
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Core Advantages</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Built on the NanoBana architecture.</p>
                    </div>

                    <div className="features-grid">
                        <div className="glass-card feature-card scroll-animate delay-1">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Nano-Texture Layering</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>Depth created through multi-layered, generative visual algorithms for a premium feel.</p>
                        </div>

                        <div className="glass-card feature-card scroll-animate delay-2">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Neural Processing</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>Interfaces that adapt in real-time using advanced client-side computation.</p>
                        </div>

                        <div className="glass-card feature-card scroll-animate delay-3">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Zero-Latency Flow</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>Optimized animations ensuring butter-smooth 60fps transitions on any device.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div className="landing-container">
                    <div className="glass-card cta-container scroll-animate">
                        <div className="cta-glow"></div>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: '800' }}>
                            Ready to <span className="gradient-text">Upgrade?</span>
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', fontSize: '1.2rem' }}>
                            Join the future of aesthetic web design today.
                        </p>
                        <button onClick={onGetStarted} className="btn-primary">Get Early Access</button>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="landing-container">
                    <p>© 2023 NanoBana Concepts. All rights reserved.</p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: '0.6' }}>
                        Visuals generated via simulated NanoBana Pro Model architecture.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
