export function AppInfoContent() {
  return (
    <div className="space-y-4">
      <p className="text-foreground leading-relaxed">
        <span className="font-medium">8020</span> is a private AI chat
        workspace.
        <br />
        It uses Keycloak for sign-in, Supabase for persistence, and LiteLLM for
        model access.
        <br />
      </p>
    </div>
  )
}
