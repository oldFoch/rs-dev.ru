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

function getFeedbacks() {
    $.ajax({
        method: "POST", url: "feedbackOperation.php", data: {operation: 'get'},
        success: function (result) {
            let jsonResult = JSON.parse(result);
            $('.load').hide();
            const template = '<div class="feedback-item">' +
                '<div class="info flex flex-justify-space-between"><div class="flex info-name">' +
                '<div class="name">{name}</div>' +
                '<div class="company">{company}</div>' +
                '</div><div class="date">{date}</div>' +
                '</div>' +
                '<div class="text">{text}</div>' +
                '</div>';
            let templatesHtml = '';
            for (let i = 0; i < jsonResult.length; i++) {
                let html = template;
                let date = new Date(jsonResult[i].date);
                date = date.toLocaleString("ru");
                date = date.split(',')[0];

                html = html.replace('{name}', jsonResult[i].name);
                html = html.replace('{company}', jsonResult[i].company);
                html = html.replace('{date}', date.toLocaleString("ru"));
                html = html.replace('{text}', jsonResult[i].text);
                templatesHtml += html;
            }
            $('.feedback').append(templatesHtml);
        }, error: function () {

        }
    })
}

$(function () {
    getFeedbacks();
    $('#accept-policy').click(function () {
        $('.policy').hide();
        setCookie('accept_policy', !0)
    });
    if (getCookie('accept_policy') && getCookie('accept_policy') !== null) {
        $('.policy').hide()
    }
    $('.feedback-add').click(function () {
        $('.form').css('display', 'flex');
    });
});
