# NutriTracker

NutriTracker is a full-featured nutrition tracking application built with Next.js, TypeScript, Prisma, MongoDB, NextAuth, and Tailwind CSS. It allows users to track their daily food intake, monitor nutritional goals, and visualize their progress over time.

## Features

- **User Authentication**: Secure login/signup with NextAuth
- **Role-Based Access Control**: Regular user and admin access levels
- **Food Tracking**: Log daily food intake with calories, protein, carbs, and fats
- **Calendar View**: Visualize nutrition data on an interactive calendar
- **Dashboard**: Get insights into your nutrition habits with summary statistics
- **Weight Calculator**: Calculate BMR, TDEE, and track caloric surplus/deficit
- **Admin Panel**: Manage users and food database (admin only)
- **Responsive Design**: Works on all device sizes

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: React Context and Hooks
- **Styling**: Tailwind CSS with custom components
- **Charts**: Recharts for data visualization

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database (local or Atlas)

## Installation

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/nutritracker.git
cd nutritracker
```

2. **Install dependencies**:

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="mongodb+srv://username:password@cluster0.example.mongodb.net/nutritracker?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

4. **Initialize Prisma**:

```bash
npx prisma generate
npx prisma db push
```

5. **Start the development server**:

```bash
npm run dev
# or
yarn dev
```

The application should now be running at `http://localhost:3000`.

## Project Structure

```
nutritracker/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Authentication routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/               # Protected dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── calendar/
│   │   │   ├── calculator/            # Weight calculator
│   │   │   └── day/[date]/
│   │   ├── (admin)/                   # Admin-only routes
│   │   │   └── admin/
│   │   ├── api/                       # API routes
│   │   │   ├── auth/
│   │   │   ├── food/
│   │   │   ├── log/
│   │   │   ├── settings/
│   │   │   ├── summary/
│   │   │   └── admin/
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Home page
│   ├── components/                    # Reusable components
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── calculator/
│   │   ├── dashboard/
│   │   ├── food/
│   │   ├── layout/
│   │   └── ui/
│   ├── lib/                           # Utility functions
│   ├── providers/                     # React providers
│   └── types/                         # TypeScript types
├── prisma/                            # Prisma schema
│   └── schema.prisma
├── public/                            # Static files
├── .env                               # Environment variables
├── package.json
└── tsconfig.json
```

## Setting Up Admin User

To create an admin user, you need to:

1. Register a regular user through the application
2. Connect to your MongoDB database (using MongoDB Compass or similar tool)
3. Find the user in the `User` collection
4. Change the `role` field from `"USER"` to `"ADMIN"`

## Usage Guide

1. **Registration and Login**:

   - Create an account with your email and password
   - Log in using your credentials

2. **Dashboard**:

   - View your daily nutrition summary
   - See weekly nutrition statistics
   - Access quick links to common actions

3. **Food Tracking**:

   - Click on a date in the calendar to view or add food items
   - Add foods with their nutritional information
   - Edit or delete food entries as needed

4. **Weight Calculator**:

   - Enter your body metrics (height, weight, age, etc.)
   - View your calculated BMR, TDEE, and target calories
   - Compare your current calorie goal with recommended intake

5. **Settings**:

   - Update your nutrition goals (calories, protein, carbs, fat)

6. **Admin Panel** (for admin users only):
   - Manage the food database
   - View and manage user accounts
   - Change user roles or delete users
