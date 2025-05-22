package com.codedev.fullstate_bakend.service;

import com.codedev.fullstate_bakend.model.Produit;
import com.codedev.fullstate_bakend.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Pour la gestion des transactions

import java.util.List;
import java.util.Optional;

/**
 * Classe de service pour la gestion des opérations liées aux produits.
 * Contient la logique métier et interagit avec le ProduitRepository.
 */
@Service // Indique que cette classe est un composant de couche de service
public class ProduitService {

    private final ProduitRepository produitRepository;

    // Injection de dépendances du ProduitRepository via le constructeur
    @Autowired
    public ProduitService(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    /**
     * Enregistre un nouveau produit ou met à jour un produit existant.
     * Gère également l'initialisation du stock si non fourni.
     * @param produit L'objet Produit à enregistrer ou à mettre à jour.
     * @return L'objet Produit enregistré/mis à jour.
     */
    @Transactional // Assure que l'opération est atomique (tout ou rien)
    public Produit enregistrerProduit(Produit produit) {
        // Logique métier avant l'enregistrement (ex: validation)
        if (produit.getNomProduit() == null || produit.getNomProduit().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom du produit ne peut pas être vide.");
        }
        if (produit.getPrix() == null || produit.getPrix().doubleValue() <= 0) {
            throw new IllegalArgumentException("Le prix du produit doit être positif.");
        }
        // Assurez-vous que le stock est initialisé si non fourni lors de la création
        if (produit.getQuantiteStock() == null) {
            produit.setQuantiteStock(0);
        }
        return produitRepository.save(produit);
    }

    /**
     * Récupère tous les produits.
     * @return Une liste de tous les produits.
     */
    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    /**
     * Récupère un produit par son ID.
     * @param id L'ID du produit.
     * @return Un Optional contenant le produit s'il existe, sinon vide.
     */
    public Optional<Produit> getProduitById(Integer id) {
        return produitRepository.findById(id);
    }

    /**
     * Supprime un produit par son ID.
     * @param id L'ID du produit à supprimer.
     */
    @Transactional
    public void supprimerProduit(Integer id) {
        if (!produitRepository.existsById(id)) {
            throw new IllegalArgumentException("Le produit avec l'ID " + id + " n'existe pas.");
        }
        produitRepository.deleteById(id);
    }

    /**
     * Met à jour un produit existant.
     * Inclut la mise à jour du stock.
     * @param id L'ID du produit à mettre à jour.
     * @param produitDetails L'objet Produit contenant les nouvelles informations.
     * @return L'objet Produit mis à jour.
     */
    @Transactional
    public Produit mettreAJourProduit(Integer id, Produit produitDetails) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produit non trouvé avec l'ID : " + id));

        produit.setNomProduit(produitDetails.getNomProduit());
        produit.setType(produitDetails.getType());
        produit.setDescription(produitDetails.getDescription());
        produit.setPrix(produitDetails.getPrix());
        produit.setQuantiteStock(produitDetails.getQuantiteStock()); // <-- Mise à jour du stock

        return produitRepository.save(produit);
    }

    /**
     * Décrémente le stock d'un produit.
     * Cette méthode est typiquement appelée lors d'une vente ou d'une sortie de stock.
     * @param produitId L'ID du produit.
     * @param quantite La quantité à décrémenter.
     * @throws IllegalArgumentException si le stock est insuffisant ou le produit n'existe pas.
     */
    @Transactional
    public void decrementerStock(Integer produitId, Integer quantite) {
        Produit produit = produitRepository.findById(produitId)
                .orElseThrow(() -> new IllegalArgumentException("Produit non trouvé avec l'ID : " + produitId));

        if (produit.getQuantiteStock() == null || produit.getQuantiteStock() < quantite) {
            throw new IllegalArgumentException("Stock insuffisant pour le produit : " + produit.getNomProduit() + ". Stock disponible : " + produit.getQuantiteStock());
        }
        produit.setQuantiteStock(produit.getQuantiteStock() - quantite);
        produitRepository.save(produit);
    }
}
