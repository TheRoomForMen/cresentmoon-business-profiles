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
    return { error: `Airtable error: ${res.status} ${text}`, records: [] };
  }

  const data = await res.json();
  return { error: null, records: data.records || [] };
}

export default async function Home() {
  const { error, records } = await getAirtableRecords();

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        Cresent Moon Business Profiles
      </h1>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <p style={{ opacity: 0.7, marginBottom: 16 }}>
        Showing {records.length} business record(s)
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {records.map((r) => {
          const f = r.fields || {};
          const name = f.Name || f.Business || f.Title || "Untitled";
          const subtitle = f.Category || f.Type || f.Tagline || "";

          return (
            <div key={r.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
              <div style={{ fontWeight: 700 }}>{name}</div>
              {subtitle ? <div style={{ opacity: 0.75 }}>{subtitle}</div> : null}
            </div>
          );
        })}
      </div>
    </main>
  );
}
