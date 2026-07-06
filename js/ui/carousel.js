
function initCarousel() {
    const wrappers = document.querySelectorAll('.carousel-wrapper');
    wrappers.forEach(wrapper => {
        const cardsContainer = wrapper.querySelector('.cards');
        const leftBtn = wrapper.querySelector('.left-btn');
        const rightBtn = wrapper.querySelector('.right-btn');

        if (cardsContainer && leftBtn && rightBtn) {
            const getScrollAmount = () => {
                return cardsContainer.clientWidth; 
            };

            leftBtn.addEventListener('click', () => {
                cardsContainer.scrollBy({
                    left: -getScrollAmount(),
                    behavior: 'smooth'
                });
            });

            rightBtn.addEventListener('click', () => {
                cardsContainer.scrollBy({
                    left: getScrollAmount(),
                    behavior: 'smooth'
                });
            });
        }
    });
}

export async function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initCarousel());
    } else {
        initCarousel();
    }
}
