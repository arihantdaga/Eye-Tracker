import $  from "jquery";

export class UI{
    constructor(){
        this.currentPos = null;
        this.height = window.innerheight;
        this.width = window.innerWidth;
        this.popupPoint = $("popup-point");
    }

    hidePoint(){
        this.popupPoint.addClass("hidden");
    }
    showPoint(){
        const top = Math.random() * this.height;
        const left = Math.random()* this.width;
        
        this.popupPoint.offset({top,left})
        this.popupPoint.removeClass("hidden");
    }
    getCurrentPosition(){
        return this.currentPos;
    }
}