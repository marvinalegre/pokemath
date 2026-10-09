export const LoginForm = () => {
  return (
    <div class="auth-form">
      <h1>Log in</h1>
      <form method="post" action="/login">
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
        <button type="submit">Log in</button>
      </form>
      <p>
        No account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};
