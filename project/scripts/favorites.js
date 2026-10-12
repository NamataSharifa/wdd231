
// Budget Bites - My Favorites page

const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const favoriteContainer = document.querySelector("#favorite-meals");
const favoritesCount = document.querySelector("#favorites-count");
const emptyFavorites = document.querySelector("#empty-favorites");

let meals = [];

// Update the copyright year.
document.querySelectorAll(".current-year").forEach((element) => {
    element.textContent = new Date().getFullYear();
});

// Open and close the mobile navigation.
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

// Read favorite IDs from localStorage.
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

// Save the updated favorites list.
function updateFavorites(favorites) {
    localStorage.setItem(
        "budgetBitesFavorites",
        JSON.stringify(favorites)
    );
}

// Display the saved meal cards.
function displayFavorites() {
    const favoriteIds = getFavorites();

    const savedMeals = meals.filter((meal) =>
        favoriteIds.includes(meal.id)
    );

    favoriteContainer.replaceChildren();

    favoritesCount.textContent =
        `${savedMeals.length} favorite meal${savedMeals.length === 1 ? "" : "s"} saved.`;

    emptyFavorites.hidden = savedMeals.length !== 0;

    savedMeals.forEach((meal) => {
        const article = document.createElement("article");
        article.className = "meal-card";

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

            <button class="button remove-favorite-button" type="button">
                Remove from Favorites
            </button>
        `;

        article.querySelector(".remove-favorite-button")
            .addEventListener("click", () => {
                const updatedFavorites = getFavorites().filter(
                    (id) => id !== meal.id
                );

                updateFavorites(updatedFavorites);
                displayFavorites();
            });

        favoriteContainer.append(article);
    });
}

// Fetch the meal data and match it to saved favorite IDs.
async function loadFavorites() {
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

        meals = data;
        displayFavorites();

    } catch (error) {
        console.error("Unable to load favorites:", error);

        favoritesCount.textContent =
            "Your favorites could not be loaded.";

        favoriteContainer.textContent =
            "Please check that data/meals.json exists and try again.";
    }
}

loadFavorites();
