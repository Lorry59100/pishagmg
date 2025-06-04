export function convertToEuros(priceInCents) {
  // Check if the price is a valid number
  if (isNaN(priceInCents) || priceInCents < 0) {
      return "Invalid price";
  }
  // Convert cents to euros and format with two decimal places
  var priceInEuros = (priceInCents / 100).toFixed(2);
  // Add the euro symbol
  return priceInEuros;
}

export function calculateDiscountPercentage(oldPriceInCents, priceInCents) {
  // Vérifier si les prix sont des nombres valides et non négatifs
  if (isNaN(oldPriceInCents) || isNaN(priceInCents) || oldPriceInCents < 0 || priceInCents < 0) {
      return "Invalid prices";
  }
  // Convertir les centimes en euros avant le calcul
  var oldPriceInEuros = parseFloat(convertToEuros(oldPriceInCents));
  var priceInEuros = parseFloat(convertToEuros(priceInCents));
  // Calculer le pourcentage de remise
  var discountPercentage = ((oldPriceInEuros - priceInEuros) / oldPriceInEuros) * 100;
  // Formater le résultat avec deux décimales et ajouter le symbole de pourcentage
  return discountPercentage.toFixed(0) + "%";
}

export const calculateTotal = (cartData, priceField = 'price') => {
  if (!cartData || !Array.isArray(cartData) || cartData.length === 0) {
    return 0; // Retourne zéro si le panier est vide ou n'est pas défini
  }

  return cartData.reduce((accumulator, item) => {
    const price = parseFloat(item[priceField]);
    if (!isNaN(price)) {
      return accumulator + price * item.quantity;
    }
    return accumulator;
  }, 0);
};

export const calculateTotalOldPrice = (cartData) => {
  if (!cartData || !Array.isArray(cartData) || cartData.length === 0) {
    return 0; // Retourne zéro si le panier est vide ou n'est pas défini
  }
  return cartData.reduce((accumulator, item) => {
    const oldPrice = parseFloat(item.oldPrice);
    if (!isNaN(oldPrice)) {
      return accumulator + oldPrice * item.quantity;
    }
    return accumulator;
  }, 0);
};

export const calculateDifference = (cartData) => {
  const totalOldPrice = calculateTotalOldPrice(cartData);
  const totalPrice = calculateTotal(cartData);
  return totalOldPrice - totalPrice;
};



