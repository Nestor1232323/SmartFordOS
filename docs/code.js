    await Promise.all([
        customElements.whenDefined('md-icon-button'),
        customElements.whenDefined('md-icon')
    ]);

    const highlightSmapp = (text) => {
        
        let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        return html
            
            
            .replace(/^(#.*)$/gm, '<span class="syntax-comment">$1</span>')
            
            
            .replace(/^(\[.*\])$/gm, '<span class="syntax-section">$1</span>')
            
            
            
            .replace(/^([\w.]+)\s*=(.*)$/gm, (match, key, value) => {
                return `<span class="syntax-key">${key}</span>=<span class="syntax-value">${value}</span>`;
            });
    };

    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        const rawText = block.textContent.trim();
        
        
        block.innerHTML = highlightSmapp(rawText);

        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);

        const copyBtn = document.createElement('md-icon-button');
        copyBtn.className = 'copy-button';
        const icon = document.createElement('md-icon');
        icon.classList.add('material-symbols-rounded');
        icon.textContent = 'content_copy';
        copyBtn.appendChild(icon);
        
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(rawText);
                icon.textContent = 'done';
                icon.style.fontVariationSettings = "'FILL' 1";
                setTimeout(() => {
                    icon.textContent = 'content_copy';
                    icon.style.fontVariationSettings = "'FILL' 0";
                }, 2000);
            } catch (err) { console.error(err); }
        });

        wrapper.appendChild(copyBtn);
        
    });