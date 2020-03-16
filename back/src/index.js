const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./config');
const controllers = require('./controllers');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

async function start() {
    try {
        await mongoose.connect(
            config.mongoURI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            });

        app.post('/login', controllers.login);
        app.get('/get-all-users', controllers.getAllUsers);
        app.get('/change-relations', controllers.changeRelations);

        app.listen(config.port, () => {
            console.log('Server started');
        });
    }

    catch (e) {
        console.log('Something wrong happened');
    }
}

start();
