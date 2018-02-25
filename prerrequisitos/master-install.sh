#!/bin/sh
# ----------------------------------------------------------------------
# Este Script instala todos los paquetes necesarios para trabajar
# ----------------------------------------------------------------------

# Actualiza
apt-get update

# Instala NodeJS el manejador de paquetes NPM
apt-get install -y nodejs
apt-get install -y npm

# Instala GIT
apt-get install -y git

# Instala Docker
apt-get install -y docker.io
systemctl enable docker.service

# Instala Kubernetes
swapoff -a
apt-get update && apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF

apt-get update
apt-get install -y kubelet kubeadm kubectl kubernetes-cni