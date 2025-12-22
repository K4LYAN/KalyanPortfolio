// ============================================
// BRUTALIST LOADER (CINEMATIC) - JS
// ============================================

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        minLoadTime: 3500,      // Slightly longer for cinematic feel
        maxLoadTime: 5000,
        updateInterval: 20,
        cleanupDelay: 1500      // Wait for curtain animation (1.2s)
    };

    // DOM Elements
    const loader = document.getElementById('brutalist-loader');
    const progressBar = document.getElementById('progress-bar');
    const percentText = document.getElementById('loader-percent');
    // Using subtext for the typewriter effect
    const statusText = document.querySelector('.loader-subtext');

    // State
    let progress = 0;
    let loadStartTime = Date.now();
    let animationId = null;

    // Typewriter Queue
    const statusMessages = [
        'INITIALIZING...',
        'SECURITY CHECKS...',
        'LOADING ASSETS...',
        'DECRYPTING...',
        'ACCESS GRANTED'
    ];
    let currentMsgIndex = 0;

    /**
     * Typewriter Effect
     */
    function typeText(text, element, speed = 40) {
        if (!element) return;
        element.textContent = '';
        let i = 0;

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    /**
     * Update progress bar
     */
    function updateProgress(value) {
        progress = Math.min(Math.max(value, 0), 100);
        if (progressBar) progressBar.style.width = progress + '%';
        if (percentText) percentText.textContent = Math.floor(progress) + '%';
    }

    /**
     * Animate progress loop
     */
    function animateProgress() {
        const elapsed = Date.now() - loadStartTime;
        const duration = CONFIG.maxLoadTime;

        // Custom Easing: EaseOutExpo for snappy finish
        const t = Math.min(elapsed / duration, 1);
        const easedT = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        let targetProgress = easedT * 100;
        updateProgress(targetProgress);

        // Status Updates based on progress milestones
        const msgIndex = Math.floor((targetProgress / 100) * (statusMessages.length - 1));
        if (msgIndex > currentMsgIndex && msgIndex < statusMessages.length) {
            currentMsgIndex = msgIndex;
            // Retrigger typing for new message
            typeText(statusMessages[currentMsgIndex], statusText, 20);
        }

        if (progress < 100) {
            animationId = requestAnimationFrame(animateProgress);
        } else {
            finishLoading();
        }
    }

    /**
     * Completion Sequence
     */
    function finishLoading() {
        const elapsed = Date.now() - loadStartTime;
        const remaining = Math.max(0, CONFIG.minLoadTime - elapsed);

        setTimeout(() => {
            updateProgress(100);
            typeText('WELCOME // ACCESS GRANTED', statusText, 10);

            // Trigger Curtain Reveal
            setTimeout(hideLoader, 500);
        }, remaining);
    }

    /**
     * Split Curtains & Cleanup
     */
    function hideLoader() {
        if (loader) {
            // This class triggers the CSS transforms on .loader-curtain
            loader.classList.add('loaded');

            // Wait for CSS animation (1.2s) then remove
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.style.overflow = '';
            }, CONFIG.cleanupDelay);
        }
    }

    /**
     * Init
     */
    function init() {
        document.body.style.overflow = 'hidden';
        loadStartTime = Date.now();

        // Start first message typing
        typeText(statusMessages[0], statusText);

        animationId = requestAnimationFrame(animateProgress);

        // Safety fallback
        setTimeout(() => {
            if (progress < 100) {
                cancelAnimationFrame(animationId);
                finishLoading();
            }
        }, CONFIG.maxLoadTime + 1000);
    }

    // Window Load Override (Speed up if page loads fast)
    window.addEventListener('load', () => {
        // Boost speed but keep animation logic
        CONFIG.maxLoadTime = Math.min(CONFIG.maxLoadTime, 2000);
    });

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
