import { getUserLanguage, loadLocalization } from './localization.js';

const THRESHOLD = 20;

class SwipeSlider {
  constructor(sliderClass) {
    this.sliderContainer = document.querySelector(`${sliderClass} .slider-container`);
    this.sliderWrapper = document.querySelector(`${sliderClass} .slider-wrapper`);
    this.prevButton = document.querySelector(`${sliderClass} .slider-button-prev`);
    this.nextButton = document.querySelector(`${sliderClass} .slider-button-next`);
    this.scrollbar = document.querySelector(`${sliderClass} .slider-scrollbar`);
    this.scrollbarDrag = document.querySelector(`${sliderClass} .slider-scrollbar-drag`);
    this.sliderButtons = this.sliderContainer.querySelector(`.slider-button`);

    if (!this.sliderContainer || !this.sliderWrapper) {
      console.error("Slider container or wrapper not found.");
      return;
    }

    this.startX = 0;
    this.oldX = 0;
    this.position = 0;
    this.snapPosition = 0;
    this.isDown = false;
    this.userHasSwiped = false;
    this.isDragging = false;
    this.startTransform = 0;
    this.slideWidth = this.calculateSlideWidth();

    this.attachEventListeners();
    this.updateUI();
  }

  calculateSlideWidth() {
    const visibleSlides = this.calculateVisibleSlides();
    return this.sliderContainer.offsetWidth / visibleSlides;
  }

  calculateVisibleSlides() {
    const containerWidth = this.sliderContainer.offsetWidth;
    const cardWidth = document.querySelector('.slider-slide').offsetWidth;
    const gap = parseInt(window.getComputedStyle(this.sliderWrapper).gap) || 0;
    return Math.max(1,containerWidth / (cardWidth + gap));
  }

  attachEventListeners() {
    this.sliderWrapper.addEventListener('mousedown', (e) => this.handleMouseStart(e));
    this.sliderWrapper.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.sliderWrapper.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.sliderWrapper.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.sliderWrapper.addEventListener('mouseup', () => this.handleEnd());
    this.sliderWrapper.addEventListener('mouseleave', () => this.handleEnd());
    this.sliderWrapper.addEventListener('touchend', () => this.handleEnd());
    this.prevButton.addEventListener('click', () => {
      this.snapToSlide(-1);
      this.prevButton.style.color = '#BABEBF';
      this.nextButton.style.color = '#182cc0';
    });
    this.nextButton.addEventListener('click', () => {
      this.snapToSlide(1);
      this.nextButton.style.color = '#BABEBF';
      this.prevButton.style.color = '#182cc0';
    });
    window.addEventListener('resize', () => {
        this.updateUI();
        this.rerender();
    });
  }

  handleTouchStart(e) {
    if (e.touches.length > 1) return;
    this.handleStart(e);
  }

  handleMouseStart(e) {
    e.preventDefault();
    this.handleStart(e);
  }
  rerender() {
    const currentTransform = this.getTransform();
    const maxTransform = -(this.sliderWrapper.scrollWidth - this.sliderContainer.offsetWidth);
    let newTransform = Math.max(currentTransform, maxTransform);
    newTransform = Math.min(newTransform, 0);

    this.sliderWrapper.style.transform = `translate3d(${newTransform}px, 0, 0)`;
    this.updateScrollbar(newTransform);
  }
  handleStart(e) {
    if (this.sliderWrapper.children.length <= this.calculateVisibleSlides()) return;
    this.isDown = true;
    this.userHasSwiped = false;
    this.position = this.snapPosition;
    this.startX = (e.pageX || e.touches[0].pageX) - this.sliderWrapper.offsetLeft;

    this.sliderWrapper.classList.add('active');
  }

  handleTouchMove(e) {
    if (e.touches.length > 1) return;
    this.handleMove(e);
  }

  handleMouseMove(e) {
    e.preventDefault();
    this.handleMove(e);
  }

  handleMove(e) {
    this.sliderButtons.style.display = 'flex';
    if (!this.isDown) return;

    const pageX = e.pageX || e.touches[0].pageX;
    const currX = pageX - this.sliderWrapper.offsetLeft;
    const dist = currX - this.startX;

    if (Math.abs(dist) < THRESHOLD) return;

    const swipeNext = this.oldX - currX < 0 ? 0 : 1; // Swipe direction
    const accelerate = this.mapToRange(Math.abs(dist), THRESHOLD, window.innerWidth, 1, 3);
    const position = this.calculateBoundaries(this.position + (dist * accelerate));

    e.preventDefault();

    this.userHasSwiped = true;
    this.snapPosition = this.calculateSnapPosition(position, swipeNext);
    this.oldX = currX;

    this.moveIndicator(this.snapPosition);
    this.sliderWrapper.style.transform = `translate3d(${position}px, 0, 0)`;
  }

  handleEnd() {
    this.isDown = false;
    this.sliderWrapper.classList.remove('active');
    this.sliderWrapper.style.transform = `translate3d(${this.snapPosition}px, 0, 0)`;
  }

  calculateBoundaries(position, bounce = true) {
    const bounceMargin = bounce ? this.slideWidth / 4 : 0;
    const maxAllowedW = -(this.sliderWrapper.scrollWidth - this.sliderContainer.offsetWidth);

    if (position > bounceMargin) return bounceMargin;
    if (position < maxAllowedW - bounceMargin) return maxAllowedW - bounceMargin;

    return position;
  }

  calculateSnapPosition(position, swipeNext) {
    const maxAllowedW = -(this.sliderWrapper.scrollWidth - this.sliderContainer.offsetWidth);
    let snapPosition = (~~(position / this.slideWidth) - swipeNext) * this.slideWidth;

    if (snapPosition < maxAllowedW) snapPosition = maxAllowedW;
    return snapPosition;
  }

  mapToRange(num, inMin, inMax, outMin, outMax) {
    return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  moveIndicator(currPos) {
    if (!this.scrollbar || !this.scrollbarDrag) return;

    const indicatorPos = this.scrollbar.offsetWidth - this.scrollbarDrag.offsetWidth;
    const position = this.mapToRange(currPos, 0, -(this.sliderWrapper.scrollWidth - this.sliderContainer.offsetWidth), 0, indicatorPos);

    this.scrollbarDrag.style.transform = `translate3d(${position}px, 0, 0)`;
  }

  updateUI() {
    this.slideWidth = this.calculateSlideWidth();
    this.snapToSlide(0);
  }

  snapToSlide(direction) {
    const slideWidth = this.slideWidth;
    console.log(slideWidth);
    const currentTransform = this.getTransform();
    let newTransform = currentTransform - (slideWidth * direction);
    const maxTransform = -(this.sliderWrapper.scrollWidth - this.sliderContainer.offsetWidth);
    newTransform = Math.max(newTransform, maxTransform);
    newTransform = Math.min(newTransform, 0);

    this.sliderWrapper.style.transition = 'transform 0.3s ease';
    this.sliderWrapper.style.transform = `translate3d(${newTransform}px, 0, 0)`;
    this.sliderWrapper.addEventListener('transitionend', () => {
      this.sliderWrapper.style.transition = '';
    });
    this.updateScrollbar(newTransform);
  }

  getTransform() {
    const transform = window.getComputedStyle(this.sliderWrapper).transform;
    return transform !== 'none' ? parseFloat(transform.split(',')[4]) : 0;
  }

  updateScrollbar(transform) {
    if(this.sliderWrapper.children.length <= this.calculateVisibleSlides()){
      this.scrollbar.style.display = 'none';
      return;
    }else{
      this.scrollbar.style.display = 'block';

    }
    if (this.scrollbar && this.scrollbarDrag) {
      const maxScroll = this.sliderWrapper.scrollWidth - this.sliderContainer.offsetWidth;
      const scrollbarWidth = this.scrollbar.offsetWidth;
      const scrollbarDragWidth = (this.sliderContainer.offsetWidth / this.sliderWrapper.scrollWidth) * scrollbarWidth;
      const scrollbarDragPos = (-transform / maxScroll) * (scrollbarWidth - scrollbarDragWidth);
      this.scrollbarDrag.style.width = `${scrollbarDragWidth}px`;
      this.scrollbarDrag.style.transform = `translate3d(${scrollbarDragPos}px, 0, 0)`;
    }
  }
}
// Function to populate slider with offers or products
function populateSlider(sliderClass, dataKey, cardStructure) {
    // Load the main data
    fetch('assets/data/data.json')
        .then(response => response.json())
        .then(data => {
            if (data && data[dataKey]) {
                const items = data[dataKey];
                const sliderWrapper = document.querySelector(`${sliderClass} .slider-wrapper`);

                // Load localization based on user preference
                const userLanguage = getUserLanguage();
                const localizationFilePath = mapLanguageFilePath(userLanguage);

                loadLocalization(localizationFilePath)
                    .then(localizationData => {
                        if (!localizationData) {
                            console.error('Failed to load localization data.');
                            return;
                        }

                        // Clear existing slides
                        sliderWrapper.innerHTML = '';

                        for (const key in items) {
                            if (items.hasOwnProperty(key)) {
                                const item = items[key];

                                // Create slider slide
                                const sliderSlide = document.createElement('div');
                                sliderSlide.classList.add('slider-slide');

                                // Create card content
                                const cardImageWrapper = document.createElement('div');
                                cardImageWrapper.classList.add('slider-card-image-wrapper');
                                const cardImage = document.createElement('img');
                                cardImage.classList.add('slider-card-image');
                                cardImage.src = item.image;
                                cardImageWrapper.appendChild(cardImage);

                                const cardContent = document.createElement('div');
                                cardContent.classList.add('slider-card-content');

                                // Add data to card content based on structure
                                let titleText = item.title;
                                let aboutText = item.about;
                                let tagsText = item.tags;
                                let companyText = item.company;


                                // Check if localization data is available for each item
                                if (localizationData) {
                                    titleText = localizationData[`${key}.title`] || titleText;
                                    aboutText = localizationData[`${key}.about`] || aboutText;
                                    tagsText = localizationData[`${key}.tags`] || tagsText;
                                    companyText = localizationData[`${key}.company`] || companyText;
                                }

                                if (cardStructure === 'about') {
                                    // Add title
                                    const cardTitle = document.createElement('div');
                                    cardTitle.classList.add('card-title');
                                    const title = document.createElement('h3');
                                    title.textContent = titleText;
                                    cardTitle.appendChild(title);

                                    cardContent.appendChild(cardTitle);

                                    const about = document.createElement('p');
                                    const cardTeaser = document.createElement('p');
                                    cardTeaser.classList.add('card-teaser');
                                    about.classList.add('card-about');
                                    about.innerHTML = aboutText; // Use innerHTML for formatted text
                                    cardTeaser.appendChild(about);
                                    cardContent.appendChild(cardTeaser);
                                } else if (cardStructure === 'tags') {
                                    // Assuming 'tags' for offers
                                    const tags = document.createElement('div');
                                    tags.classList.add('tags');
                                    tags.textContent = tagsText;
                                    cardContent.appendChild(tags);

                                    // Add title
                                    const cardTitle = document.createElement('div');
                                    cardTitle.classList.add('card-title');
                                    const title = document.createElement('h3');
                                    title.textContent = titleText;
                                    cardTitle.appendChild(title);

                                    cardContent.appendChild(cardTitle);
                                } else if (cardStructure === 'company') {
                                    // Add title
                                    const cardTitle = document.createElement('div');
                                    cardTitle.classList.add('card-title');
                                    const title = document.createElement('h3');
                                    title.innerHTML = titleText;
                                    cardTitle.appendChild(title);

                                    cardContent.appendChild(cardTitle);

                                    // Add company
                                    const company = document.createElement('div');
                                    company.classList.add('company');
                                    company.textContent = companyText;
                                    cardContent.appendChild(company);
                                }

                                sliderSlide.appendChild(cardImageWrapper);
                                sliderSlide.appendChild(cardContent);
                                sliderWrapper.appendChild(sliderSlide);
                            }
                        }

                        // Initialize the slider after populating the slides
                        if (sliderWrapper.children.length <= this) {
                            // Hide scrollbar and buttons, disable drag if slides are <= 3
                            document.querySelector(`${sliderClass} .slider-button-prev`).style.display = 'none';
                            document.querySelector(`${sliderClass} .slider-button-next`).style.display = 'none';
                            document.querySelector(`${sliderClass} .slider-scrollbar`).style.display = 'none';
                        } else {
                            // initializeSlider(sliderClass, dataKey, cardStructure);
                            new SwipeSlider(sliderClass)
                        }
                    })
                    .catch(error => {
                        console.error('Error loading localization file:', error);
                    });
            } else {
                console.error('Data not found for key:', dataKey);
            }
        })
        .catch(error => {
            console.error('Error fetching data.json:', error);
        });
}


// Helper function to map language code to localization file path
function mapLanguageFilePath(language) {
    return language === 'Eng' ? 'assets/locales/en.json' : 'assets/locales/ka.json';
}

// Populate sliders with specific data
populateSlider('.section_offers', 'offers', 'tags');
populateSlider('.section_products', 'products', 'about');
populateSlider('.section_awards', 'awards', 'company');