// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
    });

    // Close the menu after tapping a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-active');
        });
    });
}

// RSVP FORM
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rsvp-form');
    const toast = document.getElementById('toast');
    const successPanel = document.getElementById('rsvp-success');

    if (!form) return;

    // Hide the guest-count question when someone declines — it doesn't apply.
    const plusOneSection = document.getElementById('plus-one-section');
    const attendanceRadios = form.querySelectorAll('input[name="attendance"]');

    function syncPlusOneVisibility() {
        if (!plusOneSection) return;
        const declined = form.querySelector('input[name="attendance"]:checked')?.value === 'no';
        plusOneSection.hidden = declined;
    }

    attendanceRadios.forEach(radio => radio.addEventListener('change', syncPlusOneVisibility));
    syncPlusOneVisibility();

    const CONFIRMATION = 'Thank you! Your RSVP has been received. We can’t wait to see you!';
    const ERROR_MESSAGE = "Something went wrong sending your RSVP. Please try again, or email us directly.";
    let toastTimer;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
    }

    function encodeFormData(data) {
        return new URLSearchParams(data).toString();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        // Submit to Netlify Forms (works once this site is deployed on Netlify
        // with data-netlify="true" on the <form>; Netlify then emails/notifies
        // you for every submission per the site's Forms settings).
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encodeFormData(Object.fromEntries(formData)),
        })
            .then(() => {
                showToast(CONFIRMATION);

                if (successPanel) {
                    successPanel.hidden = false;
                    successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                form.reset();
            })
            .catch(() => {
                // Network/Netlify unreachable (e.g. running locally, not yet deployed) —
                // fall back to a normal form submission to the thank-you page.
                showToast(ERROR_MESSAGE);
                form.submit();
            });
    });
});

// GALLERY SLIDESHOW
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.slideshow-container');
    if (!container) return;

    const slides = container.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prev = container.querySelector('.prev');
    const next = container.querySelector('.next');

    if (slides.length === 0) return;

    let slideIndex = 0;

    function showSlide(n) {
        // Wrap around in both directions
        slideIndex = (n + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.style.display = i === slideIndex ? 'block' : 'none';
            slide.setAttribute('aria-hidden', i === slideIndex ? 'false' : 'true');
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === slideIndex);
            dot.setAttribute('aria-selected', i === slideIndex ? 'true' : 'false');
        });
    }

    if (prev) prev.addEventListener('click', () => showSlide(slideIndex - 1));
    if (next) next.addEventListener('click', () => showSlide(slideIndex + 1));

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => showSlide(i));
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showSlide(i);
            }
        });
    });

    // Arrow key navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') showSlide(slideIndex - 1);
        if (e.key === 'ArrowRight') showSlide(slideIndex + 1);
    });

    showSlide(0);
});
