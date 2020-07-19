const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const authController = require('../controllers/auth');
const mongoose = require('mongoose');
const {MONGODB_URI} = require('../config');

describe('Auth controller - Login', () => {

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

    it('should throw an error with code 500 if accesing the database fails', 
    (done) => {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: "test@test.com",
                password: "test123"
            }
        };

        authController.login(req, {}, () => {}).then(result => {
            expect(result).to.be.an('error')
            .and.to.have.property('statusCode', 500);
            done(); // To wait for async code
        })
        .catch(err => console.log(err));

        User.findOne.restore();
    });

    it('should send a response with a user status', (done) => {

        const req = {
            userId: "5c0f66b979af55031b34728a"
        };

        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.userStatus = data.status;
            }
        }

        authController.getUserStatus(req, res, () => {})
        .then(result => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new!');
            done();
        })
        .catch(err => console.log(err));

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