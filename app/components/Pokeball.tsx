import styles from "./Pokeball.module.css";

export default function Pokeball() {
  return (
    <svg
      className={styles.pokeball}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="#ffffff"
        stroke="#171717"
        strokeWidth="2"
      />
      <path d="M1 12a11 11 0 0 1 22 0z" fill="#ef4444" />
      <line x1="1" y1="12" x2="23" y2="12" stroke="#171717" strokeWidth="2" />
      <circle
        cx="12"
        cy="12"
        r="3.25"
        fill="#ffffff"
        stroke="#171717"
        strokeWidth="2"
      />
    </svg>
  );
}
