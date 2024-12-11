# Calendar Application

A calendar application built using Next.js, offering functionality similar to Google Calendar. This application allows users to create events, view a week-based calendar, switch between weeks, and manage user authentication with login and registration screens.

## Features

### Calendar View
- **Time Axis:** Time slots displayed on the Y-axis.
- **Day Axis:** Days with dates displayed on the X-axis.
- **Week Switching:** Navigate between weeks using the week switcher.
- **Event Creation:** Add events at the intersection of time and day by clicking or dragging on the calendar grid.

### Sidebar
- **Week View:** Overview of the selected week's events in a compact view.

### Authentication
- **Login Screen:** Allows users to log in with their credentials.
- **Register Screen:** Enables users to create a new account.
- **Token-Based Authentication:** User authentication is implemented by decoding JSON Web Tokens (JWT) without using NextAuth.

## Getting Started

### Prerequisites
- Node.js (>=14.x)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd calendar-application
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and configure the following variables:
   ```env
   DATABASE_URL=<Your MongoDB Connection String>
   JWT_SECRET=<Your JWT Secret>
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open the application in your browser at `http://localhost:3000`.

## Folder Structure
```
calendar-application/
├── components/        # Reusable components
├── pages/             # Next.js pages
│   ├── index.js       # Home page
│   ├── login.js       # Login screen
│   ├── register.js    # Registration screen
│   ├── api/           # API routes
├── styles/            # CSS and styling files
├── utils/             # Utility functions
├── public/            # Static assets
└── .env.local         # Environment variables
```

## Usage

### Creating an Event
1. Navigate to the main calendar view.
2. Click or drag on the desired time and day intersection.
3. Fill out the event details in the popup form and save.

### Switching Weeks
Use the week switcher at the top of the calendar to navigate between weeks.

### Logging In/Out
- Use the login screen to authenticate with your credentials.
- Use the register screen to create a new account.

## Deployment

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Technologies Used
- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** CSS Modules/Styled Components
- **Authentication:** JSON Web Tokens (JWT)
- **Database:** MongoDB


## Screenshots

![Screenshot](\public\event.png)
![Screenshot](\public\homepage.png)
## License
This project is licensed under the MIT License.

