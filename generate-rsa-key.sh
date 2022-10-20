echo "*******************************************************"
echo "Generating RSA key pair"
echo "*******************************************************"

openssl genrsa -out jwtRS256.pem 2048
openssl rsa -in jwtRS256.pem -pubout -out jwtRS256.pub.pem

echo "*******************************************************"
echo "RSA key pair generated successfully"
echo "*******************************************************"