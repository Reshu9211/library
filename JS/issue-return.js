let calculatedDueDate = "";

document.getElementById("issueForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const issueDateInput = document.getElementById("issueDate").value;
  const dueDateInput = document.getElementById("dueDate");

  if (!issueDateInput) {
    alert("Please select an issue date.");
    return;
  }

  const issueDate = new Date(issueDateInput);
  const dueDate = new Date(issueDate);
  dueDate.setDate(issueDate.getDate() + 7);
  calculatedDueDate = dueDate.toISOString().split("T")[0];

  dueDateInput.value = calculatedDueDate;
  alert("Book issued! Due date is " + calculatedDueDate);
});

document.getElementById("returnForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const returnDateInput = document.getElementById("returnDate").value;

  if (!calculatedDueDate) {
    alert("Please issue a book first to set a due date.");
    return;
  }

  const returnDate = new Date(returnDateInput);
  const dueDate = new Date(calculatedDueDate);

  const timeDiff = returnDate - dueDate;
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  let fine = 0;
  if (dayDiff > 0) {
    fine = dayDiff * 5;
  }

  document.getElementById("fineDisplay").textContent =
    fine > 0 ? `Fine to be paid: ₹${fine}` : "No fine. Returned on time.";
});
