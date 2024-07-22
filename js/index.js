document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.header_dropdown');
    const dropdownBG = document.querySelector('.dropdown');
    const headerMenuButton = document.querySelector('.header_menu-button');
    const headerMenuMobile = document.querySelector('.header_menu-mobile');
    const trigger = document.querySelector(".button-menu_trigger");
    const buttons = document.querySelector(".buttons");
    const icon1 = document.querySelector(".icon-1");
    const icon2 = document.querySelector(".icon-2");

    trigger.addEventListener("click", function () {
        buttons.classList.toggle("active");
        if (icon1.style.display === "none") {
            icon1.style.display = "block";
            icon2.style.display = "none";
        } else {
            icon1.style.display = "none";
            icon2.style.display = "block";
        }
    });
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
document.querySelectorAll('.header_mobile-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const dropdownContent = this.nextElementSibling.querySelector('.header_mobile-dropdown-list');
        const dropdownInner = dropdownContent.querySelector('.header_mobile-dropdown-list-inner');
        
        if (dropdownContent.style.height && dropdownContent.style.height !== '0px') {
            dropdownContent.style.height = dropdownContent.scrollHeight + "px";
            window.getComputedStyle(dropdownContent).height;
            dropdownContent.style.height = "0px";
            this.querySelector('.header_mobile-dropdown-arr svg').style.transform = 'rotate(0deg)';
        } else {
            // Close any open dropdowns
            const openDropdowns = document.querySelectorAll('.header_mobile-dropdown-toggle.active');
            openDropdowns.forEach(openDropdown => {
                const openDropdownContent = openDropdown.nextElementSibling.querySelector('.header_mobile-dropdown-list');
                const openDropdownInner = openDropdownContent.querySelector('.header_mobile-dropdown-list-inner');
                openDropdownContent.style.height = openDropdownInner.scrollHeight + "px";
                window.getComputedStyle(openDropdownContent).height;
                openDropdownContent.style.height = "0px";
                openDropdown.querySelector('.header_mobile-dropdown-arr svg').style.transform = 'rotate(0deg)';
                openDropdown.classList.remove('active');
            });

            dropdownContent.style.height = dropdownInner.scrollHeight + "px";
            this.querySelector('.header_mobile-dropdown-arr svg').style.transform = 'rotate(180deg)';
            dropdownContent.addEventListener('transitionend', function() {
                dropdownContent.style.height = 'auto';
            }, { once: true });
            this.classList.add('active');
        }
    });
});



  


