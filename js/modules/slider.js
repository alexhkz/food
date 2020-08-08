function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
		// Slider

		const slides = document.querySelectorAll(slide),	// каждый отдельный слайд
		slider = document.querySelector(container),
		prev = document.querySelector(prevArrow),	// предыдущий слайд
		next = document.querySelector(nextArrow),	// следующий слайд
		total = document.querySelector(totalCounter),
		current = document.querySelector(currentCounter),
		slidesWrapper = document.querySelector(wrapper), // обёртка слайдера
		slidesField = document.querySelector(field),	// ширина карусели
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

	slider.style.position = 'relative';
	
	const indicators = document.createElement('ol'), // создаём новый блок ненумерованный список
		dots = [];

	indicators.classList.add('carousel-indicators'); // добавляем новый класс и задаём ему стили
	indicators.style.cssText = `
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 15;
		display: flex;
		justify-content: center;
		margin-right: 15%;
		margin-left: 15%;
		list-style: none;
	`;
	slider.append(indicators);	// помещаем обёртку внутрь слайдера

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i + 1); // устанавливаем каждой точке атрибут data-slide-to и нумерацию с 1
		dot.style.cssText = `
			box-sizing: content-box;
			flex: 0 1 auto;
			width: 30px;
			height: 6px;
			margin-right: 3px;
			margin-left: 3px;
			cursor: pointer;
			background-color: #fff;
			background-clip: padding-box;
			border-top: 10px solid transparent;
			border-bottom: 10px solid transparent;
			opacity: .5;
			transition: opacity .6s ease;
		`;
		if (i == 0) {
			dot.style.opacity = 1; // если первая итерация, то точка подсвечивается
		}
		indicators.append(dot); // добавляем наши точки в indicators
		dots.push(dot); // добавляем нашу точку в массив
	}

	next.addEventListener('click', () => {
		if (offset == deleteNotDigits(width) * (slides.length - 1)){//offset==ширине слайдов*кол-во слайдов-1  
// в ширине лежит '500px' (строка). удаляем все не числа через replace и унарным плюсом преобразовывем в число 
			offset = 0;
		} else {
			offset += deleteNotDigits(width);
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

		dots.forEach(dot => dot.style.opacity = '.5');
		dots[slideIndex - 1].style.opacity = 1;
	});

	prev.addEventListener('click', () => {
		if (offset == 0){  
// когда мы нажимаем на prev и у нас первый сладй, то мы перемещаемся в самый конец
			offset = deleteNotDigits(width) * (slides.length - 1);
// записываем сюда последний слайд, который вычисляется по этой формуле
		} else {
			offset -= deleteNotDigits(width);
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

		dots.forEach(dot => dot.style.opacity = '.5');
		dots[slideIndex - 1].style.opacity = 1;
	});

	dots.forEach(dot => {
		dot.addEventListener('click', (e) => {
			const slideTo = e.target.getAttribute('data-slide-to');

			slideIndex = slideTo;
			offset = deleteNotDigits(width) * (slideTo - 1);

			slidesField.style.transform = `translateX(-${offset}px)`;

			if (slides.length < 10) {
				current.textContent = `0${slideIndex}`;
			} else {
				current.textContent = slideIndex;
			}

			dots.forEach(dot => dot.style.opacity = '.5');
			dots[slideIndex - 1].style.opacity = 1;
		});
	});

	function deleteNotDigits(str) {
		return +str.replace(/\D/g, '');
	}
}

export default slider;