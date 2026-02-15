self.importScripts('../jszip/dist/jszip.min.js');

self.onmessage = async function(e) {
  const { path } = e.data;
  try {
    const response = await fetch(path, { cache: 'force-cache' });
    const buf = await response.arrayBuffer();
    const zip = await self.JSZip.loadAsync(buf);
    const manifest = JSON.parse(await zip.file("manifest.json").async("string"));
    const firstAnimId = manifest.animations[0].id;
    const animPath = `animations/${firstAnimId}.json`;
    const animData = JSON.parse(await zip.file(animPath).async("string"));
    // Inline images to avoid extra requests
    if (animData.assets) {
      for (let asset of animData.assets) {
        if (asset.p) {
          const imgFile = zip.file(`images/${asset.p}`);
          if (imgFile) {
            const b64 = await imgFile.async("base64");
            asset.u = `data:image/${asset.p.split('.').pop()};base64,`;
            asset.p = b64;
          }
        }
      }
    }
    self.postMessage({ animData });
  } catch (err) {
    self.postMessage({ error: err.message });
  }
};
