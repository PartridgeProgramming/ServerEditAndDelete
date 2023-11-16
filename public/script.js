const getRockets = async() => {
    try {
        return (await fetch("api/rockets/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showRockets = async() => {
    let rockets = await getRockets();
    let rocketsDiv = document.getElementById("rocket-list");
    rocketsDiv.innerHTML = "";
    rockets.forEach((rocket) => {
        const section = document.createElement("section");
        section.classList.add("rocket");
        rocketsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = rocket.name;
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(rocket);
        };
    }); 
};

const displayDetails = (rocket) => {
    const rocketDetails = document.getElementById("rocket-details");
    rocketDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = rocket.name;
    rocketDetails.append(h3);

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    rocketDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    rocketDetails.append(eLink);
    eLink.id = "edit-link";

    const p = document.createElement("p");
    rocketDetails.append(p);
    p.innerHTML = `Company: ${rocket.company}<br>`;
    p.innerHTML += `Payload capacity: ${rocket.payload_capacity_kg}kg<br>`;
    p.innerHTML += `Propellant type: ${rocket.propellant_type}<br>`;
    p.innerHTML += `Number of successful launches: ${rocket.successful_launches}<br>`;
    p.innerHTML += `Launch sites:<br>`;

    const ul = document.createElement("ul");
    rocketDetails.append(ul);
    rocket.launch_sites.forEach((site) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = site;
    });

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit-title").innerHTML = "Edit Rocket";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
    };

    populateEditForm(rocket);
};

const populateEditForm = (rocket) => {};

const addEditRocket = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-rocket-form");
    const formData = new FormData(form);
    let response;

    try {
        // Checking if it's a new rocket (based on _id)
        if (form._id.value === "-1") {
            formData.delete("_id");
            formData.delete("img");

            const sites = getSites().join("."); // Join the sites with a period
            formData.set("launch_sites", sites); // Set the launch_sites field with the joined sites

            console.log(...formData);
            
            response = await fetch("/api/rockets", {
                method: "POST",
                body: formData
            });

            response = await response.json();
            }

            showRockets();
    }
    catch (error) {
        const errorMessage = document.getElementById("error-message");
        errorMessage.innerHTML = "There was an error with submission.";
        console.log(error);
    }
};

const getSites = () => {
    const inputs = document.querySelectorAll("#site-boxes input");
    let sites = [];

    inputs.forEach((input) => {
        sites.push(input.value);
    });

    return sites;
};

const resetForm = () => {
    const form = document.getElementById("add-edit-rocket-form");
    form.reset();
    form._id = "-1";
    document.getElementById("sites-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Rocket";
    resetForm();
};

const addSite = (e) => {
    e.preventDefault();
    const section = document.getElementById("site-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
};

window.onload = () => {
    showRockets();
    document.getElementById("add-edit-rocket-form").onsubmit = addEditRocket;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-site").onclick = addSite;
};