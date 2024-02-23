class Controller {
    constructor(view, model) {
      this.view = view;
      this.model = model;
    }
    
    initRecipePage() {
        // Chargez les recettes depuis le modèle
        const recipes = this.model.getRecipes();
        // Obtenez la liste unique d'ingrédients, appareils et ustensiles
    const uniqueItems = this.model.getUniqueItems();

        // Mettez à jour la vue avec les informations nécessaires
    this.view.updateRecipesDisplay({ recipes, uniqueItems });
    };
} 
// Instanciation de la vue, du modèle et du contrôleur
const view = new ListRecipesView();
const model = new Model(recipes);
const controller = new Controller(view, model);
controller.initRecipePage(); // Lancez l'initialisation depuis le contrôleur et mon fichier view
// Appelez la nouvelle méthode pour mettre à jour les listes déroulantes 