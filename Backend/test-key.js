const { GoogleGenerativeAI } = require('@google/generative-ai');
try {
    const genAI = new GoogleGenerativeAI(undefined);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    model.generateContent("hello").catch(console.log);
} catch(e) {
    console.log(e);
}
