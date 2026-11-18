(() => {
  const client = window.adminSupabase;
  const $ = id => document.getElementById(id);
  if (!client || !$('adminDashboard')) return;

  const statusLabels = {
    new: 'Baru',
    confirmed: 'Dikonfirmasi',
    processing: 'Diproses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan'
  };
  const statusClasses = {
    new: 'new', confirmed: 'confirmed', processing: 'processing',
    completed: 'completed', cancelled: 'cancelled'
  };
  let orders = [];
  let activeOrder = null;

  const money = value => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(value || 0);
  const date = value => new Date(value).toLocaleString('id-ID', {
    dateStyle: 'medium', timeStyle: 'short'
  });
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);

  function setMessage(message, type = 'info') {
    const el = $('dashboardMessage');
    el.textContent = message;
    el.dataset.type = type;
    el.hidden = !message;
  }

  function updateStats() {
    $('statTotal').textContent = orders.length;
    $('statNew').textContent = orders.filter(o => o.status === 'new').length;
    $('statProcessing').textContent = orders.filter(o => ['confirmed', 'processing'].includes(o.status)).length;
    $('statCompleted').textContent = orders.filter(o => o.status === 'completed').length;
  }

  function renderOrders() {
    const query = $('orderSearch').value.trim().toLowerCase();
    const filter = $('statusFilter').value;
    const filtered = orders.filter(o => {
      const matchesStatus = !filter || o.status === filter;
      const haystack = [o.customer_name, o.instagram, o.product_name, o.id].join(' ').toLowerCase();
      return matchesStatus && (!query || haystack.includes(query));
    });
    const body = $('ordersBody');
    body.textContent = '';
    $('emptyOrders').hidden = filtered.length > 0;
    $('ordersTable').hidden = filtered.length === 0;

    for (const order of filtered) {
      const tr = document.createElement('tr');
      const tdDate = document.createElement('td'); tdDate.textContent = date(order.created_at);
      const tdCode = document.createElement('td');
      const code = document.createElement('button');
      code.className = 'order-code'; code.type = 'button';
      code.textContent = order.id.slice(0, 8).toUpperCase();
      code.addEventListener('click', () => showDetail(order));
      tdCode.append(code);
      const tdCustomer = document.createElement('td');
      const strong = document.createElement('strong'); strong.textContent = order.customer_name;
      const small = document.createElement('small'); small.textContent = order.instagram ? '@' + order.instagram.replace(/^@/, '') : 'Instagram tidak dicantumkan';
      tdCustomer.append(strong, small);
      const tdProduct = document.createElement('td'); tdProduct.textContent = order.product_name;
      const tdQty = document.createElement('td'); tdQty.textContent = order.quantity;
      const tdStatus = document.createElement('td');
      const badge = document.createElement('span');
      badge.className = 'status ' + (statusClasses[order.status] || '');
      badge.textContent = statusLabels[order.status] || order.status;
      tdStatus.append(badge);
      const tdAction = document.createElement('td');
      const view = document.createElement('button'); view.className = 'btn-small'; view.type = 'button';
      view.textContent = 'Detail'; view.addEventListener('click', () => showDetail(order));
      tdAction.append(view);
      [tdDate, tdCode, tdCustomer, tdProduct, tdQty, tdStatus, tdAction].forEach(td => tr.append(td));
      body.append(tr);
    }
    $('resultCount').textContent = filtered.length + ' pesanan';
  }

  function safeFilename(value) {
    return String(value || 'artwork-custom')
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'artwork-custom';
  }

  function renderArtwork(order) {
    const container = $('detailArtwork');
    container.textContent = '';

    const items = Array.isArray(order.design?.items) ? order.design.items : [];
    const isSupportedArtwork = value => typeof value === 'string' && (
      /^data:image\/(?:png|jpeg|webp|svg\+xml);base64,/i.test(value) ||
      /^https:\/\/raw\.githubusercontent\.com\/Ridho-Fauzan\/GantunganKunci3d\/main\/assets\/demo-artworks\/[a-z0-9-]+\.svg$/i.test(value) ||
      /^https:\/\/images\.clipsafari\.com\//i.test(value)
    );
    const withArtwork = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => isSupportedArtwork(item.artwork));

    const orderCode = order.id.slice(0, 8).toUpperCase();
    const previews = withArtwork.length
      ? withArtwork
      : (isSupportedArtwork(order.design?.thumb)
        ? [{ item: { artwork: order.design.thumb, bentuk: 'Preview desain' }, index: 0, isPreview: true }]
        : []);

    if (!previews.length) {
      container.hidden = true;
      return;
    }

    container.hidden = false;
    for (const entry of previews) {
      const { item, index } = entry;
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = item.artwork;
      img.alt = (entry.isPreview ? 'Preview desain' : 'Artwork hasil kustomisasi') + ' - ' + (item.bentuk || 'desain');
      img.loading = 'lazy';

      const caption = document.createElement('figcaption');
      caption.textContent = item.bentuk || 'Artwork custom';

      const download = document.createElement('a');
      download.className = 'btn-small artwork-download';
      download.href = item.artwork;
      const ext = /\.svg(?:$|\?)/i.test(item.artwork) || /^data:image\/svg\+xml/i.test(item.artwork)
        ? 'svg'
        : /^data:image\/jpeg/i.test(item.artwork) ? 'jpg'
        : /^data:image\/webp/i.test(item.artwork) ? 'webp' : 'png';
      download.download = 'FK-' + orderCode + '-' + String(index + 1).padStart(2, '0') + '-' + safeFilename(item.bentuk) + '.' + ext;
      download.textContent = entry.isPreview ? 'Download preview' : (ext === 'svg' ? 'Download SVG siap cetak' : 'Download PNG');
      download.setAttribute('aria-label', 'Download ' + (item.bentuk || 'artwork') + ' desain');
      figure.append(img, caption, download);
      container.append(figure);
    }
  }

  function showDetail(order) {
    activeOrder = order;
    $('detailCode').textContent = 'ORDER-' + order.id.slice(0, 8).toUpperCase();
    $('detailDate').textContent = date(order.created_at);
    $('detailName').textContent = order.customer_name;
    $('detailInstagram').textContent = order.instagram ? '@' + order.instagram.replace(/^@/, '') : '—';
    $('detailWhatsapp').textContent = order.whatsapp || '—';
    $('detailProduct').textContent = order.product_name;
    $('detailQuantity').textContent = order.quantity + ' pcs';
    $('detailSides').textContent = order.print_sides;
    $('detailCustomText').textContent = order.custom_text || '—';
    $('detailColor').textContent = order.color || '—';
    $('detailNotes').textContent = order.notes || '—';
    $('detailSummary').textContent = order.summary || '—';
    renderArtwork(order);
    $('detailStatus').value = order.status;
    $('detailDialog').hidden = false;
    $('detailDialog').setAttribute('aria-hidden', 'false');
  }

  function closeDetail() {
    $('detailDialog').hidden = true;
    $('detailDialog').setAttribute('aria-hidden', 'true');
    activeOrder = null;
  }

  async function refresh() {
    $('refreshOrders').disabled = true;
    setMessage('Memuat pesanan...');
    const { data, error } = await client.from('orders')
      .select('*').order('created_at', { ascending: false }).limit(500);
    $('refreshOrders').disabled = false;
    if (error) {
      setMessage('Gagal memuat pesanan: ' + error.message + '. Pastikan SQL database pesanan sudah dijalankan.', 'error');
      return;
    }
    orders = data || [];
    updateStats();
    renderOrders();
    setMessage(orders.length ? '' : 'Belum ada pesanan yang masuk.');
  }

  $('orderSearch').addEventListener('input', renderOrders);
  $('statusFilter').addEventListener('change', renderOrders);
  $('refreshOrders').addEventListener('click', refresh);
  $('detailClose').addEventListener('click', closeDetail);
  $('detailDialog').addEventListener('click', e => {
    if (e.target === $('detailDialog')) closeDetail();
  });
  $('detailSave').addEventListener('click', async () => {
    if (!activeOrder) return;
    const nextStatus = $('detailStatus').value;
    $('detailSave').disabled = true;
    const { error } = await client.from('orders')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', activeOrder.id);
    $('detailSave').disabled = false;
    if (error) {
      $('detailError').textContent = 'Gagal menyimpan status: ' + error.message;
      $('detailError').hidden = false;
      return;
    }
    closeDetail();
    await refresh();
  });

  $('detailClose').addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDetail();
  });
  client.auth.getSession().then(({ data }) => {
    if (data.session) refresh();
  });
})();