# Frontend Folder Structure - Reorganized

## ✅ Applied Next.js App Router Structure

The frontend has been reorganized to follow the recommended Next.js App Router structure:

```
/frontend/src/app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Home page  
├── (public)/                     # Public routes (no authentication required)
│   └── (auth)/                   # Authentication routes
│       ├── login/page.tsx       → /login
│       ├── signup/page.tsx      → /signup
│       └── accept-invitation/   → /accept-invitation
├── (secured)/                    # Secured routes (authentication required)
│   ├── (creator)/               # Creator role routes
│   │   └── dashboard/page.tsx   → /dashboard (creator view)
│   ├── (admin)/                 # Admin role routes
│   │   ├── dashboard/page.tsx   → /dashboard (admin view)
│   │   ├── users-orders/        → /users-orders
│   │   └── settings/            → /settings (admin settings)
│   ├── (manager)/               # Manager role routes
│   │   ├── dashboard/page.tsx   → /dashboard (manager view)
│   │   └── team/page.tsx        → /team
│   └── (user)/                  # User role routes
│       ├── page.tsx             → /dashboard (user view)
│       ├── layout.tsx
│       ├── timesheet/
│       ├── reports/
│       ├── team/
│       ├── settings/
│       └── components/
├── api/                         # API route handlers
│   └── auth/
│       ├── login/route.ts       → handles /api/auth/login
│       └── register/route.ts    → handles /api/auth/register
├── components/                  # Reusable UI components
│   ├── Button.tsx
│   ├── Navbar.tsx
│   └── index.ts
├── lib/                        # Utility functions and logic
│   ├── api.ts
│   └── ThemeContext.tsx
├── styles/                     # CSS files
│   └── globals.css            (moved from app root)
└── types/                     # TypeScript types and interfaces
    ├── user.ts
    ├── project.ts
    ├── common.ts
    └── index.ts
```

## 📋 Changes Made

### ✅ Route Organization
- **Public routes** under `public/` - for non-authenticated pages
- **Auth routes** under `public/(auth)/` - login, signup, accept-invitation
- **Secured routes** under `secured/` - for authenticated pages only
- **Role-based grouping** with `(creator)`, `(admin)`, `(manager)`, `(user)` for different user types
- **Maintained all existing functionality** and layouts

### ✅ Asset Management  
- **Moved static assets** (icons, favicon) from `/app` to `/public`
- **Organized styles** in dedicated `/styles` folder
- **Updated import paths** in layout.tsx

### ✅ Code Organization
- **Created structured types** in `/types` with proper exports
- **Added reusable components** with examples (Button, Navbar)
- **Moved utilities** to `/lib` within app directory
- **Created API route examples** for integration patterns

### ✅ TypeScript Integration
- **Comprehensive type definitions** for User, Project, Organization
- **Common utility types** for API responses and forms
- **Centralized exports** for easy importing

### ✅ Best Practices Applied
- **Route grouping** for better organization
- **Component reusability** with proper TypeScript interfaces  
- **Utility separation** between client and server logic
- **Type safety** throughout the application

## 🔄 Required Updates

You may need to update:
1. **Import paths** in existing components that reference moved files
2. **Navigation links** to use the new `public/` and `secured/` structure
3. **API integration** to use the new API route structure
4. **Type imports** to use the new centralized types
5. **Route guards** to enforce authentication for `secured/` routes

## 🎯 Route Structure:
- `public/(auth)/` → Authentication pages (login, signup, accept-invitation)
- `secured/(creator)/` → Creator dashboard and organization management
- `secured/(admin)/` → Admin dashboard, user management, admin settings  
- `secured/(manager)/` → Manager dashboard, team management, approvals
- `secured/(user)/` → User dashboard, timesheet, reports, team, settings

## 🎯 Next Steps

1. Update any remaining references to old paths
2. Implement the new API routes with Django backend integration
3. Enhance components with proper styling (Tailwind CSS classes included)
4. Add error boundaries and loading states as needed

The structure now follows Next.js 13+ App Router best practices and provides a solid foundation for scaling the application.
