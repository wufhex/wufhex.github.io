
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vsSource, fsSource) {
    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

async function fetchShaderSource(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load shader file: ${url}`);
    }
    return await response.text();
}

export async function init() {
    const canvas = document.getElementById('bg');
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error("WebGL2 unsupported.");
        return;
    }

    let vertexShaderSource, updateShaderSource, displayShaderSource;
    try {
        vertexShaderSource = await fetchShaderSource('js/fluidbg/shaders/vs.glsl');
        updateShaderSource = await fetchShaderSource('js/fluidbg/shaders/update.glsl');
        displayShaderSource = await fetchShaderSource('js/fluidbg/shaders/display.glsl');
    } catch (error) {
        console.error("Error loading shader files:", error);
        return;
    }

    const SIM_RES = 512;
    const updateProgram = createProgram(gl, vertexShaderSource, updateShaderSource);
    const displayProgram = createProgram(gl, vertexShaderSource, displayShaderSource);

    const positionAttributeLocation = gl.getAttribLocation(updateProgram, "position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,
    ]), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    function createFluidTexture() {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        
        const initialData = new Uint8Array(SIM_RES * SIM_RES * 4);
        for (let i = 0; i < initialData.length; i += 4) {
            initialData[i]     = 128; // X Velocity component
            initialData[i + 1] = 128; // Y Velocity component
            initialData[i + 2] = 0;   // Fluid density state mapping
            initialData[i + 3] = 255; // Alpha
        }
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIM_RES, SIM_RES, 0, gl.RGBA, gl.UNSIGNED_BYTE, initialData);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return tex;
    }

    function createFramebuffer(texture) {
        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        return fb;
    }

    let texA = createFluidTexture();
    let texB = createFluidTexture();
    let fbA = createFramebuffer(texA);
    let fbB = createFramebuffer(texB);

    // Mouse Interaction 

    let mouse = { x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5, dirX: 0.0, dirY: 0.0, moving: false };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX / window.innerWidth;
        mouse.y = 1.0 - (e.clientY / window.innerHeight);
        
        if (mouse.moving) {
            mouse.dirX = mouse.x - mouse.prevX;
            mouse.dirY = mouse.y - mouse.prevY;
        }
        
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
        mouse.moving = true;
    });

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // Update

    function step() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbB);
        gl.viewport(0, 0, SIM_RES, SIM_RES);
        gl.useProgram(updateProgram);

        gl.uniform1i(gl.getUniformLocation(updateProgram, "uState"), 0);
        gl.uniform2f(gl.getUniformLocation(updateProgram, "uMouse"), mouse.x, mouse.y);
        gl.uniform2f(gl.getUniformLocation(updateProgram, "uMouseDir"), mouse.dirX, mouse.dirY);
        gl.uniform1f(gl.getUniformLocation(updateProgram, "uRadius"), 0.025);
        gl.uniform2f(gl.getUniformLocation(updateProgram, "uTexelSize"), 1.0 / SIM_RES, 1.0 / SIM_RES);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texA);

        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(displayProgram);

        gl.uniform1i(gl.getUniformLocation(displayProgram, "uState"), 0);
        gl.uniform2f(gl.getUniformLocation(displayProgram, "uTexelSize"), 1.0 / SIM_RES, 1.0 / SIM_RES);

        gl.bindTexture(gl.TEXTURE_2D, texB);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        let tempTex = texA; texA = texB; texB = tempTex;
        let tempFb = fbA; fbA = fbB; fbB = tempFb;

        mouse.dirX *= 0.85;
        mouse.dirY *= 0.85;

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}
