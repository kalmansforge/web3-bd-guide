# Web3 Business Development Guide

A comprehensive web application for managing project evaluations, metrics tracking, and business development in the Web3 space.

## Project Overview

This application provides a robust platform for:
- Project evaluation and tracking
- Metrics management and analysis
- Template-based evaluation workflows
- Dashboard for project insights
- Customizable evaluation templates
- Business development metrics guide

## Features

- **Project Management**: Create and manage multiple projects with detailed tracking
- **Evaluation System**: Conduct structured evaluations with customizable templates
- **Metrics Dashboard**: Visualize and analyze project metrics and performance
- **Template Editor**: Create and customize evaluation templates
- **Settings Management**: Configure application settings and preferences
- **Metrics Guide**: Access comprehensive guides for business development metrics
- **Data Storage**: All data is stored locally in browser localStorage (no server-side database required)

## Running the Project with Docker

You can run this project locally using Docker. This setup provides a reproducible environment for the web application.

### Quick Start

1. **Build and start the application:**

   ```sh
   docker compose up --build
   ```

2. **Access the application:**
   - The web app will be available at [http://localhost:4173](http://localhost:4173)

For detailed Docker configuration and troubleshooting, see the [Docker Implementation Guide](DOCKER.md).

## Templates

The application uses evaluation templates to standardize the project assessment process. Templates are automatically discovered and loaded from the `src/templates` directory.

For more details about templates and available examples, see the [Templates Guide](src/templates/README.md).

## Technologies

This project is built with modern web technologies:

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Form Handling**: React Hook Form with Zod validation
- **UI Enhancements**: Radix UI primitives
- **Charts**: Recharts
- **Notifications**: Sonner

## Development

You can work with this codebase in the following ways:

### Local Development

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd web3-bd-guide
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

### Using Docker

For containerized development, use the Docker setup as described in the "Running the Project with Docker" section above.

---
