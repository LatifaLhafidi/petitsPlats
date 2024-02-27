class ListRecipesView {
    constructor() {
      //selectionné les elements de DOMCX
      this.searchButtonDropdowns = document.querySelectorAll(".searchChoix");


        // Assurez-vous que la méthode updateRecipesDisplay est correctement liée à l'instance actuelle
    this.updateRecipesDisplay = this.updateRecipesDisplay.bind(this);
        // Ajout des propriétés pour suivre les éléments sélectionnés
    this.selectedItems = {
        ingredients: [],
        appareils: [],
        ustensiles: [],
      };
       // Ajout de la propriété uniqueItems
    this.uniqueItems = {
        ingredients: [],
        appareils: [],
        ustensiles: [],
      };

      //ajouter un EventListenner

      
       this.searchButtonDropdowns.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        // Utilisation des éléments sélectionnés dans les dropdowns pour filtrer les recettes
        const selectedIngredients = this.getSelectedItems("ingredients");
        const selectedAppareils = this.getSelectedItems("appareils");
        const selectedUstensiles = this.getSelectedItems("ustensiles");

        // Filtrage des recettes en fonction des éléments sélectionnés
        const filteredRecipes = controller.filterRecipes(
          selectedIngredients,
          selectedAppareils,
          selectedUstensiles
        );

        // Si des filtres de recherche sont appliqués, effectuez l'intersection
        let finalFilteredRecipes;

        if (controller.filteredBySearch.length > 0) {
          finalFilteredRecipes = controller.filteredBySearch.filter(
            (recipeBySearch) =>
              filteredRecipes.some((recipe) => recipe.id === recipeBySearch.id)
          );
        } else {
          // Sinon, utilisez les recettes filtrées directement
          finalFilteredRecipes = filteredRecipes;
        }

        // Mise à jour de l'affichage des recettes avec le résultat filtré
        // Utilisez directement updateRecipesDisplay, pas this.view.updateRecipesDisplay
        this.updateRecipesDisplay({ recipes: finalFilteredRecipes });
      });

      // Appel de la fonction pour ajouter les gestionnaires d'événements aux inputs
      this.addInputEventListeners();
    });
  }
  getSelectedItems(type) {
    return Array.from(document.querySelectorAll(`.${type} span`)).map((item) =>
      item.textContent.trim()
    );
  }
  
     // Méthode pour mettre à jour l'abnffichage des recettes
  updateRecipesDisplay(data) {
    const recipeSection = document.querySelector(".recipes-cards");
    recipeSection.innerHTML = ""; // Effacement du contenu précédent

    if (data && Array.isArray(data.recipes)) {
      data.recipes.forEach((recipe) => {
        const recipeElement = document.createElement("article");
        recipeElement.classList.add("recipe");

        recipeElement.innerHTML = `
          <div class="time">${recipe.time}min</div>
          <img src="assets/photos_les_petits_plats/${
            recipe.image
          }" alt="recette ${recipe.id}" />
          <h2>${recipe.name}</h2>
          <h3> recettee </h3>
          <p class="recettes">${recipe.description}</p>
          <h3>ingredients</h3>
          <div class="ingredients">
            ${recipe.ingredients
              .map(
                (ingredient) => `
              <p>
                ${ingredient.ingredient}
                <br>
              
              ${ingredient.quantity}
              ${ingredient.unit ? `
              ${formatUnit(ingredient.unit)}` : ""}
                </p>`
              )
              .join("")}
          </div>
        `;

        recipeSection.appendChild(recipeElement);
      });
    }
   
  }
  

 
}
// Méthode pour formater l'unité
function formatUnit(unit) {
  if (unit === "grammes") {
    return "gr";
  } else if (unit === "cuillères à soupe") {
    return "cs";
  } else {
    return unit;
  }
}

