
# Society Management Frontend

This is a modern frontend application for a Society Management System, built with [Next.js](https://nextjs.org), React, and Tailwind CSS. It provides authentication, admin, and resident features, and connects to a backend Express server using JWT authentication.

## Features
- User authentication (Sign In/Sign Up)
- Role-based dashboards (Admin, Resident)
- Payment and subscription management for residents
- Admin management for flats and dashboard
- Responsive UI with Tailwind CSS

## Folder Structure

```
frontend/
├── app/
│   ├── globals.css                # Global styles (Tailwind CSS imports)
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   ├── (auth)/                    # Auth routes (sign-in, sign-up)
│   │   ├── layout.tsx
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   └── (features)/                # Main app features (protected)
│       ├── layout.tsx
│       ├── page.tsx
│       ├── admin/                 # Admin dashboard & features
│       │   ├── dashboard/page.tsx
│       │   └── flats/page.tsx
        |   |___ edit/[flat_id]/page.tsx
        |   |___ add/page.tsx
│       │   └──subscriptions/page.tsx
        |   |__payment-entry/page.tsx
        |   |__reports/page.tsx
        |   |__notifications/page.tsx
        |   |__profile/page.tsx

│       └── resident/              # Resident dashboard & features
│           └── dashboard/page.tsx
│           ├── payment-history/page.tsx
│           ├── paynow/page.tsx
            |___profile/page.tsx
├── components/
│   ├── AuthForm.tsx               # Auth form component
│   ├── MySidebar.tsx              # Sidebar component
│   └── ui/                        # UI primitives (button, input, etc.)
├── hooks/                         # Custom React hooks
├── lib/                           # Utility functions
├── public/                        # Static assets
├── utilities/                     # Static data (e.g., navData.json)
├── package.json                   # Project dependencies and scripts
├── postcss.config.mjs             # PostCSS config
├── tailwind.config.mjs            # Tailwind CSS config
├── tsconfig.json                  # TypeScript config
└── README.md                      # Project documentation
```

## How to Run This Application

1. **Install dependencies:**
	```bash
	npm install
	```

2. **Set up environment variables:**
	- Create a `.env.local` file in the root directory.
	- Add your backend URL:
	  ```env
	  NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
	  ```

3. **Start the development server:**
	```bash
	npm run dev
	```
	The app will be available at [http://localhost:3000](http://localhost:3000).

4. **Connect to your backend:**
	- Ensure your Express backend is running and accessible at the URL specified in `.env.local`.

## Notes
- This project is frontend-only and communicates with a backend Express server using JWT tokens.
- For authentication, tokens are stored in `localStorage` after login.
- Update the folder structure and documentation as you add new features.

---
Feel free to contribute or customize for your society's needs!
