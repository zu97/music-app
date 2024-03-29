const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./config');
const artists = require('./app/artists');
const albums = require('./app/albums');
const tracks = require('./app/tracks');
const users = require('./app/users');
const trackHistory = require('./app/trackHistory');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/artists', artists);
app.use('/albums', albums);
app.use('/tracks', tracks);
app.use('/users', users);
app.use('/track_history', trackHistory);

const run = async () => {
    await mongoose.connect(config.mongoConfig.url, config.mongoConfig.options);

    app.listen(port, () => {
        console.log(`App started on ${port} port`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
}
run().catch((e) => console.error(e));
