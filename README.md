# diStreaming Project

A modern movie streaming application built with React, Vite, and Tailwind CSS. This functionality-rich platform offers a comprehensive admin dashboard for content management and an immersive user interface for browsing and reviewing movies.

## 🚀 Features

### User Features
- **Movie Browsing**: Browse movies by genre, rating, and recency.
- **Detailed Info**: View movie details, production info, and cast.
- **Trailers**: Watch movie trailers directly in a modal.
- **Reviews & Ratings**: Rate movies and leave reviews validation via Toast notifications.
- **Multi-language Support**: Fully localized in English and Indonesian.

### Admin Dashboard
- **User Management**: Edit user details, delete users (with secure ConfirmModal).
- **Content Management**:
  - **Movies**: Create, Edit, and Delete movies with comprehensive forms.
  - **Genres**: Manage movie genres.
  - **Actors**: Manage actor profiles and filmography.
  - **Reviews**: Moderate user reviews.
- **Modern UI/UX**: All actions utilize a unified Toast notification system and custom Modals instead of native browser prompts.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS
- **State Management & Data Fetching**: React Query (@tanstack/react-query), React Context (Auth & Toast)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Internationalization**: i18next & react-i18next
- **Icons**: React Icons

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd distreaming_project
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

The application will start at `http://localhost:5173` (default Vite port).

## 🔑 Testing Credentials

Use the following accounts to test the application's functionality.

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Regular User** | `xenaya@mail.com` | `xena1234` | Can browse, watch, rate, review movies, change subscription plan, and edit profile. |
| **Admin** | `test@mail.com` | `test1234` | Full access to the Admin Dashboard. |

## 🔧 Configuration

The application is currently configured to connect to the production API:
- **API URL**: `https://distreamingapi-production.up.railway.app/api`

This configuration can be found and modified in `src/config/api.js`.
