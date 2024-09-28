document.addEventListener("DOMContentLoaded", function () {
    let chemicalData = [];

    // Loading data from localStorage or JSON file (fallback)
    const storedData = localStorage.getItem("chemicalData");
    if (storedData) {
        chemicalData = JSON.parse(storedData); // Check to load from localStorage
    } else {
        // Code to fetch from JSON file if nothing is in localStorage
        fetch('chemicalData.json')
            .then(response => response.json())
            .then(data => {
                chemicalData = data;
                renderTable(chemicalData);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    const tableBody = document.querySelector("#chemicalTable tbody");

    // Function to render the table content
    function renderTable(data) {
        tableBody.innerHTML = "";
        data.forEach((item, index) => {
            const row = `<tr>
                <td><input type="checkbox" class="row-checkbox"></td>
                <td>${index + 1}</td> <!-- Calculate the row number dynamically -->
                <td contenteditable="true" class="chemicalName">${item.chemicalName}</td>
                <td contenteditable="true" class="vendor">${item.vendor}</td>
                <td contenteditable="true" class="density">${item.density}</td>
                <td contenteditable="true" class="viscosity">${item.viscosity}</td>
                <td contenteditable="true" class="packaging">${item.packaging}</td>
                <td contenteditable="true" class="packSize">${item.packSize}</td>
                <td contenteditable="true" class="unit">${item.unit}</td>
                <td contenteditable="true" class="quantity">${item.quantity}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });

        // Added listeners to update chemicalData on input change
        updateChemicalDataOnInput();
    }

    renderTable(chemicalData);

    // Function to update chemicalData from table values
    function updateChemicalDataFromTable() {
        const rows = document.querySelectorAll("#chemicalTable tbody tr");
        rows.forEach((row, index) => {
            chemicalData[index] = {
                chemicalName: row.querySelector(".chemicalName").textContent,
                vendor: row.querySelector(".vendor").textContent,
                density: parseFloat(row.querySelector(".density").textContent),
                viscosity: parseFloat(row.querySelector(".viscosity").textContent),
                packaging: row.querySelector(".packaging").textContent,
                packSize: parseFloat(row.querySelector(".packSize").textContent),
                unit: row.querySelector(".unit").textContent,
                quantity: parseFloat(row.querySelector(".quantity").textContent)
            };
        });
    }

    // Function to listen to cell edits and update chemicalData
    function updateChemicalDataOnInput() {
        tableBody.addEventListener('input', updateChemicalDataFromTable);
    }

    // Save data to localStorage
    function saveDataToLocalStorage() {
        localStorage.setItem("chemicalData", JSON.stringify(chemicalData));
        console.log("Data saved to localStorage");
    }

    // Add new row functionality
    document.getElementById("addRow").addEventListener("click", function () {
        const newRow = {
            chemicalName: 'New Chemical',
            vendor: 'New Vendor',
            density: 0,
            viscosity: 0,
            packaging: 'Bag',
            packSize: 0,
            unit: 'kg',
            quantity: 0
        };

        chemicalData.push(newRow);
        renderTable(chemicalData);
        saveDataToLocalStorage(); // Save the updated data
    });

    // Delete row functionality
    document.getElementById("deleteRow").addEventListener("click", function () {
        const selectedRow = document.querySelector("tr.selected");
        if (selectedRow) {
            const rowIndex = selectedRow.rowIndex - 1; // -1 because header is row 0
            chemicalData.splice(rowIndex, 1); // Delete the selected row
            renderTable(chemicalData);
            saveDataToLocalStorage(); // Save the updated data
        }
        alert("Data deleted successfully!");
    });

    // Move up functionality
    document.getElementById("moveUp").addEventListener("click", function () {
        const selectedRow = document.querySelector("tr.selected");
        if (selectedRow) {
            updateChemicalDataFromTable(); // Update data before moving
            const rowIndex = selectedRow.rowIndex - 1; // -1 because header is row 0
            if (rowIndex > 0) {
                [chemicalData[rowIndex], chemicalData[rowIndex - 1]] = [chemicalData[rowIndex - 1], chemicalData[rowIndex]];
                renderTable(chemicalData);
                saveDataToLocalStorage(); // Save the updated data
                selectRow(selectedRow.previousElementSibling); // Keep the row selected
            }
        }
    });

    // Move down functionality
    document.getElementById("moveDown").addEventListener("click", function () {
        const selectedRow = document.querySelector("tr.selected");
        if (selectedRow) {
            updateChemicalDataFromTable(); // Update data before moving
            const rowIndex = selectedRow.rowIndex - 1; // -1 because header is row 0
            if (rowIndex < chemicalData.length - 1) {
                [chemicalData[rowIndex], chemicalData[rowIndex + 1]] = [chemicalData[rowIndex + 1], chemicalData[rowIndex]];
                renderTable(chemicalData);
                saveDataToLocalStorage(); // Save the updated data
                selectRow(selectedRow.nextElementSibling); // Keep the row selected
            }
        }
    });

    // Refresh data functionality
    document.getElementById("refreshData").addEventListener("click", function () {
        renderTable(chemicalData); // Reload the table data
        alert("Table refreshed successfully!");
    });

    // Save data functionality
    document.getElementById("saveData").addEventListener("click", function () {
        alert("Data saved successfully!");
        saveDataToLocalStorage(); // Save the updated data
    });

    // Row selection (for moving up/down)
    let selectedRow = null;

    tableBody.addEventListener("click", function (e) {
        if (e.target.tagName === "TD" || e.target.tagName === "INPUT") {
            const row = e.target.parentElement;

            // Deselect all other rows
            if (selectedRow !== row) {
                document.querySelectorAll("tr").forEach(r => r.classList.remove("selected"));
                row.classList.add("selected"); // Select the new row
                selectedRow = row;
            }
        }
    });

    function selectRow(row) {
        if (row) {
            document.querySelectorAll("tr").forEach(r => r.classList.remove("selected"));
            row.classList.add("selected");
            selectedRow = row;
        }
    }
});
