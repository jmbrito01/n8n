VERSION=1.2.4 

docker build -t jmbrito/bit-n8n:v$VERSION -f docker/images/n8n-custom/Dockerfile .  
docker tag jmbrito/bit-n8n:v$VERSION docker.io/jmbrito/bit-n8n:v$VERSION 
docker push docker.io/jmbrito/bit-n8n:v$VERSION