export default function SignIn() {
  return (
    <form method="post" action="/auth/google_oauth2">
      <input
        type="hidden"
        name="authenticity_token"
        value={
          (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
        }
      />
      <button type="submit">Sign in with Google</button>
    </form>
  );
}
