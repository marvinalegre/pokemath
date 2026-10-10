export const LoginForm = () => {
  return (
    <form id="login-form" method="post" action="/login">
      <label for="username">Username</label>
      <input id="username" type="text" name="username" required minlength={3} />

      <label for="password">Password</label>
      <div class="password-field">
        <input
          id="password"
          type="password"
          name="password"
          required
          minlength={8}
        />
        <button
          type="button"
          class="toggle-password outline"
          aria-controls="password"
          aria-label="Show password"
        >
          <svg
            class="icon-eye"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <svg
            class="icon-eye-off"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        </button>
      </div>
      <button type="submit">Log in</button>
    </form>
  );
};
