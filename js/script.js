T/**
 * Daily Farming Management System - Core Script
 * Handles Theme Toggling (Dark Mode) and Mobile Navigation state.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Theme Engine (Dark Mode Manager)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggle');
    
    // Check if the user has a saved preference in their browser's Local Storage
    const savedTheme = localStorage.getItem('theme');

    // If they previously selected dark mode, apply it immediately on page load
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '☀️ Light Mode';
        }
    }

    // Listen for clicks on the Theme Toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Check the current theme state
            let currentTheme = document.documentElement.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                // Switch to Light Mode
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerHTML = '🌙 Dark Mode';
            } else {
                // Switch to Dark Mode
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.innerHTML = '☀️ Light Mode';
            }
        });
    }

    /* ==========================================================================
       2. Navbar State Manager (Mobile Menu)
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        // Toggle menu visibility when hamburger icon is clicked
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents the click from bubbling up to the document
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active'); // Triggers the 'X' animation in CSS
        });

        // Advanced UX: Close the mobile menu if the user clicks anywhere outside of it
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active')) {
                // If the click is NOT inside the nav menu and NOT on the toggle button
                if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });

        // Advanced UX: Close the menu when a link inside it is clicked
        const navLinks = navMenu.querySelectorAll('li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       3. Dynamic Active Link Highlighting (Optional Safety Net)
       ========================================================================== */
    // Even though you hardcoded class="active" in your HTML files, this script
    // acts as a dynamic backup to ensure the correct link is highlighted based on the URL.
    const currentPath = window.location.pathname.split('/').pop();
    if (currentPath !== '') {
        const allNavLinks = document.querySelectorAll('.nav-menu a');
        allNavLinks.forEach(link => {
            // Remove active class from all links
            link.classList.remove('active');
            // If the href matches the current URL path, make it active
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }
});