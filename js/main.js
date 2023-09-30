document.addEventListener("DOMContentLoaded", function(){
    new ScrollPropertyManager();
    new TextRotator(document.querySelector('span.slogan'), 5000);
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
                await TextRandomChanger.change(element, text, 700);
                await new Promise(resolve => setTimeout(resolve, intervalMs));
            }
        }
    }
}

class TextRandomChanger {
    /**
     * @param {HTMLElement} element
     * @param {string} text
     * @param {int} durationMs
     * @param {int} changeDelayMs
     * @return {Promise<void>}
     */
    static async change(element, text, durationMs, changeDelayMs = 100) {
        const elementTextArray = element.innerText.split('');
        const newTextArray = text.split('');

        if (element.innerText.trim().length === 0) {
            elementTextArray.push(...newTextArray);
            this.#shuffleArray(elementTextArray);
        }

        const diff = elementTextArray.length - newTextArray.length;
        const diffCount = Math.abs(diff);
        if (diff < 0) {
            elementTextArray.push(...Array(diffCount));
        } else {
            newTextArray.push(...Array(diffCount));
        }

        const indexesToChange = [...Array(elementTextArray.length).keys()];
        this.#shuffleArray(indexesToChange);

        const iterationCount = Math.trunc(durationMs / changeDelayMs);
        let changeRatio = elementTextArray.length / iterationCount;
        let charsToChange = 0;

        for (let i = 0; i < iterationCount; i++) {
            charsToChange += changeRatio;

            if (charsToChange >= 1) {
                let charsToChangeCount = Math.trunc(charsToChange);
                charsToChange -= charsToChangeCount;

                for (let i = 0; i < charsToChangeCount; i++) {
                    const index = indexesToChange.pop();
                    elementTextArray[index] = newTextArray[index];
                }

                element.innerHTML = elementTextArray.join('');
                await new Promise(resolve => setTimeout(resolve, changeDelayMs));
            }
        }

        if (charsToChange > 0) {
            let charsToChangeCount = Math.ceil(charsToChange);
            for (let i = 0; i < charsToChangeCount; i++) {
                const index = indexesToChange.pop();
                elementTextArray[index] = newTextArray[index];
            }
            element.innerHTML = elementTextArray.join('');
        }
    }

    /**
     * @param array
     */
    static #shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
