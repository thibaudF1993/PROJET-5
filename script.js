
// Étape 3 : Insérer les produits dans la page d’accueil //

// Étape 4 : Faire le lien entre un produit de la page
// d’accueil et la page Produit




function createProduct(product, parentNode) {
  // création d'éléments dans le DOM

  const newEltA = document.createElement("a");
  const newEltArticle = document.createElement("article");
  const newEltImg = document.createElement("img");
  const newEltH3 = document.createElement("h3");
  const newEltP = document.createElement("p");
  parentNode.appendChild(newEltA);
  newEltA.appendChild(newEltArticle);
  newEltArticle.appendChild(newEltImg);
  newEltArticle.appendChild(newEltH3);
  newEltArticle.appendChild(newEltP);
  newEltH3.classList.add("productName");
  newEltP.classList.add("productDescription");

  // attribution des valeurs de l'API dans les éléments créés
  newEltA.href = `./product.html?id=${product._id}`;
  newEltImg.src = product.imageUrl;
  newEltImg.alt = product.altTxt;
  newEltH3.innerText = product.name;
  newEltP.innerText = product.description;
}

function createProducts (products) {
  const parentNode = document.getElementById("items");

  // Parcourir l'array de l'API
  for ( let i = 0; i < products.length; i++) {
    const product = products[i];
    createProduct(product, parentNode);
  }
}

const getData = fetch("http://localhost:3000/api/products")
// requête auprès de l'API pour récuperer toutes ses infos

  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
    throw new Error("Unable to get products from API")
  })
  .then(createProducts)
  .catch(function(err) {
    console.error(err);
  });



