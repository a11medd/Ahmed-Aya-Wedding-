const sharp = require('sharp');

async function buildAssets() {
  const W = 768;
  const H = 1376;

  // 1. LEFT FLAP (Front)
  const leftFlapMaskSvg = Buffer.from(`
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 0,22 396,688 0,1352 0,${H}" fill="#fff" />
    </svg>
  `);
  await sharp('src/assets/burgundy-envelope.jpg')
    .ensureAlpha()
    .composite([{ input: leftFlapMaskSvg, top: 0, left: 0, blend: 'dest-in' }])
    .png()
    .toFile('src/assets/envelope-left-flap.png');
  console.log('1. Created envelope-left-flap.png');

  // 2. LEFT FLAP (Back) - Burgundy interior with flap shape
  await sharp('src/assets/burgundy-interior.jpg')
    .resize(W, H, { fit: 'cover' })
    .ensureAlpha()
    .composite([{ input: leftFlapMaskSvg, top: 0, left: 0, blend: 'dest-in' }])
    .png()
    .toFile('src/assets/envelope-left-flap-back.png');
  console.log('2. Created envelope-left-flap-back.png');

  // 3. RIGHT FLAP (Front)
  const rightFlapMaskSvg = Buffer.from(`
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <path d="M ${W},0 L ${W},45 L 403,618 Q 387,688 403,758 L ${W},1332 L ${W},${H} Z" fill="#fff" />
    </svg>
  `);
  await sharp('src/assets/burgundy-envelope.jpg')
    .ensureAlpha()
    .composite([{ input: rightFlapMaskSvg, top: 0, left: 0, blend: 'dest-in' }])
    .png()
    .toFile('src/assets/envelope-right-flap.png');
  console.log('3. Created envelope-right-flap.png');

  // 4. RIGHT FLAP (Back)
  await sharp('src/assets/burgundy-interior.jpg')
    .resize(W, H, { fit: 'cover' })
    .ensureAlpha()
    .composite([{ input: rightFlapMaskSvg, top: 0, left: 0, blend: 'dest-in' }])
    .png()
    .toFile('src/assets/envelope-right-flap-back.png');
  console.log('4. Created envelope-right-flap-back.png');

  // 5. ENVELOPE BACK (Interior in center + exposed florals at top & bottom)
  // Center polygon slightly inset so exposed florals remain crisp
  const centerMaskSvg = Buffer.from(`
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,50 380,688 0,1320" fill="#fff" filter="blur(8px)" />
      <polygon points="${W},70 410,688 ${W},1300" fill="#fff" filter="blur(8px)" />
    </svg>
  `);
  
  // Composite interior over center of original envelope
  const interiorResized = await sharp('src/assets/burgundy-interior.jpg')
    .resize(W, H, { fit: 'cover' })
    .ensureAlpha()
    .composite([{ input: centerMaskSvg, top: 0, left: 0, blend: 'dest-in' }])
    .toBuffer();

  await sharp('src/assets/burgundy-envelope.jpg')
    .composite([{ input: interiorResized, top: 0, left: 0, blend: 'over' }])
    .jpeg({ quality: 95 })
    .toFile('src/assets/envelope-back.jpg');
  console.log('5. Created envelope-back.jpg');
}

buildAssets().catch(console.error);
