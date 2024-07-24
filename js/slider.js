function initializeslider() {
    const sliderContainer = document.querySelector('.slider-container');
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const prevButton = document.querySelector('.slider-button-prev');
    const nextButton = document.querySelector('.slider-button-next');
    const scrollbar = document.querySelector('.slider-scrollbar');
    const scrollbarDrag = document.querySelector('.slider-scrollbar-drag');

    let isDragging = false;
    let startX, startTransform;
    const slideWidth = sliderContainer.offsetWidth / 3;

    function handleDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX || e.touches[0].pageX;
        const walk = x - startX;
        const newTransform = startTransform + walk;
        sliderWrapper.style.transform = `translate3d(${newTransform}px, 0, 0)`;
        updateScrollbar();
    }

    function snapToNearestSlide() {
        const currentTransform = getTransform();
        const index = Math.round(-currentTransform / slideWidth);
        const maxIndex = sliderWrapper.children.length - 3; // Adjust if showing a different number of slides
        const clampedIndex = Math.max(0, Math.min(index, maxIndex));
        const targetTransform = -clampedIndex * slideWidth;

        sliderWrapper.style.transition = 'transform 0.6s ease-in-out';
        sliderWrapper.style.transform = `translate3d(${targetTransform}px, 0, 0)`;

        setTimeout(() => {
            sliderWrapper.style.transition = 'none'; // Reset transition
        }, 600); // Match this duration with the CSS transition

        updateScrollbar();
    }

    function getTransform() {
        const matrix = window.getComputedStyle(sliderWrapper).transform;
        if (matrix === 'none') return 0;
        return parseFloat(matrix.split(',')[4]); // Extract translateX value
    }

    // Event listeners for mouse drag
    sliderWrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        startTransform = getTransform();
        sliderWrapper.addEventListener('mousemove', handleDrag);
        prevButton.style.visibility = 'visible';
        nextButton.style.visibility = 'visible';
        prevButton.style.opacity = '1';
        nextButton.style.opacity = '1';
    });

    sliderWrapper.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            sliderWrapper.removeEventListener('mousemove', handleDrag);
            snapToNearestSlide();
        }
    });

    sliderWrapper.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            sliderWrapper.removeEventListener('mousemove', handleDrag);
            snapToNearestSlide();
        }
    });

    // Event listeners for touch drag
    sliderWrapper.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX;
        startTransform = getTransform();
        sliderWrapper.addEventListener('touchmove', handleDrag);
    });

    sliderWrapper.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            sliderWrapper.removeEventListener('touchmove', handleDrag);
            snapToNearestSlide();
        }
    });
    // Navigation buttons functionality
    prevButton.addEventListener('click', () => {
        const currentTransform = getTransform();
        const newTransform = currentTransform + slideWidth;
        sliderWrapper.style.transition = 'transform 0.6s ease-in-out';
        sliderWrapper.style.transform = `translate3d(${newTransform}px, 0, 0)`;
        nextButton.style.color = '#182cc0';
        prevButton.style.color = '#BABEBF';
        setTimeout(() => {
            snapToNearestSlide();
        }, 600)
    });
    
    nextButton.addEventListener('click', () => {
        const currentTransform = getTransform();
        const newTransform = currentTransform - slideWidth;
        sliderWrapper.style.transition = 'transform 0.6s ease-in-out';
        sliderWrapper.style.transform = `translate3d(${newTransform}px, 0, 0)`;
        prevButton.style.color = '#182cc0';
        nextButton.style.color = '#BABEBF';
        setTimeout(() => {
            snapToNearestSlide();
        }, 600)
    });

    // Scrollbar drag functionality
    scrollbar.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const maxScrollLeft = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
        const dragWidth = scrollbar.offsetWidth;
        const clickPosition = e.pageX - scrollbar.getBoundingClientRect().left;
        const dragPosition = (clickPosition / dragWidth) * maxScrollLeft;
        sliderWrapper.style.transform = `translate3d(-${dragPosition}px, 0, 0)`;

    });

    function updateScrollbar() {
        const currentTransform = -getTransform();
        const totalSlides = sliderWrapper.children.length;
        const visibleSlides = 3; // Number of slides visible at a time
        const slideWidth = sliderContainer.offsetWidth / visibleSlides;
        const maxScrollLeft = (totalSlides - visibleSlides) * slideWidth;

        const snapPoints = 4; // Number of snap points
        const snapInterval = maxScrollLeft / (snapPoints - 1);

        const ratio = Math.round(currentTransform / snapInterval) / (snapPoints - 1);
        const scrollbarWidth = scrollbar.clientWidth;
        const scrollbarDragWidth = Math.max((visibleSlides / totalSlides) * scrollbarWidth, 20); // Minimum width for the drag

        // Calculate the drag position and clamp it within bounds
        const dragPosition = Math.min(Math.max(ratio * (scrollbarWidth - scrollbarDragWidth), 0), scrollbarWidth - scrollbarDragWidth);

        // Update the scrollbar drag position and width
        scrollbarDrag.style.width = `${scrollbarDragWidth}px`;
        scrollbarDrag.style.transform = `translateX(${dragPosition}px)`;
    }

    sliderWrapper.addEventListener('scroll', updateScrollbar);
    updateScrollbar();
}

// Fetch data and populate slider slides
fetch('./assets/data/data.json')
    .then(response => response.json())
    .then(res => {
        if (res && res.offers) {
            const offers = res.offers;
            const sliderWrapper = document.querySelector('.slider-wrapper');

            for (const key in offers) {
                if (offers.hasOwnProperty(key)) {
                    const offer = offers[key];
                    
                    // Create slider slide
                    const sliderSlide = document.createElement('div');
                    sliderSlide.classList.add('slider-slide');

                    // Create card content
                    const cardImageWrapper = document.createElement('div');
                    cardImageWrapper.classList.add('slider-card-image-wrapper');
                    const cardImage = document.createElement('img');
                    cardImage.classList.add('slider-card-image');
                    cardImage.src = offer.image;
                    cardImageWrapper.appendChild(cardImage);

                    const cardContent = document.createElement('div');
                    cardContent.classList.add('slider-card-content');

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

                    sliderSlide.appendChild(cardImageWrapper);
                    sliderSlide.appendChild(cardContent);
                    sliderWrapper.appendChild(sliderSlide);
                }
            }

            // Initialize the slider after populating the slides
            initializeslider();
        }
    }).catch(error => {
        console.error(error);
    });
