# POS Application

This is a Point-of-Sale (POS) application with a **React frontend** and a **.NET 8 backend**.

- **Frontend:** React 19 + Vite + TailwindCSS  
- **Backend:** ASP.NET Core 8 Web API  

The project can be run in development mode, built for production, or containerized with Docker.

---

## Prerequisites

- Node.js >= 20
- npm or yarn
- .NET 8 SDK
- Docker (optional, for containerized deployment)

---

## Running the Application

### 1. Frontend

1. Navigate to the frontend folder:
cd front
2. Install dependencies:
npm install
3. Run in development mode:
npm run dev
Frontend will be available at http://localhost:5173

### 2. BackEnd
1. cd PosApi
2. Restore dependencies:
dotnet restore
3. Run in development:
dotnet run
Backend will be available at http://localhost:5246
Swagger UI is available at http://localhost:5246/swagger
