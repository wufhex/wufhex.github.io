
export async function load(username) {
    const proxyUrl = `https://pinned.berrysauce.dev/get/${username}`;
    
    const cardsContainer = document.querySelector('.cards');
    if (!cardsContainer) {
        return;
    }

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Proxy status: ${response.status}`);
        
        const pinnedRepos = await response.json();

        for (const repo of pinnedRepos) {
            const repoName = repo.name;
            let markdownText = '';
            let usedBranch = 'main';

            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            
            cardElement.addEventListener('click', () => {
                const repoUrl = `https://github.com/${username}/${repoName}`;
                window.open(repoUrl, '_blank', 'noopener,noreferrer');
            });

            cardsContainer.appendChild(cardElement);

            try {
                const mainUrl = `https://raw.githubusercontent.com/${username}/${repoName}/main/README.md`;
                let readmeResponse = await fetch(mainUrl);
                
                if (!readmeResponse.ok) {
                    const masterUrl = `https://raw.githubusercontent.com/${username}/${repoName}/master/README.md`;
                    readmeResponse = await fetch(masterUrl);
                    usedBranch = 'master';
                }

                if (!readmeResponse.ok) throw new Error(`README missing on main/master branches.`);
                
                markdownText = await readmeResponse.text();

                const match = markdownText.match(/<div\s+align=["']center["']>([\s\S]*?)<\/div>/i);
                if (match && match[0]) {
                    let extractedHtml = match[0];

                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = extractedHtml;

                    const title = tempDiv.querySelectorAll('h1');
                    title.forEach(h1 => {
                        h1.style.display = '-webkit-box';
                        h1.style.webkitBoxOrient = 'vertical';
                        h1.style.webkitLineClamp = '4';
                        h1.style.overflow = 'hidden';
                    });

                    const images = tempDiv.querySelectorAll('img');
                    images.forEach(img => {
                        img.src = `https://raw.githubusercontent.com/${username}/${repoName}/${usedBranch}/${img.getAttribute('src')}`;
                    });

                    const paragraphs = tempDiv.querySelectorAll('p');
                    paragraphs.forEach(p => {
                        p.style.display = '-webkit-box';
                        p.style.webkitBoxOrient = 'vertical';
                        p.style.webkitLineClamp = '4';
                        p.style.overflow = 'hidden';
                    });

                    cardElement.appendChild(tempDiv);
                } else {
                    continue;
                }

            } catch (readmeError) {
                console.error(`Failed loading README content for ${repoName}:`, readmeError);
                continue
            }
        }

    } catch (error) {
        console.error('Error contacting proxy:', error);
    }
}
