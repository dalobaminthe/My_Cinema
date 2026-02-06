// CHANGEMENT D'ONGLETS

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;

        // tout cacher
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // désactiver tous les boutons
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // afficher le bon contenu
        document.getElementById(tabName).classList.add('active');

        // activer le bouton cliqué
        button.classList.add('active');
    });
});

// PAGE AVEC NOMBRE DE FILMS -- PAGINATION
