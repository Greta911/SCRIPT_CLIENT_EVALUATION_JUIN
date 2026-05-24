# 📇 Contacts App – Projet Frontend (Vanilla JS & Alpine.js)

## 🎯 Objectif du projet

Créer une application de gestion de contacts à partir du gabarit HTML fourni, avec deux implémentations distinctes :

1. Une version **Vanilla JavaScript**  
2. Une version **Alpine.js**

---

## 🔧 Fonctionnalités de base attendues

Les deux versions doivent impérativement permettre de :

- ✅ Ajouter un contact (prénom, nom, email)
- ✏️ Modifier un contact
- ❌ Supprimer un contact
- 🔢 Afficher dynamiquement le **nombre total de contacts**

---

## 💡 Astuce de développement

L’interface est déjà préparée pour faciliter l’édition :

```html
<!-- Exemple : une ligne en cours d'édition -->
<tr class="isEditing">
```

Utilisez/désactivez la classe isEditing pour basculer entre mode édition et mode affichage d’un contact.

Des classes CSS comme .isEditing-visible et .isEditing-hidden gèrent déjà l’affichage conditionnel.

## 🌟 Défis bonus
Vous pouvez enrichir votre application avec les fonctionnalités suivantes :

- 🔍 Filtrage dynamique par prénom, nom ou email via le champ de recherche
- 🔃 Tri des contacts par prénom, nom ou email en cliquant sur les en-têtes de colonne (<th>)


## 📁 Organisation du dépôt
Structure suggérée :
```pgsql
/contacts-app/
│
├── vanilla/
│   ├── index.html
│   └── app.js
│
├── alpine/
│   ├── index.html
│   └── app.js
│
└── README.md
```

