function initializeSwiper() {
    const swiperContainer = document.querySelector('.swiper-container');
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    const prevButton = document.querySelector('.swiper-button-prev');
    const nextButton = document.querySelector('.swiper-button-next');
    const scrollbar = document.querySelector('.swiper-scrollbar');
    const scrollbarDrag = document.querySelector('.swiper-scrollbar-drag');

    let isDragging = false;
    let startX, scrollLeft;
    let snapInterval = 100; // Adjust the snapping interval as needed

    function handleDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX || e.touches[0].pageX;
        const walk = (x - startX) * 2; // Adjust the scroll speed here
        swiperWrapper.scrollLeft = scrollLeft - walk;
        updateScrollbar();
    }

    function snapToNearestSlide() {
        const slideWidth = swiperContainer.offsetWidth / 3;
        const index = Math.round(swiperWrapper.scrollLeft / slideWidth);
        const targetScrollLeft = index * slideWidth;
        
        swiperWrapper.style.scrollBehavior = 'smooth';
        swiperWrapper.scrollLeft = targetScrollLeft;

        setTimeout(() => {
            swiperWrapper.style.scrollBehavior = 'auto';
        }, 500); // Match this duration with the CSS transition
        updateScrollbar();
    }

    // Event listeners for mouse drag
    swiperWrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - swiperWrapper.offsetLeft;
        scrollLeft = swiperWrapper.scrollLeft;
        swiperWrapper.addEventListener('mousemove', handleDrag);
    });

    swiperWrapper.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            swiperWrapper.removeEventListener('mousemove', handleDrag);
            snapToNearestSlide();
        }
    });

    swiperWrapper.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            swiperWrapper.removeEventListener('mousemove', handleDrag);
            snapToNearestSlide();
        }
    });

    // Event listeners for touch drag
    swiperWrapper.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - swiperWrapper.offsetLeft;
        scrollLeft = swiperWrapper.scrollLeft;
        swiperWrapper.addEventListener('touchmove', handleDrag);
    });

    swiperWrapper.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            swiperWrapper.removeEventListener('touchmove', handleDrag);
            snapToNearestSlide();
        }
    });

    // Navigation buttons functionality
    prevButton.addEventListener('click', () => {
        swiperWrapper.scrollLeft -= swiperContainer.offsetWidth;
        snapToNearestSlide();
    });

    nextButton.addEventListener('click', () => {
        swiperWrapper.scrollLeft += swiperContainer.offsetWidth;
        snapToNearestSlide();
    });

    // Scrollbar drag functionality
    scrollbar.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const maxScrollLeft = swiperWrapper.scrollWidth - swiperWrapper.clientWidth;
        const dragWidth = scrollbar.offsetWidth;
        const clickPosition = e.pageX - scrollbar.getBoundingClientRect().left;
        const dragPosition = (clickPosition / dragWidth) * maxScrollLeft;
        swiperWrapper.scrollLeft = dragPosition;
        updateScrollbar();
    });

    // Update scrollbar position and width
    function updateScrollbar() {
        const ratio = swiperWrapper.scrollLeft / (swiperWrapper.scrollWidth - swiperWrapper.clientWidth);
        scrollbarDrag.style.width = ((swiperWrapper.clientWidth / swiperWrapper.scrollWidth) / 2 )* 100 + '%';
        scrollbarDrag.style.transform = `translateX(${ratio * (scrollbar.clientWidth - scrollbarDrag.clientWidth)}px)`;
    }

    swiperWrapper.addEventListener('scroll', updateScrollbar);
    updateScrollbar();
}

// Fetch data and populate swiper slides
fetch('./assets/data/data.json')
    .then(response => response.json())
    .then(res => {
        if (res && res.offers) {
            const offers = res.offers;
            const swiperWrapper = document.querySelector('.swiper-wrapper');

            for (const key in offers) {
                if (offers.hasOwnProperty(key)) {
                    const offer = offers[key];
                    
                    // Create swiper slide
                    const swiperSlide = document.createElement('div');
                    swiperSlide.classList.add('swiper-slide');

                    // Create card content
                    const cardImageWrapper = document.createElement('div');
                    cardImageWrapper.classList.add('swiper-card-image-wrapper');
                    const cardImage = document.createElement('img');
                    cardImage.classList.add('swiper-card-image');
                    cardImage.src = offer.image;
                    cardImageWrapper.appendChild(cardImage);

                    const cardContent = document.createElement('div');
                    cardContent.classList.add('swiper-card-content');

                    const tags = document.createElement('div');
                    tags.classList.add('tags');
                    tags.textContent = offer.tags;

                    const cardTitle = document.createElement('div');
                    cardTitle.classList.add('card-title');
                    const title = document.createElement('h3');
                    title.textContent = offer.title;
                    cardTitle.appendChild(title);

                    cardContent.appendChild(tags);
                    cardContent.appendChild(cardTitle);

                    swiperSlide.appendChild(cardImageWrapper);
                    swiperSlide.appendChild(cardContent);
                    swiperWrapper.appendChild(swiperSlide);
                }
            }

            // Initialize the swiper after populating the slides
            initializeSwiper();
        }
    }).catch(error => {
        console.error(error);
    });
