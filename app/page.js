export const revalidate = 60;

async function getAirtableRecords() {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE;
  const token = process.env.AIRTABLE_TOKEN;

  if (!baseId || !table || !token) {
    return { error: "Missing Airtable env vars in Vercel.", records: [] };
  }

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: `Airtable fetch failed: ${res.status} ${res.statusText} — ${text}`, records: [] };
  }

  const data = await res.json();
  return { error: null, records: data.records ?? [] };
}

export default async function Page() {
  const { records, error } = await getAirtableRecords();

  return (
    <main style={{ padding: 24, background: "#F6EBDD", minHeight: "100vh" }}>
      <h1 style={{ margin: 0, color: "#E2725B" }}>Cresent Moon Business Profiles</h1>

      <p style={{ marginTop: 8, color: "#5D3A2D" }}>
        {error ? error : `${records.length} profiles loaded from Airtable.`}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 16 }}>
        {records.map((r) => {
          const f = r.fields ?? {};
          const name = f.Name || f.Business || f.Title || "Untitled";
          const description = f.Description || f.Bio || "";
          const website = f.Website || f.URL || "";

          return (
            <article
              key={r.id}
              style={{
                border: "1px solid rgba(93,58,45,0.15)",
                borderRadius: 16,
                padding: 16,
                background: "#F6EBDD",
              }}
            >
              <h2 style={{ margin: "0 0 8px 0", color: "#E2725B" }}>{name}</h2>
              {description ? <p style={{ margin: 0, color: "#5D3A2D" }}>{description}</p> : null}
              {website ? (
                <p style={{ marginTop: 12 }}>
                  <a href={website} target="_blank" rel="noreferrer" style={{ color: "#C7B995" }}>
                    Website
                  </a>
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </main>
  );
}
