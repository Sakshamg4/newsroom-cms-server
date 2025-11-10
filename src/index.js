require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');



const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('API running');
})

app.use('/api/auth', require('./routes/route.auth'));
app.use('/api/articles', require('./routes/route.articles'));
app.use('/api/users', require('./routes/route.user'));
app.use('/api/admin', require('./routes/route.admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on', process.env.BASE_URL));
