# Aminora Weight Loss Quiz Funnel

A modern, interactive weight loss assessment quiz built with Next.js, React, and TypeScript. This application guides users through a multi-step questionnaire to determine their eligibility for weight loss plans featuring Semaglutide and Tirzepatide medications.

## Features

- 🎯 **Multi-step Quiz Flow**: Interactive 10-step questionnaire with smooth animations
- 📊 **Progress Tracking**: Visual progress bar and step indicators
- 📈 **Projected Results**: Dynamic weight loss projections with interactive charts
- 💊 **Medication Plans**: Information about Semaglutide and Tirzepatide plans
- 🛒 **Checkout Integration**: Seamless checkout flow with order summary
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- ✨ **Smooth Animations**: Powered by Framer Motion

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Analytics**: PostHog

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd aminora-form-main
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── layout/      # Layout components (Header, ProgressBar, etc.)
│   │   ├── quiz/        # Quiz step components
│   │   └── ui/          # Reusable UI components
│   ├── context/         # React context providers
│   └── lib/             # Utility functions and API clients
├── public/
│   └── images/          # Static images (logo, vial images)
└── Aminora_files/       # Source design assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file in the root directory for environment-specific variables:

```env
# Add your environment variables here
```

## License

Private - All rights reserved

