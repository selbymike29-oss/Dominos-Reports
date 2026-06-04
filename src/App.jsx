import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://phjnysigcsvjbpllccps.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoam55c2lnY3N2amJwbGxjY3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MjY2ODcsImV4cCI6MjA5NTMwMjY4N30.q_PVeE4EEY8Vz63Mj62nAufkMzGZsiF7ynJ5NkfglgM";
const HR_EMAIL = "Teamnextlevel.HR@hotmail.com";
const EMAILJS_SERVICE_ID = "service_v2yl99l";
const EMAILJS_TEMPLATE_ID = "template_454ylh7";
const EMAILJS_PUBLIC_KEY = "1pwnQatq0FSxbbTKg";

function storeEmail(storeId) {
  if (storeId === "1736") return "TNL1736@hotmail.com";
  return `Teamnextlevel.${storeId}@hotmail.com`;
}

async function sendEmail(to, subject, message) {
  try {
    const toList = Array.isArray(to) ? to.join(",") : to;
    const data = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: toList,
        subject: subject,
        message: message,
        from_name: "Dominos GM Reports",
      },
    };
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "origin": "http://localhost" },
      body: JSON.stringify(data),
    });
    const text = await res.text();
    console.log("Email response:", res.status, text);
  } catch (e) { console.error("Email error:", e); }
}

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

async function uploadPhoto(file, folder) {
  const ext = file.name.split(".").pop();
  const filename = `${folder}/${Date.now()}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/reports-photos/${filename}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": file.type,
      "x-upsert": "true",
    },
    body: file,
  });
  if (!res.ok) throw new Error(await res.text());
  return `${SUPABASE_URL}/storage/v1/object/public/reports-photos/${filename}`;
}

const STORE_ACCOUNTS = [
  { id: "1736", name: "Store #1736", password: "Cube$$$2026" },
  { id: "6412", name: "Store #6412", password: "Cube$$$2026" },
  { id: "6427", name: "Store #6427", password: "Cube$$$2026" },
  { id: "6432", name: "Store #6432", password: "Cube$$$2026" },
  { id: "6444", name: "Store #6444", password: "Cube$$$2026" },
  { id: "6448", name: "Store #6448", password: "Cube$$$2026" },
  { id: "6460", name: "Store #6460", password: "Cube$$$2026" },
  { id: "6469", name: "Store #6469", password: "Cube$$$2026" },
  { id: "6471", name: "Store #6471", password: "Cube$$$2026" },
  { id: "6472", name: "Store #6472", password: "Cube$$$2026" },
  { id: "6473", name: "Store #6473", password: "Cube$$$2026" },
  { id: "6474", name: "Store #6474", password: "Cube$$$2026" },
  { id: "6475", name: "Store #6475", password: "Cube$$$2026" },
  { id: "6478", name: "Store #6478", password: "Cube$$$2026" },
  { id: "6485", name: "Store #6485", password: "Cube$$$2026" },
  { id: "6486", name: "Store #6486", password: "Cube$$$2026" },
  { id: "6488", name: "Store #6488", password: "Cube$$$2026" },
  { id: "6490", name: "Store #6490", password: "Cube$$$2026" },
  { id: "6498", name: "Store #6498", password: "Cube$$$2026" },
  { id: "9656", name: "Store #9656", password: "Cube$$$2026" },
  { id: "9658", name: "Store #9658", password: "Cube$$$2026" },
  { id: "9664", name: "Store #9664", password: "Cube$$$2026" },
];

const ADMIN_PASSWORD = "TNL$$$2026";
const CATEGORIES = ["New Hire", "Attendance Issue", "Maintenance Issue", "Other"];
const STATUS_COLORS = {
  Open:          { bg: "#fff3cd", text: "#856404", dot: "#ffc107" },
  "In Progress": { bg: "#cfe2ff", text: "#084298", dot: "#0d6efd" },
  Resolved:      { bg: "#d1e7dd", text: "#0a3622", dot: "#198754" },
  "Hired":       { bg: "#d1e7dd", text: "#0a3622", dot: "#198754" },
  "Not Hired":   { bg: "#f8d7da", text: "#842029", dot: "#dc3545" },
};

const NOT_HIRED_REASONS = [
  "Failed Background Check",
  "Invalid / No Insurance",
  "No Valid Driver's License",
  "Withdrew Application",
  "No Show for Orientation",
  "Position Filled",
  "Other",
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const inputStyle = {
  width: "100%", background: "#1a1a1a", border: "1px solid #3a3a3a",
  borderRadius: 10, color: "#f5f0e8", padding: "12px 14px",
  fontSize: 14, marginBottom: 14, boxSizing: "border-box", fontFamily: "Georgia, serif",
};
const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 700, color: "#aaa",
  marginBottom: 6, letterSpacing: 0.8, textTransform: "uppercase",
};
const btnRed = {
  background: "#e31837", color: "#fff", border: "none", borderRadius: 12,
  padding: "13px", fontSize: 15, fontWeight: 800, cursor: "pointer",
  width: "100%", marginTop: 4, letterSpacing: 0.5,
};

function PhotoUpload({ label, value, onChange }) {
  const ref = useRef();
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      <div onClick={() => ref.current.click()}
        style={{ background: "#1a1a1a", border: "2px dashed #3a3a3a", borderRadius: 10, padding: "16px", textAlign: "center", cursor: "pointer" }}>
        {value ? (
          <img src={typeof value === "string" ? value : URL.createObjectURL(value)} alt="preview"
            style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 8, objectFit: "cover" }} />
        ) : (
          <div>
            <div style={{ fontSize: 28 }}>📷</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Tap to take photo or upload</div>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" capture="environment"
        style={{ display: "none" }} onChange={e => onChange(e.target.files[0])} />
      {value && <div style={{ fontSize: 11, color: "#198754", textAlign: "center", marginTop: 4 }}>✅ Photo selected</div>}
    </div>
  );
}

function statusColor(status) {
  return STATUS_COLORS[status] || STATUS_COLORS["Open"];
}

export default function App() {
  const [session, setSession]           = useState(null);
  const [loginInput, setLoginInput]     = useState({ store: STORE_ACCOUNTS[0].id, password: "" });
  const [loginError, setLoginError]     = useState("");
  const [loginMode, setLoginMode]       = useState("store");
  const [view, setView]                 = useState("dashboard");
  const [submissions, setSubmissions]   = useState([]);
  const [loading, setLoading]           = useState(false);
  const [selected, setSelected]         = useState(null);
  const [filterCat, setFilterCat]       = useState("All");
  const [filterStatus, setFilterStatus] = useState("Active");
  const [filterStore, setFilterStore]   = useState("All");
  const [searchQuery, setSearchQuery]   = useState("");
  const [newNote, setNewNote]           = useState("");
  const [uploading, setUploading]       = useState(false);
  const [notHiredReason, setNotHiredReason] = useState(NOT_HIRED_REASONS[0]);
  const [showNotHired, setShowNotHired] = useState(false);
  const [form, setForm] = useState({
    category: CATEGORIES[0], gm: "", details: "",
    applicant_name: "", license_plate: "", insurance_note: "",
    application_photo: null, insurance_photo: null,
  });
  const [submitted, setSubmitted] = useState(false);

  async function loadReports(sess) {
    setLoading(true);
    try {
      let url = "/reports?order=created_at.desc";
      if (sess.type === "store") url += `&store_id=eq.${sess.store.id}`;
      const data = await sbFetch(url);
      setSubmissions(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { if (session) loadReports(session); }, [session]);

  function handleLogin() {
    setLoginError("");
    if (loginMode === "admin") {
      if (loginInput.password === ADMIN_PASSWORD) setSession({ type: "admin" });
      else setLoginError("Incorrect admin password.");
      return;
    }
    const store = STORE_ACCOUNTS.find(s => s.id === loginInput.store);
    if (store && loginInput.password === store.password) setSession({ type: "store", store });
    else setLoginError("Incorrect password for that store.");
  }

  async function submitReport() {
    if (!form.gm.trim() || !form.details.trim()) return;
    setUploading(true);
    try {
      let application_photo_url = null;
      let insurance_photo_url = null;
      if (form.application_photo) application_photo_url = await uploadPhoto(form.application_photo, "applications");
      if (form.insurance_photo) insurance_photo_url = await uploadPhoto(form.insurance_photo, "insurance");

      await sbFetch("/reports", {
        method: "POST",
        body: JSON.stringify({
          store_id: session.store.id, store_name: session.store.name,
          gm: form.gm, category: form.category,
          details: form.details, status: "Open", notes: [],
          applicant_name: form.applicant_name || null,
          license_plate: form.license_plate || null,
          insurance_note: form.insurance_note || null,
          application_photo: application_photo_url,
          insurance_photo: insurance_photo_url,
        }),
      });

      // Email HR
      await sendEmail(HR_EMAIL,
        `New ${form.category} Report - ${session.store.name}`,
        `New ${form.category} Report\nStore: ${session.store.name}\nGM: ${form.gm}\n${form.applicant_name ? "Applicant: " + form.applicant_name + "\n" : ""}${form.license_plate ? "License Plate: " + form.license_plate + "\n" : ""}Details: ${form.details}\n${form.insurance_note ? "Insurance Note: " + form.insurance_note + "\n" : ""}Submitted: ${new Date().toLocaleString()}\n\nLog in to the GM Report Center to view and process this report.`
      );

      // Email store confirmation
      await sendEmail(storeEmail(session.store.id),
        `Report Received - ${form.category}`,
        `Hi ${form.gm},\n\nYour ${form.category} report has been received by the office.\n${form.applicant_name ? "Applicant: " + form.applicant_name + "\n" : ""}Details: ${form.details}\n\nYou will receive an email when the status is updated.\n\n- Team Next Level HR`
      );

      setForm({ category: CATEGORIES[0], gm: "", details: "", applicant_name: "", license_plate: "", insurance_note: "", application_photo: null, insurance_photo: null });
      setSubmitted(true);
      setTimeout(async () => {
        setSubmitted(false); setView("dashboard");
        await loadReports(session);
      }, 1800);
    } catch (e) { console.error(e); alert("Error submitting: " + e.message); }
    setUploading(false);
  }

  async function updateStatus(id, status, storeId, storeName, category, reason = "") {
    const updateData = { status, updated_at: new Date().toISOString() };
    if (reason) updateData.not_hired_reason = reason;
    await sbFetch(`/reports?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(updateData) });
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, ...updateData } : s));
    setSelected(prev => prev ? { ...prev, ...updateData } : prev);

    // Email store about status update
    await sendEmail(storeEmail(storeId),
      `Report Update - ${status}`,
      `Your ${category} report has been updated.\nStore: ${storeName}\nNew Status: ${status}\n${reason ? "Reason: " + reason + "\n" : ""}${status === "Hired" ? "Congratulations! The new hire has been processed and approved.\n" : ""}${status === "Not Hired" ? "Unfortunately this applicant will not be moving forward.\n" : ""}${status === "In Progress" ? "The office is currently processing this report.\n" : ""}\nLog into the app to view full details.\n\n- Team Next Level HR`
    );

    setShowNotHired(false);
  }

  async function addNote(item) {
    if (!newNote.trim()) return;
    const note = `${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${newNote}`;
    const updatedNotes = [...(item.notes || []), note];
    await sbFetch(`/reports?id=eq.${item.id}`, { method: "PATCH", body: JSON.stringify({ notes: updatedNotes }) });
    setSubmissions(prev => prev.map(s => s.id === item.id ? { ...s, notes: updatedNotes } : s));
    setSelected(prev => prev ? { ...prev, notes: updatedNotes } : prev);
    setNewNote("");
  }

  const isArchive = filterStatus === "Archive";

  function isPhotoExpired(item) {
    if (!["Hired", "Not Hired"].includes(item.status)) return false;
    const updated = new Date(item.updated_at || item.created_at);
    const days = (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24);
    return days > 90;
  }

  const filtered = submissions.filter(s => {
    const active = ["Open", "In Progress"].includes(s.status);
    const archived = ["Resolved", "Hired", "Not Hired"].includes(s.status);
    const matchesSearch = !searchQuery || 
      (s.applicant_name && s.applicant_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.gm && s.gm.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.details && s.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      (isArchive ? archived : active) &&
      (filterCat === "All" || s.category === filterCat) &&
      (filterStore === "All" || s.store_name === filterStore) &&
      matchesSearch
    );
  });

  const counts = {
    Open:          submissions.filter(s => s.status === "Open").length,
    "In Progress": submissions.filter(s => s.status === "In Progress").length,
    Hired:         submissions.filter(s => s.status === "Hired").length,
    "Not Hired":   submissions.filter(s => s.status === "Not Hired").length,
    Resolved:      submissions.filter(s => s.status === "Resolved").length,
  };

  const allStoreNames = [...new Set(submissions.map(s => s.store_name))].sort();

  if (!session) return (
    <div style={{ fontFamily: "Georgia, serif", background: "#1a1a1a", minHeight: "100vh", color: "#f5f0e8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#e31837", borderRadius: 16, padding: "16px 28px", marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontSize: 36 }}>🍕</div>
        <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: 1 }}>GM Report Center</div>
        <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>Domino's Pizza</div>
      </div>
      <div style={{ width: "100%", maxWidth: 380, background: "#2a2a2a", borderRadius: 16, padding: 24, border: "1px solid #3a3a3a" }}>
        <div style={{ display: "flex", background: "#1a1a1a", borderRadius: 10, padding: 4, marginBottom: 20 }}>
          {["store", "admin"].map(m => (
            <button key={m} onClick={() => { setLoginMode(m); setLoginError(""); }}
              style={{ flex: 1, background: loginMode === m ? "#e31837" : "transparent", color: loginMode === m ? "#fff" : "#888", border: "none", borderRadius: 8, padding: "8px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {m === "store" ? "Store Login" : "Admin Login"}
            </button>
          ))}
        </div>
        {loginMode === "store" && <>
          <label style={labelStyle}>Select Your Store</label>
          <select value={loginInput.store} onChange={e => setLoginInput(p => ({ ...p, store: e.target.value }))} style={inputStyle}>
            {STORE_ACCOUNTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </>}
        <label style={labelStyle}>Password</label>
        <input type="password" placeholder="Enter password" value={loginInput.password}
          onChange={e => setLoginInput(p => ({ ...p, password: e.target.value }))}
          onKeyDown={e => e.key === "Enter" && handleLogin()} style={inputStyle} />
        {loginError && <div style={{ color: "#e31837", fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{loginError}</div>}
        <button onClick={handleLogin} style={btnRed}>Sign In</button>
      </div>
      <div style={{ marginTop: 18, fontSize: 12, color: "#555", textAlign: "center", maxWidth: 300 }}>
        Contact your admin if you need your store password.
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#1a1a1a", minHeight: "100vh", color: "#f5f0e8" }}>
      <div style={{ background: "#e31837", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 12px rgba(227,24,55,0.4)", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 15 }}>
            {session.type === "admin" ? "🔑 Admin — All Stores" : `🍕 ${session.store.name}`}
          </div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>GM Report Center</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {session.type === "store" && (
            <button onClick={() => setView("submit")}
              style={{ background: view === "submit" ? "rgba(255,255,255,0.25)" : "transparent", border: "1px solid rgba(255,255,255,0.5)", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>
              + Report
            </button>
          )}
          <button onClick={() => setView("dashboard")}
            style={{ background: view === "dashboard" ? "rgba(255,255,255,0.25)" : "transparent", border: "1px solid rgba(255,255,255,0.5)", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>
            Dashboard
          </button>
          <button onClick={() => setSession(null)}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ padding: "18px 16px", maxWidth: 620, margin: "0 auto" }}>

        {view === "dashboard" && <>
          {/* Search bar - admin only */}
          {session.type === "admin" && (
            <div style={{ marginBottom: 14 }}>
              <input
                placeholder="🔍 Search by applicant name, GM, or details..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ ...inputStyle, marginBottom: 0, background: "#2a2a2a", border: "1px solid #555" }}
              />
            </div>
          )}

          {/* Active / Archive toggle */}
          <div style={{ display: "flex", background: "#2a2a2a", borderRadius: 12, padding: 4, marginBottom: 16, border: "1px solid #3a3a3a" }}>
            <button onClick={() => setFilterStatus("Active")}
              style={{ flex: 1, background: !isArchive ? "#e31837" : "transparent", color: !isArchive ? "#fff" : "#888", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
              📋 Active Reports
            </button>
            <button onClick={() => setFilterStatus("Archive")}
              style={{ flex: 1, background: isArchive ? "#198754" : "transparent", color: isArchive ? "#fff" : "#888", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
              ✅ Archive
            </button>
          </div>

          {!isArchive && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            {[["Open", counts.Open], ["In Progress", counts["In Progress"]]].map(([status, count]) => (
              <div key={status} style={{ background: "#2a2a2a", border: `2px solid ${statusColor(status).dot}`, borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#f5f0e8" }}>{count}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: statusColor(status).dot }}>{status}</div>
              </div>
            ))}
          </div>}

          {isArchive && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
            {[["Hired", counts.Hired], ["Not Hired", counts["Not Hired"]], ["Resolved", counts.Resolved]].map(([status, count]) => (
              <div key={status} style={{ background: "#2a2a2a", border: `2px solid ${statusColor(status).dot}`, borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#f5f0e8" }}>{count}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: statusColor(status).dot }}>{status}</div>
              </div>
            ))}
          </div>}

          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 10 }}>
            {["All", ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                style={{ whiteSpace: "nowrap", background: filterCat === cat ? "#e31837" : "#2a2a2a", color: filterCat === cat ? "#fff" : "#aaa", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                {cat}
              </button>
            ))}
          </div>

          {session.type === "admin" && allStoreNames.length > 0 && (
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
              {["All", ...allStoreNames].map(sn => (
                <button key={sn} onClick={() => setFilterStore(sn)}
                  style={{ whiteSpace: "nowrap", background: filterStore === sn ? "#555" : "#2a2a2a", color: filterStore === sn ? "#fff" : "#888", border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                  {sn}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", color: "#666", padding: 40 }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", color: "#666", padding: 40, fontSize: 14 }}>No submissions found.</div>
          ) : filtered.map(item => (
            <div key={item.id} onClick={() => { setSelected(item); setShowNotHired(false); setView("detail"); }}
              style={{ background: "#2a2a2a", borderRadius: 14, padding: 16, marginBottom: 12, cursor: "pointer", border: "1px solid #3a3a3a" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ background: "#e31837", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px" }}>{item.category}</span>
                  {session.type === "admin" && <span style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>{item.store_name}</span>}
                </div>
                <span style={{ background: statusColor(item.status).bg, color: statusColor(item.status).text, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap" }}>{item.status}</span>
              </div>
              {item.applicant_name && <div style={{ fontSize: 13, color: "#e31837", fontWeight: 700, marginBottom: 4 }}>Applicant: {item.applicant_name}</div>}
              <div style={{ fontSize: 14, color: "#f0ebe0", marginBottom: 6, lineHeight: 1.4 }}>{item.details.length > 80 ? item.details.slice(0, 80) + "…" : item.details}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#666" }}>
                <span>GM: {item.gm}</span>
                <span>{formatDate(item.created_at)}</span>
              </div>
            </div>
          ))}
        </>}

        {view === "submit" && session.type === "store" && (
          <div style={{ background: "#2a2a2a", borderRadius: 16, padding: 24, border: "1px solid #3a3a3a" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800 }}>New Report — {session.store.name}</h2>
            {submitted ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 48 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#198754", marginTop: 12 }}>Report Submitted!</div>
                <div style={{ fontSize: 13, color: "#aaa", marginTop: 6 }}>HR has been notified. Returning to dashboard…</div>
              </div>
            ) : <>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>

              {form.category === "New Hire" && (
                <div style={{ background: "#1e1e1e", borderRadius: 12, padding: 16, marginBottom: 14, border: "1px solid #e31837" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e31837", marginBottom: 14 }}>🆕 NEW HIRE DETAILS</div>
                  <label style={labelStyle}>Applicant Name</label>
                  <input placeholder="Full name of applicant" value={form.applicant_name}
                    onChange={e => setForm(f => ({ ...f, applicant_name: e.target.value }))} style={inputStyle} />
                  <PhotoUpload label="📄 Photo of Application" value={form.application_photo}
                    onChange={file => setForm(f => ({ ...f, application_photo: file }))} />
                  <label style={labelStyle}>Car License Plate</label>
                  <input placeholder="e.g. ABC 1234" value={form.license_plate}
                    onChange={e => setForm(f => ({ ...f, license_plate: e.target.value }))} style={inputStyle} />
                  <PhotoUpload label="🚗 Photo of Insurance Card / Declaration Page" value={form.insurance_photo}
                    onChange={file => setForm(f => ({ ...f, insurance_photo: file }))} />
                  <label style={labelStyle}>⚠️ Insurance Note (if name not on card)</label>
                  <textarea placeholder="e.g. Card is under John Smith — applicant's father."
                    value={form.insurance_note} onChange={e => setForm(f => ({ ...f, insurance_note: e.target.value }))}
                    rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                </div>
              )}

              <label style={labelStyle}>Your Name (GM)</label>
              <input placeholder="e.g. Maria Lopez" value={form.gm} onChange={e => setForm(f => ({ ...f, gm: e.target.value }))} style={inputStyle} />
              <label style={labelStyle}>Additional Details</label>
              <textarea placeholder="Any other notes…" value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
              <button onClick={submitReport} disabled={uploading || !form.gm || !form.details}
                style={{ ...btnRed, background: (!uploading && form.gm && form.details) ? "#e31837" : "#555", cursor: (!uploading && form.gm && form.details) ? "pointer" : "not-allowed" }}>
                {uploading ? "Uploading…" : "Submit Report"}
              </button>
            </>}
          </div>
        )}

        {view === "detail" && selected && (
          <div>
            <button onClick={() => setView("dashboard")} style={{ background: "transparent", border: "none", color: "#e31837", fontSize: 14, cursor: "pointer", fontWeight: 700, marginBottom: 16, padding: 0 }}>← Back</button>

            <div style={{ background: "#2a2a2a", borderRadius: 16, padding: 20, border: "1px solid #3a3a3a", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ background: "#e31837", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 6, padding: "3px 10px" }}>{selected.category}</span>
                <span style={{ background: statusColor(selected.status).bg, color: statusColor(selected.status).text, fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "4px 12px" }}>{selected.status}</span>
              </div>
              <div style={{ fontSize: 13, color: "#aaa", marginBottom: 4 }}>{selected.store_name} · GM: {selected.gm}</div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>{formatDate(selected.created_at)}</div>
              <div style={{ fontSize: 15, color: "#f0ebe0", lineHeight: 1.6 }}>{selected.details}</div>

              {selected.not_hired_reason && (
                <div style={{ background: "#2a1a1a", borderRadius: 8, padding: 10, marginTop: 12, border: "1px solid #dc3545" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#dc3545", marginBottom: 4 }}>❌ NOT HIRED REASON</div>
                  <div style={{ fontSize: 13, color: "#f0ebe0" }}>{selected.not_hired_reason}</div>
                </div>
              )}

              {selected.category === "New Hire" && (
                <div style={{ marginTop: 16, background: "#1e1e1e", borderRadius: 12, padding: 16, border: "1px solid #e31837" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e31837", marginBottom: 12 }}>🆕 NEW HIRE DETAILS</div>
                  {selected.applicant_name && <div style={{ fontSize: 14, color: "#f0ebe0", marginBottom: 8 }}><span style={{ color: "#aaa" }}>Applicant:</span> {selected.applicant_name}</div>}
                  {selected.license_plate && <div style={{ fontSize: 14, color: "#f0ebe0", marginBottom: 8 }}><span style={{ color: "#aaa" }}>License Plate:</span> {selected.license_plate}</div>}
                  {selected.insurance_note && (
                    <div style={{ background: "#2a1a1a", borderRadius: 8, padding: 10, marginBottom: 12, border: "1px solid #e31837" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#e31837", marginBottom: 4 }}>⚠️ INSURANCE NOTE</div>
                      <div style={{ fontSize: 13, color: "#f0ebe0" }}>{selected.insurance_note}</div>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                    {isPhotoExpired(selected) ? (
                      <div style={{ gridColumn: "1/-1", background: "#2a1a1a", borderRadius: 8, padding: 12, border: "1px solid #555", textAlign: "center" }}>
                        <div style={{ fontSize: 13, color: "#888" }}>📁 Photos automatically deleted after 90 days</div>
                      </div>
                    ) : (<>
                    {selected.application_photo && (
                      <div>
                        <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Application</div>
                        <a href={selected.application_photo} target="_blank" rel="noreferrer">
                          <img src={selected.application_photo} alt="Application" style={{ width: "100%", borderRadius: 8, objectFit: "cover", maxHeight: 140 }} />
                        </a>
                      </div>
                    )}
                    {selected.insurance_photo && (
                      <div>
                        <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Insurance</div>
                        <a href={selected.insurance_photo} target="_blank" rel="noreferrer">
                          <img src={selected.insurance_photo} alt="Insurance" style={{ width: "100%", borderRadius: 8, objectFit: "cover", maxHeight: 140 }} />
                        </a>
                      </div>
                    )}
                    </>)}
                  </div>
                </div>
              )}
            </div>

            {/* Status Controls — Admin only */}
            {session.type === "admin" && (
              <div style={{ background: "#2a2a2a", borderRadius: 16, padding: 20, border: "1px solid #3a3a3a", marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Update Status</div>

                {selected.category === "New Hire" ? (
                  <>
                    <div style={{ display: "flex", gap: 8, marginBottom: showNotHired ? 12 : 0 }}>
                      <button onClick={() => { updateStatus(selected.id, "In Progress", selected.store_id, selected.store_name, selected.category); setShowNotHired(false); }}
                        style={{ flex: 1, background: selected.status === "In Progress" ? "#0d6efd" : "#3a3a3a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 4px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        ⏳ In Progress
                      </button>
                      <button onClick={() => { updateStatus(selected.id, "Hired", selected.store_id, selected.store_name, selected.category); setShowNotHired(false); }}
                        style={{ flex: 1, background: selected.status === "Hired" ? "#198754" : "#3a3a3a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 4px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        ✅ Hired
                      </button>
                      <button onClick={() => setShowNotHired(!showNotHired)}
                        style={{ flex: 1, background: selected.status === "Not Hired" ? "#dc3545" : "#3a3a3a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 4px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        ❌ Not Hired
                      </button>
                    </div>
                    {showNotHired && (
                      <div style={{ background: "#1a1a1a", borderRadius: 10, padding: 14, border: "1px solid #dc3545" }}>
                        <label style={{ ...labelStyle, color: "#dc3545" }}>Reason for Not Hiring</label>
                        <select value={notHiredReason} onChange={e => setNotHiredReason(e.target.value)} style={inputStyle}>
                          {NOT_HIRED_REASONS.map(r => <option key={r}>{r}</option>)}
                        </select>
                        <button onClick={() => updateStatus(selected.id, "Not Hired", selected.store_id, selected.store_name, selected.category, notHiredReason)}
                          style={{ ...btnRed, background: "#dc3545", marginTop: 0 }}>
                          Confirm Not Hired
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Open", "In Progress", "Resolved"].map(s => (
                      <button key={s} onClick={() => updateStatus(selected.id, s, selected.store_id, selected.store_name, selected.category)}
                        style={{ flex: 1, background: selected.status === s ? statusColor(s).dot : "#3a3a3a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 4px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Store view — read only status */}
            {session.type === "store" && (
              <div style={{ background: "#2a2a2a", borderRadius: 16, padding: 20, border: "1px solid #3a3a3a", marginBottom: 14, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Current Status</div>
                <span style={{ background: statusColor(selected.status).bg, color: statusColor(selected.status).text, fontSize: 16, fontWeight: 800, borderRadius: 20, padding: "8px 20px" }}>{selected.status}</span>
                <div style={{ fontSize: 12, color: "#666", marginTop: 10 }}>Status is updated by HR. You'll receive an email when it changes.</div>
              </div>
            )}

            <div style={{ background: "#2a2a2a", borderRadius: 16, padding: 20, border: "1px solid #3a3a3a" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Notes & Updates</div>
              {(!selected.notes || selected.notes.length === 0) && <div style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>No notes yet.</div>}
              {(selected.notes || []).map((n, i) => (
                <div key={i} style={{ background: "#1a1a1a", borderRadius: 8, padding: "10px 12px", marginBottom: 8, fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{n}</div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input placeholder="Add a note…" value={newNote} onChange={e => setNewNote(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addNote(selected)}
                  style={{ ...inputStyle, margin: 0, flex: 1 }} />
                <button onClick={() => addNote(selected)}
                  style={{ background: "#e31837", color: "#fff", border: "none", borderRadius: 10, padding: "0 16px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

