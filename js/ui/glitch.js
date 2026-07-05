const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ░▒▓█"

function startMatrix() {
    const elements = document.querySelectorAll('.glitch-text');
    if (!elements.length) {
        return;
    }

    elements.forEach((el, index) => {
        const originalText = el.textContent;
        setTimeout(() => {
            setInterval(() => {
                const chars = originalText.split("");
                const randomCharIndex = Math.floor(Math.random() * chars.length);
                const randomMtxIndex = Math.floor(Math.random() * MATRIX_CHARS.length);

                chars[randomCharIndex] = MATRIX_CHARS[randomMtxIndex];
                el.textContent = chars.join("");
            }, 128);
        }, index * 500);
    });
}

export async function run() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startMatrix);
    } else {
        startMatrix();
    }
}
