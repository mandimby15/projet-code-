package com.codedev.fullstate_bakend.controller; // Assurez-vous que le chemin du package est correct

import com.codedev.fullstate_bakend.dto.CreerFactureRequest;
import com.codedev.fullstate_bakend.model.Facture;
import com.codedev.fullstate_bakend.service.FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des opérations sur les factures.
 * Expose les endpoints HTTP pour créer et récupérer des factures.
 */
@RestController // Indique que cette classe est un contrôleur REST
@RequestMapping("/api/factures") // Définit le chemin de base pour tous les endpoints de ce contrôleur
@CrossOrigin(origins = "http://localhost:3000") // Permet les requêtes depuis votre application React (ajustez le port si nécessaire)
public class FactureController {

    private final FactureService factureService;

    // Injection de dépendances du FactureService via le constructeur
    @Autowired
    public FactureController(FactureService factureService) {
        this.factureService = factureService;
    }

    /**
     * Endpoint pour créer une nouvelle facture.
     * Le corps de la requête doit être un objet CreerFactureRequest.
     * Exemple de corps JSON:
     * {
     * "nomClient": "Client A",
     * "lignes": [
     * { "produitId": 1, "quantite": 2 },
     * { "produitId": 3, "quantite": 1 }
     * ]
     * }
     * Méthode HTTP: POST
     * URL: /api/factures
     * @param request L'objet CreerFactureRequest envoyé dans le corps de la requête (JSON).
     * @return ResponseEntity contenant la facture créée et le statut HTTP CREATED (201).
     */
    @PostMapping
    public ResponseEntity<Facture> creerFacture(@RequestBody CreerFactureRequest request) {
        try {
            Facture nouvelleFacture = factureService.creerFacture(request);
            return new ResponseEntity<>(nouvelleFacture, HttpStatus.CREATED); // Statut 201 Created
        } catch (IllegalArgumentException e) {
            // Gérer les erreurs de validation du service (ex: stock insuffisant, nom client vide)
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); // Statut 400 Bad Request
        } catch (Exception e) {
            // Gérer d'autres erreurs inattendues
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); // Statut 500 Internal Server Error
        }
    }

    /**
     * Endpoint pour récupérer toutes les factures.
     * Méthode HTTP: GET
     * URL: /api/factures
     * @return Une liste de toutes les factures et le statut HTTP OK (200).
     */
    @GetMapping
    public ResponseEntity<List<Facture>> getAllFactures() {
        List<Facture> factures = factureService.getAllFactures();
        return new ResponseEntity<>(factures, HttpStatus.OK); // Statut 200 OK
    }

    /**
     * Endpoint pour récupérer une facture par son ID.
     * Méthode HTTP: GET
     * URL: /api/factures/{id}
     * @param id L'ID de la facture à récupérer.
     * @return ResponseEntity contenant la facture et le statut HTTP OK (200) si trouvée,
     * sinon NotFound (404).
     */
    @GetMapping("/{id}")
    public ResponseEntity<Facture> getFactureById(@PathVariable Integer id) {
        return factureService.getFactureById(id)
                .map(facture -> new ResponseEntity<>(facture, HttpStatus.OK)) // Si trouvée
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND)); // Si non trouvée
    }
}
