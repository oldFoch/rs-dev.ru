$.fn.setCursorPosition = function (pos) {
    if ($(this).get(0).setSelectionRange) {
        $(this).get(0).setSelectionRange(pos, pos)
    } else if ($(this).get(0).createTextRange) {
        var range = $(this).get(0).createTextRange();
        range.collapse(!0);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select()
    }
};
(function ($) {
    var $window = $(window), $body = $('body'), $main = $('#main');
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px']
    });
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload')
        }, 100)
    });
    var $nav = $('#nav');
    if ($nav.length > 0) {
        $main.scrollex({
            mode: 'top', enter: function () {
                $nav.addClass('alt')
            }, leave: function () {
                $nav.removeClass('alt')
            },
        });
        var $nav_a = $nav.find('a');
        $nav_a.scrolly({
            speed: 1000, offset: function () {
                return $nav.height()
            }
        }).on('click', function () {
            var $this = $(this);
            if ($this.attr('href').charAt(0) != '#')
                return;
            $nav_a.removeClass('active').removeClass('active-locked');
            $this.addClass('active').addClass('active-locked')
        }).each(function () {
            var $this = $(this), id = $this.attr('href'), $section = id[0] === '#' ? $(id) : [];
            if ($section.length < 1)
                return;
            $section.scrollex({
                mode: 'middle', initialize: function () {
                    if (browser.canUse('transition'))
                        $section.addClass('inactive')
                }, enter: function () {
                    $section.removeClass('inactive');
                    if ($nav_a.filter('.active-locked').length == 0) {
                        $nav_a.removeClass('active');
                        $this.addClass('active')
                    } else if ($this.hasClass('active-locked'))
                        $this.removeClass('active-locked')
                }
            })
        })
    }
    $('.scrolly').scrolly({speed: 1000});
    $('#telephone').click(function () {
        $(this).setCursorPosition(4)
    }).mask('+7 (999) 999-9999');
    $.ajax({
        method: "GET", url: "policy.php", success: function (result) {
            $('.policy-text').find('p').append(result)
        }, error: function () {
            $('.policy-text').find('p').text('?????? ???????? ?????? ???????? ??????????????????')
        }
    });
    if (getCookie('form_sent') && getCookie('form_sent') !== null) {
        const result_div = $('.submit-status'), form = $('form');
        setResultSubmit(result_div, form, 'wait', '?? ??? ????????? ?????', 'fa-coffee')
    }
    if (getCookie('accept_policy') && getCookie('accept_policy') !== null) {
        $('.policy').hide()
    }
    $('#accept-policy').click(function () {
        $('.policy').hide();
        setCookie('accept_policy', !0)
    });
    $('#policy').click(function () {
        $('.policy-text').css('display', 'flex')
    });
    $('#close-policy').click(function () {
        $('.policy-text').css('display', 'none')
    });
    $('.submit-btn').click((event) => {
        event.preventDefault();
        const form = $(event.target).parent(), field = $(form).find('input'), result = getFormData(field),
            result_div = $('.submit-status');
        if (checkForm(field)) {
            $(event.target).hide();
            submitForm(result, result_div, form)
        }
    });
    const image = $('.lazyload');
    for (let i = 0; i < image.length; i++) {
        $(image[i]).attr('src', $(image[i])[0].dataset.src)
    }

    function getFormData(field) {
        let result = {};
        for (let i = 0; i < field.length; i++) {
            let element = $(field[i]);
            result[element[0].dataset.context] = element.val()
        }
        return result
    }

    function checkForm(field) {
        let success = !0;
        for (let i = 0; i < field.length; i++) {
            let element = $(field[i]);
            if (element.val().length < 4) {
                element.css('border', '1px solid red');
                success = !1
            } else {
                element.css('border', '1px solid green')
            }
        }
        return success
    }

    function submitForm(result, result_div, form) {
        $.ajax({
            method: "POST", url: "form.php", data: result, success: function () {
                setResultSubmit(result_div, form, 'success', '????? ??????? ??????????', 'fa-check')
            }, error: function () {
                setResultSubmit(result_div, form, 'error', '?????? ??? ???????? ?????', 'fa-times')
            }
        })
    }

    function setResultSubmit(result_div, form, status, text, icon) {
        result_div.css('display', 'flex').addClass(status);
        result_div.find('i').addClass(icon);
        result_div.find('p').text(text);
        form.hide()
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
})(jQuery)