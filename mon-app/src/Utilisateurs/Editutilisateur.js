import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';

export default function EditUtilisateur() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [utilisateur, setUtilisateur] = useState({
        nomUtilisateur: '',
        email: '',
        motDePasse: ''
    });

    // Charger les données de l'utilisateur à modifier
    useEffect(() => {
        const loadUtilisateur = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/utilisateurs/${id}`);
                setUtilisateur({
                    nomUtilisateur: response.data.nomUtilisateur,
                    email: response.data.email,
                    motDePasse: '' // On ne charge pas le mot de passe existant pour des raisons de sécurité
                });
            } catch (error) {
                console.error("Erreur lors du chargement:", error);
                alert("Impossible de charger les données de l'utilisateur");
                navigate("/");
            }
        };
        loadUtilisateur();
    }, [id, navigate]);

    const handleChange = (e) => {
        setUtilisateur({
            ...utilisateur,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/utilisateurs/${id}`, utilisateur, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Utilisateur mis à jour avec succès!');
            navigate('/'); // Redirection après mise à jour
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            alert(`Échec de la mise à jour: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Modifier l'utilisateur</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='nomUtilisateur' className='form-label'>
                                Nom d'utilisateur
                            </label>
                            <input
                                type='text'
                                className='form-control'
                                name='nomUtilisateur'
                                value={utilisateur.nomUtilisateur}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='email' className='form-label'>
                                Email
                            </label>
                            <input
                                type='email'
                                className='form-control'
                                name='email'
                                value={utilisateur.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='motDePasse' className='form-label'>
                                Nouveau mot de passe (laisser vide pour ne pas changer)
                            </label>
                            <input
                                type='password'
                                className='form-control'
                                name='motDePasse'
                                value={utilisateur.motDePasse}
                                onChange={handleChange}
                                placeholder='Entrez un nouveau mot de passe'
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button type='submit' className='btn btn-outline-success'>
                                Enregistrer
                            </button>
                            <button
                                type='button'
                                className='btn btn-danger'
                                onClick={handleCancel}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}