package com.codedev.fullstate_bakend.model; // Remplacez par le package de votre projet

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "produit")
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produit")
    private Integer idProduit;

    @Column(name = "nom_produit")
    private String nomProduit;

    @Column(name = "type")
    private String type;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "prix", precision = 10, scale = 2)
    private BigDecimal prix;

    @Column(name = "quantite_stock")
    private Integer quantiteStock; // Nouvelle colonne

    // Constructeur par défaut (obligatoire pour JPA)
    public Produit() {
    }

    // Constructeur avec paramètres, incluant quantiteStock
    public Produit(String nomProduit, String type, String description, BigDecimal prix, Integer quantiteStock) { // <-- quantiteStock ajouté ici
        this.nomProduit = nomProduit;
        this.type = type;
        this.description = description;
        this.prix = prix;
        this.quantiteStock = quantiteStock; // <-- Initialisation de quantiteStock
    }

    // Getters et Setters
    public Integer getIdProduit() {
        return idProduit;
    }

    public void setIdProduit(Integer idProduit) {
        this.idProduit = idProduit;
    }

    public String getNomProduit() {
        return nomProduit;
    }

    public void setNomProduit(String nomProduit) {
        this.nomProduit = nomProduit;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrix() {
        return prix;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }

    public Integer getQuantiteStock() {
        return quantiteStock;
    }

    public void setQuantiteStock(Integer quantiteStock) {
        this.quantiteStock = quantiteStock;
    }

    @Override
    public String toString() {
        return "Produit{" +
                "idProduit=" + idProduit +
                ", nomProduit='" + nomProduit + '\'' +
                ", type='" + type + '\'' +
                ", description='" + description + '\'' +
                ", prix=" + prix +
                ", quantiteStock=" + quantiteStock + // <-- quantiteStock ajouté ici
                '}';
    }
}
