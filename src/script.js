var selectedrow = null;

const sname = document.querySelector("#sname");
const stuId = document.querySelector("#stuId");
const email = document.querySelector("#email");
const num = document.querySelector("#num");
const submit = document.querySelector("#sub");

const numRegx = /^\d{10}$/;
const nameRegx = /^[A-Za-z\s]{2,}$/;  // At least 2 characters
const mailRegx = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const idRegx = /^\d+$/; // Ensure ID is numeric

const container = document.querySelector("table");

// Load existing data from local storage on page load
document.addEventListener("DOMContentLoaded", loadData);

submit.addEventListener("click", register);

function loadData() {
    // Create and append table headers if not present
    if (container.querySelector("thead") === null) {
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Name</th>
            <th>Student ID</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Actions</th>
        `;
        const thead = document.createElement("thead");
        thead.appendChild(headerRow);
        container.appendChild(thead);
    }

    const storedData = JSON.parse(localStorage.getItem("students")) || [];
    storedData.forEach(student => {
        addRowToTable(student);
    });
}

function register(e) {
    e.preventDefault();
    let fla = true;

    function validate() {
        sname.style.borderColor = "white";
        stuId.style.borderColor = "white";
        email.style.borderColor = "white";
        num.style.borderColor = "white";
        
        if (!nameRegx.test(sname.value)) {
            fla = false;
            sname.style.borderColor = "red";
        }
        if (!idRegx.test(stuId.value)) {
            fla = false;
            stuId.style.borderColor = "red";
        }
        if (!mailRegx.test(email.value)) {
            fla = false;
            email.style.borderColor = "red";
        }
        if (!numRegx.test(num.value)) {
            fla = false;
            num.style.borderColor = "red";
        }
    }

    if (!sname.value || !stuId.value || !email.value || !num.value) {
        console.log("empty");
        return;
    } else {
        validate();
        if (fla) {
            const studentData = {
                sname: sname.value,
                stuId: stuId.value,
                email: email.value,
                num: num.value
            };

            if (selectedrow == null) {
                addRowToTable(studentData);
                saveToLocalStorage(studentData);
            } else {
                updateRow(selectedrow, studentData);
                updateLocalStorage();
                selectedrow = null;
            }
            clearInputs();
        }
    }
}

function addRowToTable(student) {
    const prntdiv = document.createElement("tr");
    prntdiv.innerHTML = `<td>${student.sname}</td>
                         <td>${student.stuId}</td>
                         <td>${student.email}</td>
                         <td>${student.num}</td>
                         <td>
                             <button class="modify">modify</button>
                             <button class="remove">remove</button>
                         </td>`;
    container.appendChild(prntdiv);
}

function updateRow(row, student) {
    row.children[0].innerHTML = student.sname;
    row.children[1].innerHTML = student.stuId;
    row.children[2].innerHTML = student.email;
    row.children[3].innerHTML = student.num;
}

function clearInputs() {
    sname.value = '';
    stuId.value = '';
    email.value = '';
    num.value = '';
    sname.style.borderColor = "white";
    stuId.style.borderColor = "white";
    email.style.borderColor = "white";
    num.style.borderColor = "white";
}

function saveToLocalStorage(studentData) {
    const storedData = JSON.parse(localStorage.getItem("students")) || [];
    storedData.push(studentData);
    localStorage.setItem("students", JSON.stringify(storedData));
}

function updateLocalStorage() {
    const rows = Array.from(container.querySelectorAll("tr")).slice(1); // Skip header
    const students = rows.map(row => ({
        sname: row.children[0].innerHTML,
        stuId: row.children[1].innerHTML,
        email: row.children[2].innerHTML,
        num: row.children[3].innerHTML
    }));
    localStorage.setItem("students", JSON.stringify(students));
}

container.addEventListener("click", function (e) {
    const target = e.target;

    if (target.classList.contains("remove")) {
        target.closest("tr").remove();
        updateLocalStorage(); // Update local storage on removal
    }

    if (target.classList.contains("modify")) {
        selectedrow = target.closest("tr");
        sname.value = selectedrow.children[0].innerHTML;
        stuId.value = selectedrow.children[1].innerHTML;
        email.value = selectedrow.children[2].innerHTML;
        num.value = selectedrow.children[3].innerHTML;
    }
});
