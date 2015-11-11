# bookstaff
A interface for Simplified-to-Traditonal Chinese conversion, for professional editors, oriented towards high accuracy with Human checking.

# How to run

## Install Node.js 0.12

```
nvm install 0.12
nvm use 0.12
npm install
```

## Run frontend
```
cd frontend
grunt build
grunt serve
```
Visit localhost:9090.

## Run backend
Map port 80 to 8080.
```
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
```
Start 'bookstaff-backend.js'.
```
cd backend
pm2 start bookstaff-backend.js
```

# Acknowledgements
This project uses OpenCC as conversion engine by default.
The data about multiple-mapping between Simplified and Traditional Chinese characters were copied from [http://ytenx.org/byohlyuk/KienxPyan](http://ytenx.org/byohlyuk/KienxPyan).
