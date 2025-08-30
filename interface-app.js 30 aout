document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SÉLECTION DE TOUS LES ÉLÉMENTS DE LA PAGE ---
    let gestionCodesInstance = null;
    let profileInstance = null;
    let configurationInstance = null;
    let gestionHorairesInstance = null;
    let gestionCapaciteInstance = null;

    // Navigation et Structure
    const menuItems = document.querySelectorAll('.menu-item');
    const submenuItems = document.querySelectorAll('.submenu-item');
    const backButtons = document.querySelectorAll('.back-button');
    const contentSections = document.querySelectorAll('.content-section');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleIcon = document.getElementById('toggleIcon');
    const toggleBtn = document.querySelector('.toggle-btn');

    // Modales
    const welcomeModal = document.getElementById('welcomeModal');
    const welcomeModalButton = document.querySelector('#welcomeModal button');
    const dontShowAgainCheckbox = document.getElementById('dontShowAgain');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationModalButton = document.querySelector('#confirmationModal button');

    // Formulaire de Profil
    const profileForm = document.getElementById('profileForm');
    const coverUpload = document.getElementById('coverUpload');
    const coverImage = document.getElementById('coverImage');
    const coverPlaceholder = document.getElementById('coverPlaceholder');
    const removeCoverBtn = document.getElementById('removeCoverBtn');
    const coverSection = document.getElementById('coverSection');
    const discoNameInput = document.getElementById('discoName');
    const cityInput = document.getElementById('city');
    const postalCodeInput = document.getElementById('postalCode');
    const addressInput = document.getElementById('address');
    const countryInput = document.getElementById('country');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const countryCodeInput = document.getElementById('countryCode');

    // Autres formulaires
    const saveTaxSettingsBtn = document.getElementById('saveTaxSettingsBtn');
    const saveKiosqueSettings = document.getElementById('saveKiosqueSettings');

    // Kiosque
    const alert1Enabled = document.getElementById('alert1-enabled');
    const alert1Visual = document.getElementById('alert1-visual');
    const alert1Percentage = document.getElementById('alert1-percentage');
    const alert1Color = document.getElementById('alert1-color');
    const alert2Enabled = document.getElementById('alert2-enabled');
    const alert2Visual = document.getElementById('alert2-visual');
    const alert2Percentage = document.getElementById('alert2-percentage');
    const alert2Color = document.getElementById('alert2-color');
    const alert3Enabled = document.getElementById('alert3-enabled');
    const alert3Visual = document.getElementById('alert3-visual');
    const alert3Percentage = document.getElementById('alert3-percentage');
    const alert3Color = document.getElementById('alert3-color');

    // --- 2. DÉFINITION DES FONCTIONS ---

    async function showSection(targetId) {  // <-- CHANGEMENT ICI: Ajout de 'async' pour permettre 'await'
    if (!targetId) return;

    contentSections.forEach(section => section.classList.remove('active'));
    const sectionToShow = document.getElementById(targetId);
    if (sectionToShow) {
        sectionToShow.classList.add('active');
    }

    // --- Logique d'initialisation pour chaque section ---

    // NOUVEAU BLOC POUR LA GESTION DE CAPACITÉ
    if (targetId === 'gestion-capacite') {
    if (!gestionCapaciteInstance) {
        gestionCapaciteInstance = new GestionCapacite('gestion-capacite');
        gestionCapaciteInstance.init();
    } else {
        gestionCapaciteInstance.loadData();
    }
}
    
    // GESTION DES CODES JOUR
    if (targetId === 'gestion-code-jour') {
        if (!gestionCodesInstance) {
            gestionCodesInstance = new GestionCodesJour();
            gestionCodesInstance.init();
        } else {
            gestionCodesInstance.loadMonthData(gestionCodesInstance.currentYear, gestionCodesInstance.currentMonth);
        }
    }
    
    // GESTION DU PROFIL
    if (targetId === 'profile') {
        if (!profileInstance) {
            profileInstance = new ProfileManager();
            profileInstance.init();
        } else {
            profileInstance.loadProfileData();
        }
    }
    
    // GESTION DES HORAIRES
    if (targetId === 'gestion-heures-creuses') {
        if (!gestionHorairesInstance) {
            gestionHorairesInstance = new GestionHoraires();
            const section = document.getElementById('gestion-heures-creuses');
            if (section) {
                const backButtonHTML = '<a href="#" class="back-button" data-target="gestion">← Retour</a>';
                section.innerHTML = backButtonHTML + gestionHorairesInstance.render();
                
                // On doit ré-attacher l'événement au nouveau bouton retour
                section.querySelector('.back-button').addEventListener('click', (e) => {
                    e.preventDefault();
                    showSection('gestion');
                });

                const container = section.querySelector('.horaires-container');
                gestionHorairesInstance.setContainer(container);
            }
        } else {
            gestionHorairesInstance.loadHoraires().then(() => {
                gestionHorairesInstance.initializeForm();
            });
        }
    }

// GESTION DU KIOSQUE
if (targetId === 'kiosque') {
    document.getElementById('genre-selection').style.display = 'block';
    document.getElementById('tickets-entree').style.display = 'none';
}    

    // GESTION DE LA CONFIGURATION
    if (targetId.startsWith('configuration')) {
        if (!configurationInstance) {
            configurationInstance = new ConfigurationManager();
            configurationInstance.init();
        } else {
            configurationInstance.resetAndReload();
        }
    }
}

    function toggleSidebar() {
        if (sidebar && mainContent && toggleIcon) {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('collapsed');
            toggleIcon.classList.toggle('chevron-left');
            toggleIcon.classList.toggle('chevron-right');
        }
    }

    function closeModal() {
        if (dontShowAgainCheckbox && dontShowAgainCheckbox.checked) {
            localStorage.setItem('dontShowWelcomeModal', 'true');
        }
        if (welcomeModal) {
            welcomeModal.style.display = 'none';
        }
    }

    function showConfirmationModal() {
        if (confirmationModal) {
            confirmationModal.style.display = 'flex';
        }
    }

    function closeConfirmationModal() {
        if (confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    }

    function validateForm() {
let isValid = true;
// Reset previous invalid classes
profileForm.querySelectorAll('.form-group').forEach(group => group.classList.remove('invalid'));
if (coverSection) coverSection.classList.remove('invalid');
if (coverError) coverError.style.display = 'none'; // Assume #coverError exists for message
// Validate cover image
if (coverImage.src === '' || coverImage.style.display === 'none') {
isValid = false;
if (coverSection) coverSection.classList.add('invalid');
if (coverError) {
coverError.textContent = 'Veuillez ajouter une couverture.';
coverError.style.display = 'block';
}
}
// Validate discoName
if (!discoNameInput.value.trim()) {
isValid = false;
discoNameInput.closest('.form-group').classList.add('invalid');
}
// Validate city
if (!cityInput.value.trim()) {
isValid = false;
cityInput.closest('.form-group').classList.add('invalid');
}
// Validate postalCode (simple check: not empty, 5 digits for FR)
if (!postalCodeInput.value.trim() || !/^\d{5}$/.test(postalCodeInput.value)) {
isValid = false;
postalCodeInput.closest('.form-group').classList.add('invalid');
}
// Validate address
if (!addressInput.value.trim()) {
isValid = false;
addressInput.closest('.form-group').classList.add('invalid');
}
// Validate phone (not empty, digits only, 9-10 length for FR after +33)
if (!phoneInput.value.trim() || !/^\d{9,10}$/.test(phoneInput.value)) {
isValid = false;
phoneInput.closest('.form-group').classList.add('invalid');
}
// Validate email (not empty, basic email regex)
if (!emailInput.value.trim() || !/^[\w-]+(.[\w-]+)*@([\w-]+.)+[a-zA-Z]{2,7}$/.test(emailInput.value)) {
isValid = false;
emailInput.closest('.form-group').classList.add('invalid');
}
// If countryInput exists (though not in HTML, for completeness)
if (countryInput && !countryInput.value.trim()) {
isValid = false;
countryInput.closest('.form-group').classList.add('invalid');
}
return isValid;
}

    function resetForm() {
        if (profileForm) profileForm.reset();
        if (coverImage) {
            coverImage.src = '';
            coverImage.style.display = 'none';
        }
        if (coverPlaceholder) coverPlaceholder.style.display = 'flex';
        if (removeCoverBtn) removeCoverBtn.style.display = 'none';
        if (coverUpload) coverUpload.value = '';
        if (coverSection) coverSection.classList.remove('invalid');
        profileForm.querySelectorAll('.form-group').forEach(group => group.classList.remove('invalid'));
    }


    // --- 3. ATTACHEMENT DES ÉCOUTEURS D'ÉVÉNEMENTS ---

    // Navigation
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            showSection(target);
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    submenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(item.getAttribute('data-target'));
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(button.getAttribute('data-target'));
        });
    });

    // Boutons et actions spécifiques
    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if (welcomeModalButton) welcomeModalButton.addEventListener('click', closeModal);
    if (confirmationModalButton) confirmationModalButton.addEventListener('click', closeConfirmationModal);
    
    // Formulaire de Profil
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm()) {
                // Ici, tu appelleras la méthode de sauvegarde de profileInstance
                // profileInstance.handleSave(); 
                showConfirmationModal();
            }
        });
    }

    if (coverUpload) {
        coverUpload.addEventListener('change', (e) => {
            // Logique de l'upload d'image
        });
    }

    if (removeCoverBtn) {
        removeCoverBtn.addEventListener('click', () => {
             // Logique de suppression d'image
        });
    }
    
    // Alertes du Kiosque
    [alert1Enabled, alert2Enabled, alert3Enabled].forEach((alertEnabled, index) => {
        if (alertEnabled) {
            const alertVisual = document.getElementById(`alert${index + 1}-visual`);
            const alertColor = document.getElementById(`alert${index + 1}-color`);
            const alertPercentage = document.getElementById(`alert${index + 1}-percentage`);
            const alertNotification = alertEnabled.closest('.toggle-group').querySelector('.notification');

            const updateNotification = () => {
                if (alertNotification && alertEnabled.checked) {
                    alertNotification.textContent = `Alerte activée à ${alertPercentage.value}% avec la couleur ${alertColor.value}.`;
                    alertNotification.classList.add('show');
                    setTimeout(() => alertNotification.classList.remove('show'), 2000);
                }
            };

            alertEnabled.addEventListener('change', () => {
                if (alertVisual) alertVisual.classList.toggle('active', alertEnabled.checked);
                updateNotification();
            });

            if (alertColor && alertVisual) {
                alertColor.addEventListener('input', () => {
                    alertVisual.style.borderColor = alertColor.value;
                    alertVisual.style.setProperty('--alert-color', alertColor.value);
                    updateNotification();
                });
            }

            if(alertPercentage) {
                alertPercentage.addEventListener('input', updateNotification);
            }
        }
    });

    // --- 4. LOGIQUE DE DÉMARRAGE ---

    showSection('gestion');

    if (welcomeModal && !localStorage.getItem('dontShowWelcomeModal')) {
        welcomeModal.style.display = 'flex';
    }

});
