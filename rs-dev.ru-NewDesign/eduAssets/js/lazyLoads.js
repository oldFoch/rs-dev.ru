function lazyLoad() {
    const lazyLoadsImages = document.getElementsByClassName('lazy-loads');
    for (let i = 0; i < lazyLoadsImages.length; i++) {
        let el = lazyLoadsImages[i];
        if (el) {
            el.setAttribute(el.dataset.attr, el.dataset.src);
        }
    }
}
function loadJs() {
    const mainJsModule = document.createElement('script');
    mainJsModule.setAttribute('src', './eduAssets/js/main.min.js');
    document.body.appendChild(mainJsModule);

    let iterationLoadError = 0;
    const maxIteration = 20;
    const jqueryReadyInterval = setInterval(() => {
        try {
            $('lazyLoads');
            const loadEvent = new Event('jQueryLoads');
            document.dispatchEvent(loadEvent);
            clearInterval(jqueryReadyInterval);
            console.info('jQuery готов');
        } catch (e) {
            iterationLoadError++;
            console.info('jQuery еще не готов');
            if (iterationLoadError > maxIteration) {
                clearInterval(jqueryReadyInterval);
                console.error('jQuery не удалось загрузить. Часть динамического контента не доступна!');
            }
        }
    }, 500);
}

document.addEventListener("DOMContentLoaded",() => {
    lazyLoad();
    loadJs();
});