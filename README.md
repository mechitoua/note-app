# Note App Frontend

This is the frontend application for the Note App, built with React, TypeScript, and Tailwind CSS.

![Note App Logo](/apps/frontend/public/light-note-app.jpg)

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Markdown Editor (@uiw/react-md-editor)

## Setup and Installation

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

- `src/` - Source code directory
  - `components/` - Reusable UI components
  - `hooks/` - Custom React hooks
  - `utils/` - Utility functions and helpers
  - `types/` - TypeScript type definitions
  - `pages/` - Page components
  - `assets/` - Static assets (images, fonts, etc.)
  - `layouts/` - Layout components
  - `lib/` - Third-party library configurations
  - `styles/` - Global styles and CSS modules
  - `features/` - Feature-specific components and logic
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
  - `index.css` - Global styles and Tailwind imports
- `public/` - Static assets directory
  - `light-note-app.jpg` - Application logo/banner image

## Path Aliases

The project uses path aliases for cleaner imports. Available aliases:

```typescript
import Component from '@components/Component';
import { useHook } from '@hooks/useHook';
import { utility } from '@utils/utility';
import { Type } from '@types/types';
import Page from '@pages/Page';
import image from '@assets/image';
import Layout from '@layouts/Layout';
import lib from '@lib/lib';
import '@styles/style.css';
import Feature from '@features/Feature';
```

## Configuration Files

- `tsconfig.json` - TypeScript configuration
- `tsconfig.node.json` - TypeScript configuration for Node.js environment
- `vite.config.ts` - Vite bundler configuration
- `postcss.config.js` - PostCSS configuration for Tailwind CSS
- `tailwind.config.js` - Tailwind CSS configuration

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm clean` - Clean build artifacts

## Dependencies

### Production Dependencies

- `@note-app/shared` - Shared package (workspace dependency)
- `@uiw/react-md-editor` - Markdown editor component
- `lucide-react` - Icon library
- `react` and `react-dom` - React framework

### Development Dependencies

- TypeScript and React type definitions
- Vite and related plugins
- Tailwind CSS and PostCSS
- ESLint for code linting
