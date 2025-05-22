package com.codedev.fullstate_bakend.repository;

 // Assurez-vous que ce package correspond à l'emplacement de votre repository

import com.codedev.fullstate_bakend.model.Produit; // <--- C'EST LA LIGNE CLÉ ! Assurez-vous que ce chemin est correct.
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface Repository pour l'entité Produit.
 * Étend JpaRepository pour bénéficier des opérations CRUD standard.
 * Le premier type générique est l'entité (Produit), le second est le type de sa clé primaire (Integer).
 */
@Repository // Indique que cette interface est un composant de couche de persistance
public interface ProduitRepository extends JpaRepository<Produit, Integer> {
    // Spring Data JPA génère automatiquement les implémentations des méthodes CRUD.
    // Vous pouvez ajouter des méthodes de requête personnalisées ici si nécessaire.
}

