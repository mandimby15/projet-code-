import React, {useState} from 'react';
import axios from 'axios';
import {Link, Links, useNavigate} from "react-router-dom";

export default function AddUtilisateur() {
    const navigate = useNavigate();
    const [utilisateur, setUtilisateur] = useState({
        nomUtilisateur: "",
        email: "",
        motDePasse: ""
    });

    const {nomUtilisateur, email, motDePasse} = utilisateur;

    const onInputChange = (e) => {
        setUtilisateur({...utilisateur, [e.target.name]: e.target.value});
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/api/utilisateurs",
                {
                    nomUtilisateur: utilisateur.nomUtilisateur,
                    email: utilisateur.email,
                    motDePasse: utilisateur.motDePasse
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert("Utilisateur enregistré avec succès !");
                setUtilisateur({
                    nomUtilisateur: "",
                    email: "",
                    motDePasse: "",
                });
                navigate("/"); // Navigation vers la page d'accueil après succès
            }
        } catch (error) {
            console.error("Détails de l'erreur:", error);
            alert(`Échec de l'enregistrement: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleCancel = () => {
        navigate("/"); // Navigation vers la page d'accueil lors de l'annulation
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Enregistrer un utilisateur</h2>
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='nomUtilisateur' className='form-label'>
                                Nom d'utilisateur
                            </label>
                            <input
                                type='text'
                                className='form-control'
                                name='nomUtilisateur'
                                value={nomUtilisateur}
                                onChange={onInputChange}
                                placeholder='Entrez le nom'
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
                                value={email}
                                onChange={onInputChange}
                                placeholder="Entrez l'email"
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='motDePasse' className='form-label'>
                                Mot de passe
                            </label>
                            <input
                                type='password'
                                className='form-control'
                                name='motDePasse'
                                value={motDePasse}
                                onChange={onInputChange}
                                placeholder='Entrez le mot de passe'
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button type='submit' className='btn btn-outline-primary'>
                                Enregistrer
                            </button>
                            <Link
                                type='button'
                                className='btn btn-danger'
                                onClick={handleCancel}
                                to="/"
                            >
                                Annuler
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}