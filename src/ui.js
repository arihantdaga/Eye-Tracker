import $  from "jquery";
import { resolve } from "dns";

export class UI{
    constructor(ee){
        this.currentPos = null;
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.popupPoint = $("#popup-point");
        this.ee = ee;

    }
    

    hidePoint(){
        this.popupPoint.addClass("hidden");
    }
    getCurrentPointPos(){
        return this.pointer;
    }
    setRandomPoint(){
        this.pointer = {
            top: Math.floor(Math.random()*this.height),
            left: Math.floor(Math.random()*this.width)
        }
        // console.log(this.pointer);
        // this.showPoint(pointer);
    }
    showPoint(){
        // const top = Math.random() * this.height;
        // const left = Math.random()* this.width;
        
        console.log(this.pointer);

        // this.popupPoint.offset(this.pointer)
        this.popupPoint.css({
            top: this.pointer.top,
            left: this.pointer.left
        });
        this.popupPoint.removeClass("hidden");
    }
    getCurrentPosition(){
        return this.currentPos;
    }

    async PointBounce(){
        this.setRandomPoint();
        this.showPoint();
        await this.delay(1500);
        this.ee.emitEvent("HidingDot", [{pointer: this.pointer}]);
        await this.delay(400);
        this.hidePoint();
        if(this.bounceOn){
            await this.PointBounce();
        }
    }
    stopPointBounce(){
        this.bounceOn = false;
    }
    async startPointBounce(){
        this.bounceOn = true;
        await this.PointBounce();
    }
    async delay(time){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                return resolve();
            }, time);
        })
    }

    async animatePointer(position){
        return new Promise((resolve,reject)=>{
            this.popupPoint.removeClass("hidden");
            
            this.popupPoint.animate({
                top: position[0],
                left: position[1]
            }, 100, function(){
                return resolve();
            })
        });
        
    }
}
