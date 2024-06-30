const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../src/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
