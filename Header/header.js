document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    // Sticky Header Logic
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('is-sticky');
        } else {
            header.classList.remove('is-sticky');
        }
    };

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    // Initial check in case of page reload halfway down
    handleScroll();

    // Mobile Menu Toggle Logic
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('is-active');
        mobileMenu.classList.toggle('is-active');
        
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('is-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // Close Mobile Menu on item click
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileToggle.classList.remove('is-active');
            mobileMenu.classList.remove('is-active');
            document.body.style.overflow = 'auto';
        });
    });
});
