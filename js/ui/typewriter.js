
function startTyping() {
    const elements = document.querySelectorAll(".typing");
    elements.forEach((el, index) => {
        const text = el.textContent;
        el.textContent = "";

        let i = 0;

        setTimeout(() => {
            const interval = setInterval(() => {
                el.textContent += text.charAt(i);
                i++;

                if (i >= text.length) {
                    clearInterval(interval);
                }
            }, 40);
        }, index * 500);
    });
}

export async function init() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startTyping);
    } else {
        startTyping();
    }
}
