#! /bin/bash
openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout nginx.key -out nginx.crt  -subj "//x=1/C=US/CN=AIBLOG"

openssl dhparam -out dhparam.pem 2048

rm -rf certificates
mkdir certificates
mv nginx.crt certificates/
mv nginx.key certificates/
mv dhparam.pem certificates/