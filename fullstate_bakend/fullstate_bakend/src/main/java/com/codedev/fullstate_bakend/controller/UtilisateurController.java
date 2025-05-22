package com.codedev.fullstate_bakend.controller;

import com.codedev.fullstate_bakend.model.Utilisateur;
import com.codedev.fullstate_bakend.repository.RepositoryUtilisateur;
import com.codedev.fullstate_bakend.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    @Autowired
    private RepositoryUtilisateur repositoryUtilisateur;


    @Autowired
    private UtilisateurService utilisateurService;



    // GET pour récupérer tous les utilisateurs
    @GetMapping
    public List<Utilisateur> getAllUtilisateurs() {
        return repositoryUtilisateur.findAll();
    }

    // POST pour créer un utilisateur
    @PostMapping
    public Utilisateur createUtilisateur(@RequestBody Utilisateur utilisateur) {
        return repositoryUtilisateur.save(utilisateur);
    }

    // DELETE pour supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Integer id) {
        if (repositoryUtilisateur.existsById(id)) {
            repositoryUtilisateur.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // PUT pour mettre à jour un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(
            @PathVariable Integer id,
            @RequestBody Utilisateur utilisateurDetails) {

        return repositoryUtilisateur.findById(id)
                .map(utilisateur -> {
                    utilisateur.setNomUtilisateur(utilisateurDetails.getNomUtilisateur());
                    utilisateur.setEmail(utilisateurDetails.getEmail());
                    // Ne met à jour le mot de passe que s'il est fourni
                    if (utilisateurDetails.getMotDePasse() != null
                            && !utilisateurDetails.getMotDePasse().isEmpty()) {
                        utilisateur.setMotDePasse(utilisateurDetails.getMotDePasse());
                    }
                    Utilisateur updatedUtilisateur = repositoryUtilisateur.save(utilisateur);
                    return ResponseEntity.ok(updatedUtilisateur);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Utilisateur loginRequest) {
        return utilisateurService.authentifier(loginRequest.getEmail(), loginRequest.getMotDePasse())
                .map(utilisateur -> ResponseEntity.ok().body("Connexion réussie"))
                .orElse(ResponseEntity.status(401).body("Email ou mot de passe invalide"));
    }
}