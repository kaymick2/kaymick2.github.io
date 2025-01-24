document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
});

function loadNavbar() {
    const navbarContainer = document.querySelector('include-html[src="components/navbar.html"]');
    if (navbarContainer) {
        fetch(navbarContainer.getAttribute('src'))
            .then(response => response.text())
            .then(data => {
                navbarContainer.innerHTML = data;
            })
            .catch(error => console.error('Error loading navbar:', error));
    }
}