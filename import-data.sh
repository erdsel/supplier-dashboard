#!/bin/bash

echo "Importing data to MongoDB..."

mongoimport --db lonca_vendor_dashboard --collection vendors --drop --file ../vendors.json --jsonArray
mongoimport --db lonca_vendor_dashboard --collection parent_products --drop --file ../parent_products.json --jsonArray
mongoimport --db lonca_vendor_dashboard --collection orders --drop --file ../orders.json --jsonArray

echo "Data import completed!"