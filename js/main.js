document.addEventListener("DOMContentLoaded", function(){
    new ScrollPropertyManager();
    new TextRotator(document.querySelector('span.slogan'), 4000);
    new DaytimeManager(document.getElementById('daytime-switcher'));
});

class ScrollPropertyManager {
    constructor() {
        this.#updateProperty();
        window.addEventListener('scroll', () => this.#updateProperty());
        window.addEventListener('resize', () => this.#updateProperty());
    }

    #updateProperty() {
        document.body.style.setProperty('--scroll', this.#getScrollValue().toString());
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

class TextRotator {
    /**
     * @param {HTMLElement} element
     * @param {int} intervalMs
     */
    constructor(element, intervalMs) {
        const texts = [element.innerText, ...JSON.parse(element.dataset.rotateTexts)];
        this.#rotate(element, texts, intervalMs);
    }

    /**
     * @param {HTMLElement} element
     * @param {[string]} texts
     * @param {int} intervalMs
     * @return {Promise<void>}
     */
    async #rotate(element, texts, intervalMs) {
        element.innerHTML = '';

        while (true) {
            for (let i = 0; i < texts.length; i++) {
                const text = texts[i];
                await Typewriter.clear(element, 30);
                await Typewriter.write(element, text, 100);
                await new Promise(resolve => setTimeout(resolve, intervalMs));
            }
        }
    }
}

class Typewriter {
    /**
     * @param {HTMLElement} element
     * @param {string} text
     * @param {int} typeDelayMs
     * @return {Promise<void>}
     */
    static async write(element, text, typeDelayMs) {
        element.innerHTML = '';

        for (let i = 0; i < text.length; i++) {
            element.innerHTML += text.charAt(i);
            await new Promise(resolve => setTimeout(resolve, typeDelayMs));
        }
    }

    /**
     * @param {HTMLElement} element
     * @param {int} typeDelayMs
     * @return {Promise<void>}
     */
    static async clear(element, typeDelayMs) {
        while (element.innerText.length > 0) {
            element.innerHTML = element.innerText.slice(0, element.innerText.length-1);
            await new Promise(resolve => setTimeout(resolve, typeDelayMs));
        }
    }
}
