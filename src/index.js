import { WebCam } from "./webcam";
import { FaceTracker } from "./factracker";
import { DataStore } from "./datastore";
import { UI } from "./ui";
import EventEmitter  from "wolfy87-eventemitter";
import * as tf from "@tensorflow/tfjs";

// const EventEmitter = require("EventEmitter");
console.log(EventEmitter);


export class EyeTracker{
    constructor(){
        const videoElem = document.getElementById("videoElem");
        const FaceDrawCanvas = document.getElementById('faceDrawCanvas');
        const eyeElem = document.getElementById("eyesArea");

        
        this.ee = new EventEmitter();
        console.log(this.ee);
        this.webcam = new WebCam(videoElem, eyeElem);
        this.faceTracker = new FaceTracker(videoElem, FaceDrawCanvas, eyeElem);
        const imageSize = {width:eyeElem.width , height:eyeElem.height };
        this.dataStore = new DataStore(imageSize);
        this.UI = new UI(this.ee);
        // this.pointer = {
        //     x: 0,
        //     y: 0
        // }
        // this.windowWidth = window.innerWidth;
        // this.windowHeight = window.innerHeight;

    }

    async  capture(){
        return this.webcam.capture();    
    }

    async  start(){
        console.log("Hello Bro");
        
        try{
            await this.webcam.start();
            this.faceTracker.start();

        }catch(err){
            console.log("Could not access webcam");
            console.error(err);
        }

        document.getElementById("captureButton").addEventListener("click", ()=>{
            /* this.capture().then(data=>{
                this.dataStore.addExample(data);
            }) */
            this.startTraining();
        });
        document.getElementById("startTrainButton").addEventListener("click", ()=>{
            /* this.capture().then(data=>{
                this.dataStore.addExample(data);
            }) */
            // this.startTraining();
            this.startPointBounce();
        });
        document.getElementById("stopTrainButton").addEventListener("click", ()=>{
            /* this.capture().then(data=>{
                this.dataStore.addExample(data);
            }) */
            // this.startTraining();
            this.stopPointBounce();

        });
        document.getElementById("fitModelButton").addEventListener("click",()=>{
            this.dataStore.fitModel();
        });

        document.getElementById("predictButton").addEventListener("click", ()=>{
            this.isPredicting = true;
            this.startTracking();
        });

        
        this.ee.addListener("HidingDot", async (data)=>{
            // console.log("i am event");
            // console.log(data);
            const top = (data.pointer.top / window.innerHeight)*2 - 1;
            const left = (data.pointer.left / window.innerWidth)*2 - 1;
            const image = await this.capture();
            this.dataStore.addExample(image, [top,left]);
        })
        
        
    }
    getNewRandomPos(){
        
            
    }
    async startTracking(){
        while(this.isPredicting){
            // return tf.tidy(async ()=>{
                const image = await this.webcam.capture();
                //   console.log(image);
                  const points = this.dataStore.predictMouse(image);
                  console.log(points);
                  let coords = [points.get(0,0), points.get(0,1)];
                  console.log(coords);
                  coords[0] = ((coords[0] + 1)/2)* window.innerHeight;
                  coords[1] = ((coords[1] + 1)/2)* window.innerWidth;
                  await this.UI.animatePointer(coords);
                  await tf.nextFrame();
        // })   
        }
    }
    
    stopTracking(){
        this.isPredicting = false;
    }
    async startTraining(){
         
    }

    async startPointBounce(){
        this.UI.startPointBounce();
    }

    async stopPointBounce(){
        this.UI.stopPointBounce();
    }
}   

const eyeTracker = new EyeTracker();
eyeTracker.start();
