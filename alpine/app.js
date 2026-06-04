function contactApp() {
    return {
        contacts: JSON.parse(localStorage.getItem('contacts')) || [],
        search: '',
        sortBy: 'firstname',
        sortOrder: 'asc',
        newFirstname: '',
        newLastname: '',
        newEmail: '',

        init() {
            this.$watch('contacts', () => {
                localStorage.setItem('contacts', JSON.stringify(this.contacts));
            });
        },

        addContact() {
            if (!this.newFirstname || !this.newLastname || !this.newEmail) return;

            this.contacts.push({
                id: Date.now(),
                firstname: this.newFirstname,
                lastname: this.newLastname,
                email: this.newEmail,
                isEditing: false
            });

            this.newFirstname = '';
            this.newLastname = '';
            this.newEmail = '';
        },

        deleteContact(id) {
            this.contacts = this.contacts.filter(contact => contact.id !== id);
        },

        //UTILISATION D'UN GETTER (COMPUTED PROPERTY)
        //Permet d'écrire x-for="contact in visibleContacts" dans le HTML
        get visibleContacts() {
            //On crée tout de suite la copie non-destructive
            let processedContacts = [...this.contacts];

            //Filtrage (si une recherche est active)
            if (this.search.trim()) {
                const searchWords = this.search.toLowerCase().trim().split(/\s+/);
                processedContacts = processedContacts.filter(contact => {
                    const fullText = `${contact.firstname} ${contact.lastname} ${contact.email}`.toLowerCase();
                    return searchWords.every(word => fullText.includes(word));
                });
            }

            //Tri dynamique (A-Z)
            processedContacts.sort((a, b) => a[this.sortBy].localeCompare(b[this.sortBy]));

            //Inversion (si DESC)
            if (this.sortOrder === 'desc') {
                processedContacts.reverse();
            }

            // Un seul nom de variable cohérent du début à la fin de la transformation
            return processedContacts;
        },

        //NOMMAGE CLAIR INCLUANT LA NOTION DE TOGGLE
        toggleSort(column) {
            if (this.sortBy === column) {
                // On inverse (toggle) le sens si c'est la même colonne
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                // Nouvelle colonne : on trie en ascendant par défaut
                this.sortBy = column;
                this.sortOrder = 'asc';
            }
        }
    };
}