

# Bookshelf Web Application

## Overview
A digital bookshelf system where Admins manage categories, students, and books, while Students access only their assigned shelves. React frontend connects to Google Apps Script REST API backed by Google Sheets.

## Important Notes
- **Frontend** will be built here in Lovable (React/Vite/Tailwind) and can be published via Lovable's built-in publishing
- **Google Apps Script backend code** will be provided as a separate file with full setup instructions — you'll paste it into your Google Apps Script editor and deploy as a Web App
- **Google Sheets** templates and structure will be documented for easy setup

---

## Pages & Features

### 1. Login Page
- Clean, centered login form (email + PIN)
- Session stored in React context (with localStorage persistence)
- Role-based redirect: Admin → Admin Dashboard, Student → Student Dashboard
- Error handling for invalid credentials

### 2. Admin Dashboard (sidebar layout)
- **Summary cards**: Total students, categories, books
- **Manage Categories**: Create/delete categories, displayed as cards
- **Manage Students**: Create student (email + category selection), auto-generated PIN shown once with copy button, student list with category assignment
- **Upload Books**: Form with title, Google Drive link, category selector
- **Search & filter** across books

### 3. Student Dashboard
- Card-based grid showing only assigned categories
- Click category → view books in that category
- Book cards with "View" (opens Drive link) and "Download" actions

### 4. Category Page
- Category name header + list of books as cards
- Search/filter within category

## UI/UX
- Modern Google Classroom-inspired design
- Sidebar navigation (collapsible)
- Responsive layout (mobile-friendly)
- Dark mode toggle
- Smooth transitions and card-based bookshelf design
- Shadcn UI components throughout

## Google Apps Script Backend (provided as code file)
- REST API endpoints for auth, users, categories, and books
- SHA-256 PIN hashing
- Admin role validation on sensitive endpoints
- CORS headers for frontend domain
- Full setup instructions for connecting Sheets + deploying

## Deliverables
- Complete React frontend (8+ components/pages)
- Google Apps Script backend code with all endpoints
- Step-by-step setup guide for Sheets, Apps Script deployment, and connecting frontend

