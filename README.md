# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Reminder notifications

Daily email reminders are sent at 9:00 AM in each user's saved timezone. To
enable email delivery, configure these variables in the backend deployment
environment (never commit real credentials):

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASSWORD`
- `SMTP_FROM` (optional; defaults to `SMTP_USER`)
- `FRONTEND_URL` (optional; defaults to the AutomataVerse Netlify URL)

The backend creates the notification-preferences table automatically. Email
reminders are opt-in from Settings and use the email address on the signed-in
account. Browser reminders are separate and only appear around 9:00 AM while
the app is open and browser permission is granted.

Set `VITE_API_URL` in the frontend environment to use a non-default backend
URL. After configuring SMTP, redeploy/restart the backend for email reminders
to become available.
