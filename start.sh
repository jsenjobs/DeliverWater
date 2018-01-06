docker build -t jsenht/deliverwater:1.0.1 .
docker push jsenht/deliverwater:1.0.1
docker run -it -p 7082:7082 --network=deliver --link dbredis:dbredis --link dbmongo:dbmongo jsenht/deliverwater:1.0.1
docker run -d -p 7082:7082 --name deliverwater --network=deliver --link dbredis:dbredis --link dbmongo:dbmongo jsenht/deliverwater:1.0.1
