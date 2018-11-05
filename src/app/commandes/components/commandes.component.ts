import { Component, OnInit } from '@angular/core';
import { ItemMenu } from '../models/itemmenu';
import { Commandes } from '../models/commandes';
import { CommandesService } from '../services/commandes.service';
import { ProduitsService } from '../../core/produits/services/produits.service';
import { Produits } from '../../core/produits/models/produits';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProduitsEnVenteService } from 'src/app/core/produitEnVente/services/produitsEnVente';
import { ProduitsEnVente } from 'src/app/core/produitEnVente/model/produitsEnVente';


/**
 * gestion des commandes prises par l'employé
 */
@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {

  /**
   * liste temporaire de produits
   */
  mapProduitsCommandes: Map<String,number>;

  produitsEnBase : Observable<Produits[]>;

  produitsEnVente : Observable<ProduitsEnVente[]>;

  mapQuantiteRestante: Map<String,number>;

  listProduits : ItemMenu[];

  totalquantiteRestante: number = 0;

  prixTotal: number = 0;

  mapPrixProduits :  Map<String,number>;

  constructor(
    private commandesService: CommandesService,
    private produitsService: ProduitsService,
    private produitenventeservice: ProduitsEnVenteService
  ) {
    this.mapQuantiteRestante = new Map<String,number>();
    this.mapProduitsCommandes = new Map<String,number>();
  }

  ngOnInit() {

    this.recupAllProduits();
    this.recupAllProduitEnVente();
    this.generateCompteurCategorie();
    console.log(this.mapQuantiteRestante)
  }

  recupAllProduits() {
    this.produitsEnBase=this.produitsService.getListProduits()
  }

  recupAllProduitEnVente() {
    this.produitsEnVente=this.produitenventeservice.getProduitEnVente()
  }

  getQuantiteRestante(libelle): number{
    return this.mapQuantiteRestante.get(libelle);
  }

  getQuantiteCommandee(libelle): number{
    return this.mapProduitsCommandes.get(libelle);
  }

  setQuantiteCommandee(libelle, quantite){
    this.mapProduitsCommandes.set(libelle,quantite);
  }

  getPrixProduit(libelle): number{
    return this.mapPrixProduits.get(libelle);
  }

  recupPrixProduit(libelle){
    let listproduitsenvente:Observable<ProduitsEnVente[]> = this.produitenventeservice.getProduitEnVente();

    listproduitsenvente.forEach(
      (produitsEnVente:ProduitsEnVente[]) => {
        produitsEnVente.forEach(
          (produitEnVente:ProduitsEnVente) => {
            this.mapPrixProduits.set(
              produitEnVente.libelle,
              produitEnVente.prixvente
            );
          }
        );
      }
    );
  }

  generateCompteurCategorie(): void{
    this.mapQuantiteRestante = new Map<String,number>();

    let listproduit:Observable<Produits[]> = this.produitsService.getListProduits();
    let listproduitsenvente:Observable<ProduitsEnVente[]> = this.produitenventeservice.getProduitEnVente();
    
    listproduitsenvente.forEach(
      (produitsEnVente:ProduitsEnVente[]) => {
        produitsEnVente.forEach(
          (produitEnVente:ProduitsEnVente) => {
              this.mapQuantiteRestante.set(produitEnVente.libelle,0);
          }
        );
      }
    );

    listproduit.forEach(
      (produits:Produits[]) => {
        produits.forEach(
          (produit:Produits) => {
            if(this.mapQuantiteRestante.get(produit.libelle)===undefined){
              this.mapQuantiteRestante.set(
                produit.libelle,
                produit.quantiteRestante
              );
            }else{
              console.log("autre")
              if (produit.libelle === "Frite"){
                console.log("produit.libelle "+produit.libelle)
                this.mapQuantiteRestante.set(
                  "Grande", 
                  produit.quantiteRestante + this.mapQuantiteRestante.get("Frite")
                );
                console.log(produit.quantiteRestante)
                this.mapQuantiteRestante.set(
                  "Moyenne", 
                  produit.quantiteRestante + this.mapQuantiteRestante.get("Frite")
                );
                console.log(produit.quantiteRestante)
                this.mapQuantiteRestante.set(
                  "Petite", 
                  produit.quantiteRestante + this.mapQuantiteRestante.get("Frite")
                );
                console.log(produit.quantiteRestante)
              }else{
                console.log("else")
                console.log("else"+produit.libelle)
                this.mapQuantiteRestante.set(
                              produit.libelle, 
                              produit.quantiteRestante + this.mapQuantiteRestante.get(produit.libelle)
                            );
              }         
            }
          }
        )
      }
    );
  }

  /**
   * ajoute un produit dans la liste des produits commandés par le client et à l'affichage en dessous de l'item
   * @param produit
   */
  ajout(produit: Produits) {
    if ((this.getQuantiteRestante(produit.libelle) > 0) && ( this.getQuantiteCommandee(produit.libelle) < this.getQuantiteRestante(produit.libelle) ) ) {
      this.setQuantiteCommandee(produit.libelle, this.getQuantiteRestante(produit.libelle) + 1);
      this.ajouterPrix(this.getPrixProduit(produit.libelle));
      if (this.listProduits.length > 0) {
        let i;
        let trouve: boolean = false;

        for (i = 0; (i < this.listProduits.length); i++) {
          if (this.listProduits[i].getLibelle() === produit.libelle) {
            this.listProduits[i].setQuantite(this.listProduits[i].getQuantite());
            trouve = true;
            break;
          }
        }
        if (!trouve) {
          this.listProduits[this.listProduits.length] = new ItemMenu(produit.libelle, this.getQuantiteRestante(produit.libelle), this.getPrixProduit(produit.libelle));

        }
      } else {
        this.listProduits[0] = new ItemMenu(produit.libelle, this.getQuantiteRestante(produit.libelle), this.getPrixProduit(produit.libelle));
      }
    } else {
      alert("Le stock de "+ produit.libelle + " est épuisé")
    }
  }

  /**
   * retire un produit dans la liste des produits commandés par le client et à l'affichage en dessous de l'item
   * @param produit
   */
  retirer(produit: Produits) {
    if (this.getQuantiteRestante(produit.libelle) > 0) {
      this.setQuantiteCommandee(produit.libelle, this.getQuantiteRestante(produit.libelle) - 1);
      this.retirerPrix(this.getPrixProduit(produit.libelle));
      let i;
      for (i = 0; (i < this.listProduits.length); i++) {
        if (this.listProduits[i].getLibelle() === produit.libelle) {
          if (this.listProduits[i].getQuantite()==0){
            this.listProduits.splice(i, 1);
          }else{  
            this.listProduits[i].setQuantite(this.listProduits[i].getQuantite())
          }
        }
      }
    }else {
      alert("Vous n'en avez pas encore commandé")
    }
  }

  /**
   * ajoute au total le prix du produit commandé
   * @param produit
   */
  ajouterPrix(prix: number) {
    this.prixTotal += prix;
  }

  /**
   * retire au total le prix du produit annulé par le client
   * @param produit
   */
  retirerPrix(prix: number) {
    this.prixTotal -= prix;
  }


}