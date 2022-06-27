const nav_el_name = 'Bitrix24__nav-item';
const slide_el_name = 'Bitrix24__slide-item';
const active_nav_class = 'Bitrix24__nav-item__active';
const active_slide_class = 'Bitrix24__slide-item__active';
$('.Bitrix24__nav-item').click(function(event) {
    let el = event.target;
    let elClass = el.attributes[0].nodeValue;
    let slideNumber = Number(elClass.replace(nav_el_name, '').replace(' ', '').replace(nav_el_name, '').replace('-', ''));
    $('.' + active_nav_class).removeClass(active_nav_class);
    $('.' + active_slide_class).removeClass(active_slide_class);
    $(el).addClass(active_nav_class);
    $('.' + slide_el_name + '-' + slideNumber).addClass(active_slide_class);

});