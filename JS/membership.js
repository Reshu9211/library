const memberForm = document.getElementById("memberForm");
const memberTable = document.getElementById("memberTable").querySelector("tbody");

const members = [];

memberForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("memberName").value.trim();
  const id = document.getElementById("memberId").value.trim();
  const type = document.getElementById("memberType").value;

  if (!name || !id || !type) {
    alert("All fields are required.");
    return;
  }

  const member = { name, id, type };
  members.push(member);
  renderMembers();

  memberForm.reset();
});

function renderMembers() {
  memberTable.innerHTML = "";

  members.forEach(member => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${member.name}</td>
      <td>${member.id}</td>
      <td>${member.type}</td>
    `;
    memberTable.appendChild(row);
  });
}
