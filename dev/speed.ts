class Speed implements Subject{

    observers:Observer[] = []

    private speed:number = 0

    constructor(){
    }

    public subscribe(c:Observer):void{
        this.observers.push(c)
    }

    public update():void{
        this.speed += 0.0005
        for(let c of this.observers){
            c.notify(this.speed)
        }
    }
}