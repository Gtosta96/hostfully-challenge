# Booking Management Application

A production-ready, type-safe booking management application built with modern React best practices. This project demonstrates advanced frontend engineering skills including state management, form validation, CRUD operations, and a robust component architecture.

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Design Decisions](#-design-decisions)
- [Application Flow](#-application-flow)
- [Use Cases](#-use-cases)
- [Form Validation](#-form-validation)
- [State Management](#-state-management)

## 🎯 Overview

This application implements a complete booking management system with CRUD operations, validation, and error handling. It showcases enterprise-level code organization, type safety, and user experience considerations essential for senior frontend development.

## 🛠 Tech Stack

### Core

- **React** - UI library with concurrent features
- **TypeScript** - Type safety and developer experience
- **Vite** - Next-generation build tool for faster development

### State & Forms

- **React Hook Form** - Performant form management with minimal re-renders
- **Zod** - Schema validation with TypeScript inference
- **Zustand** - Lightweight state management with minimal boilerplate

### Routing

- **React Router** - Client-side routing

### Styling

- **TailwindCSS** - Utility-first CSS framework
- **shadcn/radix** - Accessible, customizable component primitives
- **CSS Variables** - Theming and design tokens

### Code Quality

- **ESLint** - Static code analysis
- **Prettier** - Code formatting
- **TypeScript Strict Mode** - Enhanced type checking

### Testing

- **Vitest** - Unit/integration tests (Vite-native)
- **React Testing Library** - Component testing
- **Playwright** - e2e tests

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Node.js 20+ (recommended)
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Run unit and integration tests (Vitest)
yarn test

# Run end-to-end tests (Playwright, headed mode)
yarn test:e2e:headed
```

## 📁 Project Structure

```
hostfully-challenge/
├── src/
│   ├── components/        # Reusable UI components
│   ├── layout/            # Layout components
│   ├── libs/              # Utilities and helpers
│   ├── pages/             # Route pages
│   ├── stores/            # Context (zustand) states
│   ├── utils/             # Utils functions
│   ├── app-router.tsx     # App Router
│   ├── global.css         # Global styles and design tokens
│   └── index.tsx          # Application entry point
├── e2e/                   # Playwright E2E tests
├── public/                # Static assets
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── package.json
```

## 🧠 Design Decisions

### 1. **Why React Hook Form + Zod?**

- **Performance**: React Hook Form minimizes re-renders by isolating component updates
- **Type Safety**: Zod schemas automatically infer TypeScript types
- **Developer Experience**: Single source of truth for validation logic
- **Bundle Size**: React Hook Form is lightweight (~8.5kb minzipped)

### 2. **Why Zustand over Context API/Redux?**

- **Simplicity**: Zustand provides a minimal API without boilerplate (no providers, actions, reducers)
- **Performance**: Fine-grained subscriptions prevent unnecessary re-renders (better than Context API)
- **Developer Experience**: Direct state access with hooks, no wrapper components needed
- **Bundle Size**: Extremely lightweight (~1kb minzipped) compared to Redux (~12kb)
- **TypeScript Support**: Excellent type inference out of the box
- **No Provider Hell**: Access store from anywhere without wrapping components

Zustand strikes the perfect balance between Context API's simplicity and Redux's power, making it ideal for this application's state management needs.

### 3. **Why shadcn/ui over Material-UI/Chakra?**

- **Ownership**: Components are copied into your codebase (full control)
- **Customization**: Built with Radix UI primitives + Tailwind (highly customizable)
- **Bundle Size**: Tree-shakeable, only include what you use
- **Accessibility**: Radix UI ensures WCAG compliance out of the box

## 🔄 Application Flow

### Main Page: Booking List (`/`)

- Displays: List of all bookings or empty state message
- Actions: Create new booking, Edit existing booking, Delete booking
- Features: Responsive cards with booking details

### Create Booking

- Trigger: Click "New Booking" or "Create Your First Booking"
- Form Fields: Guest name, Check-in date, Check-out date, Number of guests, Notes (optional)
- Validation: Real-time validation with error messages
- Success: Booking added to list with success notification

### Edit Booking

- Trigger: Click edit button on booking card
- Form Fields: Pre-filled with existing booking data
- Validation: Same rules as create
- Success: Booking updated in list with success notification

### Delete Booking

- Trigger: Click delete button on booking card
- Confirmation: Dialog to confirm deletion
- Success: Booking removed from list with success notification

## 📋 Use Cases

### 1. Main Booking Flow

#### 1.1. View Booking List

- Access the home page (`/`)
- Verify that the booking list is displayed (or empty state message)

#### 1.2. Create New Booking

- Click "New Booking" or "Create Your First Booking"
- Fill in the form: name, dates, number of guests, notes (optional)
- Submit the form
- Verify success message and new booking in the list

#### 1.3. Edit Existing Booking

- Click the edit button on a booking card
- Modify form data
- Submit
- Verify success message and updated booking in the list

#### 1.4. Delete Booking

- Click the delete button on a booking card
- Confirm deletion in the dialog
- Verify success message and booking removal from the list

### 2. Form Validations

#### 2.1. Required Fields

- Attempt to submit empty form
- Verify error messages for name, dates, and number of guests

#### 2.2. Invalid Dates

- Select start date in the past
- Select end date before start date
- Verify appropriate error messages

#### 2.3. Booking Overlap

- Create a booking for a specific period
- Attempt to create another booking with overlapping dates
- Verify overlap error message

## ✅ Form Validation

### Validation Rules

| Field            | Rules                                                    |
| ---------------- | -------------------------------------------------------- |
| Guest Name       | Required, minimum 2 characters                           |
| Check-in Date    | Required, cannot be in the past                          |
| Check-out Date   | Required, must be after check-in date                    |
| Number of Guests | Required, must be at least 1                             |
| Notes            | Optional, maximum 500 characters                         |
| Date Overlap     | Cannot overlap with existing bookings for the same dates |

### Error Messages

- **Missing required field**: "This field is required"
- **Past date**: "Check-in date cannot be in the past"
- **Invalid date range**: "Check-out date must be after check-in date"
- **Date overlap**: "This booking overlaps with an existing reservation"

## 🗄 State Management

### Zustand Implementation

**Benefits:**

- ✅ Single source of truth for booking data
- ✅ Persists across navigation
- ✅ Type-safe access with TypeScript
- ✅ No provider wrapper needed (direct hook access)
- ✅ Fine-grained subscriptions prevent unnecessary re-renders
- ✅ Simple API (`bookings`, `addBooking`, `updateBooking`, `deleteBooking`)
- ✅ Minimal boilerplate (~1kb bundle size)
