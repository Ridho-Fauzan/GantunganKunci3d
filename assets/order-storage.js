// Penyimpanan pre-order publik ke Supabase. RLS membatasi akses baca ke admin.
(() => {
  const config = window.SUPABASE_CONFIG;
  if (!config?.url || !config?.publishableKey || !window.supabase?.createClient) return;
  const client = window.supabase.createClient(config.url, config.publishableKey);
  window.orderStorage = {
    async create(payload) {
      const { data, error } = await client.from('orders').insert({
        customer_name: payload.customer_name,
        instagram: payload.instagram,
        whatsapp: payload.whatsapp || null,
        product_name: payload.product_name,
        quantity: payload.quantity,
        print_sides: payload.print_sides,
        custom_text: payload.custom_text || null,
        color: payload.color || null,
        notes: payload.notes || null,
        design: payload.design || null,
        summary: payload.summary,
        status: 'new'
      }).select('id').single();
      if (error) throw error;
      return data;
    }
  };
})();
