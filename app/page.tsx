import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <h1>shadcn-style Defaults</h1>
      <p>
        A neutral, light theme built from global CSS variables. Links use the
        foreground color, and buttons use the primary style.
      </p>

      <section className={styles.card}>
        <h2>Typography</h2>
        <p>
          Body text uses a 1.5 line height. Inline code looks like{" "}
          <code>const x = 1</code>.
        </p>
        <ul>
          <li>First item</li>
          <li>
            Second item with a <a href="#">link</a>
          </li>
        </ul>
        <blockquote>Simplicity is the ultimate sophistication.</blockquote>
      </section>

      <section className={styles.card}>
        <h2>Code</h2>
        <pre>
          <code>{`export default function Home() {
  return <h1>Hello</h1>;
}`}</code>
        </pre>
      </section>

      <section className={styles.card}>
        <h2>Table</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ada</td>
              <td>Engineer</td>
              <td>Active</td>
            </tr>
            <tr>
              <td>Linus</td>
              <td>Maintainer</td>
              <td>Away</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.card}>
        <h2>Form</h2>
        <form>
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" placeholder="Your name" />
          </div>
          <div className={styles.field}>
            <label htmlFor="message">Message</label>
            <textarea id="message" rows={4} placeholder="Say something" />
          </div>
          <div className={styles.actions}>
            <button type="button">Send</button>
            <a className="button" href="#">
              Get started
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}
