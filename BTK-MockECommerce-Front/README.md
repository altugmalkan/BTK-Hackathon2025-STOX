# Market Hub Dashboard

A modern e-commerce dashboard built with React, TypeScript, and Tailwind CSS.

## Features

- **Product Catalog**: Browse and filter products with advanced sorting options
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Product Details**: Detailed product pages with ratings and reviews
- **User Authentication**: Login pages for customers and sellers
- **Contact & About Pages**: Professional company information pages

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BTK-Hackaton-2025/MockECommerce-Front.git
cd MockECommerce-Front
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── Header.tsx     # Navigation header
│   ├── ProductCard.tsx # Product display component
│   └── ...
├── pages/             # Page components
│   ├── Index.tsx      # Home page
│   ├── Products.tsx   # Products catalog
│   ├── About.tsx      # About page
│   ├── Contact.tsx    # Contact page
│   └── ...
├── assets/            # Static assets
└── lib/              # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
