import { ItemMenu } from "./itemmenu";

export class Commandes {
    
    private id: number;
    private dateCommande: string;
    //private listProduits: Map<string, number>;
    //private listProduits: string;
    private listProduits: any[];
    private prixTotal: number;

    constructor(id : number ,dateCommande: string, listProduits: ItemMenu[], prixTotal: number) {
        this.id=id;
        this.dateCommande = dateCommande;
        this.listProduits = listProduits;
        this.prixTotal = prixTotal;
    }

    getId() {
        return this.id;
    }

    getDateCommande() {
        return this.dateCommande;
    }

    setDateCommande(dateCommande: string) {
        this.dateCommande = dateCommande;
    }

    getListProduits() {
        return this.listProduits;
    }

    setListProduits(listProduits: any[]) {
        this.listProduits = listProduits;
    }

    getPrixTotal() {
        return this.prixTotal;
    }

    setPrixTotal(prixTotal: number) {
        this.prixTotal = prixTotal;
    }
}
