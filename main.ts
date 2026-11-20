import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1048576;
const scriptDir = dirname(fileURLToPath(import.meta.url));
const inputFile = join(scriptDir, "entry.png");
const targetDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");
const targetFile = join(targetDir, "entry.png");

function failWith(reason) {
  throw new Error("entry delivery aborted: " + reason);
}

function detectKind(buf) {
  const pngHead = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (buf.length >= 8 && buf.subarray(0, 8).equals(pngHead)) {
    return "PNG";
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "JPEG";
  }
  return null;
}

function deliver() {
  if (!existsSync(inputFile)) {
    failWith("entry.png not found next to main.ts");
  }
  const info = statSync(inputFile);
  if (!info.isFile()) {
    failWith("entry.png exists but is not a regular file");
  }
  if (info.size === 0) {
    failWith("entry.png is zero bytes");
  }
  if (info.size > MAX_BYTES) {
    failWith("entry.png exceeds the 1 MiB gate limit: " + info.size);
  }
  const data = readFileSync(inputFile);
  if (data.length !== info.size) {
    failWith("short read while loading entry.png");
  }
  const kind = detectKind(data);
  if (kind === null) {
    failWith("unrecognised image signature, expected PNG or JPEG");
  }
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(targetFile, data);
  const checkBack = readFileSync(targetFile);
  if (checkBack.length !== data.length) {
    failWith("written file size differs from source after copy");
  }
  if (!checkBack.equals(data)) {
    failWith("written file content differs from source after copy");
  }
  let rolling = 0;
  for (let offset = 0; offset < data.length; offset += 1) {
    rolling = (rolling * 31 + data[offset]) >>> 0;
  }
  const report = {
    from: inputFile,
    to: targetFile,
    kind: kind,
    size: data.length,
    checksum: rolling.toString(16).padStart(8, "0"),
    verified: true,
  };
  console.log(JSON.stringify(report, null, 2));
}

try {
  deliver();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
