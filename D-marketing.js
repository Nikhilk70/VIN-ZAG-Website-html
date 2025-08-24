let currentSection = 0;
let isScrolling = false;
let scrollTimeout;
let smoothnessOffset = 0;
let extraMomentum = 0;
let momentumTimeout;
let heroTransitioned = false;

const sections = document.querySelectorAll('.content-section');
const images = document.querySelectorAll('.main-image');
const dots = document.querySelectorAll('.scroll-dot');
const leftContents = document.querySelectorAll('.left-content');
const heroImage = document.getElementById('heroImage');
const heroOverlay = document.getElementById('heroOverlay');
const heroContent = document.getElementById('heroContent');
const rightImages = document.getElementById('rightImages');

// https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop


function updateActiveSection(sectionIndex) {
    // Only update images and dots
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (images[sectionIndex]) images[sectionIndex].classList.add('active');
    if (dots[sectionIndex]) dots[sectionIndex].classList.add('active');

    // ✅ Do NOT remove previous texts, just activate the new one
    if (leftContents[sectionIndex]) {
        leftContents[sectionIndex].classList.add('active');
    }

    const progress = ((sectionIndex + 1) / (sections.length + 1)) * 150;
    currentSection = sectionIndex;
}


function handleHeroTransition(scrollTop) {
    const heroHeight = window.innerHeight;
    const transitionStart = heroHeight * 0.3;
    const transitionEnd = heroHeight * 0.8;

    if (scrollTop >= transitionStart && !heroTransitioned) {
        if (rightImages) rightImages.classList.add('active');
        heroTransitioned = true;
    } else if (scrollTop < transitionStart && heroTransitioned) {
        if (heroImage) heroImage.classList.remove('transitioning');
        if (heroOverlay) heroOverlay.style.opacity = '0.4';
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translate(-50%, -50%) scale(1)';
        }
        if (rightImages) rightImages.classList.remove('active');
        heroTransitioned = false;
    }
}


function handleScroll() {
    const scrollTop = window.pageYOffset;
    const heroHeight = window.innerHeight;
    handleHeroTransition(scrollTop);
}

function onScroll() {
    if (!isScrolling) {
        smoothnessOffset += 10;
        extraMomentum += 5;
        clearTimeout(momentumTimeout);
        setTimeout(() => {
            smoothnessOffset = Math.max(0, smoothnessOffset - 30);
        }, 50);
        setTimeout(() => {
            smoothnessOffset = Math.max(0, smoothnessOffset - 30);
            extraMomentum = Math.max(0, extraMomentum - 20);
        }, 100);
        momentumTimeout = setTimeout(() => {
            extraMomentum = Math.max(0, extraMomentum - 20);
            handleScroll();
        }, 100);
    }
    isScrolling = true;
    handleScroll();
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        smoothnessOffset = 0;
        extraMomentum = 0;
    }, 150);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        const targetScroll = window.innerHeight + (index * window.innerHeight);
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    });
});

window.addEventListener('scroll', onScroll);
setTimeout(() => {
    updateActiveSection(0);
}, 500);
let wheelTimeout;
window.addEventListener('wheel', (e) => {
    clearTimeout(wheelTimeout);
    const activeImages = document.querySelectorAll('.main-image.active');
    activeImages.forEach(img => {
        img.style.transform += ' scale(1.02)';
        setTimeout(() => {
            img.style.transform = img.style.transform.replace(' scale(1.02)', '');
        }, 150);
    });
    extraMomentum += 30;
    wheelTimeout = setTimeout(() => {
        onScroll();
    }, 10);
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionIndex = parseInt(entry.target.dataset.section);
            if (sectionIndex !== currentSection) {
                updateActiveSection(sectionIndex);
            }
        }
    });
}, {
    threshold: 0.5,
    rootMargin: '-20% 0px -20% 0px'
});

sections.forEach(section => {
    observer.observe(section);
});


const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

function updateCards() {
    cards.forEach((card, index) => {
        card.className = 'card';
        
        if (index === currentIndex) {
            card.classList.add('active');
        } else if (index === (currentIndex + 1) % cards.length) {
            card.classList.add('next');
        } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
            card.classList.add('prev');
        } else {
            card.classList.add('hidden');
        }
    });

    // Update background
    const activeCard = cards[currentIndex];
    const bgImage = activeCard.getAttribute('data-bg');
    background.style.backgroundImage = `url(${bgImage})`;

    // Update navigation dots
    navDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}