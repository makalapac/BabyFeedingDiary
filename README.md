# Breastfeeding Tracker

A Progressive Web App (PWA) for tracking breastfeeding sessions and weight measurements for your baby.

## Features

- Track breastfeeding sessions with timer
- Record which breast was used (left/right)
- Add comments to feeding sessions
- Track weight measurements
- View history of all feeding sessions and weight measurements
- Works offline
- Installable on mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5173

### Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Feeding Screen**: Press the left or right button to start a feeding session. The timer will start automatically. When finished, press the "End Feeding" button and add any comments if needed.

2. **History Screen**: View all your feeding sessions organized by date.

3. **Weight Screen**: Add weight measurements and view the history of measurements.

## Installing as a PWA

When visiting the application on a mobile device, you'll be prompted to install it as a PWA. This will add the application to your home screen for easy access.

## License

MIT 