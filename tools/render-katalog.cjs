// Renders the catalog poster (JPG) + 360° preview videos (MP4 H.264 + WebM VP9) for every product in assets/shop.js.
//
//   npm i -D playwright && npx playwright install chromium     (once)
//   python3 -m http.server 8765                                (in the repo folder, keep running)
//   FFMPEG=/path/to/ffmpeg node tools/render-katalog.cjs [id,id,...]
//
// Optional env: FRAMES (default 120 = one 4 s turn at 30 fps), BASE (default http://127.0.0.1:8765/), CHROME (browser binary)
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const pw = (() => { try { return require(process.env.G ? process.env.G + '/@playwright/mcp/node_modules/playwright-core' : 'playwright'); } catch { return require('playwright-core'); } })();
const REPO = path.resolve(__dirname, '..') + '/', BASE = process.env.BASE || 'http://127.0.0.1:8765/';
const FRAMES = +(process.env.FRAMES || 120), FPS = 30; // 120 frames @30fps = one 4-second turn
const W = 480, H = 600;
(async () => {
  const b = await pw.chromium.launch({
    executablePath: process.env.CHROME || undefined,
    args: ['--no-sandbox', '--disable-crash-reporter', '--no-zygote', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const probe = await ctx.newPage();
  await probe.goto(BASE + 'index.html');
  let ids = await probe.evaluate(() => KATALOG.map(p => p.id));
  await probe.close();
  if (process.argv[2]) ids = process.argv[2].split(',');
  for (const id of ids) {
    const t0 = Date.now();
    const p = await ctx.newPage();
    p.on('pageerror', e => console.log(id, 'pageerror:', e.message));
    await p.goto(BASE + 'desain.html?debug&produk=' + id);
    await p.addStyleTag({ content: '#panel,#shopNav,#hint{display:none!important}' });
    await p.evaluate(() => { document.getElementById('autoSwing').checked = false; dispatchEvent(new Event('resize')); });
    await p.waitForFunction(() => window.__ready && window.gantungan, null, { timeout: 60000 });
    await p.evaluate(() => window.__ready);
    const status = await p.$eval('#assetStatus', e => e.textContent);
    console.log(id, '| asset:', status);
    await p.waitForTimeout(3000);
    // Settle to a calm rest pose, then stop the live loop so only our frames are rendered
    await p.evaluate(() => {
      const g = window.gantungan;
      g.stopLoop();
      for (const c of g.charms) { c.phys.vt = 0; c.phys.twist = c.baseTwist; c.phys.vz.fill(0); c.phys.wz.fill(0); c.phys.vx.fill(0); c.phys.wx.fill(0); }
      Object.assign(g.ring, { wz: 0, vz: 0, wx: 0, vx: 0 });
      g.simulate(6, { auto: false });
    });
    const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'frames-'));
    for (let i = 0; i < FRAMES; i++) {
      const url = await p.evaluate(([i, n, fps]) => window.gantungan.turntable(i, n, fps), [i, FRAMES, FPS]);
      fs.writeFileSync(path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
      if (i === 0) fs.copyFileSync(path.join(dir, 'f0000.jpg'), REPO + `katalog/${id}.jpg`); // poster = front view
    }
    await p.close();
    execFileSync(process.env.FFMPEG || 'ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.jpg'),
      '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'slow', '-movflags', '+faststart',
      '-an', REPO + `katalog/${id}.mp4`]);
    execFileSync(process.env.FFMPEG || 'ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.jpg'),
      '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-crf', '36', '-b:v', '0', '-row-mt', '1', '-an', REPO + `katalog/${id}.webm`]);
    fs.rmSync(dir, { recursive: true });
    console.log(id, '| jpg', fs.statSync(REPO + `katalog/${id}.jpg`).size, '| mp4', fs.statSync(REPO + `katalog/${id}.mp4`).size, '| webm', fs.statSync(REPO + `katalog/${id}.webm`).size, '|', ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
