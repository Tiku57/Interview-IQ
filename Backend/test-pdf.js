const fs = require('fs');
const pdfParse = require('pdf-parse');

async function run() {
    const buffer = fs.readFileSync('package.json'); // not a pdf, but just to test if the constructor throws
    try {
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(buffer))).getText()
        console.log(resumeContent);
    } catch(e) {
        console.error("Error:", e.message);
    }
}
run();
