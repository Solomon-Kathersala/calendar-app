# Calendar Application for Communication Tracking

This project is a **Calendar Application for Communication Tracking** designed to stramline the management of company communications. It provides a dashboard, a notification system, and a calendar to track, update, and manage communications across various companies. Built using **React** and **Ant Design**, it offers an intuitive UI for efficient handling of communication-related tasks.
It provides two main modules:

1. **Admin Module**: For companies and their communication methods.
2. **User Module**: For logging and tracking communication history with companies.

---

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)


## Features

### Admin Module

- **Company Management**:
  - Add, edit, or delete companies.
  - Manage details like company name, location, LinkedIn profile, emails, phone numbers, comments, and communication periodicity.
  - Prevents duplicate entries based on name, email, or phone number.
 
- **Communication Method Management**:
  - Add, edit, or delete communication methods.
  - Manage details like method name, description, sequence, and whether it is mandatory.

### User Module

- **Dashboard**:
  - View a summary of communications for each company.
  - Display the last five finished communications and the next scheduled communication.
  - Log new communications with details like type, date, and notes.

- **Calendar Integration**:
  - Displays all scheduled communications in a monthly calendar view.
  - Includes year navigation for tracking communications across different periods.
 
- **Notifications**:
  - Alerts for overdue and due-today communications.
  - Provides an interactive table for updating communication statuses.

## File Structure

### Components

1. **`AdminModule.js`**:
   - Handles company and communicatio method management.
   - Features modals for adding or editing entries and a table for data display.

2. **`UserModule.js`**:
   - Displays the dashboard with communication summaries.
   - Integrates a calendar view for visualizing communications.

---

## Technologies Used

- **React**: For building the user interface.
- **Ant Design**: For UI components (e.g., tables, modals, forms).
- **FullCalendar**: For the calendar view.
- **Moment.js**: For date manipulation and formatting.

---

## Installation

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn

### Steps

1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **To install ant design, full calendar, and moment**:
   ```bash
   npm install antd
   npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
   npm install moment
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## Usage

- **Admin**: Manage companies and communication methods.
- **Users**: Log, track, and manage communication history with companies through the dashboard, calendar, and notifications.

---

## Deployment

This project can be deployed using platforms like Vercel, Netlify, or GitHub Pages. Follow the instructions below to deploy on GitHub Pages:

### GitHub Pages

1. **Install `gh-pages`**:
   ```bash
   npm install gh-pages --save-dev
   ```
   
2. **Add scripts to `package.json`**:
   ```json
   "homepage": "https://<your-username>.github.io/<repository-name>",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
   
3. **Deploy**:
   ```bash
   npm run deploy
   ```
   
4. **Access your app at**:
   ```
   https://<your-username>.github.io/<repository-name>
   ```

---

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure the code adheres to the existing style and conventions.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
