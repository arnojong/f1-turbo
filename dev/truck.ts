///<reference path='vehicle.ts' />

class Truck extends Vehicle implements Observer{

    private speedSubject:Subject

    constructor(s:Subject) {
        super()

        this.speedSubject = s
        this.speedSubject.subscribe(this)
        this.element = document.createElement("truck")
        let foreground = document.getElementsByTagName("foreground")[0]
        foreground.appendChild(this.element)
        this.posy = 500
    }

    public notify(p:number):void{
        this.posx+=p
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px)`
    }
    
}