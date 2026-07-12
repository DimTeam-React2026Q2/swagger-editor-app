# 🚀 Swagger

An interactive, multi-language Swagger schema viewer and REST client built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase. This application allows developers to load, parse, edit, and test OpenAPI/Swagger definitions seamlessly on both desktop and mobile devices.

## Deployment: [swagger-editor-app.vercel.app](https://swagger-editor-app.vercel.app/)

## [YouTube - Presentation ](https://youtu.be/TRzUxLmUt_g)

## 👥 Team & Role Distribution

Our team successfully designed and implemented the core modules in strict accordance with the project requirements:

- **Maryna (Team Lead / `@dromari`)**
  - **Core Architecture & Layout**: Implemented the responsive layout with vertical/horizontal split screen states using `react-resizable-panels`.
  - **OpenAPI Parser**: Authored the high-performance syntax-safe custom hook (`useSwaggerParser`) using `js-yaml` supporting auto-detection for JSON and YAML formats.
  - **Documentation Viewer**: Developed dynamic documentation panels mapping parameters (query, path, header, cookie), request bodies, and structured status code response tables.

- **Mark (`@mark-pribylnov`)**
  - **App Header & Layout**: Designed the animated sticky main application header.
  - **Authentication Flow**: Implemented secure client-side form routing for Sign In and Sign Up services.
  - **Swagger Editor Loader**: Connected the live schema typing canvas text area supporting real-time text mutations.

- **Dima (`@karpovdmitriy`)**
  - **Supabase SSR Authentication**: Set up the backend environment, middleware, server-side actions, and active user session states.
  - **Interactive REST Client**: Created the `TryItOutForm` component to collect parameter inputs and dispatch real HTTP requests.
  - **CORS Proxy & History**: Built a dedicated Next.js API proxy server to bypass CORS blockades and tracked request execution metrics.
  - **Localization**: Configured global dictionaries via `next-intl` enabling instant English and Russian layout swapping.

---

## 🛠️ Tech Stack & Architecture

### ⚡ Core Framework & State

- **Framework**: Next.js 15+ (App Router Mode) running on native Node.js ESM.
- **Language**: Strict TypeScript with mandatory explicit function return types enforced globally.
- **Forms & Validation**: Enforced schemas via `zod` paired with asynchronous controlled state mapping via `react-hook-form`.
- **Localization**: Dynamic locale-aware asynchronous route resolution using `next-intl/server` (`getTranslations`).

### 🎨 Styling & Component Library

- **Styling Engine**: Tailwind CSS v4 featuring automated utility class sorting optimization.
- **Component Foundation**: Custom structural primitives built atop **shadcn/ui** (**Radix UI Nova style**) including Accordion, Resizable Layouts, and fully responsive multi-axis Viewports.
- **Icons**: High-density clean vectorized scalable icon mapping via **Lucide React**.

### 🔧 Development Tools & CI/CD Guardrails

- **Automation Framework**: Git hooks automation engine configured with **Husky**.
- **Pre-commit Pipelines**: Incremental code quality filtering running via **Lint-staged** before code reaches remote targets.
- **Commit Validation**: Semantic and Conventional commit-message policy engine enforced via **Commitlint** rules.
- **Linter & Formatter**: Combined Next.js Core Web Vitals ESLint configs alongside architectural formatting layouts managed by **Prettier**.
- **Testing Engine**: Automated testing execution dashboard running under the optimized high-speed **Vitest** native engine with deep comprehensive **V8 statement auditing blocks**.

---

## 🚀 Getting Started

### 📦 Installation

Clone the repository and install the project dependencies:

```bash
git clone https://github.com
cd swagger-editor-app
npm install
```

### ⚙️ Environment Configuration

Create a `.env.local` file in the root directory and append your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 💻 Running the Application

Launch the local web server in development mode:

```bash
npm run dev
```

Open **`http://localhost:3000/en`** or **`http://localhost:3000/ru`** in your browser to view the client.

---

## 🧪 Testing & Code Coverage

We take code quality seriously. The application features zero unsafe typed definitions (`any`) and maintains high coverage targets.

To run the full Vitest suite and review the code coverage metrics dashboard locally, execute:

```bash
npm run test:coverage
```

### 📊 Unified Code Coverage Metrics Status

Our automated Vitest and React Testing Library suites cover all critical logical intersections, layout configurations, and OpenAPI structure parsers, comfortably exceeding the strict RS School threshold of **≥ 50%**:

- **Global Project Score (`All files`)**: **`84.25%` Total Statement Coverage** 🎉
- **Core Architectural Functions**: **`84.04%` Function Coverage**
- **Conditional Code Logic**: **`74.49%` Branch Coverage**
- **Swagger Schema Document Viewer**: `100.00%` Fully Covered
- **Interactive Try-It-Out REST Client Form**: `87.03%` Covered
- **OpenAPI Parsing Engine**: `88.23%` Covered

_Note: Secure authorization components interacting natively with Supabase server-side actions are intentionally isolated from the Vitest unit suites to prevent production environment leaks during testing._
