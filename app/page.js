import DirectoryClient from "./components/DirectoryClient";
import styles from "./directory.module.css";

export const revalidate = 60;

async function getAirtableRecords() {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE;
  const token = process.env.AIRTABLE_TOKEN;
  const view = process.env.AIRTABLE_VIEW || "Live";

  if (!baseId || !table || !token) {
    return { error: "Missing Airtable env vars in Vercel.", records: [] };
  }

  const url = new URL(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`
  );
  url.searchParams.set("view", view);
  url.searchParams.set("pageSize", "100");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      error: `Airtable fetch failed (${res.status} ${res.statusText}). ${text}`,
      records: [],
    };
  }

  const data = await res.json();
  return { error: null, records: data.records ?? [] };
}

function normalizeUrl(v) {
  if (!v || typeof v !== "string") return "";
  const s = v.trim();
  if (!s) return "";
  if (s.startsWith("mailto:")) return s;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
}

export default async function Page() {
  const { error, records } = await getAirtableRecords();

  const businesses = records.map((r) => {
    const f = r.fields ?? {};

    const name = f.Name || f.Business || f.Title || "Untitled";
    const description = f.Description || f.Bio || f.About || "";

    const website = normalizeUrl(f["Website URL"] || f.Website || f.website);
    const email = typeof f.Email === "string" ? f.Email.trim() : "";

    const logo =
      (Array.isArray(f.Logo) ? f.Logo?.[0]?.url : "") || "";
    const cover =
      (Array.isArray(f["Cover Image"]) ? f["Cover Image"]?.[0]?.url : "") || "";

    const socials = {
      instagram: normalizeUrl(f.Instagram),
      tiktok: normalizeUrl(f["TikTok"] || f["TikTok:"] || f.TikTok),
      youtube: normalizeUrl(f.YouTube || f.Youtube),
      facebook: normalizeUrl(f.Facebook),
      bluesky: normalizeUrl(f.BlueSky || f.Bluesky),
      pinterest: normalizeUrl(f.Pinterest),
    };

    return { id: r.id, name, description, website, email, logo, cover, socials };
  });

  return (
    <main className={styles.page}>
      <div className={styles.bg} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.kicker}>Cresent Moon Brand</div>
        <h1 className={styles.h1}>Business Profiles</h1>
        <p className={styles.sub}>
          Live directory pulled from Airtable (View: <strong>Live</strong>).
        </p>
        {error ? <p className={styles.error}>{error}</p> : null}
      </header>

      <DirectoryClient businesses={businesses} />

      <footer className={styles.footer}>
        Updated about every {revalidate}s • Only “published” records show
      </footer>
    </main>
  );
}
