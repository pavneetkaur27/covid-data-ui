require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//new Schema
const testSchema = new Schema({
    name: { type: String, required: true }
});

//new collection
const Test = mongoose.model('Test', testSchema);
const mongoOption = {useNewUrlParser: true};
const TEST_CASE_STATUS = {};

describe('MongoDb database test', function() {
    before(function (done) {
        this.timeout(10000);
        var mongoConnectionString="mongodb://localhost:27017/shopping-test";
        mongoose.connect(mongoConnectionString,mongoOption);
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
            console.log('Yehh we are connected with mongodb');
            done();
        });
        db.on('disconnected', console.error.bind(console, 'Hell ! mongo connection is disconnected'));
    });

    beforeEach(function() {
        if(TEST_CASE_STATUS[this.currentTest.file]) {
            this.skip();
        }
    });

    afterEach(function() {
        if (this.currentTest.state === "failed") {
            TEST_CASE_STATUS[this.currentTest.file] = true;
        }
    });

    describe('Now lets database', function() {
        it('Connection able to save new entry in data base', function(done) {
            var testName = Test({
            name: 'Vomyo'
            });
            testName.save(done);
        });

        it('Test incorrect format save action in database', function(done) {
            var wrongInfoSave = Test({
                wrongInfo: 'Not Vomyo'
            });
            wrongInfoSave.save(err => {
                if(err) { return done(); }
                throw new Error('wrong entry is saved in database, connection failed');
            });
        });

        it('Test saved data exist in database', function(done) {
                Test.find({name: 'Vomyo'}, (err, name) => {
                    if(err) {throw err;}
                    if(name.length === 0) {throw new Error('Saved data not exist in database, test failed')}
                    done();
                });
            });
        });
    //At last it will drop the database
    after(function(done){
      mongoose.connection.db.dropDatabase(function(){
        mongoose.connection.close(done);
      });
    });
});