//Afficher le contenu du localStorage

function contactApp() {
    return {
        contacts: JSON.parse(localStorage.contacts) || [],
    };
}