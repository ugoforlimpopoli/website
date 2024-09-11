const registerForm = document.getElementById('registerForm');
const nameInput = document.getElementById('nameInput');
const occupantsList = document.getElementById('occupantsList');

function updateOccupantsList() {
    fetch('https://d1s96qvov1.execute-api.eu-north-1.amazonaws.com/dev/people/status')
        .then(response => response.json())
        .then(data => {
            occupantsList.innerHTML = ''; // Clear the list first
            data.occupants.forEach(name => {
                const listItem = document.createElement('li');
                listItem.textContent = name;

                const unregisterButton = document.createElement('button');
                unregisterButton.textContent = 'Unregister';
                unregisterButton.classList.add('unregister-button');
                unregisterButton.onclick = () => unregister(name);

                listItem.appendChild(unregisterButton);
                occupantsList.appendChild(listItem);
            });
        });
}

registerForm.onsubmit = function(event) {
    event.preventDefault();
    const name = nameInput.value;

    fetch('https://d1s96qvov1.execute-api.eu-north-1.amazonaws.com/dev/people/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "registered") {
            nameInput.value = ''; // Clear the input field
            updateOccupantsList(); // Refresh the occupants list
        }
    });
};

function unregister(name) {
    fetch('https://d1s96qvov1.execute-api.eu-north-1.amazonaws.com/dev/people/unregister', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "unregistered") {
            updateOccupantsList(); // Refresh the occupants list
        }
    });
}

updateOccupantsList();
setInterval(updateOccupantsList, 20000); // Update every 20 seconds

