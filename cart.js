// Étape 8 : Afficher un tableau récapitulatif des achats
// dans la page Panier

// Récupération du panier
let productInCart = JSON.parse(localStorage.getItem("cart"));

// Création d'élements dans le DOM, attribution de classes et d'attributs
function CreateElems (i, img, newPrice, newH2){ 
  let cart__items = document.getElementById("cart__items");
  const article = document.createElement("article");
  cart__items.appendChild(article);
  article.classList.add("cart__item");
  article.setAttribute("data-id", productInCart[i].id);
  article.setAttribute("data-color", productInCart[i].color);
  const itemImg = document.createElement("div");
  article.appendChild(itemImg);
  itemImg.appendChild(img);
  itemImg.classList.add("cart__item__img");
  const content = document.createElement("div");
  const descr = document.createElement("div");
  const newColor = document.createElement("p");
  article.appendChild(content);
  content.appendChild(descr);
  descr.appendChild(newH2);
  descr.appendChild(newColor);
  descr.appendChild(newPrice);
  content.classList.add("cart__item__content");
  descr.classList.add("cart__item__content__description");
  newColor.innerText = productInCart[i].color;
  const itemContentSettings = document.createElement("div");
  const itemContentSettingsQuantity = document.createElement("div");
  const quantity = document.createElement("p");
  const inputQty = document.createElement("input");
  article.appendChild(itemContentSettings);
  itemContentSettings.appendChild(itemContentSettingsQuantity);
  itemContentSettingsQuantity.appendChild(quantity);
  itemContentSettingsQuantity.appendChild(inputQty);
  itemContentSettings.classList.add("cart__item__content__settings");
  itemContentSettingsQuantity.classList.add("cart__item__content__settings__quantity");
  inputQty.classList.add("itemQuantity");
  inputQty.type = "number";
  inputQty.name = "itemQuantity";
  inputQty.min = 1;
  inputQty.max = 100;
  inputQty.value = productInCart[i].qty;
  quantity.innerText = "Qté : ";
  const settingsDelete = document.createElement("div");
  const deleteProducts = document.createElement("p");
  article.appendChild(settingsDelete);
  settingsDelete.appendChild(deleteProducts);
  settingsDelete.classList.add("cart__item__content__settings__delete");
  deleteProducts.classList.add("deleteItem");
  deleteProducts.innerText = "Supprimer";
}

function getElem(products){ 
  for ( let i = 0; i < productInCart.length; i++) {
    const img = document.createElement("img");
    const newPrice = document.createElement("p");
    const newH2 = document.createElement("h2");

    CreateElems(i, img, newPrice, newH2);

    // Recherche d'élément correspondant dans la base de données
    const existingItem = products.find((p) => (p._id == productInCart[i].id));

    // Si élément correspondant, attribuer ses valeurs dans les variables adéquates
    if(existingItem){
      img.src = existingItem.imageUrl;
      img.alt = existingItem.altTxt; 
      newPrice.innerText = existingItem.price + " €";
      newH2.innerText = existingItem.name;
    }
  }
  priceAndTotalQtyDisplay(products);
}

// Requête auprès de l'API
const getProduct = fetch("http://localhost:3000/api/products")
.then(function(res) {
  if (res.ok) {
    return res.json();
  }
  throw new Error("Unable to get products from API")
})
.then(getElem)
.catch(function(err) {
  console.error(err);
})

// Fonction affichant la quantité totale + prix total 
function priceAndTotalQtyDisplay(products){
  priceAndTotalQtyCalcul(products);
  changeQty(products);
  removeItem();
}

// Fonction de suppression d'un article sur la page panier
function removeItem(){
  let removeElement = document.querySelectorAll(".deleteItem");

  for(let e = 0; e < removeElement.length; e++){
    removeElement[e].addEventListener("click", (event) => {
      event.stopPropagation();

      // recupération des data-id et data-color
      const btnEl = event.target;
      let selectedItem = btnEl.closest(".cart__item");
      let idProductToDelete = selectedItem.dataset.id;
      let colorProductToDelete = selectedItem.dataset.color;

      // isolation de l'élément à supprimer dans le panier
      productInCart = productInCart.filter((el) => (el.id !== idProductToDelete) || (el.color !== colorProductToDelete));

      // Stockage données dans le panier
      const productJSON = JSON.stringify(productInCart);
      localStorage.setItem("cart", productJSON);
      location.reload();
    })
  }
}

// Fonction permettant de modifier la quantité d'un article sur la page panier
function changeQty(products) {
  let itemQuantity = document.querySelectorAll(".itemQuantity");

  for(let q = 0; q < itemQuantity.length; q ++){
    itemQuantity[q].addEventListener("change", (event) => {
      event.stopPropagation();

      // Limitation de la quantité par article à 100 maximum
      if(itemQuantity[q].value > 100 || itemQuantity[q].value < 1){
        return false;
      }

      // recupération des data-id et data-color
      const btnQty = event.target;
      let qtyProductSelected = btnQty.closest(".cart__item");
      let idProductToChangeQty = qtyProductSelected.dataset.id;
      let colorProductToChangeQty = qtyProductSelected.dataset.color;

      let qtyFromItem = parseInt(btnQty.value, 10);
      productInCart[q].qty = qtyFromItem;

      // Trouver l'élément correspondant à une couleur et à un ID dans le panier, puis lui attribuer la quantité affichée dans l'input
      const matchingProduct = productInCart.find((item) => (item.id == idProductToChangeQty) && (item.color == colorProductToChangeQty));
      if(matchingProduct){
        matchingProduct.qty = qtyFromItem;
      }

      // Appel de la fonction de calcul de la quantité et du prix final
      priceAndTotalQtyCalcul(products);
    })
  }
}

// Fonction calculant la quantité totale +  prix total
function priceAndTotalQtyCalcul(products){
  let totalQty = 0;
  let totalPrice = 0;

  for ( let i = 0; i < productInCart.length; i++) {
    const qtySelected = productInCart[i].qty;
    const productFound = products.find((p) => (p._id == productInCart[i].id));

    if(productFound) {
      let pricePerProduct = productFound.price;
      let localPrice = qtySelected*pricePerProduct;
      totalQty += qtySelected;
      totalPrice += localPrice;
    } 
      // Stockage données dans le panier
      const productJSON = JSON.stringify(productInCart);
      localStorage.setItem("cart", productJSON);
    
    document.getElementById("totalQuantity").innerText = totalQty;
    document.getElementById("totalPrice").innerText = totalPrice;
  }
}

let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let inputEmail = document.getElementById("email");
let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
let cityErrorMsg = document.getElementById("cityErrorMsg");
let addressErrorMsg = document.getElementById("addressErrorMsg");
let emailErrorMsg = document.getElementById("emailErrorMsg");

// Fonction qui retourne TRUE ou FALSE si une adresse email est mal écrite
function validateEmail(email){
  let emailReg = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
  let valid = emailReg.test(email);

  if(!valid) {
    return false;
  } else {
    return true;
  }
}

// Evenement sur l'input de l'eamil qui appelle la fonction validateEmail; 
// et qui retourne un message d'erreur le cas échéant
inputEmail.addEventListener("change", (event) => {
  event.stopPropagation();
  const valueEmail = event.target.value;
 
  if(!validateEmail(valueEmail)){
    emailErrorMsg.innerText = "Erreur : l'email doit être au format azerty@domaine.com";
    return false;
  } else {
    emailErrorMsg.innerText = "";
  }
});

// Fonction qui retourne TRUE ou FALSE si la chaine de caractères 
// des input Nom, Prénom, City est mal écrite (présence de chiffres ou caractères spéciaux)
 function validateString(str){
  let strReg = new RegExp(/^[a-zA-Z '-]+$/i);
  let isStrValid = strReg.test(str);

  if(!isStrValid) {
    return false;
  } else {
    return true;
  }
}

// Evenement sur l'input du prénom qui appelle la fonction validateString; 
// et qui retourne un message d'erreur le cas échéant
firstName.addEventListener("change", (event) => {
  event.stopPropagation();
  const valueFirstName = event.target.value;
 
  if(!validateString(valueFirstName)){
    firstNameErrorMsg.innerText = "Erreur dans le prénom";
    return false;
  } else {
    firstNameErrorMsg.innerText = "";
  }
});


// Evenement sur l'input du nom de famille qui appelle la fonction validateString; 
// et qui retourne un message d'erreur le cas échéant
lastName.addEventListener("change", (event) => {
  event.stopPropagation();
  const valueLastName = event.target.value;
 
  if(!validateString(valueLastName)){
    lastNameErrorMsg.innerText = "Erreur dans le nom";
    return false;
  } else {
    lastNameErrorMsg.innerText = "";
  }
});

// Evenement sur l'input de la ville qui appelle la fonction validateString; 
// et qui retourne un message d'erreur le cas échéant
city.addEventListener("change", (event) => {
  event.stopPropagation();
  const valueCity = event.target.value;
 
  if(!validateString(valueCity)){
    cityErrorMsg.innerText = "Erreur dans le nom de la ville";
    return false;
  } else {
    cityErrorMsg.innerText = "";
  }
});

// Fonction qui retourne TRUE ou FALSE si la chaine de caractères 
// de l'input Adresse est mal écrite
function validateAddress(address){
  let addressReg = new RegExp(/^[\w\séèêàç,.'-]*$/);
  let isAddressValid = addressReg.test(address);

  if(!isAddressValid) {
    return false;
  } else {
    return true;
  }
}

// Evenement sur l'input de l'adresse qui appelle la fonction validateAddress; 
// et qui retourne un message d'erreur le cas échéant
address.addEventListener("change", (event) => {
  event.stopPropagation();
  const valueAdress = event.target.value;
 
  if(!validateAddress(valueAdress)){
    addressErrorMsg.innerText = "Erreur dans l'adresse";
    return false;
  } else {
    addressErrorMsg.innerText = "";
  }
});

async function SendData() {
  // Constitution d'un objet Contact avec les données du formulaire

  let contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value,
  };
  console.log(contact);

  // Création d'une boucle dans le local storage afin de récuperer seulement les Id produits dans un tableau
  const arrayIds = [];
  for(let i = 0; i < productInCart.length; i ++) {
    let productsID = productInCart[i].id;
    arrayIds.push(productsID);
  }
  // Si panier vide => impossible de passser une commande
  if(arrayIds.length == 0){
    console.error("Veuillez mettre des articles dans votre panier afin de passer commande.")
    return false;
  }

  // Constitution d'un objet global contenant l'objet contact et le tableau de Id produits
  const objectToSend = {
    contact: contact,
    products: arrayIds
  }
 
  // Requête POST avec l'objet global en body
  const res = await fetch("http://localhost:3000/api/products/order", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(objectToSend)
  });
  console.log(objectToSend);
  console.log(res);

// On attend la conversion du corps de la réponse en JSON, puis on la récupère 
  const returnValue = await res.json();
  const orderID = returnValue.orderId;

  // On appelle la fonction getSessionStorage puis on attend la fin de son traitement
  await getSessionStorage(orderID, returnValue);
}

async function getSessionStorage(orderID, returnValue){
  // Si on a une réponse de l'API, on met à jour la session storage
  if(returnValue) {
    sessionStorage.setItem('IDcommand', orderID);
    let sessionNumber = sessionStorage.getItem('IDcommand');
    console.log(sessionNumber);
  } else {
    alert("Une erreur est survenue. Veuillez réessayer ultérieurement.");
  }

  // Si pas de numéro de commande => message d'erreur, 
  // sinon => changement d'url pour la page Confirmation 
  if(orderID == undefined){
    console.error("Une erreur est survenue. Assurez vous que tous les champs du formulaire soient correctement remplis.")
  } else {
    document.location.href = `./confirmation.html?orderID=${sessionStorage.getItem('IDcommand')}`;
  }
};

// Appel de la fonction SendData(); attente de la fin de son traitement
async function confirm(){
  await SendData();
}

// Evenement sur le bouton "commander"
// Si les fonctions de validation des champs du formulaire sont toutes OK, appel de la fonction confirm()
document.getElementById("order").addEventListener("click", function(e) {
  e.preventDefault();
  if(validateAddress(address.value) && validateString(lastName.value) && validateString(firstName.value) && validateString(city.value) && validateEmail(inputEmail.value)){
    confirm();
  } else {
    console.error("Une erreur est survenue. Assurez vous que tous les champs du formulaire soient correctement remplis, ou qu'il y ait des articles dans votre panier.")
  }
})
