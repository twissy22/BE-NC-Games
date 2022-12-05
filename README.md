link to hosted version - https://magnificent-hospital-gown-duck.cyclic.app/api

This project is a set of api endpoints for a SQL database relating to board game reviews with tables for reviews, users, comments and categories. These endpoints can get various information from the database and can also post, patch and delete. For a full list of endpoints please see the endpoints.json file. 

To clone the project click Code on github and them copy the url from HTTPS and write the command git clone <"copied url">

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

Minimum version of Node.js is 18.9.0 and Postgres 8.7.3
