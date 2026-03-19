# DATracker

A Next.js web application for DATracker, featuring a landing page with contact form functionality.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js) or **yarn**

You can check your Node.js version by running:
```bash
node --version
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/PlentifulKnowledge/DATracker.git
```

2. Navigate to the project directory:
```bash
cd DATracker
```

3. Install dependencies:
```bash
npm install
```

## Development

To run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3010](http://localhost:3010).

The development server includes:
- Hot module replacement (HMR) for instant updates
- Error overlay for debugging
- Fast refresh for React components

## Building for Production

To create an optimized production build:

```bash
npm run build
```

This command will:
- Compile and optimize all assets
- Perform type checking
- Run linting
- Generate static pages where possible
- Create an optimized production bundle

## Running Production Build

After building, you can run the production server locally:

```bash
npm start
```

The production server will be available at [http://localhost:3010](http://localhost:3010).

## Other Available Scripts

### Linting

To check for code quality issues:

```bash
npm run lint
```

## Project Structure

```
DATracker/
├── app/                    # Next.js App Router directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ContactForm.tsx   # Contact form component
├── public/                # Static assets
│   └── images/           # Image files
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

## Technologies Used

- **Next.js 14.2.33** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form state management and validation

## Features

- Responsive design optimized for all devices
- Contact form with email/phone validation
- Character limit validation for form fields
- Modern UI with California-themed color scheme
- Glass morphism effects
- Gradient text and backgrounds

## Browser Support

This application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.

## Contact

For questions or support, please contact the project maintainers.

