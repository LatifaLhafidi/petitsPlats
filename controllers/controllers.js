class Controller {
    constructor(view, model) {
      this.view = view;
      this.model = model;
      this.filteredBySearch = []; // Ajoutez cette ligne
    }
  
    initRecipePage() {
      // Chargez les recettes depuis le modèle
      const recipes = this.model.getRecipes();
  
      // Obtenez la liste unique d'ingrédients, appareils et ustensiles
      const uniqueItems = this.model.getUniqueItems();
  
      // Mettez à jour la vue avec les informations nécessaires
      this.view.updateRecipesDisplay({ recipes, uniqueItems });
    }
// filtrer une liste de recettes en fonction des ingrédients, appareils et ustensiles sélectionnés par l'utilisateur
    filterRecipes(selectedIngredients, selectedAppareils, selectedUstensiles) {
      const allRecipes = this.model.getRecipes();
      const filteredRecipes = this.filterByIngredients(allRecipes, selectedIngredients)
                              .filterByAppareils(selectedAppareils)
                              .filterByUstensiles(selectedUstensiles)
                              .getFilteredRecipes();
      
      this.updateRecipesDisplay(filteredRecipes);
      this.updateDropdownsBasedOnFilteredRecipes(filteredRecipes);
      
      return filteredRecipes;
  }
  
  filterByIngredients(recipes, selectedIngredients) {
      return {
          recipes: recipes.filter(recipe =>
              selectedIngredients.length === 0 ||
              selectedIngredients.every(ingredient =>
                  recipe.ingredients.some(recipeIngredient =>
                      recipeIngredient.ingredient.toLowerCase().includes(ingredient.toLowerCase())
                  )
              )
          ),
          filterByAppareils: this.filterByAppareils,
          filterByUstensiles: this.filterByUstensiles,
          getFilteredRecipes: this.getFilteredRecipes
      };
  }
  
  filterByAppareils(selectedAppareils) {
      return {
          ...this,
          recipes: this.recipes.filter(recipe =>
              selectedAppareils.length === 0 ||
              selectedAppareils.every(appareil =>
                  recipe.appliance.toLowerCase().includes(appareil.toLowerCase())
              )
          )
      };
  }
  
  filterByUstensiles(selectedUstensiles) {
      return {
          ...this,
          recipes: this.recipes.filter(recipe =>
              selectedUstensiles.length === 0 ||
              selectedUstensiles.every(ustensile =>
                  recipe.ustensils.some(recipeUstensile =>
                      recipeUstensile.toLowerCase().includes(ustensile.toLowerCase())
                  )
              )
          )
      };
  }
  
  getFilteredRecipes() {
      return this.recipes;
  }
  
  updateRecipesDisplay(recipes) {
      this.view.updateRecipesDisplay({ recipes });
  }

  // la méthode pour gérer le filtrage supplémentaire
  handleAdditionalFiltering() {
    // Utilisez les éléments sélectionnés pour filtrer les recettes
    const selectedIngredients = this.view.getSelectedItems("ingredients");
    const selectedAppareils = this.view.getSelectedItems("appareils");
    const selectedUstensiles = this.view.getSelectedItems("ustensiles");

    // Si des filtres de recherche sont appliqués, utilisez les recettes filtrées par la recherche principale
    const filteredRecipes =
      controller.filteredBySearch.length > 0
        ? controller.filteredBySearch
        : this.filterRecipes(
            selectedIngredients,
            selectedAppareils,
            selectedUstensiles
          );

    // Mise à jour de l'affichage des recettes avec le résultat filtré
    this.view.updateRecipesDisplay({ recipes: filteredRecipes });

    // Mettez à jour les listes déroulantes basées sur les recettes filtrées
    this.updateDropdownsBasedOnFilteredRecipes(filteredRecipes);
  }

  updateDropdownsBasedOnFilteredRecipes(allRecipes) {
    // Utiliser les recettes filtrées au lieu de toutes les recettes
    // const allRecipes = this.filteredBySearch || [];
    let uniqueItems = {};
    // Extraire les ingrédients, appareils et ustensiles des recettes filtrées
    uniqueItems["ingredients"] = Array.from(
      new Set(
        allRecipes.flatMap((recipe) =>
          recipe.ingredients.map((ingredient) =>
            ingredient.ingredient.toLowerCase()
          )
        )
      )
    );
 
    uniqueItems["appareils"] = Array.from(
      new Set(allRecipes.map((recipe) => recipe.appliance.toLowerCase()))
    );

    uniqueItems["ustensiles"] = Array.from(
      new Set(
        allRecipes.flatMap((recipe) =>
          recipe.ustensils.map((ustensil) => ustensil.toLowerCase())
        )
      )
    );
    this.view.updateDropdowns(uniqueItems, "ingredients");
    this.view.updateDropdowns(uniqueItems, "appareils");
    this.view.updateDropdowns(uniqueItems, "ustensiles");
  }
  
  //méthode pour faire la recherche principale 
  handleSearch(query) {
    const normalizedQuery = this.normalizeString(query);
    console.log("Normalized Query:", normalizedQuery);

    //Les recettes sont filtrées en fonction de ces sélections.
    let filteredRecipes = this.filterRecipes(
      this.view.getSelectedItems("ingredients"),
      this.view.getSelectedItems("appareils"),
      this.view.getSelectedItems("ustensiles")
    );

    filteredRecipes = this.searchByText(filteredRecipes, normalizedQuery);

    // Mettre à jour la liste des recettes filtrées par la recherche principale
    controller.filteredBySearch = filteredRecipes;

    // Mettre à jour l'affichage des recettes avec le résultat filtré
    this.view.updateRecipesDisplay({ recipes: filteredRecipes });
    console.log(filteredRecipes);

    //Mise à jour des menus déroulants :
    this.updateDropdownsBasedOnFilteredRecipes(filteredRecipes);
  }
    // Méthode pour normaliser une chaîne de caractères en minuscules sans accents
    //assure que la chaîne de caractères est uniforme en minuscules et sans espaces inutiles.
    normalizeString(str) {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }
    //filteredRecipes (la liste de recettes à filtrer) et query (le terme de recherche).

    // filteredRecipes (la liste de recettes à filtrer) et searchValue (le terme de recherche).
  // la version fonctionnelle 
  searchByText(filtredRecipes,searchValue) {
    // Utilisez le paramètre query ici au lieu de normalizedQuery
    return filtredRecipes.filter((recipe) => {
      let recipeNameIncluded = recipe.name.toLowerCase().includes(searchValue);
      let descriptionIncluded = recipe.description.toLowerCase().includes(searchValue);
      let appliancesIncluded = recipe.appliance.toLowerCase().includes(searchValue);
      let utensilsIncluded = recipe.ustensils.includes(searchValue);
      let ingredientsIncluded = recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(searchValue) 
      );
      return ingredientsIncluded || recipeNameIncluded || descriptionIncluded || appliancesIncluded || utensilsIncluded;
    });
  
  }
   
  }
  
  // Instanciation de la vue, du modèle et du contrôleur
  const view = new ListRecipesView();
  const model = new Model(recipes);
  const controller = new Controller(view, model);
  
  controller.initRecipePage(); // Lancez l'initialisation depuis le contrôleur et mon fichier view
  // Appelez la nouvelle méthode pour mettre à jour les listes déroulantes
  const uniqueItems = model.getUniqueItems();
  view.updateDropdowns(uniqueItems);
  view.updateDropdowns(uniqueItems, "ingredients");
  view.updateDropdowns(uniqueItems, "appareils");
  view.updateDropdowns(uniqueItems, "ustensiles");
  