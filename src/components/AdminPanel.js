import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

const CATEGORIES = ["CPU", "Carte Mère", "RAM", "GPU", "Stockage", "Alimentation", "Boîtier"];

const AdminPanel = () => {
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("");
  const [socket, setSocket] = useState("");
  const [prix, setPrix] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [composants, setComposants] = useState([]);
  const [selectedComposant, setSelectedComposant] = useState(null);
  const [categoryVisibility, setCategoryVisibility] = useState({});
  const [sortOrder, setSortOrder] = useState({});

  useEffect(() => {
    fetchComposants();
  }, []);

  const fetchComposants = () => {
    axios.get(`${API_URL}/composants`)
      .then((response) => {
        setComposants(response.data);
        const visibilityState = {};
        CATEGORIES.forEach(cat => visibilityState[cat] = true);
        setCategoryVisibility(visibilityState);
      })
      .catch((error) => console.error("Erreur :", error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const composantData = { nom, categorie, socket, prix, image_url: imageUrl };

    if (selectedComposant) {
      await axios.put(`${API_URL}/composants/${selectedComposant.id}`, composantData);
      setSelectedComposant(null);
    } else {
      await axios.post(`${API_URL}/composants`, composantData);
    }
    
    fetchComposants();
    setNom(""); setCategorie(""); setSocket(""); setPrix(""); setImageUrl("");
  };

  const handleEdit = (composant) => {
    setSelectedComposant(composant);
    setNom(composant.nom);
    setCategorie(composant.categorie);
    setSocket(composant.socket);
    setPrix(composant.prix);
    setImageUrl(composant.image_url);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/composants/${id}`);
    fetchComposants();
  };

  const toggleCategory = (cat) => {
    setCategoryVisibility(prevState => ({
      ...prevState,
      [cat]: !prevState[cat]
    }));
  };

  const handleSort = (category, field) => {
    const isAscending = sortOrder[category]?.[field] === "asc";
    const sortedComposants = [...composants].sort((a, b) => {
      if (field === "prix") {
        return isAscending ? parseFloat(a.prix) - parseFloat(b.prix) : parseFloat(b.prix) - parseFloat(a.prix);
      }
      return isAscending ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
    });

    setComposants(sortedComposants);
    setSortOrder({
      ...sortOrder,
      [category]: { ...sortOrder[category], [field]: isAscending ? "desc" : "asc" }
    });
  };

  return (
    <div className="container mt-4">
      <h2>🔧 Gestion des Composants</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />

        <select value={categorie} onChange={(e) => setCategorie(e.target.value)} required>
          <option value="">Sélectionner une Catégorie</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input type="text" placeholder="Socket" value={socket} onChange={(e) => setSocket(e.target.value)} />
        <input type="number" placeholder="Prix (€)" value={prix} onChange={(e) => setPrix(e.target.value)} required />
        <input type="text" placeholder="URL de l'Image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

        <button type="submit">{selectedComposant ? "Modifier" : "Ajouter"}</button>
      </form>

      <h3>📦 Liste des Composants</h3>
      {CATEGORIES.map((cat) => (
        <div key={cat} className="mb-3">
          <button className="btn btn-secondary w-100" onClick={() => toggleCategory(cat)}>
            {categoryVisibility[cat] ? `🔽 Cacher ${cat}` : `▶️ Montrer ${cat}`}
          </button>

          {categoryVisibility[cat] && (
            <div className="mt-2">
              {/* Boutons de tri */}
              <div className="d-flex justify-content-start mb-2">
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleSort(cat, "nom")}>
                  Trier par Nom
                </button>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleSort(cat, "socket")}>
                  Trier par Socket
                </button>
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleSort(cat, "prix")}>
                  Trier par Prix
                </button>
              </div>

              <div className="row">
                {composants.filter(c => c.categorie === cat).map((composant, index) => (
                  <div key={composant.id} className="col-md-4">
                    <div className="p-3 border rounded bg-light">
                      {composant.image_url && (
                        <img 
                          src={composant.image_url} 
                          className="card-img-top"
                          alt={composant.nom} 
                          style={{ width: "100px", height: "100px", objectFit: "cover", margin: "auto", display: "block" }}
                        />
                      )}
                      <div className="text-center">
                        <h5 className="fw-bold">{composant.nom}</h5>
                        <p><strong>Socket:</strong> {composant.socket || "N/A"}</p>
                        <p className="fw-bold text-danger">💰 {composant.prix}€</p>
                        <button className="btn btn-warning" onClick={() => handleEdit(composant)}>✏ Modifier</button>
                        <button className="btn btn-danger ms-2" onClick={() => handleDelete(composant.id)}>❌ Supprimer</button>
                      </div>
                    </div>

                    {/* Ligne de séparation entre chaque composant */}
                    {index < composants.filter(c => c.categorie === cat).length - 1 && <hr className="border-primary my-3" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
