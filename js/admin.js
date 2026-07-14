/**
 * Daily Farming Management System - Admin Dashboard Engine
 * Handles CRUD Operations (Create, Read, Update, Delete) and Verification using LocalStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Database Initialization (Full 20-Crop Sync)
       ========================================================================== */
    const defaultCrops = [
        { id: 101, name: "Wheat", category: "Cereal", season: "Rabi", yield: 20 },
        { id: 102, name: "Rice (Paddy)", category: "Cereal", season: "Kharif", yield: 24 },
        { id: 103, name: "Maize (Corn)", category: "Cereal", season: "Kharif", yield: 18 },
        { id: 104, name: "Finger Millet (Ragi)", category: "Millet", season: "Kharif", yield: 11 },
        { id: 105, name: "Foxtail Millet", category: "Millet", season: "Kharif", yield: 8 },
        { id: 106, name: "Barley", category: "Cereal", season: "Rabi", yield: 14 },
        { id: 107, name: "Black Gram (Urad)", category: "Pulse", season: "Kharif", yield: 5 },
        { id: 108, name: "Green Gram (Moong)", category: "Pulse", season: "Zaid", yield: 4 },
        { id: 109, name: "Pigeon Pea (Arhar)", category: "Pulse", season: "Kharif", yield: 7 },
        { id: 110, name: "Rajma (Kidney Beans)", category: "Pulse", season: "Rabi", yield: 6 },
        { id: 111, name: "Potato", category: "Vegetable", season: "Rabi", yield: 140 },
        { id: 112, name: "Tomato", category: "Vegetable", season: "Multi", yield: 180 },
        { id: 113, name: "Onion", category: "Vegetable", season: "Rabi", yield: 110 },
        { id: 114, name: "Bitter Gourd", category: "Vegetable", season: "Zaid", yield: 50 },
        { id: 115, name: "Sugarcane", category: "Cash Crop", season: "Annual", yield: 360 },
        { id: 116, name: "Cotton", category: "Cash Crop", season: "Kharif", yield: 10 },
        { id: 117, name: "Mustard", category: "Oilseed", season: "Rabi", yield: 8 },
        { id: 118, name: "Groundnut", category: "Oilseed", season: "Kharif", yield: 9 },
        { id: 119, name: "Ginger", category: "Spice", season: "Kharif", yield: 70 },
        { id: 120, name: "Turmeric", category: "Spice", season: "Kharif", yield: 90 }
    ];

    // If local storage is empty, load the full 20 crop database
    let cropsDB = JSON.parse(localStorage.getItem('adminCropsDB')) || defaultCrops;

    /* ==========================================================================
       2. DOM Element Mapping
       ========================================================================== */
    const tableBody = document.getElementById('cropTableBody');
    const totalCropsWidget = document.getElementById('totalCropsWidget');
    const modal = document.getElementById('cropModal');
    const form = document.getElementById('cropForm');
    const modalTitle = document.getElementById('modalTitle');
    const inputId = document.getElementById('cropId'); 
    const inputName = document.getElementById('cropName');
    const inputCategory = document.getElementById('cropCategory');
    const inputSeason = document.getElementById('cropSeason');
    const inputYield = document.getElementById('cropYield');

    /* ==========================================================================
       3. READ: Render Data to the HTML Table
       ========================================================================== */
    function renderTable() {
        tableBody.innerHTML = ""; 
        cropsDB.forEach((crop) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${crop.id}</td>
                <td><strong>${crop.name}</strong></td>
                <td><span style="background: var(--bg-primary); padding: 3px 8px; border-radius: 12px; font-size: 0.85rem; color: var(--primary-dark);">${crop.category}</span></td>
                <td>${crop.season}</td>
                <td>${crop.yield} Qtl</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editCrop(${crop.id})">Edit</button>
                    <button class="action-btn btn-delete" onclick="deleteCrop(${crop.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
        totalCropsWidget.textContent = cropsDB.length;
        localStorage.setItem('adminCropsDB', JSON.stringify(cropsDB));
    }

    /* ==========================================================================
       4. CREATE & UPDATE
       ========================================================================== */
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const id = inputId.value;
        const cropData = {
            id: id ? parseInt(id) : Date.now(), 
            name: inputName.value,
            category: inputCategory.value,
            season: inputSeason.value,
            yield: inputYield.value
        };

        if (id) {
            const index = cropsDB.findIndex(c => c.id == id);
            if(index !== -1) cropsDB[index] = cropData;
        } else {
            cropsDB.push(cropData);
        }
        closeModal();
        renderTable(); 
    });

    /* ==========================================================================
       5. UPDATE PREP
       ========================================================================== */
    window.editCrop = function(id) {
        const crop = cropsDB.find(c => c.id === id);
        if(crop) {
            inputId.value = crop.id;
            inputName.value = crop.name;
            inputCategory.value = crop.category;
            inputSeason.value = crop.season;
            inputYield.value = crop.yield;
            modalTitle.textContent = "✏️ Edit Crop Record";
            modal.style.display = "flex";
        }
    }

    /* ==========================================================================
       6. DELETE
       ========================================================================== */
    window.deleteCrop = function(id) {
        if(confirm("Are you sure you want to permanently delete this crop record?")) {
            cropsDB = cropsDB.filter(c => c.id !== id);
            renderTable();
        }
    }

    /* ==========================================================================
       7. Modal Controls
       ========================================================================== */
    document.getElementById('openModalBtn').addEventListener('click', () => {
        form.reset(); 
        inputId.value = ""; 
        modalTitle.textContent = "🌱 Add New Crop";
        modal.style.display = "flex";
    });

    const closeModal = () => modal.style.display = "none";
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });

    /* ==========================================================================
       8. Boot the Application
       ========================================================================== */
    renderTable();

    /* ==========================================================================
       9. FARMER VERIFICATION LOGIC
       ========================================================================== */
    const verificationTableBody = document.getElementById('verificationTableBody');

    function loadPendingData() {
        if (!verificationTableBody) return;
        let submissions = JSON.parse(localStorage.getItem('farmerSubmissions')) || [];
        verificationTableBody.innerHTML = '';
        let pendingCount = 0;

        submissions.forEach((record) => {
            if (record.status === 'Pending') {
                pendingCount++;
                let tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${record.name}</strong></td>
                    <td>${record.village}, ${record.district}</td>
                    <td>${record.crop}</td>
                    <td>${record.area} Acres</td>
                    <td>
                        <button class="action-btn btn-approve" onclick="verifyRecord(${record.id})">Approve</button>
                        <button class="action-btn btn-delete" onclick="rejectRecord(${record.id})">Reject</button>
                    </td>
                `;
                verificationTableBody.appendChild(tr);
            }
        });

        // Show empty message if no pending farmers
        if (pendingCount === 0) {
            verificationTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--text-muted);">No pending farmer submissions right now.</td></tr>';
        }
    }

    window.verifyRecord = function(id) {
        let submissions = JSON.parse(localStorage.getItem('farmerSubmissions')) || [];
        let index = submissions.findIndex(r => r.id === id);
        if(index !== -1) {
            submissions[index].status = 'Verified'; // Change status
            localStorage.setItem('farmerSubmissions', JSON.stringify(submissions));
            loadPendingData(); // Refresh table
            alert("✅ Record Approved! Data will now reflect in Area Statistics.");
        }
    };

    window.rejectRecord = function(id) {
        if(confirm("Reject this data? It will be deleted permanently.")) {
            let submissions = JSON.parse(localStorage.getItem('farmerSubmissions')) || [];
            submissions = submissions.filter(r => r.id !== id);
            localStorage.setItem('farmerSubmissions', JSON.stringify(submissions));
            loadPendingData(); // Refresh table
        }
    };

    // Initialize verification table
    loadPendingData();
});