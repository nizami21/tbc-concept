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
