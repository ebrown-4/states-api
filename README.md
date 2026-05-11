# States API – Final Project

This project is a Node.js and Express REST API that provides information about all 50 U.S. states.  
It includes full CRUD functionality for state fun facts stored in MongoDB, along with multiple GET endpoints for state data, filtering, and individual state properties.

---

## Features

### ✔ State Data Endpoints
- `GET /states` – Returns all 50 states with merged fun facts  
- `GET /states?contig=true` – Returns the 48 contiguous states  
- `GET /states?contig=false` – Returns Alaska and Hawaii  
- `GET /states/:state` – Returns full data for a single state  
- `GET /states/:state/capital` – Returns the state capital  
- `GET /states/:state/nickname` – Returns the state nickname  
- `GET /states/:state/population` – Returns the state population  
- `GET /states/:state/admission` – Returns the admission date  

### ✔ Fun Facts (MongoDB CRUD)
- `POST /states/:state/funfact` – Add fun facts  
- `GET /states/:state/funfact` – Get all fun facts for a state  
- `PATCH /states/:state/funfact` – Update a fun fact by index  
- `DELETE /states/:state/funfact` – Delete a fun fact by index  

---

## Technologies Used
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- REST API architecture  

---

## Project Structure
/controllers
/routes
/middleware
/model
/config
server.js
package.json
README.md

---

## How to Run the Project

1. Install dependencies:
npm install
2. Start the server:
npm start
3. The API runs at:
http://localhost:3600

---

## Notes
- State data is loaded from a static JSON file.
- Fun facts are stored in MongoDB and merged into responses when available.
- All endpoints follow RESTful design and meet the project rubric requirements.
