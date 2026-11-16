// Auth khusus admin. Tidak menyediakan registrasi publik.
(() => {
  const config = window.SUPABASE_CONFIG;
  const sdk = window.supabase;
  if (!config?.url || !config?.publishableKey || !sdk?.createClient) {
    console.error('Supabase config atau SDK tidak tersedia.');
    return;
  }

  const client = sdk.createClient(config.url, config.publishableKey);
  window.adminSupabase = client;

  async function isAdmin(userId) {
    const { data, error } = await client
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) {
      console.error('Gagal memeriksa akses admin:', error.message);
      return false;
    }
    return !!data;
  }

  function showMessage(message, type = 'error') {
    const el = document.getElementById('authMessage');
    if (!el) return;
    el.textContent = message;
    el.dataset.type = type;
    el.hidden = false;
  }

  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    const submit = loginForm.querySelector('button[type="submit"]');
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    const safeNext = next === 'admin.html' ? next : 'admin.html';

    client.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      if (await isAdmin(session.user.id)) location.replace(safeNext);
      else await client.auth.signOut();
    });

    loginForm.addEventListener('submit', async event => {
      event.preventDefault();
      const email = document.getElementById('adminEmail').value.trim().toLowerCase();
      const password = document.getElementById('adminPassword').value;
      if (!email || !password) return showMessage('Email dan password wajib diisi.');

      submit.disabled = true;
      submit.textContent = 'Memeriksa...';
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        showMessage('Login gagal. Periksa email dan password kamu.');
        submit.disabled = false;
        submit.textContent = 'Masuk';
        return;
      }

      if (!(await isAdmin(data.user.id))) {
        await client.auth.signOut();
        showMessage('Akun ini belum memiliki akses admin. Hubungi pemilik toko.');
        submit.disabled = false;
        submit.textContent = 'Masuk';
        return;
      }

      location.replace(safeNext);
    });
  }

  const adminPage = document.getElementById('adminPage');
  if (adminPage) {
    (async () => {
      const { data: { session } } = await client.auth.getSession();
      if (!session) {
        location.replace('admin-login.html');
        return;
      }
      if (!(await isAdmin(session.user.id))) {
        await client.auth.signOut();
        location.replace('admin-login.html?error=unauthorized');
        return;
      }

      const email = document.getElementById('adminAccount');
      if (email) email.textContent = session.user.email || 'Admin';
      adminPage.hidden = false;
    })();

    document.getElementById('adminLogout')?.addEventListener('click', async () => {
      await client.auth.signOut();
      location.replace('admin-login.html');
    });
  }
})();
