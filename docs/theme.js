import 'https://esm.run/@material/web/all.js';
import { argbFromHex, themeFromSourceColor, applyTheme } from 'material-color-utilities';
import { styles as typescaleStyles } from 'https://esm.run/@material/web/typography/md-typescale-styles.js';

document.adoptedStyleSheets.push(typescaleStyles.styleSheet);


const theme = themeFromSourceColor(argbFromHex('#3C6C9C'), [
    { name: 'custom-1', value: argbFromHex('#ff0000'), blend: true }
]);

const updateTheme = (isDark) => {
    applyTheme(theme, { target: document.body, dark: isDark });
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
updateTheme(mediaQuery.matches);
mediaQuery.addEventListener('change', e => updateTheme(e.matches));

window.toggleTheme = () => {
    const isDark = document.documentElement.style.colorScheme === 'dark';
    updateTheme(!isDark);
};

await customElements.whenDefined('md-list-item');

const navItems = document.querySelectorAll('.nav-side md-list-item');

navItems.forEach(item => {
    item.addEventListener('click', () => {

navItems.forEach(nav => nav.removeAttribute('selected'));

item.setAttribute('selected', '');
    });
});


const highlightCurrentHash = () => {
    const currentHash = window.location.hash;
    if (currentHash) {
navItems.forEach(item => {
    if (item.getAttribute('href') === currentHash) {
        item.setAttribute('selected', '');
    }
});
    }
};

window.addEventListener('hashchange', highlightCurrentHash);
highlightCurrentHash();
