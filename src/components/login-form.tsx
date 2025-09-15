
"use client";
import { useFormState } from "react-dom";
import { signInWithEmail } from "@/app/actions";

export function LoginForm() {
  const [state, formAction] = useFormState(signInWithEmail, null);

  return (
    <form action={formAction}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
