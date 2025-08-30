# Backend API

Base URL: http://localhost:3000/api

Auth
- POST /auth/register { name, email, password, role? }
- POST /auth/login { email, password } -> { token }

Books (requires Bearer token; POST/PUT/DELETE require Librarian or Admin)
- GET /books -> list
- GET /books/:id -> item
- POST /books -> create
  Required: title, author, isbn, quantity, available
  Optional: cover, genres[], type, status, rating (0-10), summary, recommended (bool)
- PUT /books/:id -> update (any of the above fields)
- DELETE /books/:id -> remove

Borrow
- POST /borrow/borrow { bookId } (Borrower/User/Librarian/Admin)
- POST /borrow/return { userId, bookId } (Borrower/User)
- GET  /borrow/borrowRecords (Librarian/Admin)
- GET  /borrow/borrowRecords/:userId (Borrower/User)
- GET  /borrow/allBorrowRecords (Librarian/Admin)

Environment
- MONGO_URL, JWT, PORT

Run
- npm install
- npm run dev (hot reload)
- npm start (prod)
