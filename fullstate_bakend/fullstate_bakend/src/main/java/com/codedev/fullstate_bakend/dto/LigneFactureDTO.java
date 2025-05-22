package com.codedev.fullstate_bakend.dto; // Créez un nouveau package 'dto'

import java.math.BigDecimal;

/**
 * DTO représentant une ligne de facture pour la création et la sérialisation.
 * Contient les détails du produit au moment de la vente.
 */
public class LigneFactureDTO {
    private Integer produitId;
    private String nomProduit;     // Nom du produit au moment de la vente
    private String type;           // Type du produit au moment de la vente
    private BigDecimal prixUnitaire; // Prix unitaire au moment de la vente
    private Integer quantite;

    // Constructeur par défaut
    public LigneFactureDTO() {}

    // Constructeur pour la réception des données du frontend (seulement ID et quantité)
    public LigneFactureDTO(Integer produitId, Integer quantite) {
        this.produitId = produitId;
        this.quantite = quantite;
    }

    // Constructeur complet pour la sérialisation dans Facture.produitsJson
    public LigneFactureDTO(Integer produitId, String nomProduit, String type, BigDecimal prixUnitaire, Integer quantite) {
        this.produitId = produitId;
        this.nomProduit = nomProduit;
        this.type = type;
        this.prixUnitaire = prixUnitaire;
        this.quantite = quantite;
    }

    // Getters et Setters
    public Integer getProduitId() { return produitId; }
    public void setProduitId(Integer produitId) { this.produitId = produitId; }
    public String getNomProduit() { return nomProduit; }
    public void setNomProduit(String nomProduit) { this.nomProduit = nomProduit; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public BigDecimal getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(BigDecimal prixUnitaire) { this.prixUnitaire = prixUnitaire; }
    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }
}
