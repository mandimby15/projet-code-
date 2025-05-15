package com.codedev.fullstate_bakend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utilisateur")
    private Integer idUtilisateur;

    @Column(name = "nom_utilisateur")
    private String nomUtilisateur;

    private String email;

    @Column(name = "mot_de_passe")
    private String motDePasse;

    // Note: Il y a une colonne en double 'motdepasse' dans votre table
    // Je ne l'inclus pas ici car elle semble redondante avec 'mot_de_passe'

    // Constructeurs
    public Utilisateur() {
    }

    public Utilisateur(String nomUtilisateur, String email, String motDePasse) {
        this.nomUtilisateur = nomUtilisateur;
        this.email = email;
        this.motDePasse = motDePasse;
    }

    // Getters et Setters
    public Integer getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(Integer idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }

    public String getNomUtilisateur() {
        return nomUtilisateur;
    }

    public void setNomUtilisateur(String nomUtilisateur) {
        this.nomUtilisateur = nomUtilisateur;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }
}