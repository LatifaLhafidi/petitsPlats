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
    
    //filtre les recettes en fonction des ingrédients, appareils et ustensiles sélectionnés.
    filterRecipes(selectedIngredients, selectedAppareils, selectedUstensiles) {
        // Obtenez toutes les recettes du modèle
        const allRecipes = this.model.getRecipes();
    
        // Filtrez les recettes en fonction des sélections
        const filteredRecipes = allRecipes.filter((recipe) => {
          // Vérifiez les ingrédients
          const hasSelectedIngredients =
            selectedIngredients.length === 0 ||
            selectedIngredients.every((ingredient) =>
              recipe.ingredients.some((recipeIngredient) =>
                recipeIngredient.ingredient
                  .toLowerCase()
                  .includes(ingredient.toLowerCase())
              )
            );
    
          // Vérifiez les appareils
          const hasSelectedAppareils =
            selectedAppareils.length === 0 ||
            selectedAppareils.every((appareil) =>
              recipe.appliance.toLowerCase().includes(appareil.toLowerCase())
            );
    
          // Vérifiez les ustensiles
          const hasSelectedUstensiles =
            selectedUstensiles.length === 0 ||
            selectedUstensiles.every((ustensile) =>
              recipe.ustensils.some((recipeUstensile) =>
                recipeUstensile.toLowerCase().includes(ustensile.toLowerCase())
              )
            );
    
          // Retournez true si la recette correspond à toutes les sélections
          return (
            hasSelectedIngredients && hasSelectedAppareils && hasSelectedUstensiles
          );
        });
    
        // Mettre à jour l'affichage des recettes avec le résultat filtré
        this.view.updateRecipesDisplay({ recipes: filteredRecipes });
    
        this.updateDropdownsBasedOnFilteredRecipes(filteredRecipes);
    
        // Retournez le tableau de recettes filtrées
        return filteredRecipes;
      }
    
} 
// Instanciation de la vue, du modèle et du contrôleur
const view = new ListRecipesView();
const model = new Model(recipes);
const controller = new Controller(view, model);
controller.initRecipePage(); // Lancez l'initialisation depuis le contrôleur et mon fichier view
// Appelez la nouvelle méthode pour mettre à jour les listes déroulantes 