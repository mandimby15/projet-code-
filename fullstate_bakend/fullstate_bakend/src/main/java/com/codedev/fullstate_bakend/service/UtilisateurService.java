package com.codedev.fullstate_bakend.service;

import com.codedev.fullstate_bakend.model.Utilisateur;
import com.codedev.fullstate_bakend.repository.RepositoryUtilisateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UtilisateurService {

    @Autowired
    private RepositoryUtilisateur repositoryUtilisateur;

    public Optional<Utilisateur> authentifier(String email, String motDePasse) {
        return repositoryUtilisateur.findByEmailAndMotDePasse(email, motDePasse);
    }
}
