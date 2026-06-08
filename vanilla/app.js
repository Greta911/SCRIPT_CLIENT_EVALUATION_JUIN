// Initialisation et récupération sécurisée des données
const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
const appElement = document.querySelector('#app');

// Liste, compteur et recherche
const contactsContainer = appElement.querySelector(".contacts-table tbody");
const contactsCountElement = appElement.querySelector("#contacts-count");
const searchInput = appElement.querySelector("#input-search");

// Éléments des en-têtes du tableau pour le tri
const sortableHeaders = appElement.querySelectorAll(".contacts-table th[data-sort]");

// Éléments du formulaire d'ajout
const addFirstname = appElement.querySelector("#input-firstname");
const addLastname = appElement.querySelector("#input-lastname");
const addEmail = appElement.querySelector("#input-email");
const addForm = appElement.querySelector("#form-add-contact");

// Variables d'état pour le tri dynamique (Équivalent du State Alpine)
let sortBy = 'firstname';
let sortOrder = 'asc';

// -----------------------------------------------------------------------------
// LA FONCTION CENTRALE : Génération du résultat visuel (Filtre + Tri + Render)
// -----------------------------------------------------------------------------
function renderList() {
    // Copie non-destructive pour le traitement
    let processedContacts = [...contacts];

    // Filtrage dynamique (Recherche)
    const searchWords = searchInput.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (searchWords.length > 0) {
        processedContacts = processedContacts.filter(contact => {
            const firstname = contact.firstname || '';
            const lastname = contact.lastname || '';
            const email = contact.email || '';
            const fullText = `${firstname} ${lastname} ${email}`.toLowerCase();
            return searchWords.every(word => fullText.includes(word));
        });
    }

    // Tri dynamique en une seule passe (Gestion du niveau +1 pour undefined)
    processedContacts.sort((contactA, contactB) => {
        const valA = contactA[sortBy] ? String(contactA[sortBy]) : '';
        const valB = contactB[sortBy] ? String(contactB[sortBy]) : '';

        return sortOrder === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
    });

    // Nettoyage et injection dans le DOM
    contactsContainer.innerHTML = ''; // On vide le tableau précédent
    
    processedContacts.forEach(contact => {
        const row = document.createElement('tr');
        row.dataset.id = contact.id;
        row.className = `contact-row ${contact.isEditing ? 'isEditing' : ''}`;
        
        row.innerHTML = `
            <td class="p-4">
                <span class="isEditing-hidden">${contact.firstname || ''}</span>
                <input type="text" class="input-firstname isEditing-visible w-full mt-1 block px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" value="${contact.firstname || ''}" />
            </td>
            <td class="p-4">
                <span class="isEditing-hidden">${contact.lastname || ''}</span>
                <input type="text" class="input-lastname isEditing-visible w-full mt-1 block px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" value="${contact.lastname || ''}" />
            </td>
            <td class="p-4">
                <span class="isEditing-hidden">${contact.email || ''}</span>
                <input type="text" class="input-email isEditing-visible w-full mt-1 block px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" value="${contact.email || ''}" />
            </td>
            <td class="p-4">
                <div class="flex justify-end space-x-2">
                    <button class="btn-edit isEditing-hidden bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-md">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-delete isEditing-hidden bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button class="btn-check isEditing-visible bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">
                        <i class="fa-solid fa-check"></i>
                    </button>
                </div>
            </td>
        `;
        contactsContainer.append(row);
    });

    // Mise à jour du compteur (basé sur le tableau global initial)
    contactsCountElement.innerText = contacts.length;
}

// Fonction utilitaire de sauvegarde
function updateLocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Fonction de basculement/interrupteur du tri
function toggleSort(column) {
    if (sortBy === column) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortBy = column;
        sortOrder = 'asc';
    }
    renderList(); // On redessine avec le nouveau tri
}

// -----------------------------------------------------------------------------
// CAPTURE DES ÉVÉNEMENTS
// -----------------------------------------------------------------------------

// Gestion du tri au clic sur les en-têtes (Nécessite d'ajouter data-sort dans le HTML)
sortableHeaders.forEach(header => {
    header.addEventListener('click', () => {
        toggleSort(header.dataset.sort);
    });
});

// Barre de recherche en temps réel
searchInput.addEventListener('input', renderList);

// Ajout d'un contact
addForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!addFirstname.value.trim() || !addLastname.value.trim() || !addEmail.value.trim()) return;
    
    const newContact = {
        id: Date.now(),
        firstname: addFirstname.value,
        lastname: addLastname.value,
        email: addEmail.value,
        isEditing: false
    };
    
    contacts.push(newContact);
    updateLocalStorage();
    
    // Reset du formulaire
    addFirstname.value = "";
    addLastname.value = "";
    addEmail.value = "";

    renderList();
});

// ÉCOUTEUR UNIQUE (Centralisé par délégation) pour Edit, Delete et Check
contactsContainer.addEventListener('click', function(e) {
    const contactElement = e.target.closest('tr');
    if (!contactElement) return;
    
    const contactId = Number(contactElement.dataset.id);
    const contactFound = contacts.find(c => c.id === contactId);
    if (!contactFound) return;

    // ACTION : MODIFIER
    if (e.target.closest('.btn-edit')) {
        contactFound.isEditing = true;
        renderList();
    }
    
    // ACTION : SUPPRIMER
    else if (e.target.closest('.btn-delete')) {
        const itemIndex = contacts.findIndex(c => c.id === contactId);
        contacts.splice(itemIndex, 1);
        updateLocalStorage();
        renderList();
    }
    
    // ACTION : VALIDER (CHECK)
    else if (e.target.closest('.btn-check')) {
        contactFound.firstname = contactElement.querySelector('.input-firstname').value;
        contactFound.lastname = contactElement.querySelector('.input-lastname').value;
        contactFound.email = contactElement.querySelector('.input-email').value;
        contactFound.isEditing = false;

        updateLocalStorage();
        renderList();
    }
});

// Initialisation au premier chargement de la page
renderList();

