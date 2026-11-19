"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          Pokum
          <PokeballIcon />n
        </Link>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>

        <nav
          id="site-menu"
          aria-label="Main"
          className={`${styles.menu} ${open ? styles.menuOpen : ""}`}
          onClick={() => setOpen(false)}
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function PokeballIcon() {
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
