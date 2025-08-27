# DapurMBG Vue.js Dashboard

A Vue.js dashboard application for DapurMBG (Dapur Badan Gizi Nasional) that displays regional progress tracking, statistics, and management data.

## Features

- **Authentication System**: Secure login with JWT token management
- **Dashboard Page**: Overview with regional statistics, progress tracking, activity feeds, and media gallery
- **Wilayah Page**: Regional details with progress charts, timeline, and notes
- **API Integration**: Connects to backend API for real-time data
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop
- **Interactive Charts**: Progress visualization using Chart.js
- **Real-time Updates**: Dynamic data loading with loading states
- **User Management**: User profile display and logout functionality

## Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Chart and graph library
- **Font Awesome** - Icon library

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── Header.vue      # Navigation header with user menu
│   ├── Footer.vue      # Page footer
│   ├── ProgressCircle.vue  # Circular progress indicator
│   ├── RegionCard.vue  # Regional statistics card
│   ├── ActivityItem.vue    # Activity list item
│   ├── MediaGallery.vue    # Photo/video gallery
│   └── ProgressChart.vue   # Line chart component
├── views/              # Page components
│   ├── Login.vue       # Authentication login page
│   ├── Dashboard.vue   # Main dashboard page
│   └── Wilayah.vue     # Regional details page
├── services/           # API services
│   └── api.js          # API service with authentication
├── style.css           # Global styles and Tailwind imports
├── main.js             # Application entry point with routing
└── App.vue             # Root component
```

## Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The application will be available at `http://localhost:5173`
   - You will be redirected to the login page first
   - After successful login, navigate between Dashboard and Wilayah pages using the top navigation

## Authentication

The application includes a secure authentication system:

### Login Process
1. **Access the application** - You'll be automatically redirected to `/login`
2. **Enter credentials** - Use your username and password
3. **Automatic redirect** - Upon successful login, you'll be redirected to the dashboard
4. **Token management** - JWT tokens are automatically stored and managed

### Login API
- **Endpoint**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "token": "jwt_token_here",
    "user": {
      "username": "admin",
      "email": "admin@example.com"
    }
  }
  ```

### Protected Routes
- All dashboard routes require authentication
- Unauthenticated users are redirected to login
- Authenticated users cannot access login page (redirected to dashboard)

### Logout
- Click on user avatar in the top-right corner
- Select "Logout" from the dropdown menu
- Automatically clears stored tokens and redirects to login

## API Configuration

The application connects to the backend API at:
- **Base URL**: `https://server.qqltech.com:7113/api`
- **Endpoint**: `/dynamic/t_progress_dapur`
- **Authentication**: Bearer token (configured in `src/services/api.js`)

### API Response Format

```json
{
  "status": "success",
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "totalPages": 0,
    "limit": 10,
    "currentRowsCount": 0,
    "next_page": null,
    "prev_page": null
  }
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features Overview

### Dashboard Page
- Regional progress overview with circular progress indicator
- Interactive map area with regional markers
- Activity feed with real-time updates
- Timeline with target tracking
- Media gallery (photos, videos, documents)
- Regional notes and updates

### Wilayah Page
- Region and kitchen selection dropdowns
- Historical progress data with pagination
- Accumulative progress circle chart
- Development progress line chart
- Timeline with weekly targets
- Notes section with API integration
- Loading states and error handling

## Data Flow

1. **Component Mount**: API calls are made when components are mounted
2. **Loading States**: Skeleton loaders show while data is being fetched
3. **Error Handling**: Fallback to static data if API calls fail
4. **Real-time Updates**: Data refreshes when filters change
5. **Pagination**: Server-side pagination for large datasets

## Customization

### Adding New API Endpoints

1. Add new methods to `src/services/api.js`
2. Update components to use the new API methods
3. Handle loading and error states appropriately

### Styling Changes

- Modify `src/style.css` for global styles
- Use Tailwind classes in components for styling
- Custom CSS can be added to individual components

### Adding New Pages

1. Create new Vue component in `src/views/`
2. Add route to `src/main.js`
3. Update navigation in `src/components/Header.vue`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive Web App ready

## Development Notes

- The application uses fallback static data when API calls fail
- All API calls include proper error handling
- Loading states provide good user experience
- Components are modular and reusable
- Responsive design works on all screen sizes

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check network connectivity
   - Verify API endpoint URL
   - Ensure bearer token is valid

2. **Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS rules

For additional support or questions, please refer to the Vue.js and Vite documentation.
