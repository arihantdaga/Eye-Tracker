import * as tf from "@tensorflow/tfjs";

export class DataStore{
    constructor(){
        this.trainingSet = {
            n : 0,
            images : null,
            labels : null
        };
        this.validattionSet = {
            n : 0,
            images : null,
            labels : null
        };
    }
    async addExample(image, labels){
        // Randomly add 20% to the validation set and 80% to the training set
        const set = Math.random() > 0.2 ? this.trainingSet : this.validattionSet;
        if(!set.image){
            set.images = tf.keep(image);
            set.labels = tf.keep(labels);
        }else{
            const prevImages = set.images;
            const prevLabels = set.labels;
            set.images = tf.keep(prevImages.concat(image, 0));
            set.labels = tf.keep(prevLabels.concat(labels, 0));
        }
        set.n++;
        
    }
}