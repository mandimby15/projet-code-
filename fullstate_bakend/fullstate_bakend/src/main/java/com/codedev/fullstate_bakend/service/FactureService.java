package com.codedev.fullstate_bakend.service; // Assurez-vous que le chemin du package est correct

import com.codedev.fullstate_bakend.dto.CreerFactureRequest;
import com.codedev.fullstate_bakend.dto.LigneFactureDTO;
import com.codedev.fullstate_bakend.model.Facture;
import com.codedev.fullstate_bakend.model.Produit;
import com.codedev.fullstate_bakend.repository.FactureRepository;
import com.fasterxml.jackson.databind.ObjectMapper; // Pour la sérialisation JSON
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Classe de service pour la gestion des opérations liées aux factures.
 * Gère la création de factures, la décrémentation du stock et la sérialisation des produits.
 */
@Service // Indique que cette classe est un composant de couche de service
public class FactureService {

    private final FactureRepository factureRepository;
    private final ProduitService produitService; // Pour interagir avec le stock des produits
    private final ObjectMapper objectMapper; // Pour la sérialisation/désérialisation JSON

    // Injection de dépendances
    @Autowired
    public FactureService(FactureRepository factureRepository,
                          ProduitService produitService,
                          ObjectMapper objectMapper) { // ObjectMapper est injecté automatiquement par Spring Boot
        this.factureRepository = factureRepository;
        this.produitService = produitService;
        this.objectMapper = objectMapper;
    }

    /**
     * Crée une nouvelle facture à partir des données de la requête.
     * Décrémente également le stock des produits et sérialise la liste des produits.
     * @param request L'objet CreerFactureRequest contenant le nom du client et les lignes de facture.
     * @return La facture créée.
     * @throws IllegalArgumentException si le stock est insuffisant, un produit n'est pas trouvé, ou le nom du client est vide.
     */
    @Transactional // Très important pour assurer l'atomicité de la transaction (facture + stock)
    public Facture creerFacture(CreerFactureRequest request) {
        if (request.getLignes() == null || request.getLignes().isEmpty()) {
            throw new IllegalArgumentException("Impossible de créer une facture sans articles.");
        }
        if (request.getNomClient() == null || request.getNomClient().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom du client ne peut pas être vide.");
        }

        Facture facture = new Facture();
        facture.setDateFacture(LocalDateTime.now());
        facture.setNomClient(request.getNomClient());
        facture.setEtatFacture("En attente"); // État initial

        BigDecimal totalFacture = BigDecimal.ZERO;
        // Pour stocker les détails des produits vendus dans la facture (pour la sérialisation)
        List<LigneFactureDTO> produitsVendusPourJson = new java.util.ArrayList<>();

        for (LigneFactureDTO dto : request.getLignes()) {
            Produit produit = produitService.getProduitById(dto.getProduitId())
                    .orElseThrow(() -> new IllegalArgumentException("Produit non trouvé avec l'ID : " + dto.getProduitId()));

            if (produit.getQuantiteStock() == null || produit.getQuantiteStock() < dto.getQuantite()) {
                throw new IllegalArgumentException("Stock insuffisant pour le produit : " + produit.getNomProduit() + ". Stock disponible : " + produit.getQuantiteStock());
            }

            // Décrémenter le stock via le ProduitService
            produitService.decrementerStock(produit.getIdProduit(), dto.getQuantite());

            // Ajouter les détails du produit vendu à la liste pour la sérialisation JSON
            produitsVendusPourJson.add(new LigneFactureDTO(
                    produit.getIdProduit(),
                    produit.getNomProduit(),     // Nom du produit au moment de la vente
                    produit.getType(),           // Type du produit au moment de la vente
                    produit.getPrix(),           // Prix unitaire au moment de la vente
                    dto.getQuantite()
            ));

            totalFacture = totalFacture.add(produit.getPrix().multiply(BigDecimal.valueOf(dto.getQuantite())));
        }

        facture.setTotalFacture(totalFacture);

        try {
            // Sérialise la liste des produits vendus en chaîne JSON
            String produitsJson = objectMapper.writeValueAsString(produitsVendusPourJson);
            facture.setProduitsJson(produitsJson);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            // Gérer l'erreur de sérialisation JSON
            throw new RuntimeException("Erreur lors de la sérialisation des produits de la facture.", e);
        }

        return factureRepository.save(facture); // Sauvegarde la facture
    }

    /**
     * Récupère toutes les factures.
     * @return Une liste de toutes les factures.
     */
    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    /**
     * Récupère une facture par son ID.
     * @param id L'ID de la facture.
     * @return Un Optional contenant la facture s'il existe, sinon vide.
     */
    public Optional<Facture> getFactureById(Integer id) {
        return factureRepository.findById(id);
    }
}
