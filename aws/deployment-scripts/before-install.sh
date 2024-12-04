echo "Removing GreenRoom API executable..."
rm -rf /var/www/*

echo "Removing GreenRoom API linux service..."
rm -rf /etc/systemd/system/greenroom-api.service