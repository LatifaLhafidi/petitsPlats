class ListRecipesView {
    constructor() {
      // Sélection des éléments du DOM
      this.inputHeader = document.querySelector(".inputHeader");
      this.clearMainInputIcon = document.getElementById("clear-main-input-icon");
      this.searchButton = document.querySelector(".searchButton");
      this.searchButtonDropdowns = document.querySelectorAll(".searchChoix");

      this.inputElements = document.querySelectorAll(".inputDropdown");

  
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
      // lancer la recherche lorsque l’utilisateur entre au moins 3 caractères
       //dans la barre de recherche principale
      this.inputHeader.addEventListener("input", (e) => {
        const query = this.inputHeader.value;
        if (query.length >= 3) {
          controller.handleSearch(query);
        }
      });
      // // Ajout d'un gestionnaire d'événements pour masquer/afficher l'icône en fonction du contenu de l'input
      this.inputHeader.addEventListener("input", () => {
        const inputValue = this.inputHeader.value.trim();
        if (inputValue === "") {
          this.clearMainInputIcon.style.display = "none";
        } else {
          this.clearMainInputIcon.style.display = "block";
        }
      });
       // // Ajout d'un gestionnaire d'événements pour masquer/afficher l'icône en fonction du contenu de l'input
       this.inputHeader.addEventListener("input", () => {
        const inputValue = this.inputHeader.value.trim();
        if (inputValue === "") {
          this.clearMainInputIcon.style.display = "none";
        } else {
          this.clearMainInputIcon.style.display = "block";
        }
      });
       // Ajout d'un gestionnaire d'événements pour effacer le contenu de l'input principal
       this.clearMainInputIcon.addEventListener("click", () => {
        this.inputHeader.value = "";
        this.clearMainInputIcon.style.display = "none";
        // Déclencher une nouvelle recherche avec une chaîne vide
        controller.handleSearch("");
      });
      // Ajout d'un gestionnaire d'événements pour masquer l'icône lors du chargement de la page
      document.addEventListener("DOMContentLoaded", () => {
        this.clearMainInputIcon.style.display = "none";
      });
     
     
      this.inputElements.forEach((button) => {
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
  
    // Méthode pour obtenir les éléments sélectionnés d'un type donné
    // sélectionne tous les éléments <span> qui sont des descendants des éléments ayant
    // une classe correspondant à la valeur de type fournie
    //Array.from(...): Convertit la NodeList renvoyée par document.querySelectorAll en un tableau
    //trim() est  appliquée pour supprimer tout espace vide au début ou à la fin du contenu textuel.
    getSelectedItems(type) {
      return Array.from(document.querySelectorAll(`.${type} span`)).map((item) =>
        item.textContent.trim()
      );
    }
    updateSelectedItems() {
      const selectedItemsContainer = document.querySelector(
        ".selected-container"
      );
  
      if (selectedItemsContainer) {
        // Effacement du contenu précédent
        selectedItemsContainer.innerHTML = "";
  
        // Création d'une nouvelle liste pour chaque type d'élément sélectionné
        Object.keys(this.selectedItems).forEach((type) => {
          const selectedItemsList = document.createElement("ul");
  
          // Ajout des éléments sélectionnés à la liste
          this.selectedItems[type].forEach((item) => {
            const selectedItem = document.createElement("li");
            selectedItem.classList.add("selected-item");
            selectedItem.classList.add(type);
  
            // Ajout d'un span pour le texte de l'élément sélectionné
            const itemText = document.createElement("span");
            itemText.textContent = item;
  
            // Ajout d'un bouton de suppression à chaque élément
            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-button");
            removeButton.innerHTML = "&times;";
            removeButton.addEventListener("click", () => {
              // Gestion du clic sur le bouton de suppression
              this.removeSelectedItem(type, item);
            });
  
            // Ajout du texte et du bouton à l'élément sélectionné
            selectedItem.appendChild(itemText);
            selectedItem.appendChild(removeButton);
  
            // Ajout de l'élément à la liste
            selectedItemsList.appendChild(selectedItem);
          });
  
          // Ajout de la liste au conteneur global
          selectedItemsContainer.appendChild(selectedItemsList);
        });
      }
    }
  
    // méthode pour mettre à jour les listes déroulantes
    updateDropdowns(uniqueItems, type) {
      const listElement = document.getElementById(`${type}-list`);
      const selectedItemsContainer = document.getElementById(`selected-${type}`);
  
      if (listElement) {
        // Mise à jour des options dans la liste déroulante
        listElement.innerHTML = uniqueItems[type]
          ? uniqueItems[type]
              .map((item) => `<li>${this.normalizeItem(item)}</li>`)
              .join("")
          : "";
      }
  
      const dropdownItems = document.querySelectorAll(`#${type}-list li`);
      dropdownItems.forEach((item) => {
        item.addEventListener("mousedown", () => {
          // Vérification si l'élément est déjà sélectionné
          const isSelected = this.selectedItems[type].includes(item.textContent);
          if (!isSelected) {
            // Ajout de l'élément à la liste des éléments sélectionnés
            this.selectedItems[type].push(item.textContent);
  
            // Suppression de l'élément de la liste d'origine
            const originalIndex = uniqueItems[type].indexOf(item.textContent);
            if (originalIndex !== -1) {
              uniqueItems[type].splice(originalIndex, 1);
            }
            // Mise à jour de l'affichage des éléments sélectionnés
            this.updateSelectedItems(type);
  
            // Mise à jour de la liste déroulante après la suppression d'un élément
            this.updateDropdowns(uniqueItems, type);
  
            // Appel de la méthode du contrôleur pour gérer le filtrage supplémentaire
            controller.handleAdditionalFiltering(); // Assurez-vous que "controller" est bien défini
          }
        });
      });
  
      // Ajoutez ici le code pour gérer la soumission du formulaire
      const formElement = document.querySelector(`[name="${type}"] form`);
      if (formElement) {
        formElement.addEventListener("submit", (event) => {
          event.preventDefault();
          this.handleFormSubmission(type);
        });
      }
    }
  
    normalizeItem(item) {
      return item.replace(/\b\w/g, (match) => match.toUpperCase());
    }
  
   
  
    handleFilteredSelection(type, selectedItem) {
      // Ajoutez l'élément à la liste des éléments sélectionnés pour le type spécifié
      this.selectedItems[type].push(selectedItem);
  
      // Mise à jour de l'affichage des éléments sélectionnés
      this.updateSelectedItems(type);
  
      // Mise à jour de la liste déroulante après la suppression d'un élément
      this.updateDropdowns(uniqueItems, type);
  
      // Appel de la méthode du contrôleur pour gérer le filtrage supplémentaire
      controller.handleAdditionalFiltering(); // Assurez-vous que "controller" est bien défini
    }
  
    // Méthode pour supprimer un élément sélectionné
    removeSelectedItem(type, item) {
      const index = this.selectedItems[type].indexOf(item);
  
      if (index !== -1) {
        // Restaurez l'élément à sa liste d'origine
        uniqueItems[type].push(item);
  
        // Suppression de l'élément de la liste sélectionnée
        this.selectedItems[type].splice(index, 1);
  
        // Mise à jour de l'affichage des éléments sélectionnés
        this.updateSelectedItems(type);
  
        // Mise à jour de la liste déroulante après la suppression d'un élément
        this.updateDropdowns(uniqueItems, type);
  
        // Appel de la méthode du contrôleur pour gérer le filtrage supplémentaire
        controller.handleAdditionalFiltering(); // Assurez-vous que "controller" est bien défini
      }
    }
  
    addInputEventListeners() {
      const inputElements = document.querySelectorAll(".inputDropdown");
  
      inputElements.forEach((input) => {
        const clearInputIcon = input.nextElementSibling; // Sélectionnez la croix
  
        // Masquez la croix lors de l'initialisation
        clearInputIcon.style.display = "none";
  
        input.addEventListener("input", (event) => {
          event.preventDefault();
  
          const type = input.getAttribute("name");
          const value = event.target.value.toLowerCase();
          const listElement = document.getElementById(`${type}-list`);
  
          // Affichez ou masquez la croix en fonction du contenu de l'input
          if (value.trim() === "") {
            clearInputIcon.style.display = "none";
          } else {
            clearInputIcon.style.display = "block";
          }
  
          if (uniqueItems && uniqueItems[type]) {
            const filteredOptions = uniqueItems[type].filter((item) =>
              item.toLowerCase().includes(value)
            );
  
            if (listElement) {
              // Effacer les anciens gestionnaires d'événements
              listElement.innerHTML = "";
  
              // Ajouter les nouveaux éléments avec les gestionnaires d'événements
              filteredOptions.forEach((item) => {
                const listItem = document.createElement("li");
                listItem.textContent = item;
                listItem.addEventListener("click", () => {
                  this.handleFilteredSelection(type, item);
                });
  
                listElement.appendChild(listItem);
              });
            }
          }
  
          // Ajouter un gestionnaire d'événements pour le cas de désélection
          const selectedItemsContainer = document.querySelector(
            `.selected-container ul`
          );
  
          if (selectedItemsContainer) {
            selectedItemsContainer.addEventListener("click", (event) => {
              const selectedItem = event.target.textContent.trim();
              this.removeSelectedItem(type, selectedItem);
            });
          }
  
          // Ajoutez ici le code pour gérer la soumission du formulaire
          const formElement = document.querySelector(`[name="${type}"] form`);
          if (formElement) {
            formElement.addEventListener("submit", (event) => {
              event.preventDefault();
              this.handleFormSubmission(type);
            });
          }
        });
  
        // Ajoutez un événement pour effacer le contenu de l'input et masquer la croix
        clearInputIcon.addEventListener("click", () => {
          input.value = "";
          clearInputIcon.style.display = "none";
  
          // Mettez à jour la liste lorsque la croix est cliquée et l'input est vidé
          const type = input.getAttribute("name");
          const listElement = document.getElementById(`${type}-list`);
          const uniqueItemsList = uniqueItems[type];
  
          if (listElement && uniqueItemsList) {
            listElement.innerHTML = "";
            uniqueItemsList.forEach((item) => {
              const listItem = document.createElement("li");
              listItem.textContent = item;
              listItem.addEventListener("click", () => {
                this.handleFilteredSelection(type, item);
              });
  
              listElement.appendChild(listItem);
            });
          }
        });
      });
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
            <h2 class="name">${recipe.name}</h2>
            <h3>RECETTE</h3>
            <p class="recettes">${recipe.description}</p>
            <h3>INGREDIENTS</h3>
            <div class="ingredients">
              ${recipe.ingredients
                .map(
                  (ingredient) => `
                  <div class="ingredient">
                <h2>${ingredient.ingredient}</h2> 
                <p> ${ingredient.quantity ? ingredient.quantity : ''} ${ingredient.unit ? ingredient.unit : '' }
                  </p>
                  </div>
                
                  `
                )
                .join("")}
            </div>
          `;
  
          recipeSection.appendChild(recipeElement);
        });
      }
      // Mettez à jour le compteur
      const recipesCount = data.recipes.length; // Nombre actuel de recettes
      this.updateRecipesCounter(recipesCount);
    }
    updateRecipesCounter(count) {
      const recipesCounter = document.querySelector(".recipesCounter");
      recipesCounter.textContent = `${count} recette${count !== 1 ? "s" : ""}`;
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
  function manageDropdowns() {
    const dropdownButtons = document.querySelectorAll(".dropdown-button");
  
    dropdownButtons.forEach((button) => {
      const dropdownContent = document.querySelector(
        `[data-dropdown-content='${button.getAttribute("data-dropdown-target")}']`
      );
      const chevron = button.querySelector(".chevron");
  
      button.addEventListener("click", () => {
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
          chevron.classList.remove("rotate");
        } else {
          dropdownContent.style.display = "block";
          chevron.classList.add("rotate");
        }
      });
    });
  }
  
  manageDropdowns();