import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap'; // Pour la table Bootstrap
import EnregistrerProduit from '../produit/EnregistrerProduit'; // Assurez-vous que ce chemin est correct

export default function Accueil() {
    const [produits, setProduits] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false); // Pour afficher/masquer le formulaire d'ajout
    const [message, setMessage] = useState(''); // Pour les messages de succès/erreur (ajout/facture)
    const [selectedProductsQuantities, setSelectedProductsQuantities] = useState(new Map()); // Map: produitId -> quantite selectionnée
    const [searchTerm, setSearchTerm] = useState(''); // État pour le terme de recherche
    const [clientName, setClientName] = useState(''); // Nouvel état pour le nom du client

    useEffect(() => {
        chargerProduits();
    }, []);

    // Fonction pour charger la liste des produits depuis l'API
    const chargerProduits = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8080/api/produits', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Assurez-vous que le token est valide
                }
            });
            setProduits(response.data);
            // Réinitialiser les quantités sélectionnées si un produit n'existe plus ou si le stock est 0
            setSelectedProductsQuantities(prevMap => {
                const newMap = new Map();
                response.data.forEach(produit => {
                    if (prevMap.has(produit.idProduit) && produit.quantiteStock > 0) {
                        // Conserver la quantité si le produit est toujours là et en stock
                        newMap.set(produit.idProduit, Math.min(prevMap.get(produit.idProduit), produit.quantiteStock));
                    }
                });
                return newMap;
            });

        } catch (err) {
            console.error('Erreur de chargement des produits:', err);
            setError(`Erreur ${err.response?.status || ''}: ${err.message || 'Échec du chargement des produits.'}`);
        } finally {
            setLoading(false);
        }
    };

    // Gère le changement de quantité pour un produit sélectionné
    const handleQuantityChange = (produitId, newQuantity) => {
        const product = produits.find(p => p.idProduit === produitId);
        if (!product) return;

        const quantity = parseInt(newQuantity, 10);

        setSelectedProductsQuantities(prevMap => {
            const newMap = new Map(prevMap);
            if (isNaN(quantity) || quantity <= 0) {
                newMap.delete(produitId); // Supprimer si la quantité est invalide ou zéro
            } else if (quantity > product.quantiteStock) {
                newMap.set(produitId, product.quantiteStock); // Limiter à la quantité en stock
                setMessage(`La quantité pour ${product.nomProduit} a été ajustée au stock disponible (${product.quantiteStock}).`);
                setTimeout(() => setMessage(''), 3000);
            } else {
                newMap.set(produitId, quantity);
            }
            return newMap;
        });
    };

    // Calcule le total des prix des produits sélectionnés
    const totalPrixSelectionnes = useMemo(() => {
        let total = 0;
        selectedProductsQuantities.forEach((quantite, produitId) => {
            const produit = produits.find(p => p.idProduit === produitId);
            if (produit) {
                total += parseFloat(produit.prix || 0) * quantite;
            }
        });
        return total.toFixed(2); // Formate le total à 2 décimales
    }, [produits, selectedProductsQuantities]); // Recalcule quand les produits ou les sélections changent

    // Fonction pour filtrer les produits en fonction du terme de recherche
    const filteredProduits = useMemo(() => {
        if (!searchTerm) {
            return produits;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return produits.filter(produit =>
            (produit.nomProduit && produit.nomProduit.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (produit.type && produit.type.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (produit.description && produit.description.toLowerCase().includes(lowerCaseSearchTerm))
        );
    }, [produits, searchTerm]); // Recalcule quand les produits ou le terme de recherche changent

    // Fonction appelée lorsque le formulaire d'enregistrement est soumis avec succès
    const handleProduitSaved = () => {
        chargerProduits(); // Recharger la liste des produits pour inclure le nouveau
        setShowAddForm(false); // Cacher le formulaire après l'enregistrement
        setMessage('Produit ajouté avec succès !'); // Message de succès pour l'ajout
        setTimeout(() => setMessage(''), 3000); // Efface le message après 3 secondes
    };

    // Fonction appelée lorsque l'utilisateur annule l'ajout de produit
    const handleCancelAdd = () => {
        setShowAddForm(false); // Cacher le formulaire
    };

    // Nouvelle fonction pour générer la facture
    const genererFacture = async () => {
        if (selectedProductsQuantities.size === 0) {
            setMessage('Veuillez sélectionner au moins un produit pour générer une facture.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        if (!clientName.trim()) {
            setMessage('Veuillez entrer le nom du client.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        const lignesFacture = Array.from(selectedProductsQuantities.entries()).map(([produitId, quantite]) => ({
            produitId: produitId,
            quantite: quantite
        }));

        const requestBody = {
            nomClient: clientName,
            lignes: lignesFacture
        };

        try {
            const response = await axios.post('http://localhost:8080/api/factures', requestBody, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setMessage(`Facture #${response.data.idFacture} pour ${response.data.nomClient} générée avec succès !`);
            setSelectedProductsQuantities(new Map()); // Réinitialiser la sélection
            setClientName(''); // Réinitialiser le nom du client
            chargerProduits(); // Recharger les produits pour voir la mise à jour du stock
            setTimeout(() => setMessage(''), 5000);
        } catch (err) {
            console.error('Erreur lors de la génération de la facture:', err);
            const errorMessage = err.response?.data?.message || 'Échec de la génération de la facture. Vérifiez le stock ou les données.';
            setMessage(`Erreur: ${errorMessage}`);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    if (loading) return (
        <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger mt-4 text-center" role="alert">
            {error}
            <button className="btn btn-sm btn-secondary ms-3" onClick={chargerProduits}>
                Réessayer
            </button>
        </div>
    );

    return (
        <div className="container mx-auto p-4 font-sans text-gray-800"> {/* Couleur de texte par défaut */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Gestion des Produits</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                    {showAddForm ? 'Retour à la Liste' : 'Ajouter un Produit'}
                </button>
            </div>

            {message && (
                <div className={`alert ${message.includes('succès') ? 'alert-success' : 'alert-info'} mt-3 mb-4 text-center`} role="alert">
                    {message}
                </div>
            )}

            {/* Rendu conditionnel de la page : soit le formulaire d'ajout, soit la liste des produits */}
            {showAddForm ? (
                <EnregistrerProduit
                    onSaveSuccess={handleProduitSaved}
                    onCancel={handleCancelAdd}
                />
            ) : (
                <>
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 text-center text-lg font-semibold shadow-sm">
                        Total des produits sélectionnés : {totalPrixSelectionnes} €
                    </div>

                    <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Nom du client..."
                            className="shadow appearance-none border rounded w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Rechercher un produit (nom, type, description)..."
                            className="shadow appearance-none border rounded w-full md:w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            onClick={genererFacture}
                            className="bg-purple-600 hover:bg-purple-700 text-blue-300 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out whitespace-nowrap w-full md:w-auto"
                            disabled={selectedProductsQuantities.size === 0 || !clientName.trim()}
                        >
                            Générer Facture
                        </button>
                    </div>

                    <div className="table-responsive">
                        <Table striped bordered hover className="shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-gray-600">ID</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Nom</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Type</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Description</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Prix</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Stock</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Quantité Facture</th> {/* Nouvelle colonne */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProduits.length > 0 ? (
                                    filteredProduits.map(produit => (
                                        <tr key={produit.idProduit} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-2">{produit.idProduit}</td>
                                            <td className="px-4 py-2">{produit.nomProduit}</td>
                                            <td className="px-4 py-2">{produit.type}</td>
                                            <td className="px-4 py-2">{produit.description}</td>
                                            <td className="px-4 py-2">{produit.prix} €</td>
                                            <td className="px-4 py-2">
                                                <span className={produit.quantiteStock <= 5 && produit.quantiteStock > 0 ? 'text-orange-600 font-bold' : (produit.quantiteStock === 0 ? 'text-red-600 font-bold' : '')}>
                                                    {produit.quantiteStock}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={produit.quantiteStock}
                                                    value={selectedProductsQuantities.get(produit.idProduit) || ''}
                                                    onChange={(e) => handleQuantityChange(produit.idProduit, e.target.value)}
                                                    className="w-20 p-1 border rounded text-center"
                                                    disabled={produit.quantiteStock <= 0} // Désactiver si stock = 0
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-gray-500">Aucun produit trouvé</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </>
            )}
        </div>
    );
}
