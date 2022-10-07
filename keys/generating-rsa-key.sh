echo "Generating RSA key pair"
openssl genrsa -out jwtRS256.pem 2048
openssl rsa -in jwtRS256.pem -pubout -out jwtRS256.pub.pem
echo "Done"
