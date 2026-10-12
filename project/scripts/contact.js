// Budget Bites - Contact page

const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const contactForm = document.querySelector("#contact-form");

// Display the current year.
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

// Validate the form before submitting.
if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        if (!contactForm.checkValidity()) {
            event.preventDefault();
            contactForm.reportValidity();
        }
    });
}
