import clm from "./clmtrackr";
export class FaceTracker{
    constructor(videoSource, faceDisplayElem, eyeElem){
        this.videoSource = videoSource;
        this.faceDisplayElem = faceDisplayElem;
        this.eyeElem = eyeElem;
        this.faceDELC = this.faceDisplayElem.getContext('2d');
        this.eyesELC = this.eyeElem.getContext('2d');
        this.clm = clm;
    }
    async start(){
        this.ctracker = new clm.tracker();
        this.ctracker.init();
        this.ctracker.start(this.videoSource);
        console.log(this.ctracker);
        this.getFacePositions();
        
    }
    getFacePositions(){
        requestAnimationFrame(this.getFacePositions.bind(this));
        const positions = this.ctracker.getCurrentPosition();
        this.drawFace(positions);
    }
    drawFace(positions){
        this.faceDELC.clearRect(0, 0, this.faceDisplayElem.width, this.faceDisplayElem.height);
        if(positions){
            this.ctracker.draw(this.faceDisplayElem);
            this.drawEyes(positions);
        }
    }
    drawEyes(positions){
        const left = positions[23];
        const right = positions[28];
        const top = positions[24][1] > positions[29][1] ? positions[29] : positions[24];
        const bottom = positions[26][1] > positions[31][1] ? positions[26] : positions[31];

        const rectTopLeft = [left[0] - 5, top[1] - 5];
        const rectTopRight = [right[0] + 5, top[1] -5];
        const  rectBottomLeft = [left[0]- 5, bottom[1]+ 5];
        const rectBottomRight = [right[0] + 5, bottom[1] + 5];
        this.faceDELC.strokeStyle = 'blue';
        this.faceDELC.strokeRect(rectTopLeft[0],rectTopLeft[1],rectTopRight[0] -rectTopLeft[0], rectBottomLeft[1] - rectTopLeft[1]);
        
        const widthRatio = this.videoSource.videoWidth / this.videoSource.width;
        const heightRatio = this.videoSource.videoHeight / this.videoSource.height;

        this.eyesELC.drawImage(
            this.videoSource,
            rectTopLeft[0] * widthRatio, rectTopLeft[1] * heightRatio,
            (rectTopRight[0] -rectTopLeft[0]) * widthRatio, (rectBottomLeft[1] - rectTopLeft[1]) * heightRatio,
            0, 0, this.eyeElem.width, this.eyeElem.height
        );

    }
}
