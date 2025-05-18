//const coll = document.querySelector('.collapsible');
//const content = document.querySelector('.content');
//
//coll.addEventListener('click', () => {
//    content.style.display = content.style.display === 'block' ? 'none' : 'block';
//});
const buttons = document.querySelectorAll('.collapsible');
buttons.forEach(button => {
    button.addEventListener('click', function () {
      const content = this.nextElementSibling;
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
});
// Trinket
(function () {
    const STORAGE_PREFIX = 'trinketCode';
    const PAGE_KEY = window.location.pathname; // page-specific key
    const iframes = document.querySelectorAll('iframe.trinket-embed');

    // Load and initialize each trinket iframe
    iframes.forEach((iframe) => {
        const trinketId = iframe.dataset.trinketId;
        if (!trinketId) return;

        const storageKey = `${STORAGE_PREFIX}:${PAGE_KEY}:${trinketId}`;
        console.log("iframe:storageKey", storageKey);
        let code = '';

        // Load code from localStorage
        const savedCodeJSON = localStorage.getItem(storageKey);
        if (savedCodeJSON) {
            try {
                console.log("iframe:savedCodeJSON", savedCodeJSON);
                const parsed = JSON.parse(savedCodeJSON);
                console.log("iframe:parsed", parsed);
                if (Array.isArray(parsed) && parsed[0]?.content) {
                    code = parsed[0].content;
                }
            } catch (e) {
                console.warn(`Could not parse saved code for ${trinketId}`, e);
            }
        }
        console.log("iframe:code", code);
        // Set iframe src with preloaded code and listen=true
        const baseSrc = 'https://trinket.io/embed/pygame?listen=true';
        iframe.src = `${baseSrc}#code=${encodeURIComponent(code)}`;
    });

    // Global listener for incoming code updates
    window.addEventListener('message', function (event) {
        console.log("data", event);
        if (!event.data || !event.data.code) return;

        // Find matching iframe (based on origin and src)
        const matchingIframe = Array.from(iframes).find((iframe) => {
            try {
                const iframeWindow = iframe.contentWindow;
                return event.source === iframeWindow;
            } catch {
                return false;
            }
        });

        if (!matchingIframe) return;

        const trinketId = matchingIframe.dataset.trinketId;
        console.log("trinketId", trinketId);
        if (!trinketId) return;

        const storageKey = `${STORAGE_PREFIX}:${PAGE_KEY}:${trinketId}`;
        console.log("storageKey", storageKey, event.data.code);
        localStorage.setItem(storageKey, event.data.code);
    });
})();