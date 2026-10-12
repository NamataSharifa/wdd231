
// Budget Bites - Find Meals page

const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const mealContainer = document.querySelector("#all-meals");
const mealCount = document.querySelector("#meal-count");
const searchInput = document.querySelector("#meal-search");
const categoryFilter = document.querySelector("#category-filter");
const sortSelect = document.querySelector("#sort-meals");
const mealDialog = document.querySelector("#meal-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogContent = document.querySelector("#dialog-content");
const closeDialog = document.querySelector("#close-dialog");

let meals = [];

// Display the current year in the footer.
document.querySelectorAll(".current-year").forEach((element) => {
    element.textContent = new Date().getFullYear();
});

// Responsive navigation menu.
if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });
}

// Read saved favorites from localStorage.
function getFavorites() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("budgetBitesFavorites") || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.error("Could not read favorites:", error);
        return [];
    }
}

// Add or remove a favorite.
function saveFavorite(mealId) {
    const favorites = getFavorites();

    const updated = favorites.includes(mealId)
        ? favorites.filter((id) => id !== mealId)
        : [...favorites, mealId];

    localStorage.setItem(
        "budgetBitesFavorites",
        JSON.stringify(updated)
    );

    return updated.includes(mealId);
}

// Populate the category dropdown from the JSON data.
function populateCategories() {
    const categories = [
        ...new Set(meals.map((meal) => meal.category))
    ].sort();

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.append(option);
    });
}

// Create a card for each meal.
function createMealCard(meal) {
    const article = document.createElement("article");
    article.className = "meal-card";

    const isFavorite = getFavorites().includes(meal.id);

    article.innerHTML = `
        <span class="meal-category">${meal.category}</span>
        <h3>${meal.name}</h3>
        <p>${meal.description}</p>

        <div class="meal-meta">
            <span><strong>Estimated cost:</strong> R${meal.cost}</span>
            <span><strong>Preparation:</strong> ${meal.prepTime} min</span>
        </div>

        <p>
            <strong>Ingredients:</strong>
            ${meal.ingredients.join(", ")}
        </p>

        <div class="meal-card-actions">
            <button class="button button-secondary details-button"
                type="button">
                View Details
            </button>

            <button class="button favorite-button"
                type="button" aria-pressed="${isFavorite}">
                ${isFavorite ? "♥ Saved" : "♡ Save Favorite"}
            </button>
        </div>
    `;

    article.querySelector(".details-button").addEventListener(
        "click",
        () => showMealDetails(meal)
    );

    const favoriteButton = article.querySelector(".favorite-button");

    favoriteButton.addEventListener("click", () => {
        const saved = saveFavorite(meal.id);

        favoriteButton.textContent = saved
            ? "♥ Saved"
            : "♡ Save Favorite";

        favoriteButton.setAttribute("aria-pressed", String(saved));
    });

    return article;
}

// Search, filter, sort, and display meals.
function displayMeals() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortOption = sortSelect.value;

    let filteredMeals = meals.filter((meal) => {
        const searchableText = [
            meal.name,
            meal.category,
            meal.description,
            ...meal.ingredients
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            meal.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (sortOption === "cost-low") {
        filteredMeals.sort((a, b) => a.cost - b.cost);
    } else if (sortOption === "cost-high") {
        filteredMeals.sort((a, b) => b.cost - a.cost);
    } else if (sortOption === "time-low") {
        filteredMeals.sort((a, b) => a.prepTime - b.prepTime);
    }

    mealContainer.replaceChildren(
        ...filteredMeals.map((meal) => createMealCard(meal))
    );

    mealCount.textContent =
        `${filteredMeals.length} of ${meals.length} meals displayed.`;

    if (filteredMeals.length === 0) {
        const message = document.createElement("p");
        message.textContent =
            "No meals match your search. Try another term.";

        mealContainer.append(message);
    }
}

// Open the accessible meal details dialog.
function showMealDetails(meal) {
    dialogTitle.textContent = meal.name;

    dialogContent.innerHTML = `
        <p>${meal.description}</p>
        <p><strong>Category:</strong> ${meal.category}</p>
        <p><strong>Estimated cost:</strong> R${meal.cost}</p>
        <p><strong>Preparation time:</strong> ${meal.prepTime} minutes</p>
        <h3>Ingredients</h3>
        <ul>
            ${meal.ingredients.map((ingredient) =>
        `<li>${ingredient}</li>`
    ).join("")}
        </ul>
        <p>
            Costs are estimates and may vary by shop and serving size.
        </p>
    `;

    mealDialog.showModal();
}

// Close the dialog.
closeDialog.addEventListener("click", () => {
    mealDialog.close();
});

// Close when the user clicks the backdrop.
mealDialog.addEventListener("click", (event) => {
    if (event.target === mealDialog) {
        mealDialog.close();
    }
});

// Connect search and sorting controls.
searchInput.addEventListener("input", displayMeals);
categoryFilter.addEventListener("change", displayMeals);
sortSelect.addEventListener("change", displayMeals);

// Load meals from the JSON file using Fetch API.
async function loadMeals() {
    try {
        const response = await fetch("./data/meals.json");

        if (!response.ok) {
            throw new Error(
                `Could not load meals. HTTP status: ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("The meal data must be a JSON array.");
        }

        // Check that each meal has the required properties.
        const validMeals = data.every((meal) =>
            meal.id !== undefined &&
            typeof meal.name === "string" &&
            typeof meal.category === "string" &&
            typeof meal.description === "string" &&
            typeof meal.cost === "number" &&
            typeof meal.prepTime === "number" &&
            Array.isArray(meal.ingredients)
        );

        if (!validMeals) {
            throw new Error(
                "Check meals.json: every meal needs id, name, category, description, cost, prepTime, and ingredients."
            );
        }

        meals = data;
        populateCategories();
        displayMeals();

    } catch (error) {
        console.error("Unable to load meals:", error);

        mealCount.textContent =
            "Meals could not load. Please check the data file.";

        mealContainer.textContent =
            "Check that data/meals.json exists and contains valid meal data.";
    }
}

loadMeals();
