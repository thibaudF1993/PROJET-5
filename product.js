// Étape 5 : Récupérer l’id du produit à afficher


const queryString_id = window.location.search;
const urlSearchParams = new URLSearchParams(queryString_id);
const theId = urlSearchParams.get("id");


// Étape 6 : Insérer un produit et ses détails dans la page
// Produit

const getOneProduct = fetch(`http://localhost:3000/api/products/${theId}`)
// Récuperation des données de l'API propres à l'ID du produit situé dans l'URL

    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
        throw new Error("Unable to get product from API")
    })
    .then(function(values) {
        // Attribution des données Name, Price et Description de l'API dans les élements du DOM

        document.getElementById("title").innerText = values.name;
        document.getElementById("price").innerText = values.price;
        document.getElementById("description").innerText = values.description;

        // Attribution des données imageUrl et altTxt  de l'API dans les éléments du DOM
        let imgeParent = document.getElementsByClassName("item__img");
        let imge = document.createElement("img");
        imgeParent[0].appendChild(imge);
        imge.src = values.imageUrl;
        imge.alt = values.altTxt;

        // Parcourir l'array Colors du produit
        for ( let i = 0; i < values.colors.length; i++) {
            const parent = document.getElementById("colors");
            const option = document.createElement("option");
            parent.appendChild(option);
            option.value = values.colors[i];
            option.innerText = values.colors[i];
        }  
    })
    .catch(function(err) {
        console.error(err);
    });


// Étape 7 : Ajouter des produits dans le panier

// Création de variables
let qtyElt = document.getElementById("quantity");
let colorsElt = document.getElementById("colors");
const cart = document.getElementById("addToCart");

cart.addEventListener("click", (event) => {
    // Création de l'evenement 
    event.preventDefault();

    // Récupération des valeurs
    const color = colorsElt.value;
    const qty = parseInt(qtyElt.value, 10); // Transformation de la chaine de caracteres en nombre


    // SI aucune couleur ou quantité sélectionnées, pas d'ajout au panier
    if (!color || !qty){
        return; 
    }

    // Récuperation des données dans le local storage => le panier
    let productInCart = JSON.parse(localStorage.getItem("cart"));

    // Si pas de produit dans le local storage, on retourne un array
    if(!productInCart){
        productInCart = [];
    }
    
    // Cherche dans le panier si il y a deja cet élément
    const existingProduct = productInCart.find((p) => (p.id == theId) && (p.color == color));

    if(existingProduct){
        // Si élément déja dans le panier (même id et même couleur) , on incrémente la quantité

        existingProduct.qty += qty;
    } else {

        // Sinon, on ajoute l'objet dans le panier avec son ID, sa couleur et la quantité choisie
        const optionsProducts = {
            id: theId,
            color,
            qty,
        }
        productInCart.push(optionsProducts);
    }

    // Stockage données dans le panier
const productJSON = JSON.stringify(productInCart);
localStorage.setItem("cart", productJSON);
});





