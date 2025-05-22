package controller;


import model.Utilisateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import repository.RepositoryUtilisateur;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // autorise les requêtes React
@RestController
@RequestMapping("/api/utilisateur")
public class UtilisateurController {

    @Autowired
    private RepositoryUtilisateur repositoryUtilisateur;

    // ✅ GET : /api/utilisateur
    @GetMapping
    public List<Utilisateur> getAllUtilisateur() {
        return repositoryUtilisateur.findAll();
    }

    // ✅ POST : /api/utilisateur
    @PostMapping
    public Utilisateur createUtilisateur(@RequestBody Utilisateur utilisateur) {
        return repositoryUtilisateur.save(utilisateur);
    }
}
