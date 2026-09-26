const params = new URLSearchParams(window.location.search);

document.querySelector("#firstName").textContent =
    params.get("firstName") || "";

document.querySelector("#lastName").textContent =
    params.get("lastName") || "";

document.querySelector("#email").textContent =
    params.get("email") || "";

document.querySelector("#phone").textContent =
    params.get("phone") || "";

document.querySelector("#organization").textContent =
    params.get("organization") || "";

const submittedTime = params.get("timestamp");

if (submittedTime) {
    document.querySelector("#timestamp").textContent =
        new Date(submittedTime).toLocaleString();
}