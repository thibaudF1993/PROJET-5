// Récupération du numéro de commande dans l'URL
const queryString_orderID = window.location.search;
const urlSearchParams = new URLSearchParams(queryString_orderID);
const orderID = urlSearchParams.get("orderID");
console.log("Le numéro de commande est le suivant : " + orderID);

// Le numéro de commande apparait à l'endroit souhaité
document.getElementById("orderId").innerText = orderID;

// Suppression du local storage une fois la commande passée
localStorage.clear();
