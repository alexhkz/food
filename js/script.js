"use strict";

window.addEventListener('DOMContentLoaded', function () {

	// Tabs

	let tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {

		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', function (event) {
		const target = event.target;
		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});

	// Timer

	const deadline = '2020-08-11';

	function getTimeRemaining(endtime) {
		const t = Date.parse(endtime) - Date.parse(new Date()),
			days = Math.floor((t / (1000 * 60 * 60 * 24))),
			seconds = Math.floor((t / 1000) % 60),
			minutes = Math.floor((t / 1000 / 60) % 60),
			hours = Math.floor((t / (1000 * 60 * 60) % 24));

		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return '0' + num;
		} else {
			return num;
		}
	}

	function setClock(selector, endtime) {

		const timer = document.querySelector(selector),
			days = timer.querySelector("#days"),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000);

		updateClock();

		function updateClock() {
			const t = getTimeRemaining(endtime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}

	setClock('.timer', deadline);

	// Modal

	const modalTrigger = document.querySelectorAll('[data-modal]'),
		modal = document.querySelector('.modal');

	modalTrigger.forEach(btn => {
		btn.addEventListener('click', openModal);
	});

	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = '';
	}

	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		clearInterval(modalTimerId);
	}

	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === "Escape" && modal.classList.contains('show')) {
			closeModal();
		}
	});

	const modalTimerId = setTimeout(openModal, 50000);
	// Изменил значение, чтобы не отвлекало

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll);
		}
	}
	window.addEventListener('scroll', showModalByScroll);

	// Используем классы для создание карточек меню

	class MenuCard {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.classes = classes;
			this.parent = document.querySelector(parentSelector);
			this.transfer = 27;
			this.changeToUAH();
		}

		changeToUAH() {
			this.price = this.price * this.transfer;
		}

		render() {
			const element = document.createElement('div');

			if (this.classes.length === 0) {
				this.classes = "menu__item";
				element.classList.add(this.classes);
			} else {
				this.classes.forEach(className => element.classList.add(className));
			}

			element.innerHTML = `
					<img src=${this.src} alt=${this.alt}>
					<h3 class="menu__item-subtitle">${this.title}</h3>
					<div class="menu__item-descr">${this.descr}</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
						 <div class="menu__item-cost">Цена:</div>
						 <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
					</div>
			  `;
			this.parent.append(element);
		}
	}

	const getResource = async (url) => {     // получаем ответ от сервера
		const res = await fetch(url);         //await позволяет дождаться результата запроса.

		if (!res.ok) {								  // если что-то пошло не так с запросом, то выкидываем ошибку
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();  // возвращаем промис из функции getResource и трансформируем в нормальный объект
	};

	// getResource('http://localhost:3000/menu')
	// 	.then(data => {
			// data.forEach(({img, altimg, title, descr, price}) => {
			// 	new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
			// });
	// 	});

	axios.get('http://localhost:3000/menu')
		.then(data => {
			data.data.forEach(({img, altimg, title, descr, price}) => {	// перебираем наш массив из объектов
			// и деструктуризирую по отдельным частям и передаю внутрь конструктора MenuCard который
			new MenuCard(img, altimg, title, descr, price, '.menu .container').render();	
			//создаёт новую карточку на странице и рендерит (menu и container - родители, в которые мы будем пушить)
			// конструктор будет создаваться столько раз, сколько у нас объектов в массиве
		});
	});

	// Forms

	const forms = document.querySelectorAll('form');
	const message = {          							// создаём объект с выводимыми для пользователями сообщениями
		loading: 'img/form/spinner.svg',					// выводит картинку со спиннером загрузки
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так...'
	};

	forms.forEach(item => {    							// под каждую из форм подвязываем функцию postData
		bindPostData(item);
	});

	const postData = async (url, data) => {     // настраиваем запрос, получаем ответ от сервера и трансформирует в json
		const res = await fetch(url, { // помещаем в переменную res промис. await позволяет дождаться результата запроса.
			method: "POST",
				headers: {
					'Content-type': 'application/json'
				},
				body: data
		});

		return await res.json();  // возвращаем промис из функции postData. await позволяет дождаться результата запроса.
	};

	function bindPostData(form) {				// привязываем постинг данных
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			let statusMessage = document.createElement('img');  // создаём новый элемент с картинкой (спиннер)
			statusMessage.src = message.loading; // подставляем путь из объекта с сообщениями и приписываем инлайнcss свойства
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;
			form.insertAdjacentElement('afterend', statusMessage); // вставляем элемент(спиннер) после формы 

			const formData = new FormData(form);		// собираем все данные из нашей формы с помощью FormData

			const json = JSON.stringify(Object.fromEntries(formData.entries())); 
			//превращаем данные из formData в матрицу(массив массивов),затем 
			//превращаем в классический объект, а затем этот объект превращаем в json

			postData('http://localhost:3000/requests', json) // подставляем юрл json файла  и данные
			.then(data => {									// в случае успеха с сервера возвращаются данные (из промиса)
				console.log(data);							// выводим в консоль то, что нам выдал сервер
			 	showThanksModal(message.success);		// вызываем функцию с сообщением об успехе
			 	form.reset();   								// сбрасываем форму
			 	statusMessage.remove();						// удаляем уведомление (спиннер)
			})
			.catch(() => {
				showThanksModal(message.failure);		// вызываем функцию с сообщением о неудаче
			})
			.finally(() => {
				form.reset();									// сбрасываем форму
			});
		});
	}

	function showThanksModal(message) {							// создаём окно thanksModal вместо того, которое было в вёрстке
		const prevModalDialog = document.querySelector('.modal__dialog'); // получаем элемент по классу

		prevModalDialog.classList.add('hide');             // скрываем элемент перед тем, как показать модальное окно
		openModal();													// открываем модальное окно

		const thanksModal = document.createElement('div'); // оздаём блок-обёртку
		thanksModal.classList.add('.modal__dialog');			// назначаем класс для div и формируем вёрстку 
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>×</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector('.modal').append(thanksModal); // получаем модальное окно и добавляем блок thanksModal
		setTimeout(() => {												// выставляем таймер на 4 секунды
			thanksModal.remove();
			prevModalDialog.classList.add('show');  				// показываем контент modal__dialog
			prevModalDialog.classList.remove('hide'); 			// скрываем контент modal__dialog
			closeModal();													// закрываем модальное окно
		}, 4000);
	}

	fetch('http://localhost:3000/menu') // посылаем запрос на сервер(получаем массив menu)
		.then(data => data.json())	// получаем ответ от сервера и преращаем в обычноый объект
		.then(res => console.log(res)); // полученный результат выводим в консоль


		// Slider

		const slides = document.querySelectorAll('.offer__slide'),	// каждый отдельный слайд
			prev = document.querySelector('.offer__slider-prev'),	// предыдущий слайд
			next = document.querySelector('.offer__slider-next'),	// следующий слайд
			total = document.querySelector('#total'),
			current = document.querySelector('#current'),
			slidesWrapper = document.querySelector('.offer__slider-wrapper'), // обёртка слайдера
			slidesField = document.querySelector('.offer__slider-inner'),	// ширина карусели
			width = window.getComputedStyle(slidesWrapper).width;	// ширина обёртки
		
		let slideIndex = 1;					// текущее положение слайдера. 1 а не 0 для лучшего понимания человека
		let offset = 0;

		if (slides.length < 10) {
			total.textContent = `0${slides.length}`;
			current.textContent = `0${slideIndex}`;
	  } else {
			total.textContent = slides.length;
			current.textContent = slideIndex;
	  }

		slidesField.style.width = 100 * slides.length + '%';
		slidesField.style.display = 'flex';
		slidesField.style.transition = '0.5s all';

		slidesWrapper.style.overflow = 'hidden';

		slides.forEach(slide => {
			slide.style.width = width;
		});

		next.addEventListener('click', () => {
			if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)){//offset==ширине слайдов*кол-во слайдов-1  
	// в ширине лежит '500px' (строка). мы отнимаем через slice 2 последних знака и унарным плюсом преобразовывем в число 
				offset = 0;
			} else {
				offset += +width.slice(0, width.length - 2);
	// когда нажимаем стрелку впёред, к нам добавляется ширина еще одного слайда и слайд будет смещаться на опр. величину
			}

			slidesField.style.transform = `translateX(-${offset}px)`;

			if (slideIndex == slides.length) {
				slideIndex = 1;
			} else {
				slideIndex++;
			}

			if (slides.length < 10) {
				current.textContent = `0${slideIndex}`;
			} else {
				current.textContent = slideIndex;
			}
		});

		prev.addEventListener('click', () => {
			if (offset == 0){  
	// когда мы нажимаем на prev и у нас первый сладй, то мы перемещаемся в самый конец
				offset = +width.slice(0, width.length - 2) * (slides.length - 1);
	// записываем сюда последний слайд, который вычисляется по этой формуле
			} else {
				offset -= +width.slice(0, width.length - 2);
	// если это был не первый слайд, то мы отнимаем 
			}

			slidesField.style.transform = `translateX(-${offset}px)`;

			if (slideIndex == 1) {
				slideIndex = slides.length;
			} else {
				slideIndex--;
			}

			if (slides.length < 10) {
				current.textContent = `0${slideIndex}`;
			} else {
				current.textContent = slideIndex;
			}
		});

		// showSlides(slideIndex);
  
		// if (slides.length < 10) {
		// 	 total.textContent = `0${slides.length}`;
		// } else {
		// 	 total.textContent = slides.length;
		// }
  
		// function showSlides(n) {	//функция по показу и скрытию слайдов куда приходит slideIndex
		// 	 if (n > slides.length) {
		// 		  slideIndex = 1;
		// 	 }
		// 	 if (n < 1) {	// если номер слайда меньше 1, то мы ставим последний слайдер
		// 		  slideIndex = slides.length;
		// 	 }
  
		// 	 slides.forEach((item) => item.style.display = 'none'); //скрываем все классы и показываем только интересующий
  
		// 	 slides[slideIndex - 1].style.display = 'block';  // отнимаем единицу от текущего значения (для человека)
			 
		// 	 if (slides.length < 10) {
		// 		  current.textContent =  `0${slideIndex}`;
		// 	 } else {
		// 		  current.textContent =  slideIndex;
		// 	 }
		// }
  
		// function plusSlides (n) {
		// 	 showSlides(slideIndex += n);
		// }
  
		// prev.addEventListener('click', function(){	// при нажатии на prev отнимаем один слайдер
		// 	 plusSlides(-1);
		// });
  
		// next.addEventListener('click', function(){	// при нажатии на next прибавляем один слайдер
		// 	 plusSlides(1);
		// });
});



