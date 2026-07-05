
export async function load() {
    try {
        const res = await fetch('/data/links.json');
        const links = await res.json();

        const container = document.querySelector('.anchor-list');
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.name;
            a.target = "_blank";
            a.rel = "noopener noreferrer";

            container.appendChild(a);
        });
    } catch (err) {
        console.error('Failed to load links:', err);
    }
}
