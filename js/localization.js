// Function to get the user's preferred language
export function getUserLanguage() {
    return localStorage.getItem('preferredLanguage') || 'ქარ'; // Default to 'ქარ' if not set
}
  
// Function to map preferred language to file path
export function mapLanguageFilePath(preferredLanguage) {
    switch (preferredLanguage) {
        case 'Eng':
            return '/assets/locales/en.json';
        case 'ქარ':
            return '/assets/locales/ka.json';
        default:
            return '/assets/locales/ka.json'; // Default fallback
    }
}
  
// Function to load the localization file based on the selected language
export function loadLocalization(languageFilePath) {
    return fetch(languageFilePath)
        .then(response => response.json())
        .catch(error => {
            console.error('Error loading localization file:', error);
        });
}
  
// Function to apply the localization data to the HTML elements
function applyLocalization(data) {
    document.querySelectorAll('[data-localize]').forEach(element => {
        const key = element.getAttribute('data-localize');
        if (data[key]) {
            element.textContent = data[key];
        }
    });
}
  
// Function to handle language changes
function changeLanguage(preferredLanguage) {
    const languageFilePath = mapLanguageFilePath(preferredLanguage);
    loadLocalization(languageFilePath).then(data => {
        applyLocalization(data);
        localStorage.setItem('preferredLanguage', preferredLanguage); // Store the user's preference
    });
}
  
// Update both selected-language elements
function updateSelectedLanguages(newLanguage) {
    document.querySelectorAll('.selected-language').forEach(element => {
        element.textContent = newLanguage;
    });
}

// Event listener for dropdown toggle
document.querySelectorAll('.lang_toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const langListWrapper = this.nextElementSibling; // Assumes lang_list-wrapper is the next sibling
        langListWrapper.classList.toggle('show');
    });
});
  
// Event listener for language item clicks
document.querySelectorAll('.lang_list-item').forEach(item => {
    item.addEventListener('click', function() {
        const newLanguage = this.textContent.trim();
        updateSelectedLanguages(newLanguage);
        const  numbers = document.querySelectorAll('.numbers');
        // Change language and hide dropdown
        changeLanguage(newLanguage);
        this.parentElement.classList.remove('show'); // Hide the dropdown
        console.log(`Language changed to: ${newLanguage}`);
        console.log(`numbers: ${numbers}`);
        window.location.reload();
    });
});
  
document.addEventListener('DOMContentLoaded', () => {
    const userLanguage = getUserLanguage();

    // Set the selected language text
    const selectedLanguageElements = document.querySelectorAll('.selected-language');
    const langListItemElements = document.querySelectorAll('.lang_list-item');

    selectedLanguageElements.forEach(element => {
        element.textContent = userLanguage;
    });

    langListItemElements.forEach(item => {
        item.textContent = userLanguage === 'Eng' ? 'ქარ' : 'Eng';
    });

    // Apply localization
    changeLanguage(userLanguage);
});
