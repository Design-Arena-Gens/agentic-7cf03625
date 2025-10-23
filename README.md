# NetWeave Pro

NetWeave Pro is a multi-level marketing (MLM) platform that enables affiliates to recruit, sell digital or physical goods, and manage payouts across web and mobile. The project ships with a Node.js/Express API, MongoDB data models, Stripe payment integration, Firebase Cloud Messaging hooks, and an Expo-powered React Native client that targets iOS, Android, and web.

## Project Structure

```
backend/   # Express API with MongoDB, Stripe, Firebase integration
frontend/  # React Native (Expo) app with React Navigation + Axios
```

## Backend

- **Stack**: Node.js, Express, Mongoose, Stripe SDK, Firebase Admin SDK
- **Key features**
  - Email/password and social authentication with affiliate hierarchy linking
  - Product catalogue management with admin-only endpoints
  - Order processing pipeline with Stripe PaymentIntent creation
  - Multi-level commission distribution & payout queue
  - Notification persistence + Firebase messaging broadcaster
- **Environment**: copy `backend/.env.example` to `.env` and populate values.
- **Scripts**
  - `npm run dev` – start API with nodemon
  - `npm run build` / `npm start` – transpile with Babel and run production build

## Frontend

- **Stack**: Expo SDK 50, React Navigation, AsyncStorage, Axios
- **Key features**
  - Auth flow with registration, login, and mock social sign-in wiring
  - Dashboard with earnings metrics and downline tree visualisation
  - Product marketplace with Stripe checkout bootstrap (client secret delivery)
  - Orders, payouts, notifications, and profile management screens
  - Admin console tab for product CRUD (visible to `admin` users)
- **Environment**: copy `frontend/.env.example` to `.env` if you need to override defaults.
- **Scripts**
  - `npm run start` – launch Metro bundler (press `w` for web)
  - `npm run web` / `npm run android` / `npm run ios` – Expo platform targets

## Getting Started

1. **Install dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. **Run services**
   - API: `npm run dev` from `backend`
   - App: `npm run start` from `frontend`
3. **Configure integrations**
   - MongoDB: update `MONGO_URI`
   - Stripe: supply `STRIPE_SECRET_KEY`
   - Firebase: service-account credentials for push notifications

## Deployment

The repository is optimised for Vercel. Build the API into `dist/` (`npm run build`) and deploy the Expo web bundle for the client. See deployment scripts or CI configuration as needed.

## Additional Notes

- Commission defaults cascade three levels deep with 20% / 10% / 5% shares.
- Stripe payments expect the client to confirm the PaymentIntent using the returned `clientSecret`.
- Firebase messaging requires device tokens to be registered via the provided endpoint.

Happy weaving!
