#!/bin/bash

# Fix permissions on root-owned directories
sudo chown -R abdullah:abdullah /home/abdullah/Projects/blacktrium-ecommerce/server/src/app/modules/productcategory/
sudo chown -R abdullah:abdullah /home/abdullah/Projects/blacktrium-ecommerce/server/src/app/schemas/productcategory/

# Copy new implementation files over the old empty ones
cp /home/abdullah/Projects/blacktrium-ecommerce/server/src/app/modules/productcategory_new/*.ts /home/abdullah/Projects/blacktrium-ecommerce/server/src/app/modules/productcategory/

# Remove temp directory
rm -rf /home/abdullah/Projects/blacktrium-ecommerce/server/src/app/modules/productcategory_new

echo "Permissions fixed and files moved successfully!"
