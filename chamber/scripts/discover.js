import { discoverItems } from "../data/discover.mjs";

const discoverGrid = document.querySelector("#discover-grid");
const visitMessage = document.querySelector("#visit-message");

function displayDiscoverItems() {
    discoverItems.forEach((item, index) => {
        const card = document.createElement("article");

        card.classList.add("discover-card");
        card.classList.add(`card-${index + 1}`);

        card.innerHTML = `
            <h2>${item.name}</h2>

            <figure>
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    width="300"
                    height="200"
                    loading="lazy"
                >
            </figure>

            <address>${item.address}</address>

            <p>${item.description}</p>

            <button type="button">Learn More</button>
        `;

        discoverGrid.appendChild(card);
    });
}

function displayVisitMessage() {
    const currentVisit = Date.now();
    const previousVisit = localStorage.getItem("discoverLastVisit");

    if (!previousVisit) {
        visitMessage.textContent =
            "Welcome! Let us know if you have any questions.";
    } else {
        const timeDifference = currentVisit - Number(previousVisit);
        const oneDay = 24 * 60 * 60 * 1000;

        if (timeDifference < oneDay) {
            visitMessage.textContent =
                "Back so soon! Awesome!";
        } else {
            const daysSinceVisit = Math.floor(timeDifference / oneDay);

            const dayWord = daysSinceVisit === 1 ? "day" : "days";

            visitMessage.textContent =
                `You last visited ${daysSinceVisit} ${dayWord} ago.`;
        }
    }

    localStorage.setItem("discoverLastVisit", currentVisit);
}

displayDiscoverItems();
displayVisitMessage();