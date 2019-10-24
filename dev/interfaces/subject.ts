interface Subject {
    observers:Observer[]
    subscribe(c: Observer):void
    update():void
}