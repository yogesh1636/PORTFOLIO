// Alien data with descriptions and powers
const alienData = {
    heatblast: {
        name: "Heatblast",
        description: "A magma-based lifeform from the planet Pyros. Heatblast can generate and manipulate intense heat and fire.",
        powers: ["Pyrokinesis", "Heat Generation", "Fire Immunity", "Lava Surfing"]
    },
    diamondhead: {
        name: "Diamondhead", 
        description: "A silicon-based lifeform from the planet Petropia. Diamondhead's body is composed of extremely durable crystal.",
        powers: ["Crystal Manipulation", "Diamond Projectiles", "Refraction", "Super Durability"]
    },
    swampfire: {
        name: "Swampfire",
        description: "A plant-based Methanosian from the planet Methanos. Swampfire can control plant life, shoot fire, and regenerate from almost any injury.",
        powers: ["Chlorokinesis", "Pyrokinesis", "Regeneration", "Seed Bombs"]
    },
    fourarms: {
        name: "Four Arms",
        description: "A Tetramand from the desert planet Khoros. Four Arms possesses incredible physical strength and combat skills.",
        powers: ["Super Strength", "Enhanced Durability", "Shock Waves", "Combat Expert"]
    },
    xlr8: {
        name: "XLR8",
        description: "A Kineceleran from the planet Kinet. XLR8 can move at incredible speeds and has enhanced reflexes.",
        powers: ["Super Speed", "Enhanced Reflexes", "Speed Mirages", "Friction Immunity"]
    }
};

class Ben10Website {
    constructor() {
        this.backgroundSound = document.getElementById('backgroundSound');
        this.transformationSound = document.getElementById('transformationSound');
        this.currentActiveAlien = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startBackgroundEffects();
        this.initializeAudio();
        this.setupAlienInteractions();
    }

    setupEventListeners() {
        // Alien card interactions
        const alienCards = document.querySelectorAll('.alien-card');
        alienCards.forEach(card => {
            card.addEventListener('click', (e) => this.handleAlienClick(e));
            card.addEventListener('mouseenter', (e) => this.handleAlienHover(e));
            card.addEventListener('mouseleave', (e) => this.handleAlienLeave(e));
        });
    }

    initializeAudio() {
        this.backgroundSound.volume = 0.3;
        this.transformationSound.volume = 0.6;
        
        // Start background sound after 1 second
        setTimeout(() => {
            this.backgroundSound.play().catch(e => {
                // If autoplay fails, try on first user interaction
                document.addEventListener('click', () => {
                    this.backgroundSound.play();
                }, { once: true });
            });
        }, 1000);
    }

    fadeInAudio(audio, targetVolume, duration) {
        const steps = 60;
        const stepTime = duration / steps;
        const volumeStep = targetVolume / steps;
        
        let currentStep = 0;
        const fadeInterval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                audio.volume = targetVolume;
                return;
            }
            
            audio.volume = Math.min(volumeStep * currentStep, targetVolume);
            currentStep++;
        }, stepTime);
    }



    handleAlienClick(event) {
        this.transformationSound.currentTime = 0;
        this.transformationSound.play().catch(e => console.log('Audio play prevented'));
    }

    handleAlienHover(event) {
        const alienCard = event.currentTarget;
        const alienType = alienCard.dataset.alien;
        const alienSection = alienCard.closest('.alien-section');
        const detailsPanel = alienSection.querySelector('.alien-details');
        
        // Prevent multiple simultaneous activations
        if (this.currentActiveAlien === alienType) return;
        
        this.currentActiveAlien = alienType;
        
        // Visual effects only on hover
        this.addTransformationEffect(alienCard);
        this.showAlienDetails(detailsPanel, alienType);
        this.addScreenShake();
    }

    handleAlienLeave(event) {
        const alienCard = event.currentTarget;
        const alienSection = alienCard.closest('.alien-section');
        const detailsPanel = alienSection.querySelector('.alien-details');
        
        this.currentActiveAlien = null;
        
        // Hide alien details
        this.hideAlienDetails(detailsPanel);
        
        // Remove transformation effects
        this.removeTransformationEffect(alienCard);
    }

    addTransformationEffect(alienCard) {
        // Add glow ring effect
        const glowRings = document.querySelectorAll('.glow-ring');
        glowRings.forEach(ring => {
            ring.style.animation = 'rotate 1s linear infinite';
            ring.style.opacity = '0.8';
        });
        
        // Add card transformation
        alienCard.style.transform = 'scale(1.1) translateY(-15px) rotateY(5deg)';
        alienCard.style.boxShadow = '0 25px 50px rgba(0, 255, 65, 0.4)';
    }

    removeTransformationEffect(alienCard) {
        // Reset glow rings
        const glowRings = document.querySelectorAll('.glow-ring');
        glowRings.forEach((ring, index) => {
            ring.style.animation = index === 0 ? 'rotate 25s linear infinite' : 'rotate 30s linear infinite reverse';
            ring.style.opacity = '0.3';
        });
        
        // Reset card
        alienCard.style.transform = '';
        alienCard.style.boxShadow = '';
    }

    showAlienDetails(detailsPanel, alienType) {
        const alienInfo = alienData[alienType];
        if (!alienInfo) return;
        
        // Update content
        const nameElement = detailsPanel.querySelector('.alien-name');
        const descriptionElement = detailsPanel.querySelector('.alien-description');
        const powersElement = detailsPanel.querySelector('.alien-powers');
        
        nameElement.textContent = alienInfo.name;
        descriptionElement.textContent = alienInfo.description;
        
        // Clear and populate powers
        powersElement.innerHTML = '';
        alienInfo.powers.forEach(power => {
            const powerTag = document.createElement('span');
            powerTag.className = 'power-tag';
            powerTag.textContent = power;
            powersElement.appendChild(powerTag);
        });
        
        // Show panel with animation
        setTimeout(() => {
            detailsPanel.classList.add('active');
        }, 100);
    }

    hideAlienDetails(detailsPanel) {
        detailsPanel.classList.remove('active');
    }

    addScreenShake() {
        document.body.style.animation = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.animation = 'screenShake 0.5s ease-in-out';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }

    startBackgroundEffects() {
        // Animate glow rings
        const glowRings = document.querySelectorAll('.glow-ring');
        glowRings.forEach((ring, index) => {
            ring.style.animationDelay = `${index * 2}s`;
        });
        
        // Add floating particles effect
        this.createFloatingParticles();
        
        // Start ambient glow animation
        this.startAmbientGlow();
    }

    createFloatingParticles() {
        const particleCount = 15;
        const container = document.querySelector('.background-layer');
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #00ff41;
                border-radius: 50%;
                opacity: 0.6;
                animation: float ${5 + Math.random() * 10}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }
        
        // Add floating animation to CSS
        if (!document.querySelector('#floating-animation')) {
            const style = document.createElement('style');
            style.id = 'floating-animation';
            style.textContent = `
                @keyframes float {
                    0% { transform: translateY(0px) translateX(0px); opacity: 0; }
                    10% { opacity: 0.6; }
                    90% { opacity: 0.6; }
                    100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
                }
                @keyframes screenShake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    75% { transform: translateX(2px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    startAmbientGlow() {
        const effectOverlay = document.querySelector('.effect-overlay');
        let glowIntensity = 0.1;
        let increasing = true;
        
        setInterval(() => {
            if (increasing) {
                glowIntensity += 0.005;
                if (glowIntensity >= 0.3) increasing = false;
            } else {
                glowIntensity -= 0.005;
                if (glowIntensity <= 0.1) increasing = true;
            }
            
            effectOverlay.style.background = 
                `radial-gradient(circle at 50% 50%, rgba(0, 255, 65, ${glowIntensity}) 0%, transparent 70%)`;
        }, 100);
    }

    setupAlienInteractions() {
        // Add entrance animations
        const alienCards = document.querySelectorAll('.alien-card');
        alienCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 500 + (index * 200));
        });
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Ben10Website();
});

// Add loading screen fade out
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});