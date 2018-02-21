var express        = require("express"),
    app            = express();
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
	amqp           = require('amqplib/callback_api');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(allowCrossDomain);

// API routers
var datos = express.Router();

//Service to send message
datos.get('/microservicio1/:message', function(req, res) {	
	amqp.connect('amqp://test:test@' + process.env.API_QUEUE + ':5672', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = 'test';
            ch.assertQueue(q, {durable: false});
            ch.sendToQueue(q, new Buffer(JSON.stringify(req.params.message)));
            console.log(" [x] Sent " + req.params.message);
            res.send({
				version: 1,
				mensaje: "Microservice sent: " + req.params.message,
				success: true
			});
        });
    });    
});

app.use('/', datos);
////////////////////

var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "insumos"
});

app.get("/consultar", consultar);
app.get("/insertar", insertar);
app.get("/actualizar", actualizar);
app.get("/borrar", borrar);

function consultar(peticion, resultado)
{
// Consulta a DB
                        con.connect(function(err) {
                                if (err) throw err;
                                con.query("SELECT * FROM insumos.insumo", function (err, result, fields) {
                                if (err) throw err;
                                console.log(result);
  resultado.send("<strong>"+console.log(result[0])+"</strong>");
                                });
                        });
}

function insertar(peticion, resultado)
{
// Insert en base de datos
                        con.connect(function(err) {
                          if (err) throw err;
                          console.log("Connected!");
                          var sql = "INSERT INTO insumos.insumo (tipo, proveedor, cantidad, costo_unidad, fecha_in_inventario) values ('bombilloLEDSmall', 'proveedorBombillos', 100, 200000, NOW())";
                          con.query(sql, function (err, result) {
                                if (err) throw err;
                                console.log("1 record inserted");
  resultado.send("Last insert ID" + result.insertId);
                          });
                        });
}

function actualizar(peticion, resultado)
{
// Update en DB
                        con.connect(function(err) {
                          if (err) throw err;
                          var sql = "UPDATE insumos.insumo SET cantidad = '999' WHERE tipo = 'bombilloLEDXL'";
                          con.query(sql, function (err, result) {
                                if (err) throw err;
                                console.log(result.affectedRows + " record(s) updated");
  resultado.send(result.affectedRows + " record(s) updated");
                          });
                        });
}

function borrar(peticion, resultado)
{
//EliminaciOn en la DB
                        con.connect(function(err) {
                          if (err) throw err;
                          var sql = "DELETE FROM insumos.insumo WHERE tipo = 'bombilloLEDSmall'";
                          con.query(sql, function (err, result) {
                                if (err) throw err;
                                console.log("Number of records deleted: " + result.affectedRows);
  resultado.send("Number of records deleted: " + result.affectedRows);
                          });
                        });
}

// Start Server
app.listen(3020, function(){
	console.log("Server running on http://localhost:3020");
});