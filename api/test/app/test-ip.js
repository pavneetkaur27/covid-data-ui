const assert = require('assert');
const chai = require('chai');
const ip = require("ip");

const ipv4_reg = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const expect = chai.expect;
const localip = ip.address();

describe('Testing local ip validation', function() {
    it('Validate local ipv4 with ipv4 regax', function(done) {
        if(!localip){
            return done("Local ip not predicted");
        }
        var ipv4_status = ipv4_reg.test(localip);
        expect(ipv4_status).to.be.equal(true);
        if(ipv4_status==true){
            done();
        }else{
            done("Local ipv4 is invalid");
        }
    });
});