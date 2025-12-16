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
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text();
    return {
      error: `Airtable fetch failed: ${res.status} ${res.statusText} — ${text}`,
      records: [],
    };
  }

  const data = await res.json();
  return { error: null, records: data.records ?? [] };
}
