package com.codedev.fullstate_bakend.controller;

import com.codedev.fullstate_bakend.model.Produit;
import com.codedev.fullstate_bakend.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des opérations sur les produits.
 * Expose les endpoints HTTP pour créer, lire, mettre à jour et supprimer des produits.
 * Ce contrôleur interagit avec le ProduitService qui gère la logique métier, y compris le stock.
 */
@RestController // Indique que cette classe est un contrôleur REST
@RequestMapping("/api/produits") // Définit le chemin de base pour tous les endpoints de ce contrôleur
@CrossOrigin(origins = "http://localhost:3000") // Permet les requêtes depuis votre application React (ajustez le port si nécessaire)
public class ProduitController {

    private final ProduitService produitService;

    // Injection de dépendances du ProduitService via le constructeur
    @Autowired
    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    /**
     * Endpoint pour ajouter un nouveau produit.
     * Le stock initial est géré par le ProduitService.
     * Méthode HTTP: POST
     * URL: /api/produits/ajouter
     * @param produit L'objet Produit envoyé dans le corps de la requête (JSON).
     * @return ResponseEntity contenant le produit enregistré et le statut HTTP CREATED (201).
     */
    @PostMapping("/ajouter")
    public ResponseEntity<Produit> ajouterProduit(@RequestBody Produit produit) {
        try {
            Produit nouveauProduit = produitService.enregistrerProduit(produit);
            return new ResponseEntity<>(nouveauProduit, HttpStatus.CREATED); // Statut 201 Created
        } catch (IllegalArgumentException e) {
            // Gérer les erreurs de validation du service (ex: nom vide, prix négatif)
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); // Statut 400 Bad Request
        } catch (Exception e) {
            // Gérer d'autres erreurs inattendues
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); // Statut 500 Internal Server Error
        }
    }

    /**
     * Endpoint pour récupérer tous les produits.
     * Inclut les informations de stock.
     * Méthode HTTP: GET
     * URL: /api/produits
     * @return Une liste de tous les produits et le statut HTTP OK (200).
     */
    @GetMapping
    public ResponseEntity<List<Produit>> getAllProduits() {
        List<Produit> produits = produitService.getAllProduits();
        return new ResponseEntity<>(produits, HttpStatus.OK); // Statut 200 OK
    }

    /**
     * Endpoint pour récupérer un produit par son ID.
     * Inclut les informations de stock.
     * Méthode HTTP: GET
     * URL: /api/produits/{id}
     * @param id L'ID du produit à récupérer.
     * @return ResponseEntity contenant le produit et le statut HTTP OK (200) si trouvé,
     * sinon NotFound (404).
     */
    @GetMapping("/{id}")
    public ResponseEntity<Produit> getProduitById(@PathVariable Integer id) {
        return produitService.getProduitById(id)
                .map(produit -> new ResponseEntity<>(produit, HttpStatus.OK)) // Si trouvé
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND)); // Si non trouvé
    }

    /**
     * Endpoint pour mettre à jour un produit existant.
     * Permet de modifier le stock du produit.
     * Méthode HTTP: PUT
     * URL: /api/produits/{id}
     * @param id L'ID du produit à mettre à jour.
     * @param produitDetails L'objet Produit contenant les nouvelles données (y compris le stock).
     * @return ResponseEntity contenant le produit mis à jour et le statut HTTP OK (200),
     * sinon NotFound (404) ou BadRequest (400).
     */
    @PutMapping("/{id}")
    public ResponseEntity<Produit> updateProduit(@PathVariable Integer id, @RequestBody Produit produitDetails) {
        try {
            Produit updatedProduit = produitService.mettreAJourProduit(id, produitDetails);
            return new ResponseEntity<>(updatedProduit, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // Gérer les cas où le produit n'est pas trouvé ou validation échoue
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Ou BAD_REQUEST si c'est une erreur de validation
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Endpoint pour supprimer un produit par son ID.
     * Méthode HTTP: DELETE
     * URL: /api/produits/{id}
     * @param id L'ID du produit à supprimer.
     * @return ResponseEntity avec le statut HTTP NO_CONTENT (204) si succès,
     * sinon NotFound (404) ou InternalServerError (500).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteProduit(@PathVariable Integer id) {
        try {
            produitService.supprimerProduit(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Statut 204 No Content (succès sans contenu à retourner)
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Statut 404 Not Found
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // Statut 500 Internal Server Error
        }
    }
}
