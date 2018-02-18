var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
	Datastore      = require('mysql'),
    db             = new Datastore({filename: '/home/messages.db', autoload: true}),
	amqp           = require('amqplib/callback_api');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "insumos"
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(allowCrossDomain);

//Connect to queue message
amqp.connect('amqp://test:test@' + process.env.API_QUEUE + ':5672', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'test';
    ch.assertQueue(q, {durable: false});
    ch.consume(q, function(msg) {		
		//message 
        db.insert({
            "message":  msg.content.toString()
        });	  
    }, {noAck: true});
      
	console.log("Connection succesful");
 });
});

// API routers
var recurso = express.Router();
recurso.get('/microservinsumo2/consulta', function(req, res) {	
	db.find({}, function (err, docs) {
        res.send({
            // Consulta a DB
			con.connect(function(err) {
				if (err) throw err;
				con.query("SELECT * FROM insumos.insumo", function (err, result, fields) {
				if (err) throw err;
				console.log(result);
				});
			});
        });
    });
});
// API routers
var recurso = express.Router();
recurso.get('/microservinsumo2/insert', function(req, res) {	
	db.find({}, function (err, docs) {
        res.send({
			// Insert en base de datos
			con.connect(function(err) {
			  if (err) throw err;
			  console.log("Connected!");
			  var sql = "INSERT INTO insumos.insumo (tipo, proveedor, cantidad, costo_unidad, fecha_in_inventario) values ('bombilloLEDXL', 'proveedorBombillos', 100, 200000, '01/01/2018')";
			  con.query(sql, function (err, result) {
				if (err) throw err;
				console.log("1 record inserted");
			  });
			});
        });
    });
});
// API routers
var recurso = express.Router();
recurso.get('/microservinsumo2/actualiza', function(req, res) {	
	db.find({}, function (err, docs) {
        res.send({
			// Update en DB
			con.connect(function(err) {
			  if (err) throw err;
			  var sql = "UPDATE insumos.insumo SET cantidad = '999' WHERE tipo = 'bombilloLEDXL'";
			  con.query(sql, function (err, result) {
				if (err) throw err;
				console.log(result.affectedRows + " record(s) updated");
			  });
			});
        });
    });
});
// API routers
var recurso = express.Router();
recurso.get('/microservinsumo2/borra', function(req, res) {	
	db.find({}, function (err, docs) {
        res.send({
			//EliminaciOn en la DB
			con.connect(function(err) {
			  if (err) throw err;
			  var sql = "DELETE FROM insumos.insumo WHERE tipo = 'bombilloLEDXL'";
			  con.query(sql, function (err, result) {
				if (err) throw err;
				console.log("Number of records deleted: " + result.affectedRows);
			  });
			});
        });
    });
});

app.use('/', recurso);

// Start Server
app.listen(3022, function(){
	console.log("Server running on http://localhost:3020");
});
