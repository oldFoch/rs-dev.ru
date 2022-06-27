// Added function in jquery
$.fn.setCursorPosition = function (pos) {
    if ($(this).get(0).setSelectionRange) {
        $(this).get(0).setSelectionRange(pos, pos);
    } else if ($(this).get(0).createTextRange) {
        var range = $(this).get(0).createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
};
(function ($) {

    var $window = $(window),
        $body = $('body'),
        $main = $('#main');

    // Breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px']
    });

    // Play initial animations on page load.
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Nav.
    var $nav = $('#nav');

    if ($nav.length > 0) {

        // Shrink effect.
        $main
            .scrollex({
                mode: 'top',
                enter: function () {
                    $nav.addClass('alt');
                },
                leave: function () {
                    $nav.removeClass('alt');
                },
            });

        // Links.
        var $nav_a = $nav.find('a');

        $nav_a
            .scrolly({
                speed: 1000,
                offset: function () {
                    return $nav.height();
                }
            })
            .on('click', function () {

                var $this = $(this);

                // External link? Bail.
                if ($this.attr('href').charAt(0) != '#')
                    return;

                // Deactivate all links.
                $nav_a
                    .removeClass('active')
                    .removeClass('active-locked');

                // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
                $this
                    .addClass('active')
                    .addClass('active-locked');

            })
            .each(function () {

                var $this = $(this),
                    id = $this.attr('href'),
                    $section = $(id);

                // No section for this link? Bail.
                if ($section.length < 1)
                    return;

                // Scrollex.
                $section.scrollex({
                    mode: 'middle',
                    initialize: function () {

                        // Deactivate section.
                        if (browser.canUse('transition'))
                            $section.addClass('inactive');

                    },
                    enter: function () {

                        // Activate section.
                        $section.removeClass('inactive');

                        // No locked links? Deactivate all links and activate this section's one.
                        if ($nav_a.filter('.active-locked').length == 0) {

                            $nav_a.removeClass('active');
                            $this.addClass('active');

                        }

                        // Otherwise, if this section's link is the one that's locked, unlock it.
                        else if ($this.hasClass('active-locked'))
                            $this.removeClass('active-locked');

                    }
                });

            });

    }

    // Scrolly.
    $('.scrolly').scrolly({
        speed: 1000
    });

    // Phone mask
    $('#telephone').click(function () {
        $(this).setCursorPosition(4);
    }).mask('+7 (999) 999-9999');

    // Load policy
    $.ajax({
        method: "GET",
        url: "policy.php",
        success: function (result) {
            $('.policy-text').find('p').append(result);
        },
        error: function () {
            $('.policy-text').find('p').text('Ошибка загрузки текста политики конфиденциальности');
        }
    });

    // Check allow submit form
    if (getCookie('form_sent') && getCookie('form_sent') !== null) {
        const result_div = $('.submit-status'),
            form = $('form');
        setResultSubmit(result_div, form, 'wait', 'Вы уже отправили форму', 'fa-coffee')
    }

    // Check accept policy
    if (getCookie('accept_policy') && getCookie('accept_policy') !== null) {
        $('.policy').hide();
    }

    // Accept policy
    $('#accept-policy').click(function () {
        $('.policy').hide();
        setCookie('accept_policy', true)
    });

    // Policy click
    $('#policy').click(function () {
        $('.policy-text').css('display', 'flex');
    });

    // Policy Close
    $('#close-policy').click(function () {
        $('.policy-text').css('display', 'none');
    });

    // Submit Form
    $('.submit-btn').click((event) => {
        event.preventDefault();

        const form = $(event.target).parent(),
            field = $(form).find('input'),
            result = getFormData(field),
            result_div = $('.submit-status');

        if (checkForm(field)) {
            $(event.target).hide();
            submitForm(result, result_div, form);
        }
    });

    // Lazyload
    const image = $('.lazyload');
    for(let i = 0; i < image.length; i++) {
        $(image[i]).attr('src', $(image[i]).dataset.src);
    }

    // Custom function
    function getFormData(field) {
        let result = {};
        for (let i = 0; i < field.length; i++) {
            let element = $(field[i]);
            result[element[0].dataset.context] = element.val();
        }

        return result;
    }

    function checkForm(field) {
        let success = true;
        for (let i = 0; i < field.length; i++) {
            let element = $(field[i]);
            if (element.val().length < 4) {
                element.css('border', '1px solid red');
                success = false;
            } else {
                element.css('border', '1px solid green');
            }
        }

        return success;
    }

    function submitForm(result, result_div, form) {
        $.ajax({
            method: "POST",
            url: "form.php",
            data: result,
            success: function () {
                setResultSubmit(result_div, form, 'success', 'Форма успешно отправлена', 'fa-check');
                // setCookie('form_sent', true, 2);
            },
            error: function () {
                setResultSubmit(result_div, form, 'error', 'Ошибка при отправке формы', 'fa-times')
            }
        });
    }

    function setResultSubmit(result_div, form, status, text, icon) {
        result_div.css('display', 'flex').addClass(status);
        result_div.find('i').addClass(icon);
        result_div.find('p').text(text);
        form.hide();
    }

    function setCookie(name, value, addedDay = 0, path = '/') {
        let cookieString = name + '=' + value;
        if (addedDay > 0) {
            let date = new Date(Date.now() + 86400e3);
            date = date.toUTCString();
            cookieString += "; expires=" + date;
        }
        cookieString += "; path=" + escape(path);

        document.cookie = cookieString;
    }

    function getCookie(cookie_name) {
        let results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

        if (results)
            return (unescape(results[2]));
        else
            return null;
    }
})(jQuery);