import {getCurvePoints} from "./curve";
import {ColorScheme} from "./color";

export const sol16 = (p5) => {
    let w = p5.width;
    let h = p5.height;
    let w2 = w / 2;
    let h2 = h / 2;

    let nx = 30;
    let ny = 30;
    let resolutionX = (w2 / nx);
    let resolutionY = (h2 / ny);

    p5.stroke(0)
    let o = [[0, 0], [1, 0], [0, 1], [1, 1]]
    let diag = [[1, -1], [1, 1], [-1, -1], [1, -1]]
    for (let i = 0; i < o.length; i++) {
        const ox = w2 * o[i][0]
        const oy = h2 * o[i][1]
        for (let x = 0; x < nx; x++) {
            p5.line(ox + x * resolutionX, oy, ox + x * resolutionX, oy + h2)
        }
        for (let y = 0; y < ny; y++) {
            p5.line(ox, oy + y * resolutionY, ox + w2, oy + y * resolutionY)
        }

        const end = Math.max(p5.width, p5.height)
        for (let x = 0; x < nx - 1; x++) {
            const sx = ox + x * resolutionX
            const sy = oy + h2
            const slope = diag[i][1] / diag[i][0]
            // y − y1 = m(x − x1)
            // m(x-x1)+y1
            //y= m(x-sx)+sy
            // let ey = slope* (s)
            const ex = p5.constrain(diag[i][0] * end, ox, ox + w2)
            const ey = p5.constrain(diag[i][1] * end, oy, oy + h2)
            p5.line(sx, sy, ex, ey)
        }


    }

}


export const sol852 = (p5, colorScheme) => {


    const colors = [colorScheme.primary(), colorScheme.secondary(), colorScheme.tertiary(),colorScheme.trinary()]
    let o = [[0, 0], [1, 0], [0, 1], [1, 1]]

    let orientations = [
        [[-1,1],[1,1],[1,1],[-1,1]], // diamond
        [[1,1],[-1,1],[-1,1],[1,1]], // cross
        [[1,1],[1,1],[1,1],[1,1]], // even
        [[1,1],[-1,1],[-1,1],[1,1]], // X

    ]
    let scaleOffset=orientations[Math.floor(p5.random(0,orientations.length-1))]

    let w2 = p5.width / 2;
    let h2 = p5.height / 2;
    for (let i = 0; i < o.length; i++) {
        const cs = new ColorScheme(p5)
        const ox = w2 * o[i][0]
        const oy = h2 * o[i][1]

        const gr = p5.createGraphics(p5.width / 2, p5.height / 2)
        gr.background(cs.primary())
        let points = []
        points.push(0, 0)
        const num = p5.random(2, 8)
        const vecNorm = p5.createVector(gr.width, gr.height).normalize()
        const hyp = Math.sqrt(Math.pow(gr.width, 2) + Math.pow(gr.height, 2))
        let last = p5.createVector(0, 0)
        for (let j = 0; j < num; j++) {
            const fj = j / num;
            const next = vecNorm.copy().mult(fj * hyp)
            const stepx=(p5.random()*.75+.25) * hyp * (1 / num )
            const stepy=(p5.random()*.75+.25) * hyp * (1 / num )
            points.push(last.x + stepx)
            points.push(last.y + stepy)
            last = next
        }
        points.push(gr.width, gr.height)


        points = Array.from(getCurvePoints(points, .9))

        points.push(gr.width, 0)
        points.push(0, 0)

        gr.beginShape()
        gr.noStroke()
        gr.fill(cs.tertiary())

        for (let j = 2; j < points.length; j += 2) {
            const x = points[j]
            const y = points[j + 1]
            gr.vertex(x, y)
        }
        gr.endShape()

        gr.stroke(0)
        gr.strokeWeight(p5.width*0.0625)
        gr.line(0, 0, gr.width, 0)
        gr.line(0, 0, 0, gr.height)
        gr.line(gr.width, 0, gr.width, gr.height)
        gr.line(0, gr.height, gr.width, gr.height)


        p5.push()

        p5.translate(ox,oy)
        p5.scale(scaleOffset[i][0],scaleOffset[i][1])
        let ix = Math.min(scaleOffset[i][0],0)*p5.width/2
        let iy = Math.min(scaleOffset[i][1],0)*p5.height/2
        p5.image(gr, ix,iy);//ox, oy)
        p5.pop()

    }


}
