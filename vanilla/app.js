//Initialisation du localStorage

/*localStorage.contacts= JSON.stringify([
    {firstname: "Alex", lastname: "Doe", email: "alexdoe@mail.com", isEditing: false},
    {firstname: "Anita", lastname: "Smith", email: "anitasmith@mail.com", isEditing: true},
]);*/

const contacts = JSON.parse(localStorage.contacts) || [];
const appElement = document.querySelector('#app');

//Liste, compteur et recherche
const contactsContainer = appElement.querySelector(".contacts-table tbody");
const contactsCountElement = appElement.querySelector("#contacts-count");
const searchInput = appElement.querySelector("#input-search");

//Eléments du formulaire d'ajout
const addFirstname = appElement.querySelector("#input-firstname");
const addLastname = appElement.querySelector("#input-lastname");
const addEmail = appElement.querySelector("#input-email");
const btnAdd = appElement.querySelector("#btn-add");

// Ajout initial des items dans le DOM
contacts.forEach((item) => {
    appendNewItemInDOM(item);
});

//Function appendNewItemInDOM
function appendNewItemInDOM(item) {
    const newItem = document.createElement('tr');
    contactsContainer.append(newItem);

    newItem.outerHTML = 
    `
    <tr data-id="${item.id}" class="contact-row ${item.isEditing ? 'isEditing' : ''}">
      <td class="p-4">
        <span class="isEditing-hidden">${item.firstname}</span>
        <input
          type="text"
          class="input-firstname isEditing-visible w-full mt-1 block px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value="${item.firstname}"
        />
      </td>
      <td class="p-4">
        <span class="isEditing-hidden">${item.lastname}</span>
        <input
          type="text"
          class="input-lastname isEditing-visible w-full mt-1 block px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value="${item.lastname}"
        />
      </td>
      <td class="p-4">
        <span class="isEditing-hidden">${item.email}</span>
        <input
          type="text"
          class="input-email isEditing-visible w-full mt-1 block px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value="${item.email}"
        />
      </td>
      <td class="p-4">
        <div class="flex justify-end space-x-2">
          <button
            class="btn-edit isEditing-hidden bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-md"
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            class="btn-delete isEditing-hidden bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
          <button
            class="btn-check isEditing-visible bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
          >
            <i class="fa-solid fa-check"></i>
          </button>
        </div>
      </td>
    </tr>`;

    renderContactsCount();
}

//Function appendNewItemInARRAY
function appendNewItemInARRAY(item) {
    contacts.push(item);
    updateLocalStorage();
}

//Function pour mettre à jour le localStorage
function updateLocalStorage() {
    localStorage.contacts = JSON.stringify(contacts);
}

//Function pour afficher le nombre total de contacts
function renderContactsCount() {
    contactsCountElement.innerText = contacts.length;
}

//Capture des événements -------------------------------------------------------

//Ajout d'un contact au clic sur le bouton Add
btnAdd.addEventListener('click', function () {
    const newItem = {
        id: Date.now(),
        firstname: addFirstname.value,
        lastname: addLastname.value,
        email: addEmail.value,
        isEditing: false
    };

    appendNewItemInARRAY(newItem);
    appendNewItemInDOM(newItem);

    //Vider le formulaire
    addFirstname.value = "";
    addLastname.value = "";
    addEmail.value = "";
});

//Capture par délégation pour les actions modifier, valider et supprimer
contactsContainer.addEventListener('click', function(e) {
    //Récupère le tr du DOM
    const itemElt= e.target.closest('tr');
    //Recupère l'item du ARRAY
    const item = contacts.find(item => item.id === Number(itemElt.dataset.id));
    //MODIFIER
    if (e.target.matches('.btn-edit') || e.target.closest('.btn-edit')) {
        item.isEditing = true;
        itemElt.classList.add('isEditing');
        updateLocalStorage();
    }
    //SUPPRIMER
    if (e.target.matches('.btn-delete') || e.target.closest('.btn-delete')) {
        const itemIndex = contacts.findIndex(item => item.id === Number(itemElt.dataset.id));
        contacts.splice(itemIndex, 1);
        itemElt.remove();
        updateLocalStorage();
        renderContactsCount();
    }
});

//Enregistrer le modif lors du click sur le bouton Check
contactsContainer.addEventListener('click', function(e) {
    //VALIDER
    const itemElt = e.target.closest('tr');
    if (!itemElt) return;
    if (e.target.matches('.btn-check') || e.target.closest('.btn-check')) {
        const item = contacts.find(item => item.id === Number(itemElt.dataset.id));
        if (!item) {
            console.warn("Impossible de modifier : le contact n'existe pas dans le tableau.");
            return; 
        }
        const newFirstname = itemElt.querySelector('.input-firstname').value;
        const newLastname = itemElt.querySelector('.input-lastname').value;
        const newEmail = itemElt.querySelector('.input-email').value;

        //Mise à jour du ARRAY
        item.firstname= newFirstname;
        item.lastname= newLastname;
        item.email= newEmail;
        item.isEditing= false;

        //Mise à jour du DOM
        itemElt.querySelectorAll('.isEditing-hidden')[0].innerText = newFirstname;
        itemElt.querySelectorAll('.isEditing-hidden')[1].innerText = newLastname;
        itemElt.querySelectorAll('.isEditing-hidden')[2].innerText = newEmail;

        //Sortie du mode edition
        itemElt.classList.remove('isEditing');

        updateLocalStorage();
    }
});

//BARRE DE RECHERCHE (BONUS)
searchInput.addEventListener('input', function() {
    //Nettoyage du texte et découpage en plusieurs mots separés pau un espace
    //Filter boolean permet d'éviter les bugs si l'user met plusieurs espaces
    const filterText = this.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const rows = contactsContainer.querySelectorAll('tr');

    rows.forEach((row)=> {
        //On récupère les contacts dans le tableau grâce à son ID unique
        const item = contacts.find(item => item.id === Number(row.dataset.id));

        if (item) {
        //On fusionne les datas depuis l'objet Javascript
        const fullRowText = `${item.firstname} ${item.lastname} ${item.email}`.toLowerCase();

        //On verifie si chaque mot se trouve dans le texte de la ligne
        //every() renvoi true seulement si tous les mots sont presents
        const matchesAllWords = filterText.every(word => fullRowText.includes(word));

        //Si le texte écrit correspond aux datas on affiche la ligne sinon on la cache
        row.style.display = matchesAllWords ? "" : "none";
        }    
    });
});


