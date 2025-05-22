import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginUtilisateur() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: "",
        motDePasse: ""
    });

    const { email, motDePasse } = credentials;

    const onInputChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/api/utilisateurs/login", // <-- adapte l'URL à ton backend
                {
                    email: credentials.email,
                    motDePasse: credentials.motDePasse
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.status === 200) {
                alert("Connexion réussie !");
                navigate("/accueil"); // adapte à ta route de destination
            }
        } catch (error) {
            console.error("Erreur de connexion :", error);
            alert(`Échec de la connexion : ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Connexion</h2>
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='email' className='form-label'>Email</label>
                            <input
                                type='email'
                                className='form-control'
                                name='email'
                                value={email}
                                onChange={onInputChange}
                                placeholder="Entrez votre email"
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='motDePasse' className='form-label'>Mot de passe</label>
                            <input
                                type='password'
                                className='form-control'
                                name='motDePasse'
                                value={motDePasse}
                                onChange={onInputChange}
                                placeholder="Entrez votre mot de passe"
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button type='submit' className='btn btn-primary'>Se connecter</button>
                            <Link className='btn btn-secondary' to='/inscrire'>Créer un compte</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
