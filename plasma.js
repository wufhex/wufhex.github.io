const plasmaCanvas = document.getElementById('plasma-canvas');
const plasmaCtx    = plasmaCanvas.getContext('2d');

let width          = plasmaCanvas.width  = 400;
let height         = plasmaCanvas.height = 400;

// From my old fun made malware, adapted to js canvas :P
class Plasma {
    constructor(canvasWidth, canvasHeight, paletteSize = 256, plasmaRenderSize = 128) {
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.lowWidth = plasmaRenderSize;
        this.lowHeight = plasmaRenderSize;
        this.paletteSize = paletteSize;
        this.paletteArr = [];
        this.generatePalette();

        // Low-res buffer and offscreen canvas
        this.imageData = new ImageData(this.lowWidth, this.lowHeight);
        this.offCanvas = document.createElement('canvas');
        this.offCanvas.width = this.lowWidth;
        this.offCanvas.height = this.lowHeight;
        this.offCtx = this.offCanvas.getContext('2d');
    }

    generatePalette() {
        this.paletteArr = [];
        for (let i = 0; i < this.paletteSize; i++) {
            const r = Math.sin(0.16 * i) * 127 + 128;
            const g = Math.sin(0.16 * i + 2) * 127 + 128;
            const b = Math.sin(0.16 * i + 4) * 127 + 128;
            this.paletteArr.push({ r: r | 0, g: g | 0, b: b | 0 });
        }
    }

    generatePlasma(time) {
        const buffer = this.imageData.data;

        for (let y = 0; y < this.lowHeight; y++) {
            for (let x = 0; x < this.lowWidth; x++) {
                const colorIndex = (
                    (128 + 128 * Math.sin(x / 16)) +
                    (128 + 128 * Math.sin(y / 8)) +
                    (128 + 128 * Math.sin((x + y) / 16)) +
                    (128 + 128 * Math.sin(Math.sqrt(x * x + y * y) / 8 + time / 10))
                ) / 4;

                const color = this.paletteArr[colorIndex | 0 % this.paletteSize];
                const idx = (y * this.lowWidth + x) * 4;
                buffer[idx] = color.r;
                buffer[idx + 1] = color.g;
                buffer[idx + 2] = color.b;
                buffer[idx + 3] = 255;
            }
        }

        // Draw to offscreen canvas
        this.offCtx.putImageData(this.imageData, 0, 0);

        // Scale smoothly to main canvas
        plasmaCtx.clearRect(0, 0, this.width, this.height);
        plasmaCtx.drawImage(
            this.offCanvas,
            0, 0, this.lowWidth, this.lowHeight, // source
            0, 0, this.width, this.height        // destination
        );
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }
}

const plasma    = new Plasma(width, height);
let   startTime = Date.now();

function animatePlasma() {
    const time = (Date.now() - startTime) / 100;
    plasma.generatePlasma(time);
    requestAnimationFrame(animatePlasma);
}