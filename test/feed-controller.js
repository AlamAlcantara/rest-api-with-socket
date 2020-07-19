const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const Post = require('../models/post');

const feedController = require('../controllers/feed');

const mongoose = require('mongoose');
const {MONGODB_URI} = require('../config');

describe('Feed Controller', () => {
    before((done) => {
        mongoose.connect(MONGODB_URI)
        .then(result => {
            console.log('CONNECTED TO THE DB');

            const user = new User({
                email: "test@test.com",
                password: "test123",
                name: "Test",
                posts: [],
                _id: "5c0f66b979af55031b34728a"
            });
            return user.save();
        })
        .then(user => { done(); })
        .catch(err => console.log(err));
    });

    it('should add a created post to the posts of the creator', (done) => {

        const req = {
            body: {
                title: "test post title",
                content: "test post content"
            },
            userId: "5c0f66b979af55031b34728a",
            file: {
                path: "test path"
            }
        };

        const res = {
            status: function(){return this; },
            json: function(){}
        }

        feedController.createPost(req, res, () => {})
        .then(savedUser => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        })
    });

    after((done) => {
        User.deleteMany({})
        .then(() => {
            return mongoose.disconnect();
        })
        .then(() => {
            done();
        })
        .catch(err => console.log(err));
    });
});
