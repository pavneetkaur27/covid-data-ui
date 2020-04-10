const expect      = require('chai').expect;
const madge       = require('madge');

describe('Structure Test', function() {
    it('Circular Dependency', function() {
        return madge("./app.js").then((res) => {
            expect(res.circular()).eql([]);
        });
    });
});