"use client";

import { useMemo, useState } from "react";
import styles from "../directory.module.css";

export default function DirectoryClient({ businesses }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return businesses;

    return businesses.filter((b) => {
      const n = (b.name || "").toLowerCase();
      const d = (b.description || "").toLowerCase();
      return n.includes(query) || d.includes(query);
    });
  }, [q, businesses]);

  const orbit = businesses.slice(0, 16);

  return (
    <section className={styles.section}>
      <div className={styles.hero}>
        <div className={styles.heroLabel}>Need help? Processing…</div>

        <div className={styles.searchBar}>
          <span className={styles.searchIcon} aria-hidden="true">⌕</span>

          <input
            className={styles.searchInput}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your businesses…"
          />

          <span className={styles.count} title="Results">
            {filtered.length}
          </span>
        </div>

        <div className={styles.orbit} aria-hidden="true">
          {orbit.map((b) => (
            <div key={b.id} className={styles.orb}>
              {b.logo ? (
                <img className={styles.orbImg} src={b.logo} alt="" />
              ) : (
                <span className={styles.orbTxt}>
                  {(b.name || "C")[0]?.toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((b) => (
          <Card key={b.id} b={b} />
        ))}
      </div>
    </section>
  );
}

function Card({ b }) {
  const initials = (b.name || "C")[0].toUpperCase();

  const links = [
    b.website ? { type: "website", href: b.website, label: "Website" } : null,
    b.socials?.instagram ? { type: "instagram", href: b.socials.instagram, label: "Instagram" } : null,
    b.socials?.tiktok ? { type: "tiktok", href: b.socials.tiktok, label: "TikTok" } : null,
    b.socials?.youtube ? { type: "youtube", href: b.socials.youtube, label: "YouTube" } : null,
    b.socials?.facebook ? { type: "facebook", href: b.socials.facebook, label: "Facebook" } : null,
    b.email ? { type: "email", href: `mailto:${b.email}`, label: "Email" } : null,
  ].filter(Boolean);

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        {b.cover ? (
          <img src={b.cover} alt="" className={styles.cover} loading="lazy" />
        ) : (
          <div className={styles.coverFallback} aria-hidden="true" />
        )}

        <div className={styles.logoWrap}>
          {b.logo ? (
            <img src={b.logo} alt="" className={styles.logo} loading="lazy" />
          ) : (
            <div className={styles.logoFallback} aria-hidden="true">
              {initials}
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{b.name}</h3>
        {b.description ? (
          <p className={styles.cardDesc}>{b.description}</p>
        ) : (
          <p className={styles.cardDescMuted}>Description coming soon.</p>
        )}

        {links.length ? (
          <div className={styles.links}>
            {links.map((l) => (
              <a
                key={l.type}
                href={l.href}
                target={l.type === "email" ? "_self" : "_blank"}
                rel="noreferrer"
                className={styles.linkBtn}
              >
                <Icon type={l.type} />
                <span>{l.label}</span>
              </a>
            ))}
          </div>
        ) : (
          <div className={styles.linksEmpty}>Links coming soon.</div>
        )}
      </div>
    </article>
  );
}

function Icon({ type }) {
  const common = {
    className: styles.icon,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (type) {
    case "website":
      return (
        <svg {...common}>
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 12h18" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 3c2.5 2.6 4 5.6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.6-4-9s1.5-6.4 4-9Z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M14 3v10.2a3.8 3.8 0 1 1-3-3.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14 7.2c1.2 1.6 2.9 2.6 5 2.8V7.2c-1.6-.2-3.1-1.1-4-2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M21 12s0-4-1-5-5-1-8-1-7 0-8 1-1 5-1 5 0 4 1 5 5 1 8 1 7 0 8-1 1-5 1-5Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10 9.5 15 12l-5 2.5V9.5Z" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.1l.9-3H13V9c0-.6.4-1 1-1Z" fill="currentColor" />
        </svg>
      );
    case "email":
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}
