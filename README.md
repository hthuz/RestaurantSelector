# Robost Restaurant Selection System

A full-stack database management system for restaurants in Chicago.

This is database project for CS411 course Database Systems at UIUC. It contains hundreds of thousands of information about restaurants, menus, reviews, reviewers etc. 

## Features  

- Basic CRUD
- Advanced Query
- Food and Restaurant Classification
- Comparsion of Query Results
- Administrator and User Permission Management

## Guidance

See `doc` to see the design description of the project. A demo video of our website can be found [here](https://drive.google.com/file/d/1SHgYFu54AnvDJCT5E6_IvjZFELPrKB3O/view?usp=share_link).

Data for the project is from Google Map and Yelp. Raw data and data manipulation code is in `src`. One can have a preview of what it looks like but be careful with running the code. They are not stable and quite system-specific. See `googlemap.ipynb` to setup up the database.

Make sure you have `nodejs` installed. After you have your database set up, fill in the databse information in `server.js` and run the following to install dependency:

```bash
npm init  
npm install mysql2  
npm install express  
npm install -g express-generator  
npm express --view=ejs  
npm install  
npm install body-parser  
npm install path  
```

To start the website, run `node server.js` and go to the website based on the ip address(`localhost` or other) and port (`80` default) from your browser.

## Notice

Please follow **Academic Integrity** policy on UIUC. For more information, refer to https://provost.illinois.edu/policies/policies/academic-integrity/ and https://cs.illinois.edu/academics/courses/cs411.
