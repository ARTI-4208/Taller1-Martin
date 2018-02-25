#!/bin/sh
# ----------------------------------------------------------------------
# Este Script instala todos los paquetes necesarios para montar el servidor de colas
# ----------------------------------------------------------------------

#Rabbit
#Rabbitmq port by default is 5672
apt-get -y install rabbitmq-server
/usr/lib/rabbitmq/bin/rabbitmq-plugins enable rabbitmq_management
rabbitmqctl add_user test test
rabbitmqctl set_user_tags test administrator
rabbitmqctl set_permissions -p / test ".*" ".*" ".*"
rabbitmqctl delete_user guest
rabbitmqctl stop
invoke-rc.d rabbitmq-server stop
invoke-rc.d rabbitmq-server start