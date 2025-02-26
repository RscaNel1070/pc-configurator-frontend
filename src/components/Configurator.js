import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

const MAX_CONFIGS = 0; // Limite à 5 configurations sauvegardées

const Configurator = () => {
  const [composants, setComposants] = useState([]);
  const [config, setConfig] = useState({});
  const [totalPrix, setTotalPrix] = useState(0);
  const [configName, setConfigName] = useState("");
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/composants`)
      .then((response) => setComposants(response.data))
      .catch((error) => console.error("Erreur :", error));

    loadSavedConfigs();
  }, []);

  const handleSelection = (categorie, id) => {
    const composant = composants.find(c => c.id === parseInt(id));
    const newConfig = { ...config, [categorie]: composant };
    setConfig(newConfig);
    updateTotalPrice(newConfig);
  };

  const updateTotalPrice = (newConfig) => {
    const newTotal = Object.values(newConfig).reduce((sum, comp) => sum + (comp ? parseFloat(comp.prix) : 0), 0);
    setTotalPrix(newTotal);
  };

  const loadSavedConfigs = () => {
    const saved = JSON.parse(localStorage.getItem("pc_configs")) || [];
    setSavedConfigs(saved);
  };

  const saveConfiguration = () => {
    if (!configName.trim()) {
      alert("❌ Entrez un nom pour la configuration !");
      return;
    }

    const newConfig = { name: configName, data: config };
    let updatedConfigs = [...savedConfigs.filter(c => c.name !== configName), newConfig];

    if (updatedConfigs.length > MAX_CONFIGS) {
      updatedConfigs.shift(); // Supprime la plus ancienne configuration si on dépasse la limite
    }

    localStorage.setItem("pc_configs", JSON.stringify(updatedConfigs));
    setSavedConfigs(updatedConfigs);
    alert("✅ Configuration sauvegardée !");
    setConfigName("");
  };

  const loadConfiguration = (name) => {
    const selected = savedConfigs.find(c => c.name === name);
    if (selected) {
      setConfig(selected.data);
      updateTotalPrice(selected.data);
      setSelectedConfig(name);
    }
  };

  const deleteConfiguration = () => {
    if (!selectedConfig) {
      alert("❌ Sélectionnez une configuration à supprimer !");
      return;
    }

    const updatedConfigs = savedConfigs.filter(c => c.name !== selectedConfig);
    localStorage.setItem("pc_configs", JSON.stringify(updatedConfigs));
    setSavedConfigs(updatedConfigs);
    setSelectedConfig("");
    alert("🗑️ Configuration supprimée !");
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">🖥️ Configurateur PC</h2>

      <div className="d-flex justify-content-center mb-3">
        <input 
          type="text" 
          placeholder="Nom de la configuration"
          value={configName}
          onChange={(e) => setConfigName(e.target.value)}
          className="form-control w-25 me-2"
        />
        <button className="btn btn-success" onClick={saveConfiguration}>💾 Sauvegarder</button>
      </div>

      {/* Liste déroulante pour charger/supprimer une configuration */}
      {savedConfigs.length > 0 && (
        <div className="mb-3 text-center">
          <h4>📂 Configurations enregistrées</h4>
          <select 
            className="form-select w-50 mx-auto"
            value={selectedConfig}
            onChange={(e) => loadConfiguration(e.target.value)}
          >
            <option value="">Sélectionnez une configuration</option>
            {savedConfigs.map((conf) => (
              <option key={conf.name} value={conf.name}>{conf.name}</option>
            ))}
          </select>
          <button className="btn btn-danger mt-2" onClick={deleteConfiguration}>❌ Supprimer</button>
        </div>
      )}

      <div className="row">
        {["CPU", "Carte Mère", "RAM", "GPU", "Stockage", "Alimentation", "Boîtier"].map((categorie, index) => (
          <div className="col-md-6 mb-4" key={categorie}>
            <div className="p-3 border rounded bg-light">
              <h4 className="fw-bold text-primary">{categorie}</h4>
              <select 
                className="form-select mb-3"
                onChange={(e) => handleSelection(categorie.toLowerCase().replace(" ", "_"), e.target.value)}
                value={config[categorie.toLowerCase().replace(" ", "_")]?.id || ""}
              >
                <option value="">Sélectionner un {categorie}</option>
                {composants.filter(c => c.categorie === categorie).map(comp => (
                  <option key={comp.id} value={comp.id}>
                    {comp.nom} - {comp.prix}€
                  </option>
                ))}
              </select>

              {config[categorie.toLowerCase().replace(" ", "_")] && (
                <div className="card text-center p-2">
                  {config[categorie.toLowerCase().replace(" ", "_")].image_url && (
                    <img 
                      src={config[categorie.toLowerCase().replace(" ", "_")].image_url} 
                      className="card-img-top"
                      alt={config[categorie.toLowerCase().replace(" ", "_")].nom} 
                      style={{ width: "100px", height: "100px", objectFit: "cover", margin: "auto" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{config[categorie.toLowerCase().replace(" ", "_")].nom}</h5>
                    <p className="fw-bold text-danger">💰 {config[categorie.toLowerCase().replace(" ", "_")].prix}€</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lignes séparatrices entre chaque section */}
            {index < 6 && <hr className="my-4 border-primary" />}
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <h3 className="fw-bold text-success">💰 Prix Total : {totalPrix.toFixed(2)}€</h3>
      </div>
    </div>
  );
};

export default Configurator;
