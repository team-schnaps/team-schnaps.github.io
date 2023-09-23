document.addEventListener("DOMContentLoaded", function(){
    new DaytimeManager(document.getElementById('daytime-switcher'));
});

class DaytimeManager {
    /** @type {HTMLBodyElement} */
    #body = document.getElementsByTagName('body')[0];

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
        return this.#body.dataset.daytime;
    }

    /**
     * @param {string} value
     */
    #setDaytime(value) {
        this.#body.dataset.daytime = value;
    }
}
