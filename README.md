# Shimmer Sensor Dashboard

Angular-based web application for managing and visualizing Shimmer wearable sensor data. Features interactive time-series charts, data grid tables, and real-time device-patient mapping with AWS S3 integration.

## Features

- **Interactive Data Grid**: AG Grid implementation for displaying device and patient metadata with sorting, filtering, and pagination
- **Time-Series Visualization**: Chart.js integration for plotting accelerometer data from Shimmer sensors
- **Device-Patient Mapping**: Interface for associating devices with patients
- **Real-Time Data**: Live updates from S3-backed sensor data storage
- **Responsive UI**: Modern, mobile-friendly interface built with Tailwind CSS
- **AWS Integration**: Deployed on AWS Amplify with S3 storage backend

## Tech Stack

- **Framework**: Angular 20.1.6
- **UI Components**: AG Grid, Tailwind CSS
- **Charts**: Chart.js, ng2-charts
- **Backend**: AWS Amplify, AWS S3
- **Language**: TypeScript
- **Package Manager**: npm

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- Angular CLI (`npm install -g @angular/cli`)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/shimmerumass/shimmer-sensor-dashboard.git
cd shimmer-sensor-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure AWS Amplify (if deploying):
```bash
amplify configure
```

## Development

To start a local development server, run:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

## Building

Build the project for production:

```bash
ng build
```

Production build artifacts will be stored in the `dist/` directory with optimizations enabled.

To build with specific configuration:
```bash
ng build --configuration production
```

## Project Structure

```
src/
├── app/
│   ├── comp/
│   │   ├── data-grid/          # AG Grid component for data display
│   │   ├── header-comp/        # Header navigation component
│   │   └── auth-comp/          # Authentication component
│   ├── pages/
│   │   ├── home-page/          # Main dashboard page
│   │   ├── data-ops/           # Data operations page
│   │   └── user-ops/           # User management page
│   └── services/
│       └── api.service.ts      # API integration for S3 data
├── assets/                      # Static assets
└── environments/                # Environment configurations
```

## Key Components

### Data Grid Component
Displays Shimmer sensor metadata with:
- Patient and device information
- Timestamp data
- Accelerometer variance values
- Graph visualization buttons for Shimmer 1 and Shimmer 2 sensors

### Home Page Component
Main dashboard featuring:
- Active sensor count (unique devices with data)
- Total data points statistics
- Unregistered devices count
- User count
- Interactive charts modal for time-series visualization
- Device-patient mapping interface

### API Service
Handles data fetching from backend:
- `listFilesMetadata()`: Basic file metadata (device, date, patient, files)
- `listFilesCombinedMeta()`: Complete metadata with decoded sensor data
- `listUniquePatients()`: Patient list for mapping
- `listFilesDeconstructed()`: Parsed file structure

## Configuration

### Angular Build Budgets
Current production bundle size limits (configured in `angular.json`):
- Initial bundle warning: 3 MB
- Initial bundle error: 4 MB

### Environment Variables
Configure API endpoints in `src/environments/`:
- `environment.ts` (development)
- `environment.prod.ts` (production)

## Testing

Run unit tests:
```bash
ng test
```

Run end-to-end tests:
```bash
ng e2e
```

## Deployment

### AWS Amplify
The application is configured for AWS Amplify deployment:

1. Connect your repository to Amplify Console
2. Configure build settings (amplify.yml is included)
3. Deploy automatically on push to main branch

### Manual Deployment
Build and deploy to any static hosting:
```bash
ng build --configuration production
# Deploy contents of dist/ directory
```

## Common Issues

### Bundle Size Warnings
If you encounter bundle size errors during build, adjust budgets in `angular.json`:
```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "3mb",
    "maximumError": "4mb"
  }
]
```

### Lock File Sync Issues
If `package-lock.json` is out of sync:
```bash
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
```

### Chart Not Rendering
If the chart modal doesn't display:
- Ensure `x_values` and `y_values` arrays are populated before opening modal
- Check that Chart.js and ng2-charts are properly installed
- Verify canvas element exists in DOM before chart initialization

## Data Flow

1. **Metadata Loading**: API fetches combined metadata from S3 backend
2. **Grid Display**: Data is processed and displayed in AG Grid with Shimmer 1/2 columns
3. **Graph Visualization**: Clicking graph button emits time-series data to parent component
4. **Chart Rendering**: Modal opens with Chart.js rendering the time vs acceleration data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the UMass Shimmer research initiative.

## Contact

For questions or support, please contact the UMass Shimmer team.

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [AG Grid Documentation](https://www.ag-grid.com/angular-data-grid/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
