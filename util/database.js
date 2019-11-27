const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = callback => {
  MongoClient.connect(
    // by default test as database name you could find in the URL
    'mongodb+srv://guna:0987654321@nodemongo-jwgkk.mongodb.net/test?retryWrites=true&w=majority',{ useUnifiedTopology: true }
  )
    .then(client => {
      console.log('Connected!');
      //here we could override database name...
      //_db = client.db('test');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if(_db){
    return _db;
  }
  throw "No DB connection found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
