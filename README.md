# WorkTally - Simple Time Tracking System

A full-stack timekeeping system built with Django and Next.js.

## Project Structure

This project consists of two main parts:
- **Backend**: Django REST API
- **Frontend**: Next.js application

## Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL/MariaDB

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Configure your database in `core/settings.py`. The default configuration uses MySQL:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'your_db_name',
           'USER': 'your_db_user',
           'PASSWORD': 'your_db_password',
           'HOST': 'localhost',
           'PORT': '3306',
       }
   }
   ```

6. Apply migrations:
   ```
   python manage.py migrate
   ```

7. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

8. Run the development server:
   ```
   python manage.py runserver
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/users/register/` - Register a new user
- `POST /api/users/login/` - Login and get auth token
- `POST /api/users/logout/` - Logout and invalidate token
- `GET /api/users/me/` - Get current user details
- `POST /api/users/change-password/` - Change password
- `PUT /api/users/update-profile/` - Update user profile

### Timekeeping
- `GET /api/timekeeping/dashboard/` - Get dashboard data
- `POST /api/timekeeping/clock-in/` - Clock in
- `POST /api/timekeeping/clock-out/` - Clock out
- `GET /api/timekeeping/time-entries/` - List time entries
- `GET /api/timekeeping/projects/` - List projects
- `GET /api/timekeeping/time-off/` - List time-off requests
- `POST /api/timekeeping/time-off/` - Create time-off request

## Features

- User authentication and profile management
- Clock in/out functionality
- Time tracking with project association
- Time-off request management
- Dashboard with activity summary
- Admin panel for management

## License

MIT
