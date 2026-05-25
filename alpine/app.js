//Afficher le contenu du localStorage

function contactApp() {
    return {
        contacts: JSON.parse(localStorage.getItem('contacts')) || [],
    search: '',

    //Champs pour le formulaire d'ajout
    newFirstname: '',
    newLastname: '',
    newEmail: '',

    //Ajout d'un contact
    addContact() {
        if (this.newFirstname.trim() === '' || this.newLastname.trim() === '' || this.newEmail.trim() === '') return;
        this.contacts.push({
            id: Date.now(),
            firstname: this.newFirstname,
            lastname: this.newLastname,
            email: this.newEmail,
            isEditing: false
        });

        //Réinitialiser les champs du formulaire
        this.newFirstname = '';
        this.newLastname = '';
        this.newEmail = '';

        //Sauvegarde dans le localStorage
        this.saveToStorage();
    },
    saveToStorage() {
        localStorage.contacts = JSON.stringify(this.contacts);
    },

    //Suppression d'un contact
    deleteContact(id) {
        this.contacts = this.contacts.filter(item => item.id !== id);
        this.saveToStorage();
    },

    //Filtrer le contacts pour la barre de recherche
    filteredContacts() {
        if (!this.search.trim()) return this.contacts;
        const searchElt = this.search.toLowerCase().trim().split(/\s+/);
        return this.contacts.filter(item => {
            const fullText = `${item.firstname} ${item.lastname} ${item.email}`.toLowerCase();
            return searchElt.every(word => fullText.includes(word));
            });
        }

    };
}