import sharp from "sharp";
import fs from "fs-extra";
import path from "path";

const ROOTS = [path.resolve("public/images"), path.resolve("src/assets")];

let originalBytes = 0;
let optimizedBytes = 0;

const IMAGE_TYPES = {
  hero: {
    folders: [
      "heroes",
      "institutional",
      "img-heros",
      "img-heros/img-hero-cursos",
    ],
    width: 1920,
    quality: 65,
  },
  cards: {
    folders: ["cards", "logos-cursos"],
    width: 800,
    quality: 75,
  },
  testimonials: {
    folders: ["testimonials", "img-comentarios"],
    width: 600,
    quality: 70,
  },
  og: {
    folders: ["og"],
    width: 1200,
    quality: 75,
  },
  logos: {
    folders: ["logos-marcas"],
    width: 600,
    quality: 75,
  },
};

const VALID_EXTENSIONS = [".png", ".jpg", ".jpeg"];

async function processImage(filePath, config) {
  const { width, quality } = config;

  const inputStat = await fs.stat(filePath);
  originalBytes += inputStat.size;

  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const outputPath = path.join(dir, `${baseName}.webp`);

  await sharp(filePath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath);

  const outputStat = await fs.stat(outputPath);
  optimizedBytes += outputStat.size;

  console.log(`✔ ${baseName} → ${(outputStat.size / 1024).toFixed(1)} KB`);
}

async function scanFolder(folderPath, config) {
  const exists = await fs.pathExists(folderPath);
  if (!exists) return;

  const files = await fs.readdir(folderPath);

  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await scanFolder(fullPath, config);
    } else if (VALID_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
      await processImage(fullPath, config);
    }
  }
}

function human(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function run() {
  console.log("🚀 Iniciando optimización de imágenes\n");

  for (const type of Object.values(IMAGE_TYPES)) {
    for (const folder of type.folders) {
      for (const root of ROOTS) {
        const target = path.join(root, folder);
        if (await fs.pathExists(target)) {
          console.log(`📂 ${path.relative(process.cwd(), target)}`);
          await scanFolder(target, type);
        }
      }
    }
  }

  const saved = originalBytes - optimizedBytes;
  const percent =
    originalBytes > 0 ? ((saved / originalBytes) * 100).toFixed(1) : 0;

  console.log("\n📊 RESUMEN FINAL");
  console.log(`Original:   ${human(originalBytes)}`);
  console.log(`Optimizado: ${human(optimizedBytes)}`);
  console.log(`Ahorro:     ${human(saved)} (${percent}%)`);
}

run().catch(console.error);
