let localStorageInformation = JSON.parse(localStorage.getItem('products')); // Récupération du local Storage 

  if((localStorageInformation) && (localStorageInformation.length !== 0)){ // Si un local Storage existe
      displayCart(localStorageInformation); // Affichage du panier
      changeQuantity(localStorageInformation); // Ecoute si un changement de quantité se passe
      deleteItem(localStorageInformation); // Ecoute si une suppression survient
      calculate(localStorageInformation); // Calcule la quantité et le prix totale
  }
  else{ // Si le local Storage est vide
      displayError(); // Affichage panier vide
  }
  verifRegex(localStorageInformation); // Formulaire




// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!! Fonction verifRegex !!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!! Vérification du formulaire !!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function verifRegex(localStorageInformation){
  const regexText = /^[-a-zA-ZàâäéèêëïîôöùûüçÂ]{2,20}$/; // Regex pour les nom, prénom et ville 
  const regexAddress = /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/; // Regex pour les addresses
  const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Regex pour l'adresse mail

  inputRegex('firstName', 'input', regexText); // Vérification prénom
  inputRegex('lastName', 'input', regexText); // Vérification nom
  inputRegex('address', 'input', regexAddress); // Vérification adresse
  inputRegex('city', 'input', regexText); // Vérification ville
  inputRegex('email', 'input', regexMail); // Vérification email

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!! Fonction inputRegex !!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!! Vérification du formulaire !!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  function inputRegex(id, type, regexType){
    document.getElementById(id).addEventListener(type, function(e){ // lors d'une modification d'un input
      regex(id, e.target.value, regexType); // Chargement fonction regex
    });
  }; // Fin fonction inputRegex

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!! Fonction regex !!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!! Vérification du formulaire !!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  function regex(nameInput, value, regex){
    let HTML = document.getElementById(nameInput + 'ErrorMsg'); // Selection de l'emplacement des erreurs
    if(!value){ // Si il n'y a aucune valeur
      HTML.style.display = "block"; // Affichage du message d'erreur
      HTML.innerHTML = 'Veuillez saisir une valeur !';
    }
    else if(!regex.test(value)){ // Si la valeur est différente du regex 
      HTML.style.display = "block"; // Affichage du message d'erreur
      HTML.innerHTML = 'Veuillez saisir une valeur correct !';
    }
    else{ // Sinon
      HTML.style.display = "none"; // Suppression du message d'erreur 
        }

  }; // Fin fonction regex
  recoveryContact(localStorageInformation);
}; // Fin fonction verifRegex
  
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!! Fonction recoveryContact !!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!! Récupération données utilisateur !!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function recoveryContact (localStorageInformation){
  document.getElementById('order').addEventListener('click', function(e){ // Au clic sur le boutton
  e.preventDefault();
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let address = document.getElementById('address').value;
    let city = document.getElementById('city').value;
    let email = document.getElementById('email').value;

    const regexText = /^[-a-zA-ZàâäéèêëïîôöùûüçÂ]{2,20}$/; // Regex pour les nom, prénom et ville 
    const regexAddress = /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/; // Regex pour les addresses
    const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Regex pour l'adresse mail

    if((!firstName) || (!lastName) || (!address) || (!city) || (!email)){
      alert("Vous n'avez pas saisie un champs")
    }
    else if((!regexText.test(firstName)) || (!regexText.test(lastName)) || (!regexAddress.test(address)) || (!regexText.test(city)) || (!regexMail.test(email))){
      alert("Vous avez mal saisie un champs");
    }
    else if((!localStorageInformation) || (localStorageInformation.length === 0)){
      alert("Votre panier est vide")
    }
    else {
      let contact = { // Création de l'objet contact
        firstName : firstName,
        lastName : lastName,
        address : address,
        city : city,
        email : email
      };
      collectIdLocalStorage(localStorageInformation, contact);
    }
  });
};

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!! Fonction collectIdLocalStorage !!!!!!!!!!!!!!!!
// !!!!!!!! Tableau id des produits dans LocalStorage !!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function collectIdLocalStorage(localStorageInformation, contact){
  let products = []; // Initialisation tableau products
  for(i=0; i < localStorageInformation.length; i++){ // Boucle qui parcourt le Local Storage
    products.push(localStorageInformation[i].id); // Ajout des Ids
  }  // Fin boucle
  sendData(products, contact) // Fonction envoie des données
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!! Fonction sendData !!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!! Envoi des données vers l'API !!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function sendData (products, contact){
  const body = { // Données
    products : products,
    contact : contact
  };
  const option = { // Options
    method: "POST",
    headers : {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
  fetch('https://api-kanap.camille-crapat.fr/api/products/order', option) // Envoyer données
  .then(function(res) {
    if (res.ok) { // Vérification si des résultats sont présents
      return res.json();
    }
  })
  .then(function(data){
    let newLocalStorage = []; 
    localStorage.setItem('products', JSON.stringify(newLocalStorage)); // Vider le Local Storage
    let id = data.orderId; // Récupération de l'id
    window.location.href='./confirmation.html?id='+id // Redirection vers la page confirmation
  })
.catch(function (err) {
  let error = document.getElementById('cart__items');
  error.innerHTML = `<p>Une erreur est survenu lors du passage de la commande</p>`
  error.style.textAlign = "center";
  error.style.fontSize = "18px";
  error.style.color = "white";
  error.style.fontWeight = "bold";
  error.style.borderRadius = "10px";
  error.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
  error.style.lineHeight = "30px";
});
}


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!! Fonction displayCart !!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!! Affichage du panier sur la page !!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function displayCart(localStorageInformation){
  for(i = 0; i < localStorageInformation.length; i++){ // Boucle qui parcourt le local Storage 
    let HTML = `<article class="cart__item" data-id="${localStorageInformation[i].id}">
    <div class="cart__item__img">
      <img src="${localStorageInformation[i].imageUrl}" alt="${localStorageInformation[i].altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${localStorageInformation[i].name} ${localStorageInformation[i].colors}</h2>
        <p>${localStorageInformation[i].price}€</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localStorageInformation[i].quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;
  document.getElementById('cart__items').innerHTML += HTML; 

  } // Fin boucle for affichage localStorage
} // Fin fonction displayCart

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!! Fonction displayError !!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!! Affichage d'une message panier vide !!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function displayError(){
  // Affichage du message d'erreur panier vide
  let error = document.getElementById('cart__items');
  error.innerHTML = `<p>Le panier est vide ! Rendez-vous sur notre page produit en cliquant <a href="index.html">ici</a></p>`
  error.style.textAlign = "center";
  error.style.fontSize = "18px";
  error.style.color = "white";
  error.style.fontWeight = "bold";
  error.style.borderRadius = "10px";
  error.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
  error.style.lineHeight = "30px";
  // Modification style lien vers la page produit
  let lien = document.querySelector('#cart__items a');
  lien.style.color = "white";
  // Mise des quantité total et du prix total à 0
  document.getElementById('totalPrice').innerHTML = 0;
  document.getElementById('totalQuantity').innerHTML = 0;
}; // Fin fonction displayError 

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!! Fonction changeQuantity !!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!! Pour changer la quantité d'un canapé !!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function changeQuantity(localStorageInformation){
  let itemQuantity = document.querySelectorAll('.itemQuantity'); // Selection de l'input des quantités
  itemQuantity.forEach((item, index) => { // Boucle parcourant tous les canapés
    item.addEventListener('change', function(){ // Au changement d'une quantité
      localStorageInformation[index].quantity = parseInt(itemQuantity[index].value); // On change la quantité
      localStorage.setItem('products', JSON.stringify(localStorageInformation)); // On met à jour le localStorage
      calculate(); // On recalcule le prix et la quantité totale
    }); // Fin fonction click
  }); // Fin foreach
}; // Fin fonction changeQuantity

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!! Fonction deleteItem !!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!! Suppression d'un canapé !!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function deleteItem(localStorageInformation){
  let itemDelete = document.querySelectorAll('.deleteItem'); // Selection de tous les liens de suppression
  itemDelete.forEach((item, index) => { // Boucle qui parcourt tous les canapés
    item.addEventListener('click', function(){ // Au clicque sur un des lien 
      let supp = itemDelete[index].closest('.cart__item'); // On selectionne l'article 
      supp.remove(); // On le supprime 

      localStorageInformation.splice(index, 1); // On le supprime du localStorage
      localStorage.setItem('products', JSON.stringify(localStorageInformation)); // On met à jour le LocalStorage
      calculate(); // On recalcule la quantité et le prix totale
      if((!localStorageInformation) || (localStorageInformation.length == 0)){ // Si il n'y a plus d'article 
        displayError(); // On affiche que le panier est vide
      }
    }); // Fin fonction click
  }); // Fin foreach
}; // Fin fonction deleteItem

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!! Fonction calculate !!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!! Permet de calculer la quantité et le prix total !!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function calculate(){ 
  let localStorageReload = JSON.parse(localStorage.getItem('products'))
  let quantityTotal = 0; 
  let priceTotal = 0;
  for(i=0; i < localStorageReload.length; i++){ // Boucle qui parcourt le Local Storage
    quantityTotal += localStorageReload[i].quantity; // Calcul de la quantité total
    priceTotal += localStorageReload[i].price * localStorageReload[i].quantity; // Calcul du prix total
  }
  document.getElementById('totalPrice').innerHTML = priceTotal; // Affichage du prix total
  document.getElementById('totalQuantity').innerHTML = quantityTotal; // Affichage de la quantité total
}; // Fin de fonction calculate

