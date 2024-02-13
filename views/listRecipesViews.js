class ListRecipesView {
    constructor() {
        // Assurez-vous que la méthode updateRecipesDisplay est correctement liée à l'instance actuelle
    this.updateRecipesDisplay = this.updateRecipesDisplay.bind(this);
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
          <h3>RECETTE</h3>
          <p class="recettes">${recipe.description}</p>
          <h3>INGREDIENTS</h3>
          <div class="ingredients">
            ${recipe.ingredients
              .map(
                (ingredient) => `
              <p>${ingredient.ingredient}<br>
              ${ingredient.quantity}${
                  ingredient.unit ? ` ${formatUnit(ingredient.unit)}` : ""
                }</p>`
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

