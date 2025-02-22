import React from "react";

const CartSummary = ({ cart }) => {
  const total = cart.reduce((acc, item) => acc + item.prix, 0);

  return (
    <div>
      <h3>🛒 Panier :</h3>
      {cart.map((item, index) => (
        <p key={index}>{item.nom} - {item.prix}€</p>
      ))}
      <h3>Total: {total}€</h3>
    </div>
  );
};

export default CartSummary;