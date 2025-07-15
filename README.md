# NurtureNest

A comprehensive maternal health platform built with React, TypeScript, and Vite.

## Features

- **User Authentication**: Secure login and registration with Supabase
- **Dashboard**: Personalized dashboard for expecting mothers
- **Health Resources**: Expert-reviewed articles and guides
- **Community Forum**: Connect with other mothers and share experiences
- **Virtual Consultations**: Book online appointments with healthcare professionals
- **In-Person Appointments**: Schedule face-to-face consultations
- **ML Insights**: Advanced health analytics and predictions
- **Urgent Care**: Emergency contact and support
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Material-UI
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL) or Oracle SQL*Plus
- **Backend API**: Express.js (for Oracle integration)
- **Charts**: Chart.js, React-Chartjs-2
- **Forms**: React Hook Form, Formik, Yup
- **Icons**: Lucide React
- **Date Picker**: React-Datepicker
- **CSV Processing**: Papaparse

## Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- **For Supabase**: Supabase account and project
- **For Oracle**: Oracle Database (11g or higher) or Oracle XE
- **For Oracle**: Oracle Instant Client (if connecting remotely)

## Database Options

NurtureNest supports two database backends:

1. **Supabase (Default)**: PostgreSQL with built-in authentication, real-time subscriptions, and edge functions
2. **Oracle SQL*Plus**: Traditional Oracle database with custom Express.js backend

### Using Supabase (Default)

The project comes configured with Supabase as the default backend. Set up your Supabase environment variables in `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Using Oracle SQL*Plus

For Oracle integration, you'll need to:

1. **Install Oracle Client**: Download and install Oracle Instant Client or Oracle Database
2. **Configure Environment Variables**: Add Oracle-specific variables to your `.env` file:

```env
# Oracle Database Configuration
ORACLE_HOST=localhost
ORACLE_PORT=1521
ORACLE_SID=XE
ORACLE_USER=your_username
ORACLE_PASSWORD=your_password

# Backend API Configuration
BACKEND_URL=http://localhost:5000
DATABASE_TYPE=oracle
```

3. **Create Database Schema**: Run the schema script in Oracle SQL*Plus:
```sql
SQL> @backend/schema.sql
```

4. **Verify Tables**: Check if tables were created successfully:
```sql
SQL> @backend/verify-schema.sql
```

5. **Start the Express Backend**: Run the Oracle backend server:

```bash
npm run server
```

6. **Switch Frontend to Oracle Mode**: The frontend will automatically detect the `DATABASE_TYPE` environment variable and use the appropriate backend.

> 📖 **Detailed Oracle Setup Guide**: See `backend/ORACLE_GUIDE.md` for complete SQL*Plus commands and troubleshooting tips.

### Oracle Database Schema

The Oracle backend includes the following tables:

- `users` - User authentication and profiles
- `appointments` - Medical appointments
- `consultations` - Virtual consultations
- `articles` - Educational content
- `forum_posts` - Community forum posts
- `emergency_contacts` - Emergency contact information
- `health_records` - Health monitoring data

To set up the Oracle database:

1. **Install Oracle Database**: Download and install Oracle Database 11g or higher, or Oracle XE
2. **Run the Schema Script**: Execute the `backend/schema.sql` file in Oracle SQL*Plus or SQL Developer:
   ```sql
   @backend/schema.sql
   ```
3. **Configure Connection**: Update your `.env` file with the Oracle connection details
4. **Test Connection**: Run the backend server to verify the connection works

### Database Migration

To switch from Supabase to Oracle or vice versa:

1. **Export Data**: Use the appropriate export tools (pg_dump for Supabase, exp/expdp for Oracle)
2. **Update Environment**: Change the `VITE_DATABASE_TYPE` in your `.env` file
3. **Import Data**: Use the import tools to migrate your data
4. **Restart Application**: Restart both backend and frontend servers

## Installation

### For Supabase (Default Setup)

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### For Oracle SQL*Plus Setup

1. Complete steps 1-2 from the Supabase setup above
2. Install Oracle Instant Client or Oracle Database
3. Set up environment variables:
   Create a `.env` file in the root directory and add your Oracle credentials:
   ```
   # Oracle Database Configuration
   ORACLE_HOST=localhost
   ORACLE_PORT=1521
   ORACLE_SID=XE
   ORACLE_USER=your_username
   ORACLE_PASSWORD=your_password
   
   # Backend API Configuration
   BACKEND_URL=http://localhost:5000
   DATABASE_TYPE=oracle
   ```

4. Start the Express backend server:
   ```bash
   npm run server
   ```

5. In a new terminal, start the development server:
   ```bash
   npm run dev
   ```

### Build for Production

```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run server` - Start Express backend server (for Oracle integration)
- `npm run check-oracle` - Check Oracle backend health and configuration

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── EmergencyButton.tsx
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   └── useSupabaseUser.ts
├── lib/                # Utility libraries
│   ├── supabase.ts
│   ├── databaseService.ts    # Database abstraction layer
│   └── databaseConfig.ts     # Database configuration
├── pages/              # Page components
│   ├── Articles.tsx
│   ├── Dashboard.tsx
│   ├── Forum.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── MLInsights.tsx
│   ├── VirtualConsultation.tsx
│   ├── InPersonAppointmentPage.tsx
│   └── UrgentCarePage.tsx
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main app component
└── main.tsx            # App entry point

backend/                # Oracle backend (Express.js)
├── server.js           # Express server with Oracle integration
└── schema.sql          # Oracle database schema

scripts/                # Utility scripts
└── check-oracle.js     # Oracle health check script
```

## Features Details

### Authentication
- Secure user registration and login
- Password reset functionality
- Session management with Supabase

### Dashboard
- Personalized user experience
- Quick access to key features
- Health statistics and tracking

### Health Resources
- Categorized articles (Pregnancy, Postpartum, Nutrition, Mental Health)
- Expert-reviewed content
- Search and filter functionality

### Community Forum
- Discussion threads by topic
- User interactions and support
- Real-time updates

### Appointments
- Virtual consultation booking
- In-person appointment scheduling
- Healthcare provider matching

### ML Insights
- Health data analysis
- Predictive insights
- Interactive charts and visualizations



### Testing with Oracle SQL*Plus

1. **Set up Oracle Database**:
   - Install Oracle Database or Oracle XE
   - Create a database user with appropriate privileges
   - Run the schema creation script:
     ```sql
     @backend/schema.sql
     ```

2. **Configure Environment Variables**:
   - Update `.env` with Oracle credentials
   - Set `VITE_DATABASE_TYPE=oracle`

3. **Start the Backend Server**:
   ```bash
   npm run server
   ```

4. **Start the Frontend** (in a new terminal):
   ```bash
   npm run dev
   ```


### Switching Between Databases

To switch between Supabase and Oracle:

1. **Stop all running servers**
2. **Update `.env` file**:
   - For Supabase: Comment out Oracle variables, uncomment Supabase variables
   - For Oracle: Comment out Supabase variables, uncomment Oracle variables
3. **Restart the application**:
   - For Supabase: `npm run dev`
   - For Oracle: `npm run server` (in one terminal) and `npm run dev` (in another)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request


⚠️** Warning: Copyright Notice**
This project is protected by copyright law. Unauthorized copying, distribution, or reuse of any part of this work is strictly prohibited. Violators may be subject to legal action.


![WhatsApp Image 2025-07-15 at 14 12 38_7cf49a95](https://github.com/user-attachments/assets/81cedd39-2409-4aad-9280-bb8d536903ed)

