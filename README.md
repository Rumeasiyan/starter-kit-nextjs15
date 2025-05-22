# Next.js 15 Starter Kit

A modern, feature-rich starter kit for Next.js 15 projects with TypeScript, ESLint, Prettier, Husky setup, and shadcn/ui components.

## 🌟 Features

- **Next.js 15**: Latest version with App Router
- **TypeScript**: For type safety and better developer experience
- **shadcn/ui**: Pre-configured UI components with Tailwind CSS
- **Authentication Ready**: Built-in auth setup
- **Modern Project Structure**: Organized with best practices
- **Code Quality Tools**: ESLint, Prettier, Husky
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Prisma ORM**: Type-safe database access with MySQL

## 📁 Project Structure

```
src/
├── app/                   # App router directory
│   ├── (auth)/           # Authentication routes
│   ├── _components/      # Shared components
│   │   └── ui/          # shadcn/ui components
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── configs/              # Configuration files
│   ├── enums/           # Enumeration types
│   ├── constants/       # Constant values
│   ├── settings/        # Application settings
│   └── types/           # TypeScript type definitions
├── helpers/             # Helper functions and utilities
├── lib/                 # Utility functions and shared logic
├── store/              # State management
├── styles/             # Global styles and Tailwind CSS
├── hooks/              # Custom React hooks
├── db.ts               # Database configuration
└── middleware.ts       # Next.js middleware
prisma/                  # Prisma schema and migrations
```

## 🚀 Development

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- MySQL database

### Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-name>
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MySQL database connection:

   ```
   DATABASE_URL="mysql://user:password@localhost:3306/database_name"
   ```

5. Set up the database:

   ```bash
   # Create and apply database migrations
   npx prisma migrate dev --name init

   # Seed the database with initial data
   npx prisma db seed
   ```

### Starting the Development Server

```bash
npm run dev
# or
yarn dev
```

The development server will start with Turbopack enabled for faster builds.

## 🎨 UI Components

This starter kit uses [shadcn/ui](https://ui.shadcn.com/) components with the following configuration:

- **Style**: New York
- **Base Color**: Neutral
- **CSS Variables**: Enabled
- **Directory Structure**:
  - UI Components: `src/app/_components/ui`
  - Utility Functions: `src/lib/utils`
  - Global CSS: `src/styles/globals.css`

### Component Aliases

The project includes pre-configured path aliases for easier imports:

```typescript
{
  "@/app/_components": Components
  "@/lib/utils": Utility functions
  "@/app/_components/ui": UI components
  "@/lib": Library functions
  "@/hooks": Custom hooks
}
```

## 🛠 Code Quality Tools

### Available Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run typecheck` - Run TypeScript type checking

### Database Commands

- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database
- `npx prisma db push reset` - Reset schema changes to database
- `npx prisma db pull` - Pull database schema
- `npx prisma migrate dev` - Create and apply migrations (development)
- `npx prisma migrate deploy` - Apply migrations (production)
- `npx prisma migrate reset` - Reset database and reapply migrations
- `npx prisma studio` - Open Prisma Studio to view/edit data
- `npx prisma db seed` - Seed the database with initial data

### Email Setup

The application uses Nodemailer for sending emails. Configure the following environment variables in your `.env` file:

```bash
# Email Configuration
EMAIL_SERVER_HOST=your-smtp-host
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-smtp-username
EMAIL_SERVER_PASSWORD=your-smtp-password
EMAIL_FROM=your-verified-sender-email

# Example for Gmail
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-gmail@gmail.com
EMAIL_SERVER_PASSWORD=your-app-specific-password
EMAIL_FROM=your-gmail@gmail.com
```

For Gmail:

1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to Google Account > Security
   - Under "2-Step Verification", click on "App passwords"
   - Select "Mail" and your device
   - Use the generated 16-character password as `EMAIL_SERVER_PASSWORD`

### Automatic Checks

The following checks run automatically before commits:

1. **Type Checking**: Ensures TypeScript types are valid
2. **Code Formatting**: Verifies code follows Prettier rules
3. **Linting**: Runs ESLint on staged files
4. **Commit Message Format**: Validates commit messages follow conventions

### Code Style Guide

#### TypeScript/JavaScript

We use ESLint with the following configurations:

- Next.js core web vitals
- TypeScript recommended rules
- React recommended rules
- React Hooks rules
- JSX accessibility rules
- Prettier integration

Key ESLint rules:

- No unused variables (warning)
- No explicit any (warning)
- React in JSX scope not required
- Props types validation not required

### Git Workflow

#### Commit Messages

Format: `type(scope): Subject`

Types:

- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding/updating tests
- `chore` - Maintenance tasks
- `revert` - Reverting changes
- `ci` - CI/CD changes
- `build` - Build system changes
- `deps` - Dependencies updates

Rules:

- Type must be lowercase
- Scope must be kebab-case
- Subject must be sentence-case
- No period at the end of subject
- Maximum line length: 100 characters

Examples:

```bash
feat(auth): Add user authentication system
fix(api): Resolve null response handling
docs(readme): Update installation instructions
```

### Tooling Setup

- **TypeScript**: Static type checking
- **ESLint**: Code quality and style checking
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Run linters on git staged files
- **commitlint**: Commit message linting
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components
- **Prisma**: Type-safe ORM for database operations
- **MySQL**: Database system

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 👏 Credits

Created by [Rumeasiyan](https://github.com/rumeasiyan) - Next.js 15 Starter Kit
