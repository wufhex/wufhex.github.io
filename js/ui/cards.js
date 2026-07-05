
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

                    extractedHtml = extractedHtml.replace(
                        /src=["'](?!http)([^"']+)["']/g, 
                        `src="https://raw.githubusercontent.com/${username}/${repoName}/${usedBranch}/$1"`
                    );

                    cardElement.innerHTML = extractedHtml;
                } else {
                    return;
                }

            } catch (readmeError) {
                console.error(`Failed loading README content for ${repoName}:`, readmeError);
                return
            }
        }

    } catch (error) {
        console.error('Error contacting proxy:', error);
    }
}
