"use strict";
class Vehicle {
    constructor() {
        this.counter = 0;
        this.speed = 0;
        this.game = Game.getInstance();
        this.posx = 100;
    }
    bounce(x) {
        if (this.counter === 15) {
            this.posy += 5 * x;
            this.counter++;
        }
        else if (this.counter === 30) {
            this.posy -= 5 * x;
            this.counter = 0;
        }
        else {
            this.counter++;
        }
    }
    checkCollision() {
        if (this.posx > window.innerWidth - this.element.clientWidth) {
            this.game.winner(this);
        }
    }
    update() {
        this.bounce(2);
    }
}
class Car extends Vehicle {
    constructor() {
        super();
        this.splitted = [];
        this.currentLetter = 0;
        this.element = document.createElement("car");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        this.check = this.game.generateRandom();
        this.posy = 580;
        this.behavior = new Forward(this);
        this.makeWord();
    }
    makeWord() {
        this.randomWord = this.game.randomWord();
        this.game.setWord(this.randomWord);
    }
    onKeyDown(event) {
        console.log(this.splitted);
        console.log(this.randomWord.charCodeAt(this.currentLetter));
        console.log(event.keyCode);
        const keyCode = this.randomWord.charAt(this.currentLetter).toUpperCase().charCodeAt(0);
        switch (event.keyCode) {
            case keyCode:
                if (this.currentLetter === this.randomWord.length - 1) {
                    console.log('Het woord is klaar.');
                    this.currentLetter = 0;
                    this.speed += 0.10;
                    if (this.speed > 0) {
                        this.behavior = new Forward(this);
                    }
                    this.makeWord();
                }
                else {
                    const letterSpans = document.getElementById('word').childNodes;
                    console.log(letterSpans[this.currentLetter].classList.add('correct'));
                    this.currentLetter++;
                }
                break;
            default: this.speed -= 0.10;
        }
    }
    update() {
        this.behavior.update();
    }
}
class Dialog {
    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        document.body.appendChild(this.overlay);
        this.element = document.createElement('div');
        this.element.classList.add('dialog');
        this.element.classList.add('dialog-start');
        document.body.appendChild(this.element);
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new Dialog();
        }
        return this._instance;
    }
    setHTML(html) {
        this.element.innerHTML = html;
    }
    addButton() {
        this.button = document.createElement('button');
        this.button.innerText = 'START';
        this.button.onclick = () => { Dialog.getInstance().startGame(); };
        this.element.appendChild(this.button);
    }
    startGame() {
        Game.getInstance().startGame();
        this.element.remove();
        this.overlay.remove();
    }
}
class Game {
    constructor() {
        this.vehicle = [];
        this.running = false;
    }
    initialize() {
        this.speedSubject = new Speed();
        this.speedSubject.subscribe(this);
        this.showWord();
        this.showSpeed();
        this.vehicle = [new Truck(this.speedSubject), new Car()];
        this.gameLoop();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Game();
        }
        return this.instance;
    }
    generateRandom() {
        return Math.floor(Math.random() * (90 - 65 + 1) + 65);
    }
    randomWord() {
        const wordArray = ["marechaussee", "kmar", "schiphol", "drugs", "paspoort", "tobs", "kazerne", "veiligheid", "nederland", "grenscontrole", "informatie", "defensie", "commandant", "baret", "controle", "paresto", "wapen", "wapendag"];
        let randomWord = wordArray[Math.floor(Math.random() * wordArray.length)];
        return randomWord;
    }
    showWord() {
        let word = document.createElement("div");
        word.setAttribute("id", "word");
        document.body.appendChild(word);
    }
    showSpeed() {
        this.extraSpeedElement = document.createElement("speed");
        this.extraSpeedElement.setAttribute("id", "extraSpeed");
        document.body.appendChild(this.extraSpeedElement);
    }
    setWord(word) {
        const splitted = word.split('');
        let addToHTML = '';
        splitted.forEach(letter => addToHTML += '<span>' + letter + '</span>');
        document.getElementById("word").innerHTML = addToHTML;
    }
    winner(v) {
        if (v instanceof Car) {
            alert("You win :D\nDo you want to play again?");
        }
        else if (v instanceof Truck) {
        }
        window.location.reload();
    }
    startGame() {
        this.running = true;
    }
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        if (this.running) {
            for (let v of this.vehicle) {
                v.update();
                v.checkCollision();
            }
            this.speedSubject.update();
        }
        else {
            if (!this.dialog) {
                this.dialog = Dialog.getInstance();
                this.dialog.setHTML('<h1>KMar F1 - Turbo</h1>' +
                    '<p>Jij bent verantwoordelijk voor de turbo. Probeer zo snel mogelijk de woorden in te typen die in het beeld verschijnen.</p>' +
                    '<p>Let op, door verkeerde aanslagen gaat je auto achteruit!</p>' +
                    '<p>Probeer van de oranje bus te winnen!</p>');
                this.dialog.addButton();
            }
        }
    }
    notify(p) {
        let speed = Math.floor(p * 2) + 90;
        this.extraSpeedElement.innerHTML = speed.toString() + " km/u";
    }
}
window.addEventListener("load", () => {
    const g = Game.getInstance();
    g.initialize();
});
class Speed {
    constructor() {
        this.observers = [];
        this.speed = 0;
    }
    subscribe(c) {
        this.observers.push(c);
    }
    update() {
        this.speed += 0.0005;
        for (let c of this.observers) {
            c.notify(this.speed);
        }
    }
}
class Truck extends Vehicle {
    constructor(s) {
        super();
        this.speedSubject = s;
        this.speedSubject.subscribe(this);
        this.element = document.createElement("truck");
        let foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
        this.posy = 500;
    }
    notify(p) {
        this.posx += p;
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px)`;
    }
}
class Backward {
    constructor(c) {
        this.car = c;
    }
    update() {
        this.car.bounce(1);
        this.car.posx += this.car.speed;
        this.car.element.style.transform = `translate(${this.car.posx}px, ${this.car.posy}px)`;
        if ((this.car.last + 1000) < Date.now()) {
            this.car.speed--;
            this.car.last = Date.now();
        }
    }
}
class Forward {
    constructor(c) {
        this.car = c;
    }
    update() {
        this.car.bounce(2);
        this.car.posx += this.car.speed;
        this.car.element.style.transform = `translate(${this.car.posx}px, ${this.car.posy}px)`;
        if ((this.car.last + 1000) < Date.now()) {
            this.car.behavior = new Backward(this.car);
        }
    }
}
//# sourceMappingURL=main.js.map