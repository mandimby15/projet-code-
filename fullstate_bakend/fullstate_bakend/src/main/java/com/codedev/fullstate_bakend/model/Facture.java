package com.codedev.fullstate_bakend.model; // Assurez-vous que le chemin du package est correct

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entité JPA représentant la table 'factures' dans la base de données.
 * Inclut le nom du client et une représentation JSON des lignes de facture.
 */
@Entity
@Table(name = "factures") // Nom de la table dans la base de données
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_facture")
    private Integer idFacture;

    @Column(name = "date_facture", nullable = false)
    private LocalDateTime dateFacture;

    @Column(name = "nom_client", length = 255) // Nom du client directement dans la facture
    private String nomClient;

    @Column(name = "produits_json", columnDefinition = "TEXT") // Liste des produits sérialisée en JSON
    private String produitsJson; // Stockera une chaîne JSON de List<LigneFactureDTO>

    @Column(name = "total_facture", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalFacture;

    @Column(name = "etat_facture", length = 50)
    private String etatFacture; // Ex: 'En attente', 'Payée', 'Annulée'

    // Constructeur par défaut (requis par JPA)
    public Facture() {
        this.dateFacture = LocalDateTime.now(); // Initialise la date à la création
        this.etatFacture = "En attente"; // État par défaut
    }

    // Getters et Setters
    public Integer getIdFacture() {
        return idFacture;
    }

    public void setIdFacture(Integer idFacture) {
        this.idFacture = idFacture;
    }

    public LocalDateTime getDateFacture() {
        return dateFacture;
    }

    public void setDateFacture(LocalDateTime dateFacture) {
        this.dateFacture = dateFacture;
    }

    public String getNomClient() {
        return nomClient;
    }

    public void setNomClient(String nomClient) {
        this.nomClient = nomClient;
    }

    public String getProduitsJson() {
        return produitsJson;
    }

    public void setProduitsJson(String produitsJson) {
        this.produitsJson = produitsJson;
    }

    public BigDecimal getTotalFacture() {
        return totalFacture;
    }

    public void setTotalFacture(BigDecimal totalFacture) {
        this.totalFacture = totalFacture;
    }

    public String getEtatFacture() {
        return etatFacture;
    }

    public void setEtatFacture(String etatFacture) {
        this.etatFacture = etatFacture;
    }

    @Override
    public String toString() {
        return "Facture{" +
                "idFacture=" + idFacture +
                ", dateFacture=" + dateFacture +
                ", nomClient='" + nomClient + '\'' +
                ", produitsJson='" + produitsJson + '\'' +
                ", totalFacture=" + totalFacture +
                ", etatFacture='" + etatFacture + '\'' +
                '}';
    }
}
