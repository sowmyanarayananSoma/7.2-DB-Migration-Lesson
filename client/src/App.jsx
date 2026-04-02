import { useState, useEffect } from 'react';

// ─── Styles ────────────────────────────────────────────────────────────────────

const S = {
  app: { minHeight: '100vh', background: '#f3f4f6', fontFamily: 'system-ui, sans-serif' },
  header: { background: '#1e293b', color: '#fff', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em' },
  headerSub: { fontSize: '13px', color: '#94a3b8', marginTop: '2px' },
  main: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },

  banner: (isProd) => ({
    padding: '10px 32px', background: isProd ? '#14532d' : '#78350f',
    color: '#fff', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px',
  }),
  dot: (isProd) => ({
    width: 9, height: 9, borderRadius: '50%',
    background: isProd ? '#4ade80' : '#fbbf24', flexShrink: 0,
  }),
  bannerChip: { opacity: 0.55, margin: '0 4px' },

  card: { background: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' },

  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#475569' },
  input: { border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 12px', fontSize: '14px', outline: 'none', width: '100%' },
  hint: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' },

  btnPrimary: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '9px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  btnDanger: { background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer' },
  btnSecondary: { background: 'none', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '7px 16px', fontSize: '13px', color: '#475569', cursor: 'pointer' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
  productCard: { background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  productCategory: { fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' },
  productName: { fontSize: '15px', fontWeight: '600', marginBottom: '4px' },
  productPrice: { fontSize: '22px', fontWeight: '700', color: '#16a34a', marginBottom: '8px' },
  productDesc: { fontSize: '13px', color: '#64748b', marginBottom: '10px', lineHeight: 1.5 },
  attrs: { background: '#f8fafc', borderRadius: '6px', padding: '8px 10px', marginBottom: '12px', fontSize: '12px', color: '#64748b' },
  attrRow: { marginBottom: '2px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: (inStock) => ({
    fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '9999px',
    background: inStock ? '#dcfce7' : '#fee2e2',
    color: inStock ? '#15803d' : '#dc2626',
  }),

  authTabs: { display: 'flex', gap: '8px', marginBottom: '20px' },
  tab: (active) => ({
    padding: '7px 18px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', border: 'none',
    background: active ? '#2563eb' : '#f1f5f9',
    color: active ? '#fff' : '#64748b',
  }),
  lockedPanel: { background: '#fefce8', border: '1px dashed #fbbf24', borderRadius: '10px', padding: '32px', textAlign: 'center', marginBottom: '24px' },
  lockedTitle: { fontSize: '16px', fontWeight: '600', color: '#92400e', marginBottom: '8px' },
  lockedSub: { fontSize: '13px', color: '#a16207' },
  loginPrompt: { background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: '10px', padding: '20px', textAlign: 'center', marginBottom: '24px' },
  loginPromptText: { fontSize: '14px', color: '#1d4ed8' },
  userBadge: { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },

  error: { color: '#dc2626', fontSize: '13px', margin: '8px 0' },
  success: { color: '#16a34a', fontSize: '13px', margin: '8px 0' },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '48px 0' },
  loading: { textAlign: 'center', color: '#94a3b8', padding: '48px 0' },
};

// ─── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [env, setEnv] = useState({ environment: 'development', authEnabled: false });
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [authTab, setAuthTab] = useState('login');
  const [authUser, setAuthUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [productForm, setProductForm] = useState({ name: '', price: '', category: '', description: '', attributes: '' });
  const [productError, setProductError] = useState('');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  const isProd = env.environment === 'production';
  // In production, write actions require the user to be logged in
  const canWrite = !isProd || authUser;

  useEffect(() => {
    fetch('/api/env').then((r) => r.json()).then(setEnv).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductError('');

    let attributes = {};
    if (productForm.attributes.trim()) {
      try {
        productForm.attributes.split(',').forEach((pair) => {
          const [key, ...rest] = pair.split(':');
          if (!key || rest.length === 0) throw new Error();
          attributes[key.trim()] = rest.join(':').trim();
        });
      } catch {
        setProductError('Attributes must be in "key: value, key: value" format');
        return;
      }
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Send token in production so the server can verify the user
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify({
          name: productForm.name,
          price: parseFloat(productForm.price),
          category: productForm.category,
          description: productForm.description,
          attributes,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      setProductForm({ name: '', price: '', category: '', description: '', attributes: '' });
      fetchProducts();
    } catch (err) {
      setProductError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    });
    fetchProducts();
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const endpoint = authTab === 'register' ? '/api/auth/register' : '/api/auth/login';
    const body = authTab === 'register'
      ? { name: authForm.name, email: authForm.email, password: authForm.password }
      : { email: authForm.email, password: authForm.password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAuthUser(data.user);
      setAuthToken(data.token);
      setAuthSuccess(authTab === 'register' ? 'Account created!' : `Welcome back, ${data.user.name}!`);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    setAuthToken(null);
    setAuthSuccess('');
    setAuthError('');
  };

  return (
    <div style={S.app}>

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.headerTitle}>🛍️ ShopLocal</div>
          <div style={S.headerSub}>Deployment Lesson 2 — Database Migration Demo</div>
        </div>
      </div>

      {/* Environment banner */}
      <div style={S.banner(isProd)}>
        <div style={S.dot(isProd)} />
        <span><strong>{isProd ? 'Production' : 'Development'}</strong></span>
        <span style={S.bannerChip}>·</span>
        <span>MongoDB: <strong>{isProd ? 'Atlas (cloud)' : 'Local'}</strong></span>
        <span style={S.bannerChip}>·</span>
        <span>Supabase Auth: <strong>{isProd ? 'Enabled' : 'Disabled'}</strong></span>
        {!isProd && (
          <>
            <span style={S.bannerChip}>·</span>
            <span style={{ opacity: 0.7 }}>Change NODE_ENV to "production" in server/.env to enable auth</span>
          </>
        )}
      </div>

      <div style={S.main}>

        {/* ── Auth section ─────────────────────────────────────────── */}
        {isProd ? (
          <div style={S.card}>
            <div style={S.sectionTitle}>👤 User Account (Supabase / PostgreSQL)</div>
            {authUser ? (
              <>
                <div style={S.userBadge}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{authUser.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{authUser.email}</div>
                  </div>
                  <button style={S.btnSecondary} onClick={handleLogout}>Log out</button>
                </div>
                {authSuccess && <div style={S.success}>{authSuccess}</div>}
              </>
            ) : (
              <>
                <div style={S.authTabs}>
                  <button style={S.tab(authTab === 'login')} onClick={() => { setAuthTab('login'); setAuthError(''); setAuthSuccess(''); }}>Log in</button>
                  <button style={S.tab(authTab === 'register')} onClick={() => { setAuthTab('register'); setAuthError(''); setAuthSuccess(''); }}>Register</button>
                </div>
                <form onSubmit={handleAuth}>
                  {authTab === 'register' && (
                    <div style={S.field}>
                      <label style={S.label}>Name</label>
                      <input style={S.input} value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} placeholder="Your name" required />
                    </div>
                  )}
                  <div style={S.field}>
                    <label style={S.label}>Email</label>
                    <input style={S.input} type="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} placeholder="you@email.com" required />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Password</label>
                    <input style={S.input} type="password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder="••••••••" required />
                  </div>
                  {authError && <div style={S.error}>{authError}</div>}
                  {authSuccess && <div style={S.success}>{authSuccess}</div>}
                  <button style={S.btnPrimary} type="submit">
                    {authTab === 'register' ? 'Create account' : 'Log in'}
                  </button>
                </form>
              </>
            )}
          </div>
        ) : (
          <div style={S.lockedPanel}>
            <div style={S.lockedTitle}>🔒 Auth is disabled in development</div>
            <div style={S.lockedSub}>
              User accounts are stored in Supabase (PostgreSQL) and are only available in production.<br />
              Set <code>NODE_ENV=production</code> in <code>server/.env</code> and add your Supabase credentials to unlock this section.
            </div>
          </div>
        )}

        {/* ── Add product form — hidden in production until logged in ── */}
        {canWrite ? (
          <div style={S.card}>
            <div style={S.sectionTitle}>➕ Add a Product (MongoDB)</div>
            <form onSubmit={handleAddProduct}>
              <div style={S.row2}>
                <div style={S.field}>
                  <label style={S.label}>Product name</label>
                  <input style={S.input} value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g. Classic Tee" required />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Price ($)</label>
                  <input style={S.input} type="number" min="0" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="e.g. 29.99" required />
                </div>
              </div>
              <div style={S.field}>
                <label style={S.label}>Category</label>
                <input style={S.input} value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} placeholder="e.g. Clothing, Electronics, Books" required />
              </div>
              <div style={S.field}>
                <label style={S.label}>Description (optional)</label>
                <input style={S.input} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Short description" />
              </div>
              <div style={S.field}>
                <label style={S.label}>Attributes (optional)</label>
                <input style={S.input} value={productForm.attributes} onChange={(e) => setProductForm({ ...productForm, attributes: e.target.value })} placeholder="colour: red, sizes: S/M/L" />
                <span style={S.hint}>Separate each attribute with a comma — this is what makes MongoDB flexible across product types</span>
              </div>
              {productError && <div style={S.error}>{productError}</div>}
              <button style={S.btnPrimary} type="submit">Add Product</button>
            </form>
          </div>
        ) : (
          <div style={S.loginPrompt}>
            <div style={S.loginPromptText}>🔒 Log in above to add or delete products</div>
          </div>
        )}

        {/* ── Product list ──────────────────────────────────────────── */}
        <div style={S.sectionTitle}>📦 Products ({products.length})</div>

        {loadingProducts ? (
          <div style={S.loading}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={S.empty}>No products yet — add one above!</div>
        ) : (
          <div style={S.grid}>
            {products.map((p) => (
              <div key={p._id} style={S.productCard}>
                <div style={S.productCategory}>{p.category}</div>
                <div style={S.productName}>{p.name}</div>
                <div style={S.productPrice}>${p.price.toFixed(2)}</div>
                {p.description && <div style={S.productDesc}>{p.description}</div>}
                {p.attributes && Object.keys(p.attributes).length > 0 && (
                  <div style={S.attrs}>
                    {Object.entries(p.attributes).map(([k, v]) => (
                      <div key={k} style={S.attrRow}>
                        <strong>{k}:</strong> {Array.isArray(v) ? v.join(', ') : String(v)}
                      </div>
                    ))}
                  </div>
                )}
                <div style={S.cardFooter}>
                  <span style={S.badge(p.inStock)}>{p.inStock ? 'In stock' : 'Out of stock'}</span>
                  {/* Only show delete button if user can write */}
                  {canWrite && (
                    <button style={S.btnDanger} onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
