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
  totalPriceCalcul(products);
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

// Fonction permettant de modifier la quantité d'un article sur la page panier
function changeQty() {
  let itemQuantity = document.querySelectorAll(".itemQuantity");

  for(let q = 0; q < itemQuantity.length; q ++){
    itemQuantity[q].addEventListener("change", (event) => {
      event.stopPropagation();

      // recupération des data-id et data-color
      const btnQty = event.target;
      let qtyProductSelected = btnQty.closest(".cart__item");
      let idProductToChangeQty = qtyProductSelected.dataset.id;
      let colorProductToChangeQty = qtyProductSelected.dataset.color;

      let qtyFromItem = parseInt(btnQty.value, 10);
      productInCart[q].qty = qtyFromItem;

      // Trouver l'élément correspondant à une couleur et à un ID dans le panier, puis lui attribuer la quantité affichée dans l'input
      const newProductInCart = productInCart.find((item) => (item.id == idProductToChangeQty) && (item.color == colorProductToChangeQty));
      if(newProductInCart){
        newProductInCart.qty = qtyFromItem;
      }
      
      // Stockage données dans le panier
      const productJSON = JSON.stringify(productInCart);
      localStorage.setItem("cart", productJSON);
      location.reload();
    })
  }
}

// Fonction de suppression d'un article sur la page panier
function removeItem(){

  // Sélection des balises pour suppression d'un article
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

// Fonction calculant la quantité totale ainsi que le prix total
function totalPriceCalcul(products){
  let totalqty = 0;
  let totalPrice = 0;

  for ( let i = 0; i < productInCart.length; i++) {
    const qtySelected = productInCart[i].qty;
    const productFound = products.find((p) => (p._id == productInCart[i].id));

    if(productFound) {
      let pricePerProduct = productFound.price;
      let localPrice = qtySelected*pricePerProduct;
      totalqty += qtySelected;
      totalPrice += localPrice;
    } 
  }  
  changeQty();
  removeItem();
  document.getElementById("totalQuantity").innerText = totalqty;
  document.getElementById("totalPrice").innerText = totalPrice;
}

let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
let cityErrorMsg = document.getElementById("cityErrorMsg");

let addressErrorMsg = document.getElementById("addressErrorMsg");

let emailErrorMsg = document.getElementById("emailErrorMsg");
let inputEmail = document.getElementById("email");

function validateEmail(email){
  let emailReg = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
  let valid = emailReg.test(email);
  console.log(valid);

  if(!valid) {
      return false;
  } else {
      return true;
  }
}

inputEmail.addEventListener("change", (event) => {
  event.stopPropagation();
  const valueEmail = event.target.value;
 
  if(!validateEmail(valueEmail)){
    emailErrorMsg.innerText = "Erreur : l'email doit être au format azerty@domaine.com";
  } else {
    emailErrorMsg.innerText = "";
  }
  console.log(valueEmail);
});

// function validateString(str){
//   let strReg = new RegExp(/^[a-z ,.'-]+$/i);
//   let isStrvalid = strReg.test(str);
//   console.log(isStrvalid);

//   if(!isStrvalid) {
//       return false;
//   } else {
//       return true;
//   }
// }

// if(!validateString("jean-marc-")){
//   firstNameErrorMsg.innerText = "Erreur : pas de chiffres et de caractères spéciaux";
//   lastNameErrorMsg.innerText = "Erreur : pas de chiffres et de caractères spéciaux";
//   cityErrorMsg.innerText = "Erreur : pas de chiffres et de caractères spéciaux";
// }
