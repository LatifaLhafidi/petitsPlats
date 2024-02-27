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
      // Nouvelle méthode pour mettre à jour l'affichage des recettes
    updateRecipesDisplay(data) {
        this.view.updateRecipesDisplay(data);
      }
      // Méthode pour gérer la recherche principale
    handleSearch(query) {
        const normalizedQuery = this.normalizeString(query);
        console.log("Normalized Query:", normalizedQuery);
    
        // Filtrer les recettes en fonction de la requête
        let filteredRecipes = this.filterRecipes(
          this.view.getSelectedItems("ingredients"),
          this.view.getSelectedItems("appareils"),
          this.view.getSelectedItems("ustensiles")
        );
    
        filteredRecipes = this.filterByText(filteredRecipes, normalizedQuery);
    
        // Mettre à jour la liste des recettes filtrées par la recherche principale
        controller.filteredBySearch = filteredRecipes;
    
        // Mettre à jour l'affichage des recettes avec le résultat filtré
        this.view.updateRecipesDisplay({ recipes: filteredRecipes });
        console.log(filteredRecipes);
    
        this.updateDropdownsBasedOnFilteredRecipes(filteredRecipes);
      }
      //filtre les recettes en fonction d'une requête texte.
    filterByText(filteredRecipes, query) {
        // Utilisez le paramètre query ici au lieu de normalizedQuery
        return filteredRecipes.filter((recipe) => {
          const normalizedRecipeData = this.normalizeRecipeData(recipe);
    
          // Recherche dans le nom, la description et les ingrédients
          const searchableText = (
            normalizedRecipeData.name +
            normalizedRecipeData.description +
            normalizedRecipeData.ingredients
              .map((ingredient) => ingredient.ingredient)
              .join(" ")
          )
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    
          return searchableText.includes(
            query
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          );
        });
      }
    
      // Méthode pour normaliser une chaîne de caractères en minuscules sans accents
      normalizeString(str) {
        return str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      }
    
    
} 
// Instanciation de la vue, du modèle et du contrôleur
const view = new ListRecipesView();
const model = new Model(recipes);
const controller = new Controller(view, model);
controller.initRecipePage(); // Lancez l'initialisation depuis le contrôleur et mon fichier view
// Appelez la nouvelle méthode pour mettre à jour les listes déroulantes 