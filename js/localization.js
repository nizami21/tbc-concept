// Function to get the user's preferred language
export function getUserLanguage() {
    return localStorage.getItem('preferredLanguage') || 'ქარ'; // Default to 'ქარ' if not set
}

// Function to map preferred language to file path
function mapLanguageFilePath(preferredLanguage) {
    switch (preferredLanguage) {
        case 'Eng':
            return 'assets/locales/en.json';
        case 'ქარ':
            return 'assets/locales/ka.json';
        default:
            return 'assets/locales/ka.json'; // Default fallback
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

function handleResize() {
    const windowWidth = window.innerWidth;
    const userLanguage = getUserLanguage();

    // Get all elements with the specific classes
    const enLogos = document.querySelectorAll('.eng_logo');
    const kaLogos = document.querySelectorAll('.desktop-svg');
    const mobileLogos = document.querySelectorAll('.mobile-svg');

    // Loop through each set of elements and apply styles
    enLogos.forEach(enLogo => {
        kaLogos.forEach(kaLogo => {
            mobileLogos.forEach(mobileLogo => {
                if (windowWidth < 768) {
                    enLogo.style.display = 'none';
                    kaLogo.style.display = 'none';
                    mobileLogo.style.display = 'block';
                } else {
                    if (userLanguage === 'Eng') {
                        enLogo.style.display = 'block';
                        kaLogo.style.display = 'none';
                    } else {
                        enLogo.style.display = 'none';
                        kaLogo.style.display = 'block';
                    }
                    mobileLogo.style.display = 'none';
                }
            });
        });
    });
}


// Add event listener for window resize
window.addEventListener('resize', handleResize);

// Call the function once to set the initial state
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

    // Call handleResize to set initial state
    handleResize();
});

// Event listener for dropdown toggle
document.querySelectorAll('.lang_toggle').forEach(toggle => {
    toggle.addEventListener('click', function () {
        const langListWrapper = this.nextElementSibling; // Assumes lang_list-wrapper is the next sibling
        if (langListWrapper) {
            langListWrapper.classList.toggle('show');
        }
    });
});

// Event listener for language item clicks
document.querySelectorAll('.lang_list-item').forEach(item => {
    item.addEventListener('click', function () {
        const newLanguage = this.textContent.trim();
        updateSelectedLanguages(newLanguage);
        changeLanguage(newLanguage);
        const langListWrapper = this.parentElement;
        if (langListWrapper) {
            langListWrapper.classList.remove('show'); // Hide the dropdown
        }
        console.log(`Language changed to: ${newLanguage}`);
        window.location.reload();
    });
});
