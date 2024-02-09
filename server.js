// importing express, fs for readfile and writefile, and path for get request /notes
const express = require('express');
const fs = require('fs');
const path = require('path');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');


// Specify on which port the Express.js server will run
const PORT = process.env.PORT || 3001;
//creating instance of express
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


//GET /notes should return the notes.html file
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//GET /api/notes should read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => { 
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
    res.json(JSON.parse(data))
    }
    })}
);

app.post('/api/notes', (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      
      //reading json data in order to update it with new note
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new review
          parsedNotes.push(newNote);
  
          // Write updated reviews back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
      
      //responds with new note
      res.json(newNote);
    } else {
      res.json('Error in posting note');
    }
});

//GET * should return the index.html file
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
