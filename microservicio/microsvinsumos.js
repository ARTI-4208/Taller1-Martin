var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var methodOverride = require("method-override"),
var amqp           = require('amqplib/callback_api');

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

var oApp = express();
oApp.use(bodyParser.json());
oApp.use(bodyParser.urlencoded({ extended: true }));
var oMyConnection = mysql.createConnection({
   host: process.env.DATABASE_HOST || '127.0.0.1',
   user: 'root',
   password: '123',
   database: 'insumos',
   port: 3306
});

oApp.get('/microsvinsumos/insumos', function(oReq, oRes) {
   var sSQLGetAll = "SELECT * FROM insumos.insumo";
   oMyConnection.query(sSQLGetAll, function(oError, oRows, oCols) {
     if(oError) {
       oRes.write(JSON.stringify({
         error: true,
         error_object: oError
       }));
       oRes.end();
     } else {
       oRes.write(JSON.stringify(oRows));
	   
			amqp.connect('amqp://test:test@' + process.env.API_QUEUE + ':5672', function(err, conn) {
				conn.createChannel(function(err, ch) {
					var q = 'test';
					ch.assertQueue(q, {durable: false});
					ch.sendToQueue(q, new Buffer(JSON.stringify()));//req.params.message
					console.log(" [x] Sent " + oRows);//req.params.message
					oRes.send({
						version: 1,
						mensaje: "Microservice sent: " + oRows,
						success: true
					});
				});
			});
			
       oRes.end();
     }
   });
});

function CreateInsumo(oDataInsumo, oResponse) {
  var sSQLCreate = "INSERT INTO insumos.insumo (insumo_id, tipo, proveedor, cantidad, costo_unidad, fecha_in_inventario) VALUES (NULL, ";
  sSQLCreate += "'" + oDataInsumo.tipo + "', ";
  sSQLCreate += "'" + oDataInsumo.proveedor + "', ";
  sSQLCreate += "'" + oDataInsumo.cantidad + "', ";
  sSQLCreate += "'" + oDataInsumo.costo_unidad + "', ";
  sSQLCreate += "NOW())";

  oMyConnection.query(sSQLCreate, function(oError, oRows, oCols) {
    if(oError) {
      oResponse.write(JSON.stringify({
        error: true,
        error_object: oError
      }));
      oResponse.end();
    } else {
      var iIDCreated = oRows.insertId;
      oResponse.write(JSON.stringify({
        error: false,
        idCreated: iIDCreated
      }));
      oResponse.end();
    }
  });
}

function ReadInsumo(oResponse) {
  var sSQLRead = "SELECT * FROM insumos.insumo";
  oMyConnection.query(sSQLRead, function(oError, oRows, oCols) {
    if(oError) {
      oResponse.write(JSON.stringify({
        error: true,
        error_object: oError
      }));
      oResponse.end();
    } else {
      oResponse.write(JSON.stringify({
        error: false,
        data: oRows
      }));
      oResponse.end();
    }
  });
}
function UpdateInsumo(oDataInsumo, oResponse) {
  var sSQLUpdate = "UPDATE insumos.insumo SET last_updated = NOW() ";
  if(oDataInsumo.hasOwnProperty('tipo')) {
    sSQLUpdate += " AND tipo = '" + oDataInsumo.tipo + "' ";
  }
  if(oDataInsumo.hasOwnProperty('proveedor')) {
    sSQLUpdate += " AND proveedor = '" + oDataInsumo.proveedor + "' ";
  }
  if(oDataInsumo.hasOwnProperty('cantidad')) {
    sSQLUpdate += " AND cantidad = '" + oDataInsumo.cantidad + "' ";
  }
  if(oDataInsumo.hasOwnProperty('costo_unidad')) {
    sSQLUpdate += " AND costo_unidad = '" + oDataInsumo.costo_unidad + "' ";
  }
  sSQLUpdate = " WHERE insumo_id = '" + oDataInsumo.insumo_id + "'";

  oMyConnection.query(sSQLUpdate, function(oErrUpdate, oRowsUpdate, oColsUpdate) {
    if(oErrUpdate) {
      oResponse.write(JSON.stringify({
        error: true,
        error_object: oErrUpdate
      }));
      oResponse.end();
    } else {
      oResponse.write(JSON.stringify({
        error: false
      }));
      oResponse.end();
    }
  });
}
function DeleteInsumo(oDataInsumo, oResponse) {
  var sSQLDelete = "DELETE FROM insumos.insumo WHERE insumo_id = '" + oDataInsumo.insumo_id + "'";
  oMyConnection.query(sSQLDelete, function(oErrDelete, oRowsDelete, oColsDelete) {
    if(oErrDelete) {
      oResponse.write(JSON.stringify({
        error: true,
        error_object: oErrDelete
      }));
      oResponse.end();
    } else {
      oResponse.write(JSON.stringify({
        error: false
      }));
      oResponse.end();
    }
  });
}

 oApp.post('/microsvinsumos', function(oReq, oRes) {
   var oDataOP = {};
   var sOP = '';

   oDataOP = oReq.body.data_op;
   sOP = oReq.body.op;

   switch(sOP) {

     case 'CREATE':
      CreateInsumo(oDataOP, oRes);
     break;

     case 'READ':
      ReadInsumo(oRes);
     break;

     case 'UPDATE':
      UpdateInsumo(oDataOP, oRes);
     break;

     case 'DELETE':
      DeleteInsumo(oDataOP, oRes);
     break;

     default:
      oRes.write(JSON.stringify({
        error: true,
        error_message: 'Debes proveer una operación a realizar'
      }));
      oRes.end();
     break;

   }
 });

 oApp.listen(3069, function(oReq, oRes) {
   console.log("Servicios web gestión entidad Insumos, en puerto 3069");
 });
