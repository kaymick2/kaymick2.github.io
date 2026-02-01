document.addEventListener('DOMContentLoaded', function() {
    loadIncludeHtml();
});

function loadIncludeHtml() {
    document.querySelectorAll('include-html[src]').forEach(function(el) {
        var src = el.getAttribute('src');
        if (!src) return;
        fetch(src)
            .then(function(response) {
                if (!response.ok) throw new Error(response.status + ' ' + response.statusText);
                return response.text();
            })
            .then(function(html) {
                el.innerHTML = html;
            })
            .catch(function(err) {
                console.error('Error loading ' + src + ':', err);
            });
    });
}