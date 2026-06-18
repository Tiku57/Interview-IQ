const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function run() {
  const form = new FormData();
  form.append('jobDescription', 'Software Engineer');
  form.append('selfDescription', 'I am a dev');
  // Create a dummy PDF
  fs.writeFileSync('dummy.pdf', '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n');
  form.append('resume', fs.createReadStream('dummy.pdf'));

  try {
    const res = await axios.post('http://localhost:3000/api/interview/', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMzNjNjJjZjY4YjhkNWZjMmU3OWI2YyIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3ODE3Nzc5NjUsImV4cCI6MTc4MTg2NDM2NX0.M7q8ZM2B77IiKuqvO85oLfhwGXiSpq2q3g8pN5GgJz0'
      }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
run();
