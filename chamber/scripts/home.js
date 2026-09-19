const apiKey = "5cfe55adec00a3815aea158871eb09cf";

const city = "Johannesburg";
const country = "ZA";

// WEATHER
async function getWeather() {
    try {
        const currentURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`;

        const forecastURL =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&appid=${apiKey}`;

        const currentResponse = await fetch(currentURL);
        const forecastResponse = await fetch(forecastURL);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Weather data could not be loaded.");
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);

    } catch (error) {
        console.error("Weather error:", error);

        document.querySelector("#current-weather").innerHTML =
            "<p>Weather information is currently unavailable.</p>";

        document.querySelector("#forecast").innerHTML =
            "<p>Forecast information is currently unavailable.</p>";
    }
}

// CURRENT WEATHER
function displayCurrentWeather(data) {
    const weatherContainer = document.querySelector("#current-weather");

    weatherContainer.innerHTML = `
        <p class="temperature">${Math.round(data.main.temp)}°C</p>
        <p>${data.weather[0].description}</p>
    `;
}

// 3-DAY FORECAST
function displayForecast(data) {
    const forecastContainer = document.querySelector("#forecast");

    const dailyForecast = data.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 3);

    forecastContainer.innerHTML = dailyForecast.map(day => `
        <div class="forecast-day">
            <p>
                ${new Date(day.dt_txt).toLocaleDateString("en-ZA", {
        weekday: "long"
    })}
            </p>

            <p>${Math.round(day.main.temp)}°C</p>

            <p>${day.weather[0].description}</p>
        </div>
    `).join("");
}

// BUSINESS SPOTLIGHTS
async function getSpotlights() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Members data could not be loaded.");
        }

        const data = await response.json();

        // Gold = 3, Silver = 2
        const eligibleMembers = data.members.filter(member =>
            member.membership === 2 ||
            member.membership === 3
        );

        // Randomize the eligible members
        const shuffledMembers = [...eligibleMembers].sort(
            () => Math.random() - 0.5
        );

        // Select 3 random Gold/Silver members
        const selectedMembers = shuffledMembers.slice(0, 3);

        displaySpotlights(selectedMembers);

    } catch (error) {
        console.error("Spotlight error:", error);

        document.querySelector("#spotlight-container").innerHTML =
            "<p>Business spotlights are currently unavailable.</p>";
    }
}

// MEMBERSHIP LEVEL
function getMembershipLevel(level) {
    if (level === 3) {
        return "Gold";
    }

    if (level === 2) {
        return "Silver";
    }

    return "Member";
}

// DISPLAY BUSINESS SPOTLIGHTS
function displaySpotlights(members) {
    const container = document.querySelector("#spotlight-container");

    container.innerHTML = members.map(member => `
        <article class="spotlight-card">

            <img
                src="images/${member.image}"
                alt="${member.name} logo"
                loading="lazy"
            >

            <h3>${member.name}</h3>

            <p>
                <strong>${getMembershipLevel(member.membership)}</strong>
                Member
            </p>

            <p>${member.address}</p>

            <p>${member.phone}</p>

            <a
                href="${member.website}"
                target="_blank"
                rel="noopener"
            >
                Visit Website
            </a>

        </article>
    `).join("");
}

// START THE PAGE
getWeather();
getSpotlights();