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

    const getGoods = (callback, prop, value) => {
        getData('db.json')
            .then(data => {
                if(value) {
                    callback(data.filter(item => item[prop] === value))
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

    // Cтраница категорий товаров
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
            // 2 вариант
            // const arr = data.map(createCard);
            // goodsList.append(...arr);
        };

        /* Замена title */
        // 1 способ (по клику)
        // const navigation = document.querySelector('.navigation');
        // let goodsTitle = document.querySelector('.goods__title');

        // navigation.addEventListener('click', ({target}) => {
        //     console.log(target);
        //     if(target.classList.contains('navigation__link') && target.closest('.navigation__item')) {
        //         goodsTitle.textContent = target.textContent;
        //     }
        // })

        // 2 способ (по hash ссылки)
        let goodsTitle = document.querySelector('.goods__title');

        const changeTitle = () => {
            goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
        }
        

        window.addEventListener('hashchange', () => {
            hash = location.hash.substring(1);
            getGoods(renderGoodsList, 'category', hash);
            changeTitle();
        });
        changeTitle();
        getGoods(renderGoodsList, 'category', hash);

    } catch (err) {
        console.warn(err);
    }

    // Страница товара
    try {
      if (!document.querySelector('.card-good')) {
        throw 'Это не страница товара'
      }  

        // Генерация li (списка options) для select
        const generateList = (data) => data.reduce((html, item, i) => html +
         `<li class="card-good__select-item" data-id="${i}">${item}</li>`, '')

        const cardGoodImage = document.querySelector('.card-good__image');
        const cardGoodBrand = document.querySelector('.card-good__brand');
        const cardGoodTitle = document.querySelector('.card-good__title');
        const cardGoodPrice = document.querySelector('.card-good__price');
        const cardGoodColor = document.querySelector('.card-good__color');
        const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');
        const cardGoodColorList = document.querySelector('.card-good__color-list');
        const cardGoodSizes = document.querySelector('.card-good__sizes');
        const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
        const cardGoodBuy = document.querySelector('.card-good__buy');

        const renderCardGood = ([{brand, name, cost, color, sizes, photo}]) => {
            cardGoodImage.src = `goods-image/${photo}`;
            cardGoodImage.alt = `${brand} ${name}`;
            cardGoodBrand.textContent = brand;
            cardGoodTitle.textContent = name;
            cardGoodPrice.textContent = `${cost} ₽`;
            if (color) {
                cardGoodColor.textContent = color[0];
                cardGoodColor.dataset.id = 0;
                cardGoodColorList.innerHTML = generateList(color);
            } else {
                cardGoodColor.style.display = 'none'
            }
            if (sizes) {
                cardGoodSizes.textContent = sizes[0];
                cardGoodSizes.dataset.id = 0;
                cardGoodSizesList.innerHTML = generateList(sizes);
            } else {
                cardGoodSizes.style.display = 'none'
            }
        };

        cardGoodSelectWrapper.forEach(item => {
            item.addEventListener('click', ({target}) => {

                if(target.closest('.card-good__select')) {
                    target.classList.toggle('card-good__select__open');
                }
                if(target.closest('.card-good__select-item')) {
                    const cardGoodSelect = item.querySelector('.card-good__select');
                    cardGoodSelect.textContent = target.textContent;
                    cardGoodSelect.dataset.id = target.dataset.id;
                    cardGoodSelect.classList.remove('card-good__select__open');
                }
            });
        });

        getGoods(renderCardGood, 'id', hash);

    } catch (err) {
        console.warn(err);
    }

});