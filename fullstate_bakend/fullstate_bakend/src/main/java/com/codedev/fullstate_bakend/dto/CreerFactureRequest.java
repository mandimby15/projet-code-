package com.codedev.fullstate_bakend.dto;

import java.util.List;

/**
 * DTO pour la création d'une nouvelle facture.
 * Contient le nom du client et la liste des lignes de facture (produitId et quantite).
 */
public class CreerFactureRequest {
    private String nomClient;
    private List<LigneFactureDTO> lignes; // Liste des produits et quantités

    // Constructeurs
    public CreerFactureRequest() {}

    public CreerFactureRequest(String nomClient, List<LigneFactureDTO> lignes) {
        this.nomClient = nomClient;
        this.lignes = lignes;
    }

    // Getters et Setters
    public String getNomClient() {
        return nomClient;
    }

    public void setNomClient(String nomClient) {
        this.nomClient = nomClient;
    }

    public List<LigneFactureDTO> getLignes() {
        return lignes;
    }

    public void setLignes(List<LigneFactureDTO> lignes) {
        this.lignes = lignes;
    }
}
