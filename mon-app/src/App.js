import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import Navbar from './layout/Navbar'; // Suppression de l'import inutilisé

import Navbar from './layout/Navbar';
import Home from './page/Home';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Addutilisateur from './Utilisateurs/Addutilisateur';
import EditUtilisateur from "./Utilisateurs/Editutilisateur";

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar/>
                <Routes>
                    <Route exact path='/' element={<Home/>}/>
                    <Route exact path='/inscrire' element={<Addutilisateur/>}/>
                    <Route exact path="/edit-utilisateur/:id" element={<EditUtilisateur/>}/>

                </Routes>
            </Router>


        </div>
    );
}

export default App;