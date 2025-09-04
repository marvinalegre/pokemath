import { readdir, stat } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

const START = Number(process.argv[2]);
const END = Number(process.argv[3]);
validateArguments();

const iconsPath = join(process.cwd(), "_assets/icons");
const sugimoriPath = join(process.cwd(), "_assets/sugimori");
const iconsOutputPath = join(process.cwd(), "public/images/icons");
const sugimoriOutputPath = join(process.cwd(), "public/images/sugimori");
validateDirectories();

const icons = await readdir(iconsPath);
const sugimoris = await readdir(sugimoriPath);

for (
  let n = START;
  n < (process.argv[3] === undefined ? START : END) + 1;
  n++
) {
  if (!areBothFilesPresent(n)) continue;

  optimize(n);
}

//////////////////////////////
//////////////////////////////
//////////////////////////////
//////////////////////////////
//HELPER FUNCTIONS
//////////////////////////////
//////////////////////////////
//////////////////////////////
//////////////////////////////
function validateArguments() {
  if (process.argv[2] === undefined) {
    console.log("Provide at least one argument.");
    process.exit();
  }

  if (START === 0 || isNaN(START)) {
    console.log("Invalid argument/s. It must be 1 - 1134.");
    process.exit();
  }

  if (process.argv[3] !== undefined && isNaN(END)) {
    console.log("Invalid argument/s. It must be 1 - 1134.");
    process.exit();
  }
}

async function validateDirectories() {
  await stat(iconsPath);
  await stat(sugimoriPath);
  await stat(iconsOutputPath);
  await stat(sugimoriOutputPath);
}

function areBothFilesPresent(n) {
  if (
    !icons.includes(
      `pm0${n < 10 ? `00${n}` : n < 100 ? `0${n}` : n}_00_00_00_big.png`,
    )
  ) {
    return false;
  }
  if (!sugimoris.includes(`${n}.png`)) {
    return false;
  }
  return true;
}

function optimize(n) {
  try {
    sharp(join(sugimoriPath, `${n}.png`))
      .resize(400) // width in pixels
      .toFormat("avif", { quality: 50, effort: 9 })
      .toFile(join(sugimoriOutputPath, `${n}.avif`));
  } catch (e) {
    console.error(e.message);
  }

  try {
    sharp(
      join(
        iconsPath,
        `pm0${n < 10 ? `00${n}` : n < 100 ? `0${n}` : n}_00_00_00_big.png`,
      ),
    )
      .resize(200) // width in pixels
      .toFormat("avif", { quality: 50, effort: 9 })
      .toFile(join(iconsOutputPath, `${n}.avif`));
  } catch (e) {
    console.error(e.message);
  }
}
