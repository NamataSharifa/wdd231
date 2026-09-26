const timestamp = document.querySelector("#timestamp");

timestamp.value = new Date().toISOString();

const membershipLinks = document.querySelectorAll(".membership-card a");
const closeButtons = document.querySelectorAll(".close-modal");

membershipLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const modal = document.querySelector(link.getAttribute("href"));

        modal.showModal();
    });
});

closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        button.closest("dialog").close();
    });
});