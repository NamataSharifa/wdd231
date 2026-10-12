// Budget Bites - Form submission confirmation page

const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const submissionDetails = document.querySelector("#submission-details");

// Update the copyright year.
document.querySelectorAll(".current-year").forEach((element) => {
    element.textContent = new Date().getFullYear();
});

// Mobile navigation.
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

// Read submitted information from the URL.
const parameters = new URLSearchParams(window.location.search);

const name = parameters.get("name") || "";
const email = parameters.get("email") || "";
const subject = parameters.get("subject") || "";
const message = parameters.get("message") || "";

// Display submitted information safely using textContent.
function addDetail(label, value) {
    const paragraph = document.createElement("p");
    const heading = document.createElement("strong");

    heading.textContent = `${label}: `;
    paragraph.append(heading, document.createTextNode(value));

    submissionDetails.append(paragraph);
}

if (name && email && subject && message) {
    submissionDetails.replaceChildren();

    addDetail("Name", name);
    addDetail("Email", email);
    addDetail("Subject", subject);
    addDetail("Message", message);
} else {
    submissionDetails.replaceChildren();

    const messageText = document.createElement("p");
    messageText.textContent =
        "No complete form submission was found. Please use the contact form to send a message.";

    submissionDetails.append(messageText);
}
