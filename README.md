
# SkillSphere

SkillSphere is a React-based freelancing platform powered by Firebase. It enables users to discover and hire skilled freelancers, manage job requests, and leave feedback. With real-time notifications and email alerts, SkillSphere ensures a seamless and efficient experience for both clients and freelancers.

## Features

- **Freelancer Discovery**:
  - Browse and filter freelancer profiles by skills, location, and ratings.
- **Profile Details**:
  - View detailed freelancer profiles, including past work, reviews, and ratings.
- **Job Requests**:
  - Submit project details for hiring freelancers, triggering email and in-app notifications.
- **Real-Time Updates**:
  - Get real-time updates on job requests using Firebase's database.
- **Feedback System**:
  - Rate and review freelancers after project completion.

## Tech Stack

- **Frontend**: React.
- **Backend**: Nodejs , Firebase.
- **Deployment**: Firebase Hosting.

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ShubhamRaut280/Local-service-frontend-react.git
   cd Local-service-frontend-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com).
   - Enable Authentication, Firestore.
   - Download the firebaseConfig object and add it to a `.env` file:
     ```env
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

4. Start the development server:
   ```bash
   npm start
   ```

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Firebase Hosting:
   ```bash
   firebase deploy
   ```

## Live Demo

👉 Visit SkillSphere

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
