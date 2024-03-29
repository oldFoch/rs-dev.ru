let currentSlide = 1;
const maxSlideNumber = 3;
const sliderDelay = 5000;
const animationDelay = 300;
const slideElementPrefix = 'slide-';
const slideBtnElementPrefix = 'slide-btn-';
const activeSlideClassName = 'TopBlock__content-slider__control-contents-inner-active';

function changeSlide(nextSlideNumber) {
    $('#' + slideElementPrefix + currentSlide).hide(animationDelay);
    $('#' + slideElementPrefix + nextSlideNumber).show(animationDelay);
    $('#' + slideBtnElementPrefix + currentSlide).removeClass(activeSlideClassName);
    $('#' + slideBtnElementPrefix + nextSlideNumber).addClass(activeSlideClassName);
    currentSlide = nextSlideNumber;
}

function startSlider() {
    const sliderBtnClass = 'TopBlock__content-slider__control-contents';
    const hideSlides = [2, 3];

    $('#' + slideBtnElementPrefix + currentSlide).addClass(activeSlideClassName);
    hideSlides.forEach((slide) => {
        $('#' + slideElementPrefix + slide).hide();
    });

    const sliderInterval = setInterval(function () {
        changeSlide(currentSlide + 1 > maxSlideNumber ? 1 : currentSlide + 1);
    }, sliderDelay);

    $('.' + sliderBtnClass).click(function () {
        let nextSlide = Number(this.dataset.slide);

        clearInterval(sliderInterval);

        if (nextSlide === currentSlide) {
            return;
        }

        changeSlide(nextSlide);
    });

    $('.nextSlide').click(function () {
        changeSlide(Number(currentSlide) + 1);
        clearInterval(sliderInterval);
    });

    $('.TopBlock__content-slider').swipe({
        swipeStatus:function(event, phase, direction, distance)
        {
            if (phase==="end"){
                //сработает через 20 пикселей то число которое выбрали в threshold
                if (direction === 'left') {
                    changeSlide(currentSlide + 1 > maxSlideNumber ? 1 : currentSlide + 1);
                    clearInterval(sliderInterval);
                }
                if (direction === 'right') {
                    changeSlide(currentSlide - 1 < 1 ? 3 : currentSlide - 1);
                    clearInterval(sliderInterval);
                }
            }
        },
        triggerOnTouchEnd:false,
        threshold:60
    });
}

function getFormData(field) {
    let result = {};
    for (let i = 0; i < field.length; i++) {
        let element = $(field[i]);
        result[element[0].dataset.context] = element.val()
    }
    return result
}

function submitForm(result, result_div, form) {
    $.ajax({
        method: "POST", url: "feedback.php", data: result, success: function () {
            setResultSubmit(result_div, form, 'success', 'Форма отправлена успешно', 'fa-check')
        }, error: function () {
            setResultSubmit(result_div, form, 'error', 'Ошибка при отправке', 'fa-times')
        }
    })
}

function checkForm(field) {
    let success = true;
    for (let i = 0; i < field.length; i++) {
        let element = $(field[i]);
        if (element.val().length < 4) {
            element.css('border', '2px solid #FBD04B');
            if (!success) {
                element.click();
            }
            success = false;
        } else {
            element.css('border', '2px solid green')
        }
    }
    return success
}

function setResultSubmit(result_div, form, status, text, icon) {
    result_div.css('display', 'flex').addClass(status);
    result_div.find('i').addClass(icon);
    result_div.find('p').text(text);
    form.hide()
}

function submitScript() {
    $('.submit-btn').click((event) => {
        event.preventDefault();
        const form = $(event.target).parent().parent(),
            field = $(form).find('input'),
            result = getFormData(field),
            result_div = $('.submit-status');
        if (checkForm(field)) {
            $(event.target).hide();
            submitForm(result, result_div, form);
        }
    });
}

function setCookie(name, value, addedDay = 0, path = '/') {
    let cookieString = name + '=' + value;
    if (addedDay > 0) {
        let date = new Date(Date.now() + 86400e3);
        date = date.toUTCString();
        cookieString += "; expires=" + date
    }
    cookieString += "; path=" + escape(path);
    document.cookie = cookieString
}

function getCookie(cookie_name) {
    let results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
    if (results)
        return (unescape(results[2])); else return null
}

document.addEventListener('jQueryLoads', () => {
    startSlider();
    submitScript();
    if (getCookie('accept_policy') && getCookie('accept_policy') !== null) {
        $('.policy').hide()
    }

    $('.feedback').click(function () {
        $('html, body').animate({
            scrollTop: $('.Feedback__content').offset().top
        }, {
            duration: 370,   // по умолчанию «400»
            easing: "linear" // по умолчанию «swing»
        });

        return false;
    });
    $('#accept-policy').click(function () {
            $('.policy').hide();
            setCookie('accept_policy', !0)
    });
});
