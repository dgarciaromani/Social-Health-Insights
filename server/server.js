const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/ranks', routes.get_ranks);
app.get('/address/:street/:city/:state/:zip', routes.get_address);
app.get('/slider/*', routes.slider_search);
app.get('/states/:healthOutcome/:avgPrevalence/:percentage/:moreLess/:aboveBelow', routes.get_states);
app.get('/tract_page/:tract', routes.tract_search);
app.get('/radios/*', routes.get_percentile_groups);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
