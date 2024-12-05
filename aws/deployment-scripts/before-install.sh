echo "Removing GreenRoom API executable..."
sudo rm -rf /var/www/*

echo "Removing GreenRoom API linux service..."
sudo rm -rf /etc/systemd/system/greenroom-api.service