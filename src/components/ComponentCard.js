import React from "react";

const ComponentCard = ({ composant, addToCart }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">{composant.nom}</h4>
        <p className="card-text">Catégorie: {composant.categorie}</p>
        <p className="card-text">Prix: {composant.prix}€</p>
        <button className="btn btn-primary" onClick={() => addToCart(composant)}>Ajouter</button>
      </div>
    </div>
  );
};

export default ComponentCard;
