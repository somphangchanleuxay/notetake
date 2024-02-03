const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const util = require('util');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// API routes
app.get('/api/notes', (req, res) => {
    // Read the notes from the db.json file and send them as a response
    const readFromFile = util.promisify(fs.readFile)
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
});

app.post('/api/notes', (req, res) => {
    // Receive a new note, save it to the db.json file, and send it as a response
    const newNote = req.body;
    newNote.id = uuidv4(); // Assign a unique id using uuid package
    
    // Read existing notes from the db.json file
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));
    
    // Add the new note to the existing notes array
    notes.push(newNote);
    
    // Write the updated notes back to the db.json file
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2), 'utf8');
    
    // Send the new note as a response
    res.json(newNote);
});

// HTML routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});