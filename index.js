function updateRow() {
    const startDateInput = document.getElementById("start-date-input");
    const endDateInput = document.getElementById("end-date-input");
    const excludeDatesInput = document.getElementById("exclude-dates-input");
    const daysInput = document.getElementById("days-input");
    const leadCountInput = document.getElementById("lead-count-input");
    const expectedDRRInput = document.getElementById("expected-drr-input");
    const monthInput = document.getElementById("month-input");
    const yearInput = document.getElementById("year-input");

    // Get user inputs
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const leadCount = parseFloat(leadCountInput.value);

    // Validate the inputs
    if (isNaN(leadCount) || startDate >= endDate) {
        return;
    }

    // Calculate the number of days and expected DRR
    const oneDay = 24 * 60 * 60 * 1000;
    const startDateTimestamp = startDate.getTime();
    const endDateTimestamp = endDate.getTime();
    const totalDays = Math.round(Math.abs((endDateTimestamp - startDateTimestamp) / oneDay)) + 1;

    // Handle excluded dates (if any)
    let validDays = totalDays;
    if (excludeDatesInput.value) {
        const excludedDates = excludeDatesInput.value.split(",").map(date => date.trim());
        validDays = totalDays - excludedDates.length;
    }

    const expectedDRR = leadCount / validDays;

    // Display results
    monthInput.value = startDate.getMonth() + 1;
    yearInput.value = startDate.getFullYear();
    daysInput.value = validDays;
    expectedDRRInput.value = expectedDRR.toFixed(2);
}

function saveData(button) {
    const row = button.closest("tr");

    // Create a new row for the saved data
    const newRow = document.createElement("tr");

    // Create and append cells for the new row
    const cells = Array.from(row.querySelectorAll("td")).map(cell => {
        const newCell = document.createElement("td");
        if (cell.querySelector("input")) {
            const inputValue = cell.querySelector("input").value;
            if (cell.querySelector("input").id === "start-date-input" || cell.querySelector("input").id === "end-date-input") {
                const date = new Date(inputValue);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
                newCell.textContent = formattedDate;
            } else {
                newCell.textContent = inputValue;
            }
        }
        return newCell;
    });

    // Create the "Last Updated" cell and set its value to the current date and time
    const lastUpdatedCell = document.createElement("td");
    const currentDate = new Date();
    lastUpdatedCell.textContent = currentDate.toLocaleString();

    // Insert the "Last Updated" cell in the correct position
    cells.splice(10, 0, lastUpdatedCell);

    // Append the cells to the new row
    cells.forEach(cell => newRow.appendChild(cell));

    // Append the new row with the saved data below the current row
    if (row.nextSibling) {
        row.parentNode.insertBefore(newRow, row.nextSibling);
    } else {
        row.parentNode.appendChild(newRow);
    }

    // Clear the input fields in the current row, excluding buttons
    const inputs = Array.from(row.querySelectorAll("input"));
    inputs.forEach(input => {
        if (input.type !== "button") {
            input.value = "";
        }
    });
}

function cancelData(button) {
    const row = button.closest("tr");
    const inputs = row.querySelectorAll("input");
    inputs.forEach(input => (input.value = ""));
}
