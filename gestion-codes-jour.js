// public/js/gestion-codes-jour.js

// On s'assure que tout ancien manager est nettoyé avant de faire quoi que ce soit.
if (window.activeManager && typeof window.activeManager.cleanup === 'function') {
    window.activeManager.cleanup();
}

// On assigne notre objet manager directement à la propriété 'window.codeJourManager'.
// Cela évite l'erreur de re-déclaration de 'const'.
window.codeJourManager = {
    // Propriétés
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    days: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
    codes: {},
    yearDropdown: null,
    boundCloseDropdownHandler: null, 

    init() {
        console.log("%c[CODE JOUR] Initialisation...", "color: green; font-weight: bold;");
        this.renderYearMonthNav();
        this.createYearDropdown();
        this.loadCodes(this.currentYear);
    },
    
    cleanup() {
        console.log("%c[CODE JOUR] Nettoyage...", "color: red; font-weight: bold;");
        const dropdown = document.getElementById('yearDropdown');
        if (dropdown) dropdown.remove();
        if (this.boundCloseDropdownHandler) {
            document.removeEventListener('click', this.boundCloseDropdownHandler);
        }
        window.activeManager = null;
    },

    createYearDropdown() {
        // Cette fonction crée le dropdown et l'attache au body
        // Elle s'assure aussi de supprimer toute ancienne version
        const existingDropdown = document.getElementById('yearDropdown');
        if (existingDropdown) existingDropdown.remove();

        this.yearDropdown = document.createElement('div');
        this.yearDropdown.className = 'year-dropdown';
        this.yearDropdown.id = 'yearDropdown';
        const years = [new Date().getFullYear(), new Date().getFullYear() + 1];
        years.forEach(year => {
            const option = document.createElement('div');
            option.className = 'year-option';
            option.textContent = year;
            option.onclick = () => this.changeYear(year);
            this.yearDropdown.appendChild(option);
        });
        document.body.appendChild(this.yearDropdown);

        this.boundCloseDropdownHandler = (e) => {
            if (this.yearDropdown && !this.yearDropdown.contains(e.target) && !e.target.closest('.year-select-btn')) {
                this.yearDropdown.style.display = 'none';
            }
        };
        document.addEventListener('click', this.boundCloseDropdownHandler);
    },

    // --- Collez ici toutes vos autres fonctions (loadCodes, saveCodesToDB, etc.) ---
    // Le contenu de ces fonctions ne change pas.
    async loadCodes(year) {
        console.log(`Chargement des codes pour l'année ${year}...`);
        try {
            const token = localStorage.getItem('token');
            if (!token) { throw new Error("Token non trouvé."); }
            const response = await fetch(`/api/codes-jour?year=${year}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error(`Erreur du serveur: ${response.statusText}`);
            const result = await response.json();
            this.codes = result.data || {};
            this.renderCalendar(this.currentYear, this.currentMonth);
        } catch (error) {
            console.error('Impossible de charger les codes :', error);
            alert('Une erreur est survenue lors du chargement des codes.');
        }
    },
    async saveCodesToDB() {
        const codesToSave = Object.entries(this.codes).map(([date, code]) => ({ date, code }));
        if (codesToSave.length === 0) { alert('Aucun code à enregistrer.'); return; }
        try {
            const token = localStorage.getItem('token');
            if (!token) { throw new Error("Token non trouvé."); }
            const response = await fetch('/api/codes-jour', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ codes: codesToSave })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Erreur lors de la sauvegarde');
            alert(result.message);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde :', error);
            alert(`Erreur: ${error.message}`);
        }
    },
    renderYearMonthNav() {
        const navContainer = document.getElementById('yearMonthNav');
        if (!navContainer) return;
        let monthButtonsHTML = this.months.map((month, index) =>
            `<button class="month-btn ${index === this.currentMonth ? 'active' : ''}" onclick="window.codeJourManager.changeMonth(${index})">${month}</button>`
        ).join('');
        navContainer.innerHTML = `<div class="year-select-btn" id="yearSelectBtn">${this.currentYear}</div><div class="month-nav">${monthButtonsHTML}</div>`;
        const yearBtn = navContainer.querySelector('#yearSelectBtn');
        if (yearBtn) {
            yearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleYearDropdown();
            });
        }
    },
    changeMonth(index) {
        this.currentMonth = index;
        this.renderYearMonthNav();
        this.renderCalendar(this.currentYear, this.currentMonth);
    },
    changeYear(year) {
        this.currentYear = year;
        this.renderYearMonthNav();
        if (this.yearDropdown) this.yearDropdown.style.display = 'none';
        this.loadCodes(this.currentYear);
    },
    toggleYearDropdown() {
        const yearBtn = document.getElementById('yearSelectBtn');
        if (!yearBtn || !this.yearDropdown) return;
        if (this.yearDropdown.style.display === 'block') {
            this.yearDropdown.style.display = 'none';
        } else {
            const rect = yearBtn.getBoundingClientRect();
            this.yearDropdown.style.left = `${rect.left}px`;
            this.yearDropdown.style.top = `${rect.bottom + window.scrollY}px`;
            this.yearDropdown.style.width = `${rect.width}px`;
            this.yearDropdown.style.display = 'block';
        }
    },
    renderCalendar(year, month) {
        const calendar = document.getElementById('calendar');
        if (!calendar) return;
        let headerHTML = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => `<div class="day-cell header">${day}</div>`).join('');
        calendar.innerHTML = `<div class="week-row">${headerHTML}</div>`;
        const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let dayGrid = Array(firstDayOfMonth).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
        while (dayGrid.length % 7 !== 0) dayGrid.push(null);
        for (let i = 0; i < dayGrid.length; i += 7) {
            const row = document.createElement('div');
            row.className = 'week-row';
            for (let j = 0; j < 7; j++) {
                const day = dayGrid[i + j];
                const cell = document.createElement('div');
                cell.className = 'day-cell';
                if (day !== null) {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const codeValue = this.codes[dateStr] || '';
                    if (new Date().getFullYear() === year && new Date().getMonth() === month && new Date().getDate() === day) cell.classList.add('today');
                    cell.innerHTML = `<span class="day-number">${day}</span><input type="text" value="${codeValue}" placeholder="-" onchange="window.codeJourManager.updateCode('${dateStr}', this.value)">`;
                } else { cell.classList.add('empty'); }
                row.appendChild(cell);
            }
            calendar.appendChild(row);
        }
    },
    updateCode(date, value) { this.codes[date] = value.toUpperCase(); },
    generateCodes(type) {
        const genMonth = (y, m) => {
            const daysInM = new Date(y, m + 1, 0).getDate();
            for (let i = 1; i <= daysInM; i++) {
                const date = `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                const dayOfWeek = (new Date(y, m, i).getDay() + 6) % 7;
                this.codes[date] = `${this.days[dayOfWeek]} ${Math.floor(Math.random() * 900) + 100}`;
            }
        };
        if (type === 'month') genMonth(this.currentYear, this.currentMonth);
        else if (type === 'year') for (let m = 0; m < 12; m++) genMonth(this.currentYear, m);
        this.renderCalendar(this.currentYear, this.currentMonth);
    },
    exportToPDF() {
        const element = document.getElementById('code-jour-container');
        if (element) html2pdf(element);
    }
};

// On lance le script et on le déclare comme le manager actif
window.codeJourManager.init();
window.activeManager = window.codeJourManager;
