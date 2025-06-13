const books = [
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", available: true },
  { title: "1984", author: "George Orwell", available: false },
  { title: "To Kill a Mockingbird", author: "Harper Lee", available: true },
  { title: "Pride and Prejudice", author: "Jane Austen", available: true },
  { title: "The Hobbit", author: "J.R.R. Tolkien", available: false }
];

function renderBooks(filter = "") {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = "";

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(filter.toLowerCase()) ||
    book.author.toLowerCase().includes(filter.toLowerCase())
  );

  filteredBooks.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Status:</strong> ${book.available ? "Available" : "Not Available"}</p>
    `;
    bookList.appendChild(bookCard);
  });
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  renderBooks(e.target.value);
});

window.onload = () => {
  renderBooks();
};
