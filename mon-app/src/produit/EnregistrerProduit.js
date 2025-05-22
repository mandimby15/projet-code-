import React, { useState } from 'react';
import axios from 'axios';

export default function EnregistrerProduit({ onSaveSuccess, onCancel }) {
  const [newProduit, setNewProduit] = useState({
    nomProduit: '',
    type: '',
    description: '',
    prix: '',
    quantiteStock: '' // Ajout du champ stock
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduit(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSaveProduit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!newProduit.nomProduit || !newProduit.type || !newProduit.prix || newProduit.quantiteStock === '') {
      setErrorMessage('Veuillez remplir tous les champs obligatoires (Nom, Type, Prix, Stock).');
      return;
    }
    if (isNaN(newProduit.prix) || parseFloat(newProduit.prix) <= 0) {
      setErrorMessage('Le prix doit être un nombre positif.');
      return;
    }
    if (isNaN(newProduit.quantiteStock) || parseInt(newProduit.quantiteStock, 10) < 0) {
      setErrorMessage('Le stock doit être un nombre entier positif ou nul.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/produits/ajouter', newProduit, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Produit enregistré avec succès:', response.data);
      setSuccessMessage('Produit enregistré avec succès !');

      setNewProduit({
        nomProduit: '',
        type: '',
        description: '',
        prix: '',
        quantiteStock: ''
      });
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du produit:', error);
      if (error.response && error.response.data) {
        setErrorMessage(`Erreur: ${error.response.data.message || 'Échec de l\'enregistrement du produit.'}`);
      } else {
        setErrorMessage('Échec de l\'enregistrement du produit. Veuillez vérifier votre connexion ou le serveur.');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Nouveau Produit</h3>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveProduit}>
        <div className="mb-4">
          <label htmlFor="nomProduit" className="block text-gray-700 text-sm font-bold mb-2">Nom du Produit:</label>
          <input
            type="text"
            id="nomProduit"
            name="nomProduit"
            value={newProduit.nomProduit}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type:</label>
          <input
            type="text"
            id="type"
            name="type"
            value={newProduit.type}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea
            id="description"
            name="description"
            value={newProduit.description}
            onChange={handleInputChange}
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-6">
          <label htmlFor="prix" className="block text-gray-700 text-sm font-bold mb-2">Prix (€):</label>
          <input
            type="number"
            id="prix"
            name="prix"
            value={newProduit.prix}
            onChange={handleInputChange}
            step="0.01"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="quantiteStock" className="block text-gray-700 text-sm font-bold mb-2">Quantité en Stock:</label>
          <input
            type="number"
            id="quantiteStock"
            name="quantiteStock"
            value={newProduit.quantiteStock}
            onChange={handleInputChange}
            min="0"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-red-600 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline shadow-md transition duration-300 ease-in-out"
          >
            Enregistrer Produit
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-blue-600 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline shadow-md transition duration-300 ease-in-out"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
