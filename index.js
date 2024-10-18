const tbodyTag = document.querySelector("tbody");
const StudentName = document.querySelector("#StudentName");
const StudentID = document.querySelector("#StudentID");
const StudentEmail = document.querySelector("#StudentEmail");
const StudentContact = document.querySelector("#StudentContact");


const Submitbtn = document.getElementById("submit-btn");

let editMode = false;  // To track whether we're in edit mode
let editingRow = null;  // To store the row being edited


Submitbtn.addEventListener("click", function(event) {
    event.preventDefault();  // for not refreshing the page after clicking button
    
    // Checking if validation is done or not
    if (validation()) {
        if (editMode) {
            updateStudentRecord();
        } else {
            PrintDetailsOfStudent();
        }
        saveStudentsToLocalStorage();
    }
});

function validation() {
    // Validation for filling all elements
    if (!StudentName.value || !StudentID.value || !StudentEmail.value || !StudentContact.value) {
        alert("Please fill all the required* fields");
        return false;
    }

    // Validation for name containing letters
    const validName = /^[A-Za-z\s]+$/;
    if (!validName.test(StudentName.value)) {
        alert("Student name should contain only letters!");
        return false;
    }

    // ID Contains only numbers
    const validID = /^[0-9]+$/;
    if (!validID.test(StudentID.value)) {
        alert("Student ID should contain only numbers!");
        return false;
    }

    // Email Contains Only valid emails
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmail.test(StudentEmail.value)) {
        alert("Please enter a valid email address!");
        return false;
    }

    // Contact should contain 10digits
    const validContact = /^[0-9]{10}$/;
    if (!validContact.test(StudentContact.value)) {
        alert("Contact number should contain exactly 10 digits!");
        return false;
    }

    return true;
}

// *****Function for priting the students after clicked on ADD*****

function PrintDetailsOfStudent() {

    const trTag = document.createElement("tr"); // creating row tag

    //creating and appending of every field into html
    const tdTagforName = document.createElement("td");
    tdTagforName.innerHTML = StudentName.value;
    trTag.appendChild(tdTagforName);

    const tdTagforID = document.createElement("td");
    tdTagforID.innerHTML = StudentID.value;
    trTag.appendChild(tdTagforID);

    const tdTagforEmail = document.createElement("td");
    tdTagforEmail.innerHTML = StudentEmail.value;
    trTag.appendChild(tdTagforEmail);

    const tdTagforContact = document.createElement("td");
    tdTagforContact.innerHTML = StudentContact.value;
    trTag.appendChild(tdTagforContact);

    //For Edit button
    const EditBtn = document.createElement("button");
    EditBtn.innerHTML = "Edit";
    EditBtn.classList.add("edit-btn");
    trTag.appendChild(EditBtn);

    EditBtn.addEventListener("click", () => EditStudent(trTag));

    // For Delete Button
    const DeleteBtn = document.createElement("button");
    DeleteBtn.innerHTML = "Delete";
    DeleteBtn.classList.add("delete-btn");
    trTag.appendChild(DeleteBtn);

    DeleteBtn.addEventListener("click", DeleteStudent);


    tbodyTag.appendChild(trTag);
    console.log(tbodyTag);
    
    // For Creating fields empty after clicking ADD button
    StudentName.value = '';
    StudentID.value = '';
    StudentEmail.value = '';
    StudentContact.value = '';
}

function EditStudent(row) {
    // Set the form fields to the selected student's data
    const cells = row.getElementsByTagName('td');
    StudentName.value = cells[0].innerHTML;
    StudentID.value = cells[1].innerHTML;
    StudentEmail.value = cells[2].innerHTML;
    StudentContact.value = cells[3].innerHTML;

    // Set edit mode
    editMode = true;
    editingRow = row;

    Submitbtn.innerText = "Update";
}

function updateStudentRecord() {
    if (editingRow) {
        const cells = editingRow.getElementsByTagName('td');
        cells[0].innerHTML = StudentName.value;
        cells[1].innerHTML = StudentID.value;
        cells[2].innerHTML = StudentEmail.value;
        cells[3].innerHTML = StudentContact.value;

        // Exit edit mode
        editMode = false;
        editingRow = null;

        // Change button text back to "ADD"
        StudentName.value = '';
        StudentID.value = '';
        StudentEmail.value = '';
        StudentContact.value = '';
        Submitbtn.innerText = "ADD";
    }
}

//function to delete a student if clicked on delete button
function DeleteStudent(e){
    const student = e.target;
    // Now check if the target is the delete button
    if (student.classList.contains('delete-btn')) {
        const parent = student.parentElement;
        // Get the student details from the row (for matching with local storage data)
        const studentName = parent.children[0].innerHTML;
        const studentID = parent.children[1].innerHTML;
        const studentEmail = parent.children[2].innerHTML;
        const studentContact = parent.children[3].innerHTML;

        parent.remove();

        deleteStudentFromLocalStorage(studentName, studentID, studentEmail, studentContact);
    }
}


//function to delete students from local storage if delete button is clicked.
function deleteStudentFromLocalStorage(name, id, email, contact) {
    // Retrieve the students from local storage
    let students = JSON.parse(localStorage.getItem('students'));

    // Find the student in the array using their details and remove them
    students = students.filter(student => {
        return student.name !== name || student.id !== id || student.email !== email || student.contact !== contact;
    });

    // Save the updated students array back to local storage
    localStorage.setItem('students', JSON.stringify(students));
}


// Function to save student data to local storage when clicked on ADD
function saveStudentsToLocalStorage() {
    const students = [];

    // Loop through all the rows in the table body and get the student data
    tbodyTag.querySelectorAll("tr").forEach(row => {
        const cells = row.getElementsByTagName('td');
        const student = {
            name: cells[0].innerHTML,
            id: cells[1].innerHTML,
            email: cells[2].innerHTML,
            contact: cells[3].innerHTML
        };
        students.push(student);
    });

    // Save the students array to local storage
    localStorage.setItem('students', JSON.stringify(students));
}

// Loading stored student data from local storage when the page is loaded
window.addEventListener('DOMContentLoaded', loadStudentsFromLocalStorage);

// Function to load student data from local storage when the page is loaded
function loadStudentsFromLocalStorage() {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
        const students = JSON.parse(storedStudents);

        // Loop through the stored students and add them to the table
        students.forEach(student => {
            const trTag = document.createElement("tr");

            const tdTagforName = document.createElement("td");
            tdTagforName.innerHTML = student.name;
            trTag.appendChild(tdTagforName);

            const tdTagforID = document.createElement("td");
            tdTagforID.innerHTML = student.id;
            trTag.appendChild(tdTagforID);

            const tdTagforEmail = document.createElement("td");
            tdTagforEmail.innerHTML = student.email;
            trTag.appendChild(tdTagforEmail);

            const tdTagforContact = document.createElement("td");
            tdTagforContact.innerHTML = student.contact;
            trTag.appendChild(tdTagforContact);

            // Add Edit and Delete buttons
            const EditBtn = document.createElement("button");
            EditBtn.innerHTML = 'Edit';
            EditBtn.classList.add("edit-btn");
            trTag.appendChild(EditBtn);

            const DeleteBtn = document.createElement("button");
            DeleteBtn.innerHTML = 'Delete';
            DeleteBtn.classList.add("delete-btn");
            trTag.appendChild(DeleteBtn);

            // Append the row to the table body
            tbodyTag.appendChild(trTag);

            // Add event listeners for Edit and Delete
            EditBtn.addEventListener('click', () => EditStudent(trTag));
            DeleteBtn.addEventListener('click', DeleteStudent);
        });
    }
}