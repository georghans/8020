This is a [Next.js](https://nextjs.org) app with local Keycloak login through NextAuth.

## Local Keycloak auth

Create a Keycloak client in your deployed Keycloak realm at `https://auth.dev.8o2o.de`:

- Client type: OpenID Connect
- Client ID: `app8020-local`
- Client authentication: On
- Valid redirect URI: `http://localhost:3000/api/auth/callback/keycloak`
- Valid post logout redirect URI: `http://localhost:3000/*`
- Web origin: `http://localhost:3000`

Create `.env.local`:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-output-from-openssl-rand-base64-32

KEYCLOAK_CLIENT_ID=app8020-local
KEYCLOAK_CLIENT_SECRET=replace-with-keycloak-client-secret
KEYCLOAK_ISSUER=https://auth.dev.8o2o.de/realms/replace-with-your-realm
```

Generate the secret with:

```bash
openssl rand -base64 32
```

The issuer must be the realm URL that your Next.js app can reach from the host. For your deployed Keycloak, that should be `https://auth.dev.8o2o.de/realms/<realm-name>`.

## Getting Started

First, run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
