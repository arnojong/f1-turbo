class Dialog {

    private static _instance:Dialog;
    private element:HTMLElement;
    private overlay:HTMLElement;
    private button:HTMLElement;
  
    private constructor() {
      this.overlay = document.createElement('div');
      this.overlay.classList.add('overlay');
      document.body.appendChild(this.overlay);
  
      this.element = document.createElement('div');
      this.element.classList.add('dialog');
      this.element.classList.add('dialog-start');
      document.body.appendChild(this.element);
    }
  
    /**
     * There can always only be one Dialog instance.
     * 
     * @returns {Dialog}
     */
    public static getInstance():Dialog {
      if (!this._instance) {
        this._instance = new Dialog();
      }
      return this._instance;
    }
  
    /**
     * Set a string of
     * 
     * @param {string} html 
     */
    public setHTML(html:string):void {
      this.element.innerHTML = html;
    }
  
    public addButton():void {
      this.button = document.createElement('button');
      this.button.innerText = 'START';
      this.button.onclick = () => { Dialog.getInstance().startGame() };
      this.element.appendChild(this.button);
    }
  
    public startGame():void {
      Game.getInstance().startGame();
      this.element.remove();
      this.overlay.remove();
    }
  
  }