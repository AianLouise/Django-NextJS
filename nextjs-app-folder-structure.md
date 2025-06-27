### 📄 `nextjs-app-folder-structure.md`

```markdown
# Next.js App Folder Structure (App Router)

This is a recommended folder structure for Next.js projects using the **App Router** (introduced in Next.js 13+).

## 📁 Root App Directory

```

/app
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── globals.css             # Global styles
├── (public)/               # Public routes (no auth required)
│   └── (auth)/             # Authentication routes
├── (secured)/              # Secured routes (auth required)
│   ├── (creator)/          # Creator role routes
│   ├── (admin)/            # Admin role routes  
│   ├── (manager)/          # Manager role routes
│   └── (user)/             # User role routes
├── api/                    # API routes
├── components/             # Reusable UI components
├── lib/                    # Utility functions and logic
├── styles/                 # CSS modules or Tailwind files
├── types/                  # TypeScript types and interfaces
└── public/                 # Static assets (images, fonts)

```

---

## 📘 Folder Descriptions

### `/app/{route}/`
Each route is a folder:
- `page.tsx` — the actual page component
- `layout.tsx` — shared layout for nested pages
- `loading.tsx` — loading indicator
- `error.tsx` — error boundary

---

### `(group)/`
Routes inside parentheses do not affect the URL. Useful for grouping:

```

/app/(public)/(auth)/
├── login/page.tsx     → /login
└── register/page.tsx  → /register

/app/(secured)/(user)/  
├── dashboard/page.tsx → /dashboard
└── timesheet/page.tsx → /timesheet

/app/(secured)/(admin)/
├── dashboard/page.tsx → /dashboard (admin view)
└── settings/page.tsx  → /settings

```

---

### `/components/`
Reusable UI parts:
```

/app/components/
├── Navbar.tsx
├── Button.tsx
└── UserCard.tsx

```

---

### `/lib/`
Logic and helpers (server-side or utility code):
```

/app/lib/
├── auth.ts
├── fetchData.ts
└── constants.ts

```

---

### `/api/`
API route handlers:
```

/app/api/
├── users/route.ts         → handles /api/users
└── login/route.ts         → handles /api/login

```

---

### `/styles/`
CSS modules, Tailwind, or custom styles:
```

/app/styles/
├── globals.css
└── button.module.css

```

---

### `/types/`
All your TypeScript types, interfaces, and enums:
```

/app/types/
├── user.ts
└── product.ts

```

---

## ✅ AI Agent Prompt Template

Use this with your AI tool:

> Follow this folder structure:
> - Pages in `/app/{route}/page.tsx`
> - Reusable components in `/app/components`
> - Utilities in `/app/lib`
> - API routes in `/app/api/{route}/route.ts`
> - Use group folders like `(auth)/` for organization

---