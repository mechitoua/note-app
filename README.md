# Note App

A modern note-taking application built with React and TypeScript, featuring a clean UI and powerful markdown editing capabilities.

![Note App Logo](/public/light-note-app.jpg)

## Features

- Rich Markdown editing with live preview
- Tag-based note organization
- Quick search and filtering
- Responsive design
- Light/Dark mode support
- Fast and efficient with Vite
- Local storage persistence

## Tech Stack

- React 18 with TypeScript
- Vite for blazing-fast development
- Tailwind CSS for styling
- React Markdown Editor (@uiw/react-md-editor)
- Radix UI for accessible components
- Zustand for state management
- Headless UI & Heroicons for UI components

## Quick Start

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

The app will automatically open at `http://localhost:3000`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks for note management
│   └── notes/     # Note-specific hooks (CRUD, editor, state)
├── services/      # API and service layer
├── types/         # TypeScript type definitions
├── features/      # Feature-specific components
├── layouts/       # Layout components
├── lib/          # Third-party library configurations
├── styles/       # Global styles and Tailwind utilities
└── utils/        # Helper functions and utilities
```

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint for code quality
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean build artifacts

## Key Dependencies

### Core
- `react` & `react-dom` (v18)
- `typescript` (v5)
- `vite` (v5)
- `zustand` - State management
- `@uiw/react-md-editor` - Markdown editor

### UI Components
- `@headlessui/react` - Unstyled, accessible components
- `@heroicons/react` - Beautiful icons
- `@radix-ui/react-separator` - UI primitives
- `lucide-react` - Icon set
- `react-resizable-panels` - Resizable layout panels

### Development
- `@swc/core` - Fast TypeScript/JavaScript compiler
- `eslint` - Code linting
- `prettier` - Code formatting
- `tailwindcss` - Utility-first CSS

## Path Aliases

The project uses path aliases for clean imports:

```typescript
import { Component } from '@/components'
import { useNotesCrud } from '@/hooks/notes'
import { noteService } from '@/services'
import { Note } from '@/types'
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.
