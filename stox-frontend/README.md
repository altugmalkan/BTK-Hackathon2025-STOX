# Stox - Modern Marketplace Platform

A sophisticated marketplace platform built with modern web technologies, featuring a clean design system inspired by Stripe, Linear, and Vercel aesthetics.

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <https://github.com/BTK-Hackaton-2025/stox-frontend.git>

# Step 2: Navigate to the project directory
cd stox-frontend

# Step 3: Install the necessary dependencies
# NOTE: I suggest using pnpm (MAC: brew install pnpm, Windows-Powershell:Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression)
pnpm install

# Step 4: Start the development server
pnpm run dev
```

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn/ui** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework

## Features

- Modern, responsive design system
- Component-based architecture
- Type-safe development with TypeScript
- Fast development experience with Vite
- Accessible UI components with shadcn/ui

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Commit Message Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit messages. This helps us maintain a clean commit history and enables automated changelog generation.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat:** A new feature
- **fix:** A bug fix
- **docs:** Documentation only changes
- **style:** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor:** A code change that neither fixes a bug nor adds a feature
- **perf:** A code change that improves performance
- **test:** Adding missing tests or correcting existing tests
- **chore:** Changes to the build process or auxiliary tools and libraries

### Examples

```bash
# Adding a new feature
git commit -m "feat: add user authentication system"

# Fixing a bug
git commit -m "fix: resolve navigation menu overflow on mobile"

# Documentation update
git commit -m "docs: update API documentation for user endpoints"

# Refactoring code
git commit -m "refactor: extract common utility functions"

# Breaking changes
git commit -m "feat!: redesign user profile API"
```

### Scope (Optional)

You can add a scope to provide additional context:

```bash
git commit -m "feat(auth): add OAuth2 integration"
git commit -m "fix(ui): resolve button alignment issues"
```

For more details, please refer to the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Commit your changes using conventional commit format (`git commit -m 'feat: add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request
