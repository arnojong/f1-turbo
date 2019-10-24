class Vehicle {
    public element: HTMLElement
    public posx:number
    public posy:number
    private counter:number = 0
    public speed:number = 0
    protected game:Game
    protected check:number
    protected word:string
    public last:number
    public behavior:Behavior

    constructor() {
        this.game = Game.getInstance()
        this.posx = 100
    }

    public bounce(x:number):void{
        if (this.counter === 15){
            this.posy += 5*x
            this.counter++
        } else if (this.counter === 30){
            this.posy -= 5*x
            this.counter = 0
        } else {
            this.counter++
        }
    }

    public checkCollision():void{
        if(this.posx > window.innerWidth - this.element.clientWidth) {
            this.game.winner(this)
        }
    }

    public update():void{
        this.bounce(2)
    }
}