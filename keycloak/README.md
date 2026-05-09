# Keycloak Realm Import

Import `8020-dev-realm.json` into Keycloak to create a dedicated development realm for this app.

After import:

1. Open realm `8020-dev`.
2. Open `Clients -> app8020-local -> Credentials`.
3. Regenerate the client secret or replace the imported placeholder.
4. Update `.env.local`:

```bash
KEYCLOAK_ISSUER=https://auth.dev.8o2o.de/realms/8020-dev
KEYCLOAK_CLIENT_ID=app8020-local
KEYCLOAK_CLIENT_SECRET=<secret from Keycloak>
```

If you want Google login, enable `Identity providers -> Google`, then replace the placeholder Google client id and secret. The Google OAuth redirect URI is:

```text
https://auth.dev.8o2o.de/realms/8020-dev/broker/google/endpoint
```

Local app redirect URI:

```text
http://localhost:3000/api/auth/callback/keycloak
```
