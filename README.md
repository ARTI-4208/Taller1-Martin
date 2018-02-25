# Taller 1 - Martin Orjuela: Microservicio de insumos en ambiente de servidores externos

Bienvenido al desarrollo del taller de microservicios del curso de arquitecturas de nueva generación, efectuado por Martin Orjuela.

## Contexto
Este taller está enfocado en resolver mediante una Arquitectura de microservicios un caso de negocio del MarketPlace para LumenConcept.

## Pasos
A continuación, se indican los pasos y herramientas utilizadas en el desarrollo de uno de los microservicios:

* Configuración de 2 instancias EC2 en AWS, una tipo t2.small para la configuración del servidor master y otra tipo t2.micro para la configuración del servidor Queue Manager.
* Descargue el código de las aplicaciones que ejecutaremos por medio del comando:
```sh
git clone https://github.com/ARTI-4208/Taller1-Martin.git
```
* Es posible que solicite sus credenciales de github para empezar la descarga. Ubíquese en la carpeta del código y revise los archivos que encontrará allí. Revise todo el código para entender el funcionamiento.
    * docker-compose.yml: Este archivo es el que permite la creación de las imágenes y contenedoras de Docker. Se crean dos de estas: un servicio con la instancia de base de datos mysql del microservicio (insumos-db) y otro servicio con la aplicación en node.js (insumos-microservicio).
	* ./database: Archivos para la creación de la imagen y contenedor del servicio de base de datos mysql [Dockerfile, setup.sql, start.sh, stop.sh].
	* ./microservicio: Archivos para la creación de la imagen y contenedor del servicio en node.js [Dockerfile, microsvinsumos.js, package.json].
	* ./deployments: Archivos para el depliegue en kubernetes del microservicio [microsvinsumos-svc.yml].
	* ./deployments-apigateway: Archivos para el depliegue en kubernetes del API Gateway [api-gateway-svc.yml, package.json, registry.js].
	* ./prerrequisitos: Archivos para la instalación de Docker, Kubernetes, RabbitMQ [master-install.sh, queue-install.sh].
* Dentro de las instancias AWS se procede con la configuración inicial de prerrequisitos o instalación de software base, mediante las shells master-install.sh y queue-install.sh respectivamente. Estos procedimientos se encuentran en ./prerrequisitos.
* Todos los pasos a realizar se deben ejecutar con altos privilegios, así que desde el comienzo proceda con la instrucción:
```sh
sudo -s
```
* Consultar imágenes de Docker:
```sh
docker images
```
* Consultar contenedoras creadas:
```sh
docker ps -a 
docker ps
```
* Cree el nodo maestro ejecutando el siguiente comando.
```sh
kubeadm init --apiserver-advertise-address=172.31.9.84 
```
* Guarde el comando presentado como resultado de la anterior ejecución, dado que es el comando que debemos ejecutar en los otros nodos que deseemos unir a la red.
* El siguiente paso es configurar la red de los pods del cluster. Para ello ejecute los siguientes comandos uno a uno:
```sh
mkdir -p $HOME/.kube<
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
export KUBECONFIG=/etc/kubernetes/admin.conf
sysctl net.bridge.bridge-nf-call-iptables=1
export kubever=$(kubectl version | base64 | tr -d '\n')
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$kubever"
```
* Al digitar el siguiente comando debemos encontrar un listado de los nodos actualmente en la red, por el momento solo se presentará el nodo maestro.
```sh
kubectl get nodes
```
* Habilite la regla de Firewall en la máquina.
```sh
sysctl net.bridge.bridge-nf-call-iptables=1
```
* Debido a que es posible que durante la instalación el nodo definido como Worker presente problemas de comunicación y no permita el despliegue de contenedores, Para poder continuar con el taller en caso que este nodo no logre establecer comunicación, digite el siguiente comando en el nodo master, el cual habilita la ejecución de pods en el mismo nodo maestro.
```sh
#Comando opcional solo en caso que falle la conexión entre master y worker 
kubectl taint nodes --all node-role.kubernetes.io/master- 
```
* Verifique la instalación de RabbitMQ accediendo a la plataforma de administración de RabbitMQ por medio de su navegador, ingresando la dirección:
```sh
#Utilice la IP_RABBIT por la dirección IP de la máquina virtual.
http://172.31.3.25:15672
```



```sh
docker-compose build
docker-compose up
```



* Por medio del siguiente comando podrá observar cuales son los pods que se están ejecutando y en que nodo.
```sh
kubectl get pods --output=wide
#Para mayor detalle de los pods
kubectl describe pods
```
* También puede verificar que los 5 contenedores se están ejecutando digitando en la consola del worker el comando:
```sh
docker ps -a
```
Verifique que los despliegues se está ejecutando por medio del comando:
```sh
kubectl get deployments
```






## Hands On
El taller se encuentra publicado en la Wiki del siguiente repositorio:

[https://github.com/ARTI-4208/Taller-1/wiki](https://github.com/ARTI-4208/Taller-1/wiki)

## Referencias

* https://github.com/ARTI-4208/Taller-1/wiki
* https://github.com/sabusajin/mysql-nodejs-microservice
* http://www.dwmkerr.com/learn-docker-by-building-a-microservice/
* https://github.com/Osedea/nodock
* https://docs.docker.com/samples/library/mysql/
* https://github.com/docker-library
* http://www.aalmunia.net/blog/implementando-un-crud-con-node-js-y-mysql/
* https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app
* https://kubernetes.io/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/

