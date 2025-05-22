import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print'; // Importez le hook pour l'impression

export default function ListeFactures() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef(); // Référence pour le conteneur de toutes les étiquettes à imprimer

  useEffect(() => {
    const chargerFactures = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/factures', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Assurez-vous que le token est valide
          }
        });
        setFactures(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des factures:', err);
        setError(`Erreur ${err.response?.status || ''}: ${err.message || 'Échec du chargement des factures.'}`);
        setLoading(false);
      }
    };

    chargerFactures();
  }, []);

  // Hook pour gérer l'impression de toutes les factures
  const handlePrintAll = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Liste_Factures_${new Date().toLocaleDateString()}`,
    pageStyle: `
      @page {
        size: auto; /* auto is the initial value */
        margin: 10mm; /* Adjust margins for printing */
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        /* Styles spécifiques pour l'impression des étiquettes */
        .invoice-label {
          border: 1px solid #ccc;
          padding: 15px;
          margin-bottom: 20px; /* Espace entre les étiquettes à l'impression */
          page-break-inside: avoid; /* Évite de couper une étiquette en deux pages */
        }
        /* Masquer le bouton d'impression lors de l'impression */
        .print-button-container {
          display: none;
        }
      }
    `,
  });

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement des factures...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4 text-center" role="alert">
        {error}
        <button className="btn btn-sm btn-secondary ms-3" onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 font-sans">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Liste des Factures</h2>

      {factures.length === 0 ? (
        <div className="alert alert-info text-center">
          Aucune facture trouvée pour le moment.
        </div>
      ) : (
        <>
          <div className="print-button-container flex justify-end mb-4">
            <button
              onClick={handlePrintAll}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Imprimer Toutes les Factures
            </button>
          </div>

          {/* Conteneur de toutes les étiquettes à imprimer */}
          <div ref={componentRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factures.map(facture => {
              const produitsVendus = facture.produitsJson ? JSON.parse(facture.produitsJson) : [];
              return (
                <div key={facture.idFacture} className="invoice-label bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Facture N° {facture.idFacture}</h3>
                  <div className="mb-3 text-gray-700 text-sm">
                    <p><span className="font-semibold">Client:</span> {facture.nomClient}</p>
                    <p><span className="font-semibold">Date:</span> {new Date(facture.dateFacture).toLocaleString()}</p>
                    <p><span className="font-semibold">État:</span> {facture.etatFacture}</p>
                  </div>

                  <h4 className="text-lg font-semibold mb-2 text-gray-800">Détails:</h4>
                  <ul className="list-disc list-inside mb-3 text-gray-700 text-sm">
                    {produitsVendus.length > 0 ? (
                      produitsVendus.map((item, idx) => (
                        <li key={idx}>
                          {item.nomProduit} ({item.quantite} x {item.prixUnitaire}€)
                        </li>
                      ))
                    ) : (
                      <li>Aucun produit</li>
                    )}
                  </ul>

                  <div className="text-right text-lg font-bold text-gray-900 mt-4">
                    Total: {facture.totalFacture} €
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
