import * as tf from '@tensorflow/tfjs';

export class WebCam{
    constructor(videoElem, eyeElem){
        this.videoElem = videoElem;
        this.eyeElem = eyeElem;
    }

    async start(){
        return new Promise((resolve, reject)=>{
            const nav = navigator;
            navigator.getUserMedia = navigator.getUserMedia ||
            nav.webkitGetUserMedia || nav.mozGetUserMedia ||
            nav.msGetUserMedia;
            if (navigator.getUserMedia) {
                navigator.getUserMedia(
                    { video: true },
                    video=>{
                        this.videoElem.srcObject = video;
                        return resolve();
                    },
                    err=>{
                        reject(err);
                    }
                )
            }else{
                reject();
            }
        });
    }

    async capture(){
        return tf.tidy(()=>{
            const eyesImage  = tf.fromPixels(this.eyeElem);
            console.log(eyesImage);
            const batchedImages = eyesImage.expandDims(0);

            // Normalize Image from -1 to 1
            return batchedImages.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
        })
    }
}
