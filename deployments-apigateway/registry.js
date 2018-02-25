var requestify     = require("requestify");

const apiGatewayUrl = "http://172.31.9.84:31602/apps"; //direcciOn IP y el puerto donde se estA ejecutando el servicio del apigateway
console.log("Registering microservice of insumos " + apiGatewayUrl);
requestify.request(apiGatewayUrl, {
    method: "POST",
    body: {
        "appName": "microsvinsumos",
        "hostName": "172.31.9.84", //direcciOn ip del worker deon se estA ejecutando el microservicio
        "port": 30385, //puerto por el que el servicio balanceador de carga de la aplicaciOn microservicio1 está escuchando
        "service": "/microsvinsumos",
        "method": "GET"
    },
    headers: {
        'Content-Type': 'application/json'
    }
}).then(function (response) {
    console.log("Service registered successfully to " + apiGatewayUrl);
}).fail(function (response) {
    console.log("Fail register to " + apiGatewayUrl + " " + response);
});
