/**
 * Daily Farming Management System - Global Search Engine
 * Provides a predictive, lightweight local lookup for Crops, Equipment, Schemes, and Villages.
 */

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('mainSearch');
    // Select the button next to the search input
    const searchBtn = document.querySelector('.search-bar button');

    // If the search bar doesn't exist on this page, stop the script to prevent errors
    if (!searchInput) return;

    /* ==========================================================================
       1. The Local Search Index
       Acts as our lightweight "database" for global routing.
       ========================================================================== */
    const searchIndex = [
        // Crops
        { title: "Wheat", type: "Crop Data", url: "crop-details.html?crop=wheat", tags: ["wheat", "rabi", "cereal", "flour"] },
        { title: "Rice (Paddy)", type: "Crop Data", url: "crop-details.html?crop=rice", tags: ["rice", "paddy", "kharif", "cereal"] },
        { title: "Sugarcane", type: "Crop Data", url: "crop-details.html?crop=sugarcane", tags: ["sugarcane", "cash crop", "sugar"] },
        
        // Area Statistics (Villages)
        { title: "Pimpalgaon Data", type: "Area Stats", url: "area-statistics.html", tags: ["pimpalgaon", "nashik", "maharashtra", "village"] },
        { title: "Jagraon Data", type: "Area Stats", url: "area-statistics.html", tags: ["jagraon", "ludhiana", "punjab", "village"] },
        
        // Equipment
        { title: "Tractor", type: "Machinery", url: "equipment.html", tags: ["tractor", "vehicle", "plow"] },
        { title: "Rotavator", type: "Machinery", url: "equipment.html", tags: ["rotavator", "tillage", "soil"] },
        
        // Schemes
        { title: "PM-KISAN Yojana", type: "Govt Scheme", url: "schemes.html", tags: ["pm kisan", "money", "finance", "subsidy"] },
        { title: "Crop Insurance", type: "Govt Scheme", url: "schemes.html", tags: ["insurance", "bima yojana", "protection"] },
        
        // Tips
        { title: "Drip Irrigation", type: "Farming Tip", url: "farmingtips.html", tags: ["drip", "irrigation", "water", "save"] },
        { title: "Soil Testing", type: "Farming Tip", url: "farmingtips.html", tags: ["soil", "testing", "ph", "npk"] },
        
        // Fertilizer
        { title: "NPK Calculator", type: "Tool", url: "fertilizer.html", tags: ["npk", "calculator", "urea", "dap", "fertilizer"] }
    ];

    /* ==========================================================================
       2. Dynamic UI Injection (The Dropdown Container)
       ========================================================================== */
    const searchContainer = searchInput.parentElement;
    searchContainer.style.position = 'relative'; // Ensure dropdown aligns properly

    const suggestionsBox = document.createElement('div');
    suggestionsBox.setAttribute('id', 'searchSuggestions');
    
    // Injecting CSS via JS so you don't have to edit style.css again
    suggestionsBox.style.cssText = `
        position: absolute;
        top: 110%;
        left: 0;
        width: 70%;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 2000;
        max-height: 300px;
        overflow-y: auto;
        display: none;
        text-align: left;
    `;
    searchContainer.appendChild(suggestionsBox);

    /* ==========================================================================
       3. Search & Filter Logic
       ========================================================================== */
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        suggestionsBox.innerHTML = ''; // Clear previous results

        if (query.length < 2) {
            suggestionsBox.style.display = 'none';
            return;
        }

        // Filter the index based on title OR tags
        const results = searchIndex.filter(item => {
            const matchTitle = item.title.toLowerCase().includes(query);
            const matchTag = item.tags.some(tag => tag.includes(query));
            return matchTitle || matchTag;
        });

        // Render Results
        if (results.length > 0) {
            results.forEach(result => {
                const itemDiv = document.createElement('div');
                itemDiv.style.cssText = `
                    padding: 12px 15px;
                    border-bottom: 1px solid var(--border-color);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: var(--text-main);
                `;
                
                // Hover effect logic
                itemDiv.addEventListener('mouseover', () => itemDiv.style.backgroundColor = 'rgba(46, 204, 113, 0.1)');
                itemDiv.addEventListener('mouseout', () => itemDiv.style.backgroundColor = 'transparent');

                itemDiv.innerHTML = `
                    <span style="font-weight: 600;">${result.title}</span>
                    <span style="font-size: 0.8rem; background: var(--bg-primary); padding: 3px 8px; border-radius: 12px; color: var(--primary-dark);">${result.type}</span>
                `;

                // Routing on click
                itemDiv.addEventListener('click', () => {
                    window.location.href = result.url;
                });

                suggestionsBox.appendChild(itemDiv);
            });
            suggestionsBox.style.display = 'block';
        } else {
            // No results state
            suggestionsBox.innerHTML = `<div style="padding: 15px; color: var(--text-muted); text-align: center;">No matching crops, tools, or data found.</div>`;
            suggestionsBox.style.display = 'block';
        }
    });

    /* ==========================================================================
       4. UX Handling (Closing and Submitting)
       ========================================================================== */
    // Hide dropdown if clicked outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });

    // Handle "Enter" key or Search Button click (Navigates to top result)
    const triggerSearch = () => {
        const topResult = suggestionsBox.querySelector('div');
        if (topResult && searchInput.value.length >= 2) {
            topResult.click(); // Programmatically click the first option
        }
    };

    if (searchBtn) {
        searchBtn.addEventListener('click', triggerSearch);
    }

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            triggerSearch();
        }
    });
});