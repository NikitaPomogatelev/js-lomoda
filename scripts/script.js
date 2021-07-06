document.addEventListener('DOMContentLoaded', () => {
    const headerCityButton = document.querySelector('.header__city-button');

    // Получение города из localstorage
    // if(localStorage.getItem('lomoda-location')) {
    //     headerCityButton.textContent = localStorage.getItem('lomoda-location');
    // }

    headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';

    // Обработчик определния города и запись в localstorage
    headerCityButton.addEventListener('click', () => {
        const city = prompt('Укажите ваш город');
        headerCityButton.textContent = city;
        localStorage.setItem('lomoda-location', city)
    });

    // Блокировка скролла

    const disableScroll = () => {
        // Вычисление ширины скрола 
        const widthScroll = window.innerWidth - document.body.offsetWidth;
        console.log(widthScroll);
        // Сколь px от верха прокручено
        document.body.dbScrollY = window.scrollY;
        document.body.style.cssText = `
            position: fixed;
            top: ${-window.scrollY}px;
            left: 0;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            padding-right: ${widthScroll}px;
        `;
    };
    // Разблокировка скролла
    const enableScroll = () => {
        document.body.style.cssText = '';
        window.scroll({
            top: document.body.dbScrollY,
        })
    };

    // Модальное окно

    const subheaderCart = document.querySelector('.subheader__cart');
    const cartOverlay = document.querySelector('.cart-overlay');

    const openModalCart = () => {
        cartOverlay.classList.add('cart-overlay-open');
        document.addEventListener('keydown', escapeHandler);
        disableScroll();
    }
    const closeModalCart = () => {
        cartOverlay.classList.remove('cart-overlay-open');
        enableScroll();
        document.removeEventListener('keydown', escapeHandler);
    }

    const escapeHandler = ({code, keyCode}) => {
        if (code === 'Escape' || keyCode === 27) {
            closeModalCart();
        }
    }

    subheaderCart.addEventListener('click', openModalCart)

    cartOverlay.addEventListener('click', ({target}) => {
        if (target.classList.contains('cart__btn-close') || target === cartOverlay) {
            closeModalCart();
        }
    })

});