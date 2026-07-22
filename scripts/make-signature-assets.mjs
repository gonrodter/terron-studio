import sharp from "sharp";

function backgroundAlpha(red, green, blue) {
  const min = Math.min(red, green, blue);
  const max = Math.max(red, green, blue);
  const spread = max - min;

  if (min > 248 && spread < 10) return 0;
  if (min > 220 && spread < 22) {
    return Math.round(((248 - min) / 28) * 255);
  }

  return 255;
}

const image = sharp("assets/signature-source.png").ensureAlpha();
const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

for (let index = 0; index < data.length; index += info.channels) {
  data[index + 3] = backgroundAlpha(data[index], data[index + 1], data[index + 2]);
}

const signature = sharp(data, {
  raw: {
    width: info.width,
    height: info.height,
    channels: info.channels,
  },
})
  .trim({ threshold: 1 })
  .png();

await signature.toFile("assets/signature.png");
