class CreatorProfile {
    constructor() {
        this.systemSound = document.getElementById('systemSound');
        this.bootSequence = document.getElementById('bootSequence');
        this.mainContent = document.getElementById('mainContent');
        
        this.init();
    }

    init() {
        this.startBootSequence();
        this.setupModuleInteractions();
        this.initializeAudio();
        this.createMatrixEffect();
    }

    startBootSequence() {
        // Play system sound during boot with restart
        setTimeout(() => {
            this.systemSound.currentTime = 0;
            this.systemSound.volume = 0.4;
            this.systemSound.play().catch(e => {
                // If autoplay fails, try on first user interaction
                document.addEventListener('click', () => {
                    this.systemSound.currentTime = 0;
                    this.systemSound.play();
                }, { once: true });
            });
        }, 500);

        // Hide boot sequence after animation
        setTimeout(() => {
            this.bootSequence.style.display = 'none';
            this.startMainAnimations();
        }, 5000);
    }

    startMainAnimations() {
        // Animate skill modules with stagger
        const modules = document.querySelectorAll('.skill-module');
        modules.forEach((module, index) => {
            module.style.opacity = '0';
            module.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                module.style.transition = 'all 0.6s ease';
                module.style.opacity = '1';
                module.style.transform = 'translateY(0)';
            }, 6000 + (index * 200));
        });

        // Animate vision items
        const visionItems = document.querySelectorAll('.vision-item');
        visionItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 7000 + (index * 150));
        });
    }

    setupModuleInteractions() {
        const modules = document.querySelectorAll('.skill-module');
        
        modules.forEach(module => {
            module.addEventListener('mouseenter', () => {
                this.activateModule(module);
            });
            
            module.addEventListener('mouseleave', () => {
                this.deactivateModule(module);
            });
        });
    }

    activateModule(module) {
        // Add activation effects
        module.style.background = 'rgba(0, 255, 65, 0.1)';
        module.style.borderColor = '#00ff41';
        
        // Animate module status
        const status = module.querySelector('.module-status');
        if (status) {
            status.style.animation = 'statusPulse 0.5s ease-in-out infinite';
        }

        // Add scan line effect
        const scanLine = document.createElement('div');
        scanLine.className = 'module-scan';
        scanLine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ff41, transparent);
            animation: moduleScan 1s ease-in-out;
        `;
        
        module.style.position = 'relative';
        module.appendChild(scanLine);
        
        setTimeout(() => {
            if (scanLine.parentNode) {
                scanLine.remove();
            }
        }, 1000);
    }

    deactivateModule(module) {
        module.style.background = 'rgba(0, 0, 0, 0.8)';
        module.style.borderColor = 'rgba(0, 255, 65, 0.3)';
        
        const status = module.querySelector('.module-status');
        if (status) {
            status.style.animation = '';
        }
    }

    initializeAudio() {
        this.systemSound.volume = 0.3;
        
        // Add click sound effects
        document.addEventListener('click', (e) => {
            if (e.target.closest('.skill-module') || e.target.closest('.nav-link')) {
                this.playClickSound();
            }
        });
    }

    playClickSound() {
        // Create a short beep sound effect
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    createMatrixEffect() {
        const matrixContainer = document.querySelector('.matrix-rain');
        if (!matrixContainer) return;

        // Create matrix rain effect
        for (let i = 0; i < 20; i++) {
            const drop = document.createElement('div');
            drop.className = 'matrix-drop';
            drop.style.cssText = `
                position: absolute;
                color: #00ff41;
                font-family: 'Share Tech Mono', monospace;
                font-size: 12px;
                opacity: 0.3;
                left: ${Math.random() * 100}%;
                animation: matrixFall ${5 + Math.random() * 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            drop.textContent = Math.random() > 0.5 ? '1' : '0';
            matrixContainer.appendChild(drop);
        }

        // Add matrix animation to CSS
        if (!document.querySelector('#matrix-animation')) {
            const style = document.createElement('style');
            style.id = 'matrix-animation';
            style.textContent = `
                .matrix-rain {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                }
                
                @keyframes matrixFall {
                    0% { transform: translateY(-100vh); opacity: 0; }
                    10% { opacity: 0.3; }
                    90% { opacity: 0.3; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
                
                @keyframes moduleScan {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CreatorProfile();
});

// Add typing effect for boot sequence
document.addEventListener('DOMContentLoaded', () => {
    const bootLines = document.querySelectorAll('.boot-line');
    
    bootLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (charIndex < text.length) {
                    line.textContent += text[charIndex];
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, 500 + (index * 700));
    });
});