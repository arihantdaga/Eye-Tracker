import { WebCam } from "./webcam";
import { FaceTracker } from "./factracker";
import { DataStore } from "./datastore";
export class EyeTracker{
    constructor(){
        const videoElem = document.getElementById("videoElem");
        const FaceDrawCanvas = document.getElementById('faceDrawCanvas');
        const eyeElem = document.getElementById("eyesArea");

        this.webcam = new WebCam(videoElem, eyeElem);
        this.faceTracker = new FaceTracker(videoElem, FaceDrawCanvas, eyeElem);
        this.dataStore = new DataStore();

    }

    async  capture(){
        this.webcam.capture();    
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
        })
        
    }
    startTraining(){
        
    }
}

const eyeTracker = new EyeTracker();
eyeTracker.start();