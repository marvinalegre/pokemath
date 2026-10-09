export const SignupForm = () => {
  return (
    <div class="auth-form">
      <h1>Create an account</h1>
      <form method="post" action="/signup">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          required
          minlength={3}
        />
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          required
          minlength={8}
        />
        <button type="submit">Sign up</button>
      </form>
      <p>
        Have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
};
