# Auth Service

A TypeScript-based authentication service built with Node.js and Express.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The server will be available at `http://localhost:3000`

### Building for Production

To build the application:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

### Scripts

- `dev`: Start development server with hot-reload
- `build`: Build the application
- `start`: Start production server
- `lint`: Lint the code
- `format`: Format the code

## Project Structure

```
src/
  ├── app.ts          # Express application setup
  ├── config/        # Configuration files
  ├── controllers/   # Route controllers
  ├── middlewares/   # Custom express middlewares
  ├── models/        # Database models
  ├── routes/        # Routes
  ├── services/      # Business logic
  └── utils/         # Utility classes and functions
```

## License

ISC
