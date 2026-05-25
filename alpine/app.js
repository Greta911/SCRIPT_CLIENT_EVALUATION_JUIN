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
    }

    };
}