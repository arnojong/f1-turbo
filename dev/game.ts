class Game implements Observer{
    
    public vehicle: Vehicle []=[]
    private static instance:Game
    private extraSpeedElement:HTMLElement
    private speedSubject:Subject
    private dialog: Dialog
    private running: boolean = false

    private constructor() {
    }

    public initialize():void {
        this.speedSubject = new Speed()
        this.speedSubject.subscribe(this)
        this.showWord()
        this.showSpeed()
        this.vehicle = [new Truck(this.speedSubject), new Car()]
        this.gameLoop()
    }

    public static getInstance():Game {
        if (!this.instance) {            
            this.instance = new Game()
        }
        return this.instance
    }

    public generateRandom():number{
        return Math.floor(Math.random()*(90-65+1)+65)
    }

    public randomWord():string{
        const wordArray = ["marechaussee","kmar","schiphol","drugs","paspoort","tobs","kazerne","veiligheid","nederland","grenscontrole","informatie","defensie","commandant","baret","controle","paresto","wapen","wapendag"]
        let randomWord = wordArray[Math.floor(Math.random() * wordArray.length)];
        return randomWord;
    }

    private showWord():void{
        let word = document.createElement("div")
        word.setAttribute("id","word")
        document.body.appendChild(word)
    }

    private showSpeed():void{
        this.extraSpeedElement = document.createElement("speed")
        this.extraSpeedElement.setAttribute("id","extraSpeed")
        document.body.appendChild(this.extraSpeedElement)
    }

    public setWord(word:string):void{
        const splitted = word.split('');
        let addToHTML = '';
        splitted.forEach(letter =>
            addToHTML += '<span>' + letter + '</span>');
        document.getElementById("word").innerHTML = addToHTML;
    }

    public winner(v:Vehicle):void{
        if (v instanceof Car){
            alert("You win :D\nDo you want to play again?")
        }
        else if (v instanceof Truck){
            // alert("You lost :(\nDo you want to try again?")
        }
        window.location.reload();
    }

    public startGame(){
        this.running = true;
    }
    
    private gameLoop():void{
        requestAnimationFrame(() => this.gameLoop())

        if (this.running) {
            for(let v of this.vehicle){
                v.update()
                v.checkCollision()
            }
            this.speedSubject.update()
        }
        else {
            if (!this.dialog) {
                this.dialog = Dialog.getInstance();
                this.dialog.setHTML(
                    '<h1>KMar F1 - Turbo</h1>' +
                    '<p>Jij bent verantwoordelijk voor de turbo. Probeer zo snel mogelijk de woorden in te typen die in het beeld verschijnen.</p>' +
                    '<p>Let op, door verkeerde aanslagen gaat je auto achteruit!</p>' +
                    '<p>Probeer van de oranje bus te winnen!</p>'
                  );
                this.dialog.addButton();
            }
        }
        
    }

    public notify(p:number):void{
        let speed = Math.floor(p*2)+90
        this.extraSpeedElement.innerHTML = speed.toString() + " km/u"
    }

} 

window.addEventListener("load", () => {
    const g = Game.getInstance()
    g.initialize()
});