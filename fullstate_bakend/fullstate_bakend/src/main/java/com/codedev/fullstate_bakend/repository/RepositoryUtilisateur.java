package com.codedev.fullstate_bakend.repository;

import com.codedev.fullstate_bakend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepositoryUtilisateur extends JpaRepository<Utilisateur, Integer> {

    // Méthodes personnalisées optionnelles


    Optional<Utilisateur> findByEmailAndMotDePasse(String email, String motDePasse);

    Utilisateur findByEmail(String email);
}