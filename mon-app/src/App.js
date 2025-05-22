import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import Navbar from './layout/Navbar'; // Suppression de l'import inutilisé

import Navbar from './layout/Navbar';
import Home from './page/Home';
import Accueil from './page/Accueil';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Addutilisateur from './Utilisateurs/Addutilisateur';
import EditUtilisateur from "./Utilisateurs/Editutilisateur";
import LoginUtilisateur from "./Utilisateurs/LoginUtilisateur"
import EnregistrerProduit from './produit/EnregistrerProduit';
import ListeFactures from './page/ListeFactures'; // Le nouveau composant

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar/>
                <Routes>
                    <Route exact path='/' element={<Home/>}/>
                    <Route exact path='/inscrire' element={<Addutilisateur/>}/>
                    <Route exact path="/edit-utilisateur/:id" element={<EditUtilisateur/>}/>
                    <Route exact path="/connecter" element={<LoginUtilisateur/>}/>
                    <Route exact path='/accueil' element={<Accueil/>}/>
                    <Route exact path='#' element={<EnregistrerProduit/>}/>
                    <Route path="/factures" element={<ListeFactures />} />

                </Routes>
            </Router>


        </div>
    );
}

export default App;