const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

const membersURL = "data/members.json";


async function getMembers() {
    try {
        const response = await fetch(membersURL);

        if (!response.ok) {
            throw new Error("Could not load member data.");
        }

        const data = await response.json();

        displayMembers(data.members);

    } catch (error) {
        console.error(error);

        membersContainer.innerHTML =
            "<p>Sorry, member information could not be loaded.</p>";
    }
}


function displayMembers(members) {

    membersContainer.innerHTML = "";

    members.forEach((member) => {

        const card = document.createElement("article");
        card.classList.add("member-card");

        const image = document.createElement("img");
        image.src = `images/${member.image}`;
        image.alt = `${member.name} business`;
        image.loading = "lazy";
        image.width = 300;
        image.height = 180;

        const businessName = document.createElement("h2");
        businessName.textContent = member.name;

        const address = document.createElement("p");
        address.textContent = member.address;

        const phone = document.createElement("p");
        phone.textContent = member.phone;

        const website = document.createElement("a");
        website.href = member.website;
        website.textContent = "Visit Website";
        website.target = "_blank";
        website.rel = "noopener";

        const description = document.createElement("p");
        description.textContent = member.description;

        const membership = document.createElement("p");
        membership.classList.add("membership");

        if (member.membership === 3) {
            membership.textContent = "Gold Member";
        } else if (member.membership === 2) {
            membership.textContent = "Silver Member";
        } else {
            membership.textContent = "Member";
        }

        card.appendChild(image);
        card.appendChild(businessName);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(website);
        card.appendChild(description);
        card.appendChild(membership);

        membersContainer.appendChild(card);
    });
}


gridButton.addEventListener("click", () => {

    membersContainer.classList.add("members-grid");
    membersContainer.classList.remove("members-list");

    gridButton.classList.add("selected");
    listButton.classList.remove("selected");

});


listButton.addEventListener("click", () => {

    membersContainer.classList.add("members-list");
    membersContainer.classList.remove("members-grid");

    listButton.classList.add("selected");
    gridButton.classList.remove("selected");

});


getMembers();