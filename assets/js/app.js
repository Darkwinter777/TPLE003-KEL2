// ── Storage helpers ──
const db = {
  get: (key, def = null) => { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } },
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  push: (key, item) => { const arr = db.get(key, []); arr.push(item); db.set(key, arr); },
};

// ── Seed demo data ──
function seedData() {
  if (db.get('seeded')) return;

  db.set('users_warga', [
    { id: 'w1', nama: 'Budi Santoso', username: 'budi', password: '1234', noHp: '081234567890', alamat: 'Jl. Mawar No.5 RT 02/03' },
    { id: 'w2', nama: 'Siti Rahayu', username: 'siti', password: '1234', noHp: '081298765432', alamat: 'Jl. Melati No.12 RT 01/02' },
  ]);
  db.set('users_admin', [
    { id: 'a1', nama: 'Pak RT Joko', username: 'admin', password: 'admin123', wilayah: 'RT 01-03 / RW 05' },
  ]);
  db.set('users_tps', [
    { id: 't1', nama: 'Petugas TPS', username: 'tps', password: 'tps123', lokasi: 'TPS Kelurahan Mawar' },
  ]);

  const now = Date.now();
  db.set('requests', [
    { id: 'r1', wargaId: 'w1', wargaNama: 'Budi Santoso', wargaAlamat: 'Jl. Mawar No.5 RT 02/03', jenisSampah: 'Organik', beratKg: 3, catatan: 'Sisa dapur', status: 'menunggu', tglRequest: now - 86400000*2, tglPickup: null },
    { id: 'r2', wargaId: 'w1', wargaNama: 'Budi Santoso', wargaAlamat: 'Jl. Mawar No.5 RT 02/03', jenisSampah: 'Plastik', beratKg: 1.5, catatan: '', status: 'dijadwalkan', tglRequest: now - 86400000*5, tglPickup: now + 86400000, jadwalStr: 'Besok, 08:00' },
    { id: 'r3', wargaId: 'w2', wargaNama: 'Siti Rahayu', wargaAlamat: 'Jl. Melati No.12 RT 01/02', jenisSampah: 'Kertas', beratKg: 2, catatan: 'Koran bekas', status: 'selesai', tglRequest: now - 86400000*10, tglPickup: now - 86400000*8, jadwalStr: '18 Jun, 09:00' },
    { id: 'r4', wargaId: 'w2', wargaNama: 'Siti Rahayu', wargaAlamat: 'Jl. Melati No.12 RT 01/02', jenisSampah: 'Elektronik', beratKg: 5, catatan: 'TV rusak', status: 'menunggu', tglRequest: now - 86400000, tglPickup: null },
  ]);
  db.set('seeded', true);
}

// ── Auth ──
const auth = {
  login: (role, username, password) => {
    const users = db.get(`users_${role}`, []);
    return users.find(u => u.username === username && u.password === password) || null;
  },
  setSession: (role, user) => { db.set('session', { role, user }); },
  getSession: () => db.get('session'),
  logout: () => { localStorage.removeItem('session'); },
  require: (role) => {
    const s = auth.getSession();
    if (!s || s.role !== role) { location.href = `/pilahin/login/${role}.html`; return null; }
    return s.user;
  },
};

// ── Utilities ──
function fmtDate(ts) {
  if (!ts) return '-';
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function badgeHtml(status) {
  const map = { menunggu: ['pending','Menunggu'], dijadwalkan: ['process','Dijadwalkan'], selesai: ['done','Selesai'], ditolak: ['rejected','Ditolak'] };
  const [cls, label] = map[status] || ['pending', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function genId() { return '_' + Math.random().toString(36).slice(2, 9); }

// ── Toast ──
function toast(msg, type = 'success') {
  let t = document.getElementById('_toast');
  if (!t) { t = document.createElement('div'); t.id = '_toast'; Object.assign(t.style, { position:'fixed', bottom:'90px', left:'50%', transform:'translateX(-50%)', padding:'10px 20px', borderRadius:'24px', fontSize:'13px', fontWeight:'600', zIndex:'999', transition:'opacity .3s', maxWidth:'90%', textAlign:'center' }); document.body.appendChild(t); }
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.background = type === 'error' ? '#c62828' : '#2d6a4f';
  t.style.color = '#fff';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2500);
}

seedData();
