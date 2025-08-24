// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgb(28 34 60)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        nav.style.background = 'rgb(28 34 60)';
        nav.style.boxShadow = 'none';
    }
});

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Simulate form submission
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    
    setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '#45b049';
            form.reset();
        }, 2000);
    }, 1500);
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});


let currentIndex = 0;
const cards = document.querySelectorAll('.card');
const navDots = document.querySelectorAll('.nav-dot');
const background = document.getElementById('background');
let autoRotateInterval;

const cardClasses = ['active', 'next', 'hidden', 'prev'];

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

function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCards();
}

function goToCard(index) {
    currentIndex = index;
    updateCards();
}

function startAutoRotate() {
    autoRotateInterval = setInterval(nextCard, 4000);
}

function stopAutoRotate() {
    clearInterval(autoRotateInterval);
}

// Initialize
updateCards();
startAutoRotate();

// Navigation dots event listeners
navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        stopAutoRotate();
        goToCard(index);
        setTimeout(startAutoRotate, 8000); // Restart auto-rotate after 8 seconds
    });
});

// Card click event listeners
cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        if (index !== currentIndex) {
            stopAutoRotate();
            goToCard(index);
            setTimeout(startAutoRotate, 8000);
        }
    });
});

// Pause on hover
const container = document.querySelector('.container');
container.addEventListener('mouseenter', stopAutoRotate);
container.addEventListener('mouseleave', startAutoRotate);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        stopAutoRotate();
        nextCard();
        setTimeout(startAutoRotate, 8000);
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stopAutoRotate();
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCards();
        setTimeout(startAutoRotate, 8000);
    }
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        stopAutoRotate();
        if (diff > 0) {
            // Swipe left - next card
            nextCard();
        } else {
            // Swipe right - previous card
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCards();
        }
        setTimeout(startAutoRotate, 8000);
    }
}


const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

window.addEventListener('scroll', () => {
    const aboutSection = document.querySelector('.about');
    const aboutImage = document.querySelector('.about-visual img');

    if (!aboutSection || !aboutImage) return;

    const sectionTop = aboutSection.offsetTop;
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;

    const scrollSpeed = .5;

    // Change here:
    const scrollOffset = scrollTop + windowHeight - sectionTop;
    const positiveScrollOffset = Math.max(scrollOffset, 0);

    if (scrollOffset > 0 && scrollOffset < aboutSection.offsetHeight + windowHeight) {
        const backgroundOffset = positiveScrollOffset * scrollSpeed;
        aboutSection.style.backgroundPosition = `center ${-backgroundOffset}px`;

        const scrollPercent = Math.min(1, positiveScrollOffset / aboutSection.offsetHeight);
        const translateY = scrollPercent * -30;
        const scale = 1 + scrollPercent * 0.1;
        aboutImage.style.transform = `translateY(${translateY}px) scale(${scale})`;
    }
});

let currentSpeed = 1;
let isPaused = false;
const track = document.getElementById('postersTrack');

function pauseAnimation() {
    track.style.animationPlayState = 'paused';
    isPaused = true;
}

function playAnimation() {
    track.style.animationPlayState = 'running';
    isPaused = false;
}

function changeSpeed() {
    if (currentSpeed === 1) {
        currentSpeed = 2;
        track.style.animationDuration = '22.5s';
    } else if (currentSpeed === 2) {
        currentSpeed = 0.5;
        track.style.animationDuration = '90s';
    } else {
        currentSpeed = 1;
        track.style.animationDuration = '45s';
    }
}

// Add smooth hover effects
document.querySelectorAll('.poster').forEach(poster => {
    poster.addEventListener('mouseenter', () => {
        poster.style.transform = 'translateY(-10px) scale(1.05)';
    });
    
    poster.addEventListener('mouseleave', () => {
        poster.style.transform = 'translateY(0) scale(1)';
    });
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case ' ': // Spacebar
            e.preventDefault();
            if (isPaused) {
                playAnimation();
            } else {
                pauseAnimation();
            }
            break;
        case 'ArrowUp':
            changeSpeed();
            break;
    }
});

function selectServiceTab(service) {
    if (service === 'digital-marketing') {
        window.location.href = "D-marketing.html";
    } else if (service === 'web-development') {
        window.location.href = "Web-development.html";
    } else if (service === 'stationery-design') {
        window.location.href = "Stationery-design.html";
    } else if (service === 'cv-creation') {
        window.location.href = "CV-creation.html";
    }
}
