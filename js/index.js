document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.header_dropdown');
    const dropdownBG = document.querySelector('.dropdown');
    const headerMenuButton = document.querySelector('.header_menu-button');
    const headerMenuMobile = document.querySelector('.header_menu-mobile');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.header_dropdown-toggle');

        toggle.addEventListener('click', function(event) {
            dropdown.classList.toggle('active');
            updateDropdownBG();
        });

        document.addEventListener('click', function(event) {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('active');
                updateDropdownBG();
            }
        });
    });
    headerMenuButton.addEventListener('click', function() {
        headerMenuButton.classList.toggle('active');
        headerMenuMobile.classList.toggle('active');
    });
    function updateDropdownBG() {
        let anyActive = false;
        dropdowns.forEach(dropdown => {
            if (dropdown.classList.contains('active')) {
                anyActive = true;
            }
        }); 

        if (anyActive) {
            dropdownBG.classList.add('active');
        } else {
            dropdownBG.classList.remove('active');
        }
    }
});

document.querySelector('.lang_toggle').addEventListener('click', function() {
    document.querySelector('.lang_list-wrapper').classList.toggle('show');
});

document.querySelector('.lang_list-item').addEventListener('click', function() {
    const selectedLanguage = this.innerHTML; 
        
    const currentLanguage = selectedLanguage.trim() === 'Eng' ? 'Eng' : 'ქარ';
    const newLanguageText = currentLanguage === 'Eng' ? 'ქარ' : 'Eng';

    const listItem = document.querySelector('.lang_list-item');
    if (listItem) {
        listItem.innerHTML = newLanguageText;
    }

    document.getElementById('selected-language').innerHTML = currentLanguage;
    //Language change logic goes here. no logic planned yet
    console.log(`Language changed to: ${currentLanguage}`);
    document.querySelector('.lang_list-wrapper').classList.remove('show');
});

window.onclick = function(event) {
    if (!event.target.closest('.lang_dropdown')) {
        document.querySelector('.lang_list-wrapper').classList.remove('show');
    }
};

