const expect = require('chai').expect;
const sinon = require('sinon');

const jwt = require('jsonwebtoken');
const authMiddleWare = require('../middleware/auth');


describe('Auth middleware', () => {
    it('should set request auth to false if no auth header is present', () => {
        let req = {
            get: function(headerName) {
                return null
            }
        };
    
        authMiddleWare(req, {}, () => {});
    
        expect(req.isAuth).to.be.false;
    });
    
    it('should set request auth to false if the auth header is one string', () => {
        let req = {
            get: function(headerName) {
                return 'Bearer'
            }
        };
    
        authMiddleWare(req, {}, () => {});
    
        expect(req.isAuth).to.be.false;
    });

    it('should add userId property to the request', () => {
        let req = {
            get: function(headerName) {
                return 'Bearer xyz'
            }
        };

        sinon.stub(jwt, 'verify');
        jwt.verify.returns({userId: 'abc'});

        authMiddleWare(req, {}, () => {});
    
        expect(req.isAuth).to.be.true;
        expect(req).to.have.property('userId', 'abc');
        
        jwt.verify.restore();
    });

    it('should set request auth to false if the token is invalid', () => {
        let req = {
            get: function(headerName) {
                return 'Bearer xyz'
            }
        };
    
        authMiddleWare(req, {}, () => {});
    
        expect(req.isAuth).to.be.false;
        expect(req).not.to.have.property('userId');
    });
});
