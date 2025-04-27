let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
let editIndex = null;
const categoryTabs = document.querySelectorAll(".tab");
const recipeContainer = document.getElementById("recipeContainer");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const menuToggle = document.getElementById("menuToggle");
const tabsMenu = document.getElementById("tabsMenu");

const openModalBtn = document.getElementById("openModalBtn");
const saveRecipeBtn = document.getElementById("saveRecipeBtn");
const cancelBtn = document.getElementById("cancelBtn");

const titleInput = document.getElementById("recipeTitle");
const categoryInput = document.getElementById("recipeCategory");
const ingredientsInput = document.getElementById("recipeIngredients");
const stepsInput = document.getElementById("recipeSteps");
const imageInput = document.getElementById("recipeImage");

let currentCategory = "Entradas";

// Cambiar categoría
categoryTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    categoryTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentCategory = tab.dataset.category;
    renderRecipes();
    if (tabsMenu.classList.contains("show")) {
      tabsMenu.classList.remove("show"); // Cierra menú después de seleccionar
    }
  });
});

// Abrir menú hamburguesa
menuToggle.addEventListener("click", () => {
  tabsMenu.classList.toggle("show");
});

// Modal
openModalBtn.onclick = () => {
  resetForm();
  modal.classList.remove("hidden");
};

cancelBtn.onclick = () => {
  modal.classList.add("hidden");
  resetForm();
};

saveRecipeBtn.onclick = () => {
  const title = titleInput.value.trim();
  const category = categoryInput.value;
  const ingredients = ingredientsInput.value.trim();
  const steps = stepsInput.value.trim();
  const imageFile = imageInput.files[0];

  if (!title || !ingredients || !steps) return alert("Completa todos los campos.");

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imageBase64 = e.target.result;
      saveRecipe(title, category, ingredients, steps, imageBase64);
    };
    reader.readAsDataURL(imageFile);
  } else {
    const currentImage = editIndex !== null ? recipes[editIndex].image : null;
    saveRecipe(title, category, ingredients, steps, currentImage);
  }
};

function saveRecipe(title, category, ingredients, steps, image) {
  const newRecipe = { title, category, ingredients, steps, image };

  if (editIndex !== null) {
    recipes[editIndex] = newRecipe;
    editIndex = null;
  } else {
    recipes.push(newRecipe);
  }

  localStorage.setItem("recipes", JSON.stringify(recipes));
  modal.classList.add("hidden");
  resetForm();
  renderRecipes();
}

function renderRecipes() {
  recipeContainer.innerHTML = "";
  const filtered = recipes.filter(r => r.category === currentCategory);
  filtered.forEach((r, i) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      ${r.image ? `<img src="${r.image}" alt="${r.title}" class="recipe-image"/>` : ""}
      <h3>${r.title}</h3>
      <p><strong>Ingredientes:</strong><br>${r.ingredients.replace(/\n/g, "<br>")}</p>
      <p><strong>Instrucciones:</strong><br>${r.steps.replace(/\n/g, "<br>")}</p>
      <div class="card-buttons">
        <button onclick="editRecipe(${recipes.indexOf(r)})">Editar</button>
        <button onclick="deleteRecipe(${recipes.indexOf(r)})">Eliminar</button>
      </div>
    `;
    recipeContainer.appendChild(card);
  });
}

function editRecipe(index) {
  const r = recipes[index];
  editIndex = index;
  titleInput.value = r.title;
  categoryInput.value = r.category;
  ingredientsInput.value = r.ingredients;
  stepsInput.value = r.steps;
  modalTitle.textContent = "Editar Receta";
  modal.classList.remove("hidden");
}

function deleteRecipe(index) {
  if (confirm("¿Eliminar esta receta?")) {
    recipes.splice(index, 1);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    renderRecipes();
  }
}

function resetForm() {
  titleInput.value = "";
  ingredientsInput.value = "";
  stepsInput.value = "";
  categoryInput.value = "Entradas";
  imageInput.value = "";
  modalTitle.textContent = "Agregar Receta";
  editIndex = null;
}

renderRecipes();
