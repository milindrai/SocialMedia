const app = require('./app');
const { connectDatabase } = require('./config/database');

connectDatabase();

const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () => console.log('Listening on port '+ process.env.PORT));