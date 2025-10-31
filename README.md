#  BookIt Web App

## 🧾 Description
A modern booking platform built with React, TypeScript, and Supabase.  
Users can explore experiences, choose a slot, enter details, apply a promo code, and confirm their booking securely.

## 🧠 Tech Stack
**Frontend:**
- React
- TypeScript
- TailwindCSS
- Vite
- Supabase

**Backend:**
- Node.js
- Express
- TypeScript

## ✨ Features
- View and select experiences  
- Slot booking and validation  
- Promo code verification  
- Booking confirmation page  
- Responsive design based on Figma  
- Supabase integration for database and storage

## 📂 Folder Structure

### Frontend (`/frontend`)
```
├── src/
│   ├── components/
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── integrations/
│   │   └── supabase/        # Supabase client & types
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── pages/               # Application pages
│   │   ├── Checkout.tsx
│   │   ├── ExperienceDetails.tsx
│   │   ├── Index.tsx
│   │   ├── NotFound.tsx
│   │   └── Result.tsx
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── supabase/               # Supabase configuration
│   ├── migrations/
│   └── types.ts
├── public/                 # Static assets
├── .env                    # Environment variables
├── components.json         # shadcn/ui config
├── tailwind.config.ts      # Tailwind configuration
└── vite.config.ts         # Vite configuration
```

### Backend (`/backend`)
```
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── bookingsController.ts
│   │   ├── experiencesController.ts
│   │   └── promoController.ts
│   ├── integrations/
│   │   └── supabase.ts    # Supabase server client
│   ├── routes/            # API routes
│   │   ├── bookings.ts
│   │   ├── experiences.ts
│   │   └── promo.ts
│   ├── app.ts            # Express app setup
│   └── index.ts          # Server entry point
├── .env                  # Environment variables
└── tsconfig.json        # TypeScript configuration
```

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone <repo-url>
cd booking-hero-app
```

### 2. Install dependencies
#### Frontend
```bash
cd frontend
npm install
```
#### Backend
```bash
cd ../backend
npm install
```

### 3. Add environment variables
Create a `.env` file in each folder.

**Frontend `.env`**
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-key>
```

**Backend `.env`**
```
PORT=5000
```

### 4. Run the app
#### Backend
```bash
npm run dev
```
#### Frontend
```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

## 🎨 Design
All styling is matched to the provided Figma design using TailwindCSS utilities and custom components from the shadcn/ui library.

## 🚀 Deployment
- Frontend → Vercel or Netlify  
- Backend → Render, Railway, or Vercel Functions

## 🧰 Scripts
In both frontend and backend directories:
- `npm run dev` – start development server  
- `npm run build` – build project  
- `npm run lint` – check code quality  

## 📝 License
MIT License
