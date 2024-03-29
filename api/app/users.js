const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { nanoid } = require('nanoid');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const User = require('../models/User');
const config = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    },
});

const router = express.Router();
const upload = multer({storage});

router.post('/', upload.single('avatar'), async (req, res, next) => {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName,
        };

        if (req.file) {
            userData.avatar = req.file.filename
        }

        const user = new User(userData);
        user.generateToken();
        await user.save();

        res.send(user);
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(e);
        }

        next(e);
    }
});

router.post('/sessions', async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({error: 'Invalid email or password'});
        }

        const isMatch = await user.checkPassword(password);
        if (!isMatch) {
            return res.status(400).send({error: 'Invalid email or password'});
        }

        user.generateToken();
        await user.save();

        res.send(user);
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(e);
        }

        next(e);
    }
});

router.delete('/sessions', async (req, res, next) => {
   try {
       const token = req.get('Authorization');
       const message = {message: 'ok'};

       if (!token) return res.send(message);

       const user = await User.findOne({token});
       if (!user) return res.send(message);

       user.generateToken();
       await user.save();

       res.send(message);
   } catch(e) {
       next(e);
   }
});

router.post('/facebookLogin', async (req, res, next) => {
    try {
        const authToken = req.body.authToken;
        const accessToken = config.facebook.appId + '|' + config.facebook.appSecret;
        const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${authToken}&access_token=${accessToken}`;

        const response = await axios.get(debugTokenUrl);

        if (response.data.data.error) {
            return res.status(401).send({message: 'Facebook token incorrect'});
        }

        if (response.data.data.user_id !== req.body.id) {
            return res.status(401).send({message: 'Wrong user id'});
        }

        let user = await User.findOne({facebookId: req.body.id});
        if (!user) {
            const userData = {
                email: req.body.email,
                password: nanoid(),
                displayName: req.body.name,
                facebookId: req.body.id,
            };

            if (req.body.photoUrl) {
                const photo = await axios.get(req.body.photoUrl, { responseType: 'stream' });
                const photoName = nanoid() + '.jpg';

                const photoPath = path.resolve(config.uploadPath, photoName);
                photo.data.pipe(fs.createWriteStream(photoPath));

                userData['avatar'] = photoName;
            }

            user = new User(userData);

            user.generateToken();
            await user.save();
        }

        res.send(user);
    } catch(e) {
        next(e);
    }
});

router.post('/googleLogin', async (req, res, next) => {
    try {
        const authToken = req.body.authToken;
        const debugTokenUrl = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${authToken}`;

        const response = await axios.get(debugTokenUrl);

        if (response.data.error) {
            return res.status(401).send({message: 'Google token incorrect'});
        }

        if (response.data.user_id !== req.body.id) {
            return res.status(401).send({message: 'Wrong user id'});
        }

        let user = await User.findOne({googleId: req.body.id});
        if (!user) {
            const userData = {
                email: req.body.email,
                password: nanoid(),
                displayName: req.body.name,
                googleId: req.body.id,
            };

            if (req.body.photoUrl) {
                const photo = await axios.get(req.body.photoUrl, { responseType: 'stream' });
                const photoName = nanoid() + '.jpg';

                const photoPath = path.resolve(config.uploadPath, photoName);
                photo.data.pipe(fs.createWriteStream(photoPath));

                userData['avatar'] = photoName;
            }

            user = new User(userData);

            user.generateToken();
            await user.save();
        }

        res.send(user);
    } catch(e) {
        next(e);
    }
});

module.exports = router;

