const express = require('express');
const app = express();
const PORT = 3001;

app.get('/healthz', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});