export const SignupForm = () => {
  return (
    <main class="container">
      <h1>Create an account</h1>
      <form method="post" action="/signup" class="signup-form">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          required
          minlength={3}
          autocomplete="username"
        />
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          required
          minlength={8}
          autocomplete="new-password"
        />
        <button type="submit">Sign up</button>
      </form>
    </main>
  );
};
