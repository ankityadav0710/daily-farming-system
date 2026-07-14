/**
 * Daily Farming Management System - Area Statistics Module
 * Handles procedural data generation, cascading dropdowns, and Admin Verified Farmer integration.
 */

document.addEventListener("DOMContentLoaded", () => {
            
    /* ==========================================================================
       1. Structural Regional District Configuration Matrix
       ========================================================================== */
    const regions = {
        "Uttar Pradesh": [
            "Agra", "Aligarh", "Prayagraj", "Varanasi", "Lucknow", "Kanpur", "Meerut", 
            "Ghaziabad", "Noida", "Mathura", "Jhansi", "Gorakhpur", "Bareilly", "Moradabad", 
            "Saharanpur", "Ayodhya", "Azamgarh", "Firozabad", "Muzaffarnagar", "Shahjahanpur", 
            "Etawah", "Mainpuri", "Kannauj", "Jalaun", "Lalitpur", "Sitapur"
        ],
        "Bihar": [
            "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", 
            "Arrah", "Begusarai", "Katihar", "Munger", "Chhapra", "Danapur", "Saharsa", 
            "Hajipur", "Sasaram", "Dehri", "Siwan", "Bettiah", "Motihari", "Bagaha", 
            "Kishanganj", "Jamalpur", "Buxar", "Jehanabad", "Aurangabad"
        ],
        "Madhya Pradesh": [
            "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", 
            "Satna", "Ratlam", "Rewa", "Murwara", "Singrauli", "Burhanpur", "Khandwa", 
            "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Chhatarpur", "Damoh", 
            "Mandsaur", "Khargone", "Neemuch", "Pithampur", "Hoshangabad"
        ],
        "Uttarakhand": [
            "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", 
            "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", 
            "Udham Singh Nagar", "Uttarkashi"
        ]
    };

    const cropDatabaseArr = [
        { name: "Wheat", multiplier: 20, cat: ["Uttar Pradesh", "Bihar", "Madhya Pradesh"] },
        { name: "Rice (Paddy)", multiplier: 24, cat: ["Uttar Pradesh", "Bihar", "Uttarakhand"] },
        { name: "Maize (Corn)", multiplier: 18, cat: ["Uttar Pradesh", "Bihar", "Madhya Pradesh"] },
        { name: "Finger Millet (Ragi)", multiplier: 11, cat: ["Uttarakhand"] },
        { name: "Foxtail Millet", multiplier: 8, cat: ["Uttarakhand"] },
        { name: "Barley", multiplier: 14, cat: ["Uttarakhand", "Uttar Pradesh"] },
        { name: "Black Gram (Urad)", multiplier: 5, cat: ["Madhya Pradesh", "Uttar Pradesh"] },
        { name: "Green Gram (Moong)", multiplier: 4, cat: ["Bihar", "Madhya Pradesh"] },
        { name: "Pigeon Pea (Arhar)", multiplier: 7, cat: ["Uttar Pradesh", "Madhya Pradesh"] },
        { name: "Rajma (Kidney Beans)", multiplier: 6, cat: ["Uttarakhand"] },
        { name: "Potato", multiplier: 140, cat: ["Uttar Pradesh", "Bihar"] },
        { name: "Tomato", multiplier: 180, cat: ["Uttar Pradesh", "Bihar", "Madhya Pradesh", "Uttarakhand"] },
        { name: "Onion", multiplier: 110, cat: ["Madhya Pradesh", "Bihar", "Uttar Pradesh"] },
        { name: "Bitter Gourd", multiplier: 50, cat: ["Uttar Pradesh", "Bihar", "Madhya Pradesh"] },
        { name: "Sugarcane", multiplier: 360, cat: ["Uttar Pradesh", "Bihar"] },
        { name: "Cotton", multiplier: 10, cat: ["Madhya Pradesh", "Uttar Pradesh"] },
        { name: "Mustard", multiplier: 8, cat: ["Uttar Pradesh", "Madhya Pradesh"] },
        { name: "Groundnut", multiplier: 9, cat: ["Madhya Pradesh", "Uttar Pradesh"] },
        { name: "Ginger", multiplier: 70, cat: ["Uttarakhand"] },
        { name: "Turmeric", multiplier: 90, cat: ["Uttarakhand", "Uttar Pradesh"] }
    ];

    const villagePrefixes = ["Ram", "Kishan", "Dev", "Shiv", "Gopal", "Shanti", "Anand", "Govind", "Maha", "Bada", "Rudra", "Hari", "Nava", "Kashi", "Ganga"];
    const villageSuffixes = ["pur", "nagar", "gaon", "garh", "kheda", "tola", "chauk", "kalan", "khurd", "bad"];

    const locationData = {};
    const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    /* ==========================================================================
       2. Generate Procedural Data (Including Prayagraj Special Logic)
       ========================================================================== */
    for (const [state, districts] of Object.entries(regions)) {
        locationData[state] = {};
        districts.forEach(district => {
            locationData[state][district] = {};
            
            // SPECIAL RULE FOR PRAYAGRAJ: Generate 12 to 15 villages instead of 3
            let numberOfVillages = (district === "Prayagraj") ? getRandom(12, 15) : 3;
            
            for (let v = 0; v < numberOfVillages; v++) {
                
                // Ensure unique village names inside the district
                let villageName;
                let attempts = 0;
                do {
                    let prefix = villagePrefixes[getRandom(0, villagePrefixes.length - 1)];
                    let suffix = villageSuffixes[getRandom(0, villageSuffixes.length - 1)];
                    villageName = `${prefix}${suffix}`;
                    attempts++;
                } while (locationData[state][district][villageName] && attempts < 20);

                let regionalCrops = cropDatabaseArr.filter(c => c.cat.includes(state));
                if(regionalCrops.length < 2) regionalCrops = cropDatabaseArr;
                let selectedCrops = [...regionalCrops].sort(() => 0.5 - Math.random()).slice(0, 3);
                
                let totalVillageFarmers = 0;
                let totalVillageLand = 0;
                let cropsGrown = [];
                let maxArea = 0;
                let primaryCrop = "";

                selectedCrops.forEach(crop => {
                    let farmers = getRandom(40, 180);
                    let area = getRandom(120, 600); 
                    if (state === "Uttarakhand") area = Math.round(area * 0.4); 
                    let production = area * crop.multiplier;

                    totalVillageFarmers += farmers;
                    totalVillageLand += area;
                    if (area > maxArea) { maxArea = area; primaryCrop = crop.name; }

                    cropsGrown.push({
                        name: crop.name,
                        farmers: farmers,
                        area: `${area} Acres`,
                        production: `${production.toLocaleString()} Qtl`
                    });
                });

                locationData[state][district][villageName] = {
                    totalFarmers: totalVillageFarmers,
                    totalLand: totalVillageLand, // Keep as raw number for math later
                    majorCrop: primaryCrop,
                    crops: cropsGrown
                };
            }
        });
    }

    /* ==========================================================================
       3. DOM Elements & Cascading Logic
       ========================================================================== */
    const stateSelect = document.getElementById("stateSelect");
    const districtSelect = document.getElementById("districtSelect");
    const villageSelect = document.getElementById("villageSelect");
    const statsDashboard = document.getElementById("statsDashboard");
    const cropTableBody = document.getElementById("cropTableBody");

    // Skip execution if we are not on the area-statistics page
    if (!stateSelect || !districtSelect || !villageSelect) return;

    const sortedStates = Object.keys(locationData).sort();
    sortedStates.forEach(state => {
        let option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });

    stateSelect.addEventListener("change", function() {
        districtSelect.innerHTML = '<option value="">-- Choose District --</option>';
        villageSelect.innerHTML = '<option value="">-- Choose Village --</option>';
        districtSelect.disabled = true;
        villageSelect.disabled = true;
        statsDashboard.style.display = "none";
        if (this.value) {
            const sortedDistricts = Object.keys(locationData[this.value]).sort();
            sortedDistricts.forEach(district => {
                let option = document.createElement("option"); option.value = district; option.textContent = district;
                districtSelect.appendChild(option);
            });
            districtSelect.disabled = false;
        }
    });

    districtSelect.addEventListener("change", function() {
        villageSelect.innerHTML = '<option value="">-- Choose Village --</option>';
        villageSelect.disabled = true;
        statsDashboard.style.display = "none";
        if (this.value) {
            const sortedVillages = Object.keys(locationData[stateSelect.value][this.value]).sort();
            sortedVillages.forEach(village => {
                let option = document.createElement("option"); option.value = village; option.textContent = village;
                villageSelect.appendChild(option);
            });
            villageSelect.disabled = false;
        }
    });

    /* ==========================================================================
       4. FINAL RENDER: Procedural Data + Admin Verified Data Integration
       ========================================================================== */
    villageSelect.addEventListener("change", function() {
        const selectedState = stateSelect.value;
        const selectedDistrict = districtSelect.value;
        const selectedVillage = this.value;

        if (!selectedVillage) {
            statsDashboard.style.display = "none";
            return;
        }

        const data = locationData[selectedState][selectedDistrict][selectedVillage];
        
        // Base totals from procedural data
        let totalFarmersCalc = data.totalFarmers;
        let totalLandCalc = data.totalLand;

        // --- INTEGRATION: Fetch Farmer Data from LocalStorage ---
        let userSubmissions = JSON.parse(localStorage.getItem('farmerSubmissions')) || [];
        
        // Filter records that are 'Verified' AND match the currently selected village
        let localVerifiedRecords = userSubmissions.filter(r => 
            r.status === 'Verified' && 
            r.state.toLowerCase() === selectedState.toLowerCase() && 
            r.district.toLowerCase() === selectedDistrict.toLowerCase() &&
            r.village.toLowerCase() === selectedVillage.toLowerCase()
        );

        // Add verified farmers to the total numbers
        localVerifiedRecords.forEach(record => {
            totalFarmersCalc += 1;
            totalLandCalc += parseFloat(record.area);
        });

        // Update UI Counters
        document.getElementById("lblFarmers").textContent = totalFarmersCalc;
        document.getElementById("lblLand").textContent = totalLandCalc.toLocaleString() + " Acres";
        document.getElementById("lblMajorCrop").textContent = data.majorCrop;

        // Render Table
        cropTableBody.innerHTML = ""; 
        
        // 1. Print Standard Procedural Rows
        data.crops.forEach(crop => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${crop.name}</strong></td>
                <td>${crop.farmers}</td>
                <td>${crop.area}</td>
                <td>${crop.production}</td>
            `;
            cropTableBody.appendChild(tr);
        });

        // 2. Print Admin Verified User Rows (Highlighted!)
        localVerifiedRecords.forEach(record => {
            const tr = document.createElement("tr");
            tr.style.backgroundColor = "rgba(230, 126, 34, 0.1)"; // Highlight color to show user data
            
            let estProd = parseFloat(record.area) * 20; // Generic rough yield estimate
            
            tr.innerHTML = `
                <td>
                    <strong>${record.crop}</strong> 
                    <br><span style="font-size:0.75rem; color:var(--accent-color); font-weight:bold;">★ Added by Farmer: ${record.name}</span>
                </td>
                <td>1</td>
                <td>${record.area} Acres</td>
                <td>~${estProd.toLocaleString()} Qtl</td>
            `;
            cropTableBody.appendChild(tr);
        });

        statsDashboard.style.display = "block";
    });
});