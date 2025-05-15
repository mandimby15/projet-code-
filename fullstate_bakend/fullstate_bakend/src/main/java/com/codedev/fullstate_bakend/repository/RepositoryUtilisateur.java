package com.codedev.fullstate_bakend.repository;

import com.codedev.fullstate_bakend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositoryUtilisateur extends JpaRepository<Utilisateur, Integer> {
    // Méthodes personnalisées optionnelles
    Utilisateur findByEmail(String email);
}