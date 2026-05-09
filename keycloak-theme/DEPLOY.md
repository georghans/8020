# Deploying the Theme

Build:

```bash
bun run build-keycloak-theme
```

Generated JARs:

```text
dist_keycloak/keycloak-theme-for-kc-22-to-25.jar
dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar
```

For Keycloak 26 or newer, start with:

```text
dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar
```

For Keycloak 22 through 25, use:

```text
dist_keycloak/keycloak-theme-for-kc-22-to-25.jar
```

Copy the JAR into the Keycloak `providers` directory, restart Keycloak, then select the theme:

```text
Realm settings -> Themes -> Login theme -> app8020
```
