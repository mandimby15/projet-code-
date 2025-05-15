import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";

export default function Home() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUtilisateurs = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/utilisateurs');
                setUtilisateurs(response.data);
            } catch (error) {
                console.error('Erreur:', error);
                setError(`Erreur ${error.response?.status || ''}: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchUtilisateurs();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/utilisateurs/${id}`);
            setUtilisateurs(utilisateurs.filter(user => user.idUtilisateur !== id));
            alert('Utilisateur supprimé avec succès');
        } catch (error) {
            console.error('Erreur suppression:', error);
            alert('Échec de la suppression');
        }
    };

    if (loading) return (
        <div className="text-center mt-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Chargement...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger mt-4">
            {error}
            <button className="btn btn-sm btn-secondary ms-3" onClick={() => window.location.reload()}>
                Réessayer
            </button>
        </div>
    );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Liste des Utilisateurs</h2>
                <Link to="/inscrire" className="btn btn-success">
                    Ajouter un utilisateur
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {utilisateurs.length > 0 ? (
                        utilisateurs.map(user => (
                            <tr key={user.idUtilisateur}>
                                <td>{user.idUtilisateur}</td>
                                <td>{user.nomUtilisateur}</td>
                                <td>{user.email}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link
                                            to={`/edit-utilisateur/${user.idUtilisateur}`}
                                            className="btn btn-sm btn-primary me-2"
                                        >
                                            Modifier
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(user.idUtilisateur)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">Aucun utilisateur trouvé</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}