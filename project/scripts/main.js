const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const featuredMeals = document.querySelector("#featured-meals");
const mealStatus = document.querySelector("#meal-status");
const currentYear = document.querySelector("#current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

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

async function loadFeaturedMeals() {
    if (!featuredMeals || !mealStatus) return;

    try {
        const response = await fetch("data/meals.json");

        if (!response.ok) {
            throw new Error(`Meal data request failed: ${response.status}`);
        }

        const meals = await response.json();
        const favorites = JSON.parse(
            localStorage.getItem("budgetBitesFavorites") || "[]"
        );

        const featured = meals.slice(0, 3);

        featuredMeals.innerHTML = featured.map((meal) => {
            const isFavorite = favorites.includes(meal.id);

            return `
                <article class="meal-card">
                    <span class="meal-category">${meal.category}</span>
                    <h3>${meal.name}</h3>
                    <p>${meal.description}</p>
                    <div class="meal-meta">
                        <span><strong>Estimated cost:</strong> R${meal.cost}</span>
                        <span><strong>Time:</strong> ${meal.prepTime} min</span>
                    </div>
                    <p><strong>Main ingredients:</strong>
                        ${meal.ingredients.join(", ")}
                    </p>
                    <button class="button button-secondary favorite-button"
                        type="button"
                        data-meal-id="${meal.id}"
                        aria-pressed="${isFavorite}">
                        ${isFavorite ? "♥ Saved" : "♡ Save Favorite"}
                    </button>
                </article>
            `;
        }).join("");

        mealStatus.textContent = `${featured.length} affordable meal ideas loaded.`;

        featuredMeals.querySelectorAll(".favorite-button").forEach((button) => {
            button.addEventListener("click", () => {
                const mealId = Number(button.dataset.mealId);
                const savedFavorites = JSON.parse(
                    localStorage.getItem("budgetBitesFavorites") || "[]"
                );

                const updatedFavorites = savedFavorites.includes(mealId)
                    ? savedFavorites.filter((id) => id !== mealId)
                    : [...savedFavorites, mealId];

                localStorage.setItem(
                    "budgetBitesFavorites",
                    JSON.stringify(updatedFavorites)
                );

                const isFavorite = updatedFavorites.includes(mealId);
                button.textContent = isFavorite ? "♥ Saved" : "♡ Save Favorite";
                button.setAttribute("aria-pressed", String(isFavorite));
            });
        });
    } catch (error) {
        console.error("Unable to load featured meals:", error);
        mealStatus.textContent =
            "We could not load meals right now. Please try again later.";
    }
}

loadFeaturedMeals();
