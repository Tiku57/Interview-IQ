const fs = require("fs");
const pdfParse = require("pdf-parse");

async function run() {
  try {
      const b = fs.readFileSync("package.json")
      console.log(await pdfParse(b));
  } catch(e) { console.log(e.message) }
}
run();
