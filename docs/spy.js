function setupScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-side md-list-item');
    
    if (sections.length === 0 || navItems.length === 0) return;
    
    function updateActiveSection() {
        let current = '';
        const contentContainer = document.querySelector('.content-container');
        const scrollTop = contentContainer ? contentContainer.scrollTop : window.scrollY;
        const containerOffset = contentContainer ? contentContainer.offsetTop : 0;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - containerOffset - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        
        
        if (!current && scrollTop < 100 && sections.length > 0) {
            current = sections[0].getAttribute('id');
        }
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === `#${current}`) {
                item.setAttribute('selected', '');
            } else {
                item.removeAttribute('selected');
            }
        });
    }
    
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
        contentContainer.addEventListener('scroll', updateActiveSection);
        updateActiveSection(); 
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupScrollSpy);
} else {
    setupScrollSpy();
}