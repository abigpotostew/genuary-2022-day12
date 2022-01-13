import p5 from 'p5';
import P5 from 'p5';
import {PRNGRand} from "./random";
import {ColorScheme} from "./color";
import {sol852} from "./sol-lewitt";


let chunks = []
var recorder;
const pixelDens = 1;
const sketch = p5 => {

    let colorScheme;
    let colorsArrayMap = new Map()
    let acceleration = 0;
    let velocity = 0
    let globalLineWidth = 30;

    let radius = 0.5;
    let colorFlipAllowed = false;

    const frate = 30 // frame rate
    const numFrames = 100 // num of frames to record
    let recording = false


    p5.setup = () => {
        const canv = p5.createCanvas(800, 800,p5.WEBGL);
        canv.parent('sketch')
        p5.pixelDensity(pixelDens)
        p5.colorMode(p5.HSB)
        p5.sb = new PRNGRand(new Date().getMilliseconds())
        colorScheme = new ColorScheme(p5)
    }

    p5.mouseReleased = () => {
        p5.loop()
    }

    p5.keyPressed = () => {
        if (p5.key === 'r') {
            recording = !recording
            if (recording) {
                record()
            } else {
                exportVideo()
            }
        }

        if(p5.key==='s'){
            p5.saveCanvas('sketch-d6', 'png')
        }
    }

    const colliding =(position,r,points)=>{
        if(position.x+r > p5.width || position.x-r < 0 || position.y+r > p5.height || position.y-r < 0){
            return true
        }
        for (let point of points) {
            const mg= P5.Vector.sub(point.position,position).mag();
            if(mg< r+point.radius){
                return true
            }
        }
        return false;
    }

    p5.draw = () => {
        p5.sb = new PRNGRand(new Date().getMilliseconds())
        colorScheme = new ColorScheme(p5)

        p5.push()
        p5.translate(-p5.width/2,-p5.height/2,0);
        p5.background(0)

        const N=1000;
        const points = [];
        const minSize=2;
        const maxSize = p5.width/5;
        let lastPoint = {position:p5.createVector(p5.width/2,p5.height/2), radius:0}
        for(let i=0;i<N;++i){
            let size = p5.sb.randomInt(minSize,maxSize)
            do {
                let found  = false;
                let aOffset = p5.sb.randomInt(0,360)
                for(let a=0;a<360;a++){

                    const radian = p5.radians((a+aOffset)%360);
                    const x = lastPoint.position.x + p5.cos(radian)*(size+lastPoint.radius)
                    const y = lastPoint.position.x + p5.sin(radian)*(size+lastPoint.radius);
                    const position = p5.createVector(x,y)
                    if(!colliding(position,size,points)){
                        const item ={position:p5.createVector(x,y),radius:size};
                        points.push(item)
                        found = true;
                        break;
                    }
                }
                if(found){
                    break;
                }
                size= Math.floor(size*.5);
            }while(size>minSize)
            lastPoint = points[p5.sb.randomInt(0,points.length)]
        }

        p5.noStroke();
        const numLights = p5.sb.randomInt(1,2)
        p5.ambientLight(colorScheme.primary({brightness:.1}));
        p5.directionalLight(colorScheme.secondary(), p5.sb.randomReal(), p5.sb.randomReal(), p5.sb.randomReal());
        p5.directionalLight(colorScheme.secondary({brightness:.5}), p5.sb.randomReal(), p5.sb.randomReal(), p5.sb.randomReal());
        for (let i = 0; i < numLights; i++) {
            const pointLight = p5.createVector( p5.sb.randomInt(p5.width),p5.sb.randomInt(p5.height),p5.sb.randomInt(-p5.height,-p5.height*.25))
            p5.pointLight(colorScheme.continuousStepped(i+2), pointLight.x,pointLight.y,pointLight.z);
        }

        for (let point of points) {
            p5.push()
            p5.translate(point.position.x, point.position.y, -100)
            p5.sphere(point.radius )
            p5.pop()
        }
        console.log(points.length)


        p5.noLoop()
        p5.pop()
    }
    // var recorder=null;
    const record = () => {
        chunks.length = 0;
        let stream = document.querySelector('canvas').captureStream(30)
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            if (e.data.size) {
                chunks.push(e.data);
            }
        };
        recorder.start();

    }

    const exportVideo = (e) => {
        recorder.stop();

        setTimeout(() => {
            var blob = new Blob(chunks);
            var vid = document.createElement('video');
            vid.id = 'recorded'
            vid.controls = true;
            vid.src = URL.createObjectURL(blob);
            document.body.appendChild(vid);
            vid.play();
        }, 1000)
    }
}


new p5(sketch);
