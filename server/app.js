const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT;


app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Server is running REALLY REALLY FAST'
    });
});

app.listen(port, () => console.log('Active on port ' + port));
