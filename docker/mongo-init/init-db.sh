#!/bin/bash
# MongoDB initialization script

echo "Creating database and user for product management..."

mongosh <<EOF
use admin
db.createUser({
  user: 'root',
  pwd: 'password123',
  roles: [
    {
      role: 'readWrite',
      db: 'product_management'
    }
  ]
});

use product_management
db.createCollection('users');
db.createCollection('products');

echo "MongoDB initialization completed"
EOF
