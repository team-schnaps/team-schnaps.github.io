document.addEventListener("DOMContentLoaded", function(){
    new ScrollPropertyManager();
    new DaytimeManager(document.getElementById('daytime-switcher'));
});

class ScrollPropertyManager {
    constructor() {
        this.#updateProperty();
        window.addEventListener('scroll', () => this.#updateProperty());
        window.addEventListener('resize', () => this.#updateProperty());
    }

    #updateProperty() {
        document.documentElement.style.setProperty('--scroll', this.#getScrollValue().toString());
    }

    /**
     * @return {number} Value from 0 to 1 which indicates % of scroll
     */
    #getScrollValue() {
        return window.scrollY / (document.body.offsetHeight - window.innerHeight);
    }
}

class DaytimeManager {
    /**
     * @param {HTMLElement} toggleElement
     */
    constructor(toggleElement) {
        this.#init();

        toggleElement.addEventListener('click', function (event){
            event.preventDefault();
            this.#toggle();
        }.bind(this));
    }

    #init() {
        const hours = (new Date()).getHours(); // 24h format (0-23)
        if (hours > 7 && hours < 21) {
            this.#setDaytime('day');
        } else {
            this.#setDaytime('night');
        }
    }

    #toggle() {
        if (this.#getDaytime() === 'day') {
            this.#setDaytime('night');
        } else {
            this.#setDaytime('day');
        }
    }

    /**
     * @return {string}
     */
    #getDaytime() {
        return document.body.dataset.daytime;
    }

    /**
     * @param {string} value
     */
    #setDaytime(value) {
        document.body.dataset.daytime = value;
    }
}
