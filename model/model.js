class Model {
  constructor(recipes) {
    this.recipes = recipes;
  }

  // Méthode pour obtenir les recettes
  getRecipes() {
    return this.recipes;
  }

  // Nouvelle méthode pour obtenir toutes les recettes
  getAllRecipes() {
    return this.recipes;
  }

  getUniqueItems() {
    const ingredients = new Map(); // Utilisation d'une Map pour éviter les doublons
    const appareils = new Map();
    const ustensiles = new Map();

    this.recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const normalizedIngredient = this.normalizeItem(ingredient.ingredient);
        ingredients.set(normalizedIngredient, ingredient.ingredient);
      });

      const normalizedAppareil = this.normalizeItem(recipe.appliance);
      appareils.set(normalizedAppareil, recipe.appliance);

      recipe.ustensils.forEach((ustensil) => {
        const normalizedUstensil = this.normalizeItem(ustensil);
        ustensiles.set(normalizedUstensil, ustensil);
      });
    });

    // Convertir les Map en tableau tout en préservant l'ordre d'insertion
    const uniqueIngredients = Array.from(ingredients.values()).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
    const uniqueAppareils = Array.from(appareils.values()).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
    const uniqueUstensiles = Array.from(ustensiles.values()).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );

    return {
      ingredients: uniqueIngredients,
      appareils: uniqueAppareils,
      ustensiles: uniqueUstensiles,
    };
  }
  
  normalizeItem(item) {
    return item.replace(/\b\w/g, (match) => match.toUpperCase());
  }
}
