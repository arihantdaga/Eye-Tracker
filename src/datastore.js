import * as tf from "@tensorflow/tfjs";

export class DataStore{
    constructor(imageSize){
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
        this.imageSize = imageSize;

        this.model = this.createModel();

    }
    async addExample(image, coords){
        const labels = tf.tensor1d([coords[0], coords[1]]).expandDims(0);

        // Randomly add 20% to the validation set and 80% to the training set
        const set = Math.random() > 0.2 ? this.trainingSet : this.validattionSet;
        if(!set.images){
            set.images = tf.keep(image);
            set.labels = tf.keep(labels);
        }else{
            const prevImages = set.images;
            const prevLabels = set.labels;
            set.images = tf.keep(prevImages.concat(image, 0));
            set.labels = tf.keep(prevLabels.concat(labels, 0));
        }
        set.n++;
        // console.log(set.images.dataSync());
        // console.log(set.labels);
        // console.log(set.n);
    }

    createModel(){

        const model = tf.sequential();
        
        model.add(tf.layers.conv2d({
            kernelSize: 5,
            filters: 20,
            strides: 1,
            activation: 'relu',
            inputShape: [this.imageSize.height, this.imageSize.width, 3],
        }));
        
        model.add(tf.layers.maxPooling2d({
            poolSize: [2, 2],
            strides: [2, 2],
        }));
        
        model.add(tf.layers.flatten());
        
        model.add(tf.layers.dropout(0.2));
        
        // Two output values x and y
        model.add(tf.layers.dense({
            units: 2,
            activation: 'tanh',
        }));
        
        // Use ADAM optimizer with learning rate of 0.0005 and MSE loss
        model.compile({
            optimizer: tf.train.adam(0.0005),
            loss: 'meanSquaredError',
        });
        return model;
    }

    fitModel(){
        let batchSize = Math.floor(this.trainingSet.n * 0.1);
        console.log("Batch Size : ", batchSize);
        if (batchSize < 4) {
            batchSize = 4;
        } else if (batchSize > 64) {
            batchSize = 64;
        }
        if(!this.model){
            this.model = this.createModel(this.imageSize);
        }
        
        this.model.fit(this.trainingSet.images, this.trainingSet.labels, {
            batchSize: batchSize,
            epochs: 20,
            shuffle: true,
            validationData: [this.validattionSet.images, this.validattionSet.labels],
            callbacks: {
                onBatchEnd: async (batch, logs) => {
                //   ui.trainStatus('Loss: ' + logs.loss.toFixed(5));
                console.log("Training Loss: ", logs.loss.toFixed(5));
                }
              }
        })
    }

    predictMouse(image){
        // console.log(image);
        return this.model.predict(image);
    }
}