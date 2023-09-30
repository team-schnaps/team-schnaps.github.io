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
     * @param {string} newText
     * @param {int} durationMs
     * @param {int} changeDelayMs
     * @return {Promise<void>}
     */
    static async change(element, newText, durationMs, changeDelayMs = 100) {
        const currentText = this.#getCurrentText(element, newText);
        const maxLength = currentText.length > newText.length ? currentText.length : newText.length;
        const currentChars = this.#getCharArray(currentText, maxLength);
        const newChars = this.#getCharArray(newText, maxLength);
        const changeOrder = this.#getChangeOrderArray(currentChars);

        const iterationCount = Math.trunc(durationMs / changeDelayMs);
        let changeStep = currentChars.length / iterationCount;
        let changeCount = 0;

        for (let i = 0; i < iterationCount; i++) {
            changeCount += changeStep;

            if (changeCount >= 1) {
                let charsToChangeCount = Math.trunc(changeCount);
                changeCount -= charsToChangeCount;
                this.#updateElementText(element, currentChars, newChars, changeOrder, charsToChangeCount);
                await new Promise(resolve => setTimeout(resolve, changeDelayMs));
            }
        }

        if (changeCount > 0) {
            let charsToChangeCount = Math.ceil(changeCount);
            this.#updateElementText(element, currentChars, newChars, changeOrder, charsToChangeCount);
        }
    }

    /**
     * @param {HTMLElement} element
     * @param {string} newText
     * @return {string}
     */
    static #getCurrentText(element, newText) {
        if (element.innerText.trim().length === 0) {
            const newTextArray = this.#getCharArray(newText, newText.length);
            this.#shuffleArray(newTextArray);
            return newTextArray.join('');
        }

        return element.innerText;
    }

    /**
     * @param {string} text
     * @param {int} maxLength
     * @return {[string]}
     */
    static #getCharArray(text, maxLength) {
        const missingCount =  maxLength - text.length;
        return missingCount > 0 ? [...text.split(''), ...Array(missingCount)] : text.split('');
    }

    /**
     * @param {[string]} currentChars
     * @return {[int]}
     */
    static #getChangeOrderArray(currentChars) {
        const changeOrder = [...Array(currentChars.length).keys()];
        this.#shuffleArray(changeOrder);
        return changeOrder;
    }

    /**
     * @param {HTMLElement} element
     * @param {[string]} currentChars
     * @param {[string]} newChars
     * @param {[int]} changeOrder
     * @param {int} charsToChangeCount
     */
    static #updateElementText(element, currentChars, newChars, changeOrder, charsToChangeCount) {
        for (let i = 0; i < charsToChangeCount; i++) {
            const index = changeOrder.pop();
            currentChars[index] = newChars[index];
        }
        element.innerHTML = currentChars.join('');
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
