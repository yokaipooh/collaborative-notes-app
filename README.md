## Setup and Run Instructions

### 1. Prerequisites
Before running the application, ensure the following are installed on your system:
- **Node.js** (v18 or later)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or later)

---

### 2. Clone the Repository
Clone the project repository to your local machine:
```bash
git clone <repository-url>
cd collaborative-notes-app
```

---

### 3. Install Dependencies
Install the required dependencies for both the frontend and backend:
```bash
npm install
```

---

### 4. Database Setup
Run the following SQL commands to create the database and table:
```sql
CREATE DATABASE collaborative_notes;
\c collaborative_notes
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

(Optional) Seed the database with sample data for testing:
```sql
INSERT INTO notes (title, content)
VALUES
('Sample Note 1', 'This is the content for Sample Note 1.'),
('Sample Note 2', 'This is the content for Sample Note 2.');
```

---

### 5. Configure the Backend
Ensure the backend is configured to connect to your PostgreSQL database. Open `server.cjs` and verify the database connection details:
```javascript
const pool = new Pool({
  user: "postgres", // Replace with your PostgreSQL username
  host: "localhost",
  database: "collaborative_notes", // Replace with your database name
  password: "postgres", // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});
```

---

### 6. Run the Application
- **Start the Backend**: Run the backend server:
  ```bash
  npm run dev:backend
  ```
  The backend will start on [http://localhost:5200](http://localhost:5200).

- **Start the Frontend**: Run the frontend development server:
  ```bash
  npm run dev:frontend
  ```
  The frontend will start on [http://localhost:5173](http://localhost:5173).

- **Run Both Simultaneously**: Alternatively, you can run both the frontend and backend together:
  ```bash
  npm run dev
  ```

---

### 7. Test the Application
- **Open the Application**: Navigate to [http://localhost:5173](http://localhost:5173) in your browser.
- **Test Features**:
  - **Create a Note**: Click "Create New Note," fill in the title and content, and save.
  - **Edit a Note**: Click the edit icon on a note, modify the content, and save.
  - **Delete a Note**: Click the delete icon on a note.
  - **Real-Time Updates**: Open the app in two tabs and test collaborative editing.

---

## Collaborative Notes App Documentation

### Performance Optimizations
- **Lazy Loading for Notes**: Implemented using **TanStack Virtual** to load notes incrementally, ensuring smooth performance even with large datasets.
- **Efficient Rendering**: Leveraged memoization with **Zustand** to minimize unnecessary re-renders, keeping the app responsive.
- **Virtualization for Smooth Scrolling**: Used **TanStack Virtual** to render only visible notes, reducing DOM overhead.
- **Data Fetching Strategy**: Notes are fetched in chunks using pagination (`limit` and `offset`), with infinite scrolling for seamless data loading.

---

### Design Choices
- **State Management with Zustand**: Chosen for its simplicity and efficiency in managing app state.
- **Real-Time Updates with Socket.IO**: Enables seamless collaborative editing with bi-directional communication.
- **UI Design with Material UI**: Provides a modern, responsive, and consistent design using pre-built components.
- **Rich Text Editor with TipTap**: Offers a feature-rich editing experience with real-time updates.
- **Routing and Navigation with React Router**: Ensures smooth navigation with dynamic routes for editing notes.
- **Form Handling with React Hook Form & Zod**: Simplifies form state management and validation.
- **Card Layout for Notes**: Uses **MUI's Card component** for a clean and interactive note display.

---

### Why These Choices Were Made
- **Performance First**: Optimized for large datasets with lazy loading, virtualization, and memoization.
- **Simplicity**: Leveraged tools like Zustand and React Router to maintain a clean architecture.
- **Real-Time Collaboration**: Core functionality powered by Socket.IO for instant updates.
- **User Experience**: Ensured a polished and responsive UI with Material UI and TipTap.

