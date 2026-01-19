const headerLeft = document.getElementById('header-left');
const headerRight = document.getElementById('header-right');
const line1 = document.getElementById('line-1');
const line2 = document.getElementById('line-2');
const chars = document.querySelectorAll('.hero-title .char'); 
        
const speedSection = document.getElementById('speed-control');
const item1 = document.querySelector('.item-1');
const item2 = document.querySelector('.item-2');
const item3 = document.querySelector('.item-3');

const directionSection = document.getElementById('scroll-direction');
const dirLines = document.querySelectorAll('.direction-line');
const stickyText = document.getElementById('sticky-text');
const directionVisuals = document.getElementById('direction-visuals');
        
const lerpSpans = document.querySelectorAll('.lerp-span');
const lerpBy = document.querySelector('.lerp-by');
const lerpChars = document.querySelectorAll('.lerp-char');

const fixedSection = document.getElementById('fixed-elements');
const fixedStickyText = document.getElementById('fixed-sticky-text');
const footerRevealElements = document.querySelectorAll('.footer-reveal-text');

let currentScroll = window.scrollY; 
let targetScroll = window.scrollY;  
const angles = [9, 0, 10, 30, -3];

const lerp = (start, end, factor) => {
    return start + (end - start) * factor;
};

const lerpStates = Array.from(lerpSpans).map(() => ({ 
    scale: 0, 
    targetScale: 0 
}));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const index = Array.from(lerpSpans).indexOf(entry.target);
        if (index > -1) {
            lerpStates[index].targetScale = entry.isIntersecting ? 1 : 0;
        }
    });
}, { threshold: 0.2 });

lerpSpans.forEach(span => observer.observe(span));

const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } 
    });
}, { threshold: 0.5 });

footerRevealElements.forEach(el => footerObserver.observe(el));

window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
    const scrollPosition = window.scrollY;

    headerLeft.style.transform = `translate(${0.3 * scrollPosition}px, -${0.2 * scrollPosition}px)`;
    headerRight.style.transform = `translate(-${0.3 * scrollPosition}px, -${0.2 * scrollPosition}px)`;

    line1.style.transform = `translateY(${scrollPosition * 0.2}px)`;
    line2.style.transform = `translateY(${scrollPosition * 0.3}px)`;

    chars.forEach((char, i) => {
        const speed = 0.05 * (i+1);
        char.style.transform = `translateY(${scrollPosition * speed}px)`;
    });

    const speedSectionOffset = speedSection.offsetTop;
    const speedDelta = scrollPosition - speedSectionOffset;

    item1.style.transform = `translateY(${ -1 * speedDelta }px)`;
    item2.style.transform = `translateY(${ -3 * speedDelta }px)`;
    item3.style.transform = `translateY(${ -5 * speedDelta }px)`;

    const dirSectionOffset = directionSection.offsetTop;
    const dirDelta = scrollPosition - dirSectionOffset;

    dirLines.forEach((line, index) => {
        let direction = 1; 
        let offset = 0;

        if (index === 1 || index === 4) {
            direction = -1;
            offset = 500;
        } else {
            offset = -1000; 
        }

        const angle = angles[index % angles.length];
        line.style.transform = `rotate(${angle}deg) translateX(${ (direction * dirDelta * 2) + offset }px)`;
    });

    const relativeScroll = scrollPosition - dirSectionOffset;
    const limit = directionVisuals.offsetHeight - stickyText.offsetHeight - stickyText.offsetTop;
    const stickyY = Math.max(0, Math.min(relativeScroll, limit));
    stickyText.style.transform = `translateY(${stickyY}px)`;

    const fixedSectionOffset = fixedSection.offsetTop;
    const fixedRelativeScroll = scrollPosition - fixedSectionOffset;
    const fixedSectionHeight = fixedSection.offsetHeight;

    const textLimit = fixedSectionHeight - fixedStickyText.offsetHeight - fixedStickyText.offsetTop;
    const fixedTextY = Math.max(0, Math.min(fixedRelativeScroll, textLimit));
    fixedStickyText.style.transform = `translateY(${fixedTextY}px)`;
});

const animate = () => {
    currentScroll = lerp(currentScroll, targetScroll, 0.05);
    const scrollLag = targetScroll - currentScroll;

    lerpSpans.forEach((span, i) => {
        const dragFactor = 0.1 + (i * 0.02);
        const yMove = scrollLag * dragFactor;

        lerpStates[i].scale = lerp(lerpStates[i].scale, lerpStates[i].targetScale, 0.1);
        span.style.transform = `translateY(${yMove}px) scale(${lerpStates[i].scale})`;
    });

    const byDragFactor = 0.14; 
    if(lerpBy) {
        lerpBy.style.transform = `translateY(${scrollLag * byDragFactor}px)`;
    }

    lerpChars.forEach((char, i) => {
        const charDragFactor = 0.16 + (i * 0.03); 
        char.style.transform = `translateY(${scrollLag * charDragFactor}px)`;
    });

    requestAnimationFrame(animate);
};

animate();