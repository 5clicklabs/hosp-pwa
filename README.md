# Hospital Appointment Booking System with Chat Interface

A modern Progressive Web Application (PWA) built with Next.js that provides an intuitive chat-based interface for booking hospital appointments. The application uses OpenAI's GPT API for natural language processing and Firebase for data persistence.

## Features

- 💬 Chat-like interface for natural interaction
- 🏥 Intelligent department recommendation based on symptoms
- 📅 Real-time appointment scheduling
- 📱 Progressive Web App (PWA) support
- 📞 Phone number verification with OTP
- 📆 Calendar integration for appointments
- 🌐 Multi-language support
- 🔒 Secure authentication with Firebase

## Prerequisites

Before you begin, ensure you have:

1. **Firebase Account & Configuration**

   - Create a Firebase project
   - Enable Authentication (Phone Authentication)
   - Enable Firestore Database
   - Create a web app and get your configuration
   - Add the following to your `.env.local`:

   ```
   NEXT_PUBLIC_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_APP_ID=your_firebase_app_id
   ```

2. **OpenAI API Key**
   - Get an API key from OpenAI
   - Add to `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser

## Building for Production

```bash
npm run build
npm run start
```

## PWA Support

This project was built on top of a Next.js PWA boilerplate created by [this youtube tutorial](https://www.youtube.com/watch?v=ARNN_zmrwcw). The original boilerplate provided essential configurations for PWA support including:

- Proper `_document.tsx` setup
- Configured `manifest.json`
- Optimized `next.config.js`
- PWA installation support

To customize the PWA settings, edit the `manifest.json` file in the `public` folder. Ensure the `display` option is set to "standalone" or "fullscreen".

To install as a desktop app, look for the install icon in your browser's address bar:

<img width="510" alt="PWA Install Button" src="https://user-images.githubusercontent.com/99047250/213308384-370d7664-2f28-48de-a64a-dd896c8ad528.png">

## Project Structure

- `/src/components`: UI components including chat interface
- `/src/flows`: Flow logic for different features
- `/src/hooks`: Custom hooks for operations and frequent tasks
- `/src/lib`: Types, utilities, and configurations
- `/src/pages`: Next.js pages and API routes

## Key Features Implementation

The appointment booking flow is implemented in a modular way, with separate components for:

- Department selection
- User details collection
- OTP verification
- Doctor selection
- Appointment scheduling
- Confirmation and calendar integration

## Credits

PWA boilerplate template created by [original author]. The original template provided crucial configurations for PWA functionality with Next.js, which many online tutorials missed.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## License

MIT
