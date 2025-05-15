import React from 'react';
import {Link} from 'react-router-dom'; // Importez le composant Link

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    Gestion de stok

                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                    <div className="d-flex ms-auto">
                        <Link className="btn btn-outline-danger" to="/inscrire">se
                            connecter</Link> {/* Utilisez le composant Link pour le lien d'inscription */}
                    </div>
                </div>
            </div>
        </nav>
    );
}