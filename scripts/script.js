document.addEventListener('DOMContentLoaded', () => {
    const headerCityButton = document.querySelector('.header__city-button');

    let hash = location.hash.substring(1);

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

    // Запрос базы данных

    const getData = async (url) => {
        const data = await fetch(url);

        if (!data.ok) {
			throw new Error(`Возникла ошибка по адресу: ${data.url} Статус ошибки: ${data.status}: ${data.statusText}`);
		}
		return await data.json();
    };

    const getGoods = (callback, value) => {
        getData('db.json')
            .then(data => {
                if(value) {
                    callback(data.filter(item => item.category === value))
                } else {
                    callback(data);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    getGoods((data) => {
        console.log(data);
    });

    subheaderCart.addEventListener('click', openModalCart)

    cartOverlay.addEventListener('click', ({target}) => {
        if (target.classList.contains('cart__btn-close') || target === cartOverlay) {
            closeModalCart();
        }
    });

    try {
        const goodsList = document.querySelector('.goods__list');

        if(!goodsList) {
            throw `Такого элемента на этой странице нет!`;
        }

        // Создание карточки товара
        const createCard = ({id, preview, cost, brand, name, sizes}) => {
            // const createCard = data => data.id, data.preview, data.cost ...
            const li = document.createElement('li');
            // console.log(data);
            li.classList.add('goods__item');

            li.innerHTML = `
            <article class="good">
                <a class="good__link-img" href="card-good.html#${id}">
                    <img class="good__img" src="goods-image/${preview}" alt="${name}">
                </a>
                <div class="good__description">
                    <p class="good__price">${cost} &#8381;</p>
                    <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                    ${sizes ? 
                        `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` 
                    : ''}
                    
                    <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                </div>
            </article>
            `;

            return li;
        };

        // Создание 
        const renderGoodsList = data => {
            goodsList.textContent = '';

            // 1 способ перебора
            // for (let i = 0; i < data.length; i++) {
            //     console.log(data[i]);
            // }
            // 2 способ перебора
            // for (const item of data) {
            //     console.log(item);
            // }

            data.forEach(item => {
                const card = createCard(item);
                goodsList.append(card);
            });
        };

        const navigation = document.querySelector('.navigation');
        let goodsTitle = document.querySelector('.goods__title');

        navigation.addEventListener('click', ({target}) => {
            console.log(target);
            if(target.classList.contains('navigation__link') && target.closest('.navigation__item')) {
                goodsTitle.textContent = target.textContent;
            }
        })

        window.addEventListener('hashchange', () => {
            hash = location.hash.substring(1);
            getGoods(renderGoodsList, hash);

        });
        getGoods(renderGoodsList, hash);

    } catch (err) {
        console.warn(err);
    }


});