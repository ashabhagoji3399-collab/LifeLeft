let applications = JSON.parse(localStorage.getItem("applications")) || [];


// Add Application

function addApplication() {

    const company = document.getElementById("company").value.trim();
    const role = document.getElementById("role").value.trim();
    const date = document.getElementById("date").value;
    const status = document.getElementById("status").value;

    if (company === "" || role === "" || date === "") {
        alert("Please fill all fields!");
        return;
    }

    const application = {
        company: company,
        role: role,
        date: date,
        status: status
    };

    applications.push(application);

    saveApplications();
    displayApplications();
    updateDashboard();

    // Clear form
    document.getElementById("company").value = "";
    document.getElementById("role").value = "";
    document.getElementById("date").value = "";
    document.getElementById("status").value = "Applied";
}


// Save Applications

function saveApplications() {
    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );
}


// Display Applications

function displayApplications() {

    const list = document.getElementById("applicationList");

    list.innerHTML = "";

    if (applications.length === 0) {

        list.innerHTML = `
            <div class="empty-message">
                No applications added yet.
            </div>
        `;

        return;
    }

    applications.forEach((application, index) => {

        const div = document.createElement("div");

        div.className = "application-card";

        div.innerHTML = `
            <div class="application-info">

                <h3>${application.company}</h3>

                <p>${application.role}</p>

                <small>
                    Applied on: ${application.date}
                </small>

            </div>

            <div class="application-actions">

                <span class="status ${application.status.toLowerCase()}">
                    ${application.status}
                </span>

                <button
                    class="delete-btn"
                    onclick="deleteApplication(${index})"
                >
                    Delete
                </button>

            </div>
        `;

        list.appendChild(div);
    });
}


// Delete Application

function deleteApplication(index) {

    applications.splice(index, 1);

    saveApplications();
    displayApplications();
    updateDashboard();
}


// Update Dashboard

function updateDashboard() {

    const total = applications.length;

    const applied = applications.filter(
        app => app.status === "Applied"
    ).length;

    const interview = applications.filter(
        app => app.status === "Interview"
    ).length;

    const selected = applications.filter(
        app => app.status === "Selected"
    ).length;

    document.getElementById("totalCount").textContent = total;

    document.getElementById("appliedCount").textContent = applied;

    document.getElementById("interviewCount").textContent = interview;

    document.getElementById("selectedCount").textContent = selected;

    document.getElementById("applicationCount").textContent =
        `${total} ${total === 1 ? "Application" : "Applications"}`;
}


// Load saved data when page opens

displayApplications();
updateDashboard();