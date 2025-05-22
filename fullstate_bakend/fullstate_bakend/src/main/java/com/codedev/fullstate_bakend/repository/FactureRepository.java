package com.codedev.fullstate_bakend.repository; // Assurez-vous que le chemin du package est correct

import com.codedev.fullstate_bakend.model.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface Repository pour l'entité Facture.
 * Étend JpaRepository pour bénéficier des opérations CRUD standard.
 */
@Repository // Indique que cette interface est un composant de couche de persistance
public interface FactureRepository extends JpaRepository<Facture, Integer> {
    // Spring Data JPA génère automatiquement les implémentations des méthodes CRUD.
}
