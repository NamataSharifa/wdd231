const courses = [
    {
        subject: "CSE",
        number: 110,
        title: "Introduction to Programming",
        credits: 2,
        certificate: "Web and Computer Programming",
        description: "Introduction to programming concepts.",
        technology: ["Python"],
        completed: true
    },

    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        certificate: "Web and Computer Programming",
        description: "Introduction to web development.",
        technology: ["HTML", "CSS"],
        completed: true
    },

    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        certificate: "Web and Computer Programming",
        description: "Programming fundamentals.",
        technology: ["Python"],
        completed: true
    },

    {
        subject: "CSE",
        number: 210,
        title: "Programming with Classes",
        credits: 2,
        certificate: "Web and Computer Programming",
        description: "Object-oriented programming.",
        technology: ["C++"],
        completed: false
    },

    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        certificate: "Web and Computer Programming",
        description: "Dynamic web development.",
        technology: ["HTML", "CSS", "JavaScript"],
        completed: true
    },

    {
        subject: "WDD",
        number: 231,
        title: "Web Frontend Development I",
        credits: 2,
        certificate: "Web and Computer Programming",
        description: "Frontend web development.",
        technology: ["HTML", "CSS", "JavaScript"],
        completed: true
    }
];


const courseContainer = document.querySelector("#course-container");
const totalCredits = document.querySelector("#total-credits");


function displayCourses(courseList) {

    courseContainer.innerHTML = "";

    courseList.forEach(course => {

        const courseCard = document.createElement("div");

        courseCard.classList.add("course-card");

        if (course.completed) {
            courseCard.classList.add("completed");
        }

        courseCard.textContent =
            `${course.subject} ${course.number}`;

        courseContainer.appendChild(courseCard);

    });

    calculateCredits(courseList);
}


function calculateCredits(courseList) {

    const credits = courseList.reduce(
        (total, course) => total + course.credits,
        0
    );

    totalCredits.textContent = credits;
}


document.querySelector("#all-button").addEventListener("click", () => {

    displayCourses(courses);

});


document.querySelector("#wdd-button").addEventListener("click", () => {

    const wddCourses = courses.filter(
        course => course.subject === "WDD"
    );

    displayCourses(wddCourses);

});


document.querySelector("#cse-button").addEventListener("click", () => {

    const cseCourses = courses.filter(
        course => course.subject === "CSE"
    );

    displayCourses(cseCourses);

});


displayCourses(courses);