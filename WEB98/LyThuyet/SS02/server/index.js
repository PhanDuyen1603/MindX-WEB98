import express from 'express';
import { users } from './data.js';

const app = express();
app.use(express.json()); 

app.get('/', (req, res) => {
    const queryParams = req.query;
    res.send(queryParams);
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id == id);
    res.send(user);
});

app.post('/users', (req, res) => {
    const body = req.body;
    users.push(body);
    res.send(users);
});

app.listen(8080, () => console.log('Server is running on port 8080'));