import http from 'http';
import { customers } from './data.js';
const PORT = 8080;

const server = http.createServer((request, response) => {

    //Bai 01

    // const path = request.url.split('?')[0];

    //    if (path === '/customers') {
    //     response.writeHead(200, { 'Content-Type': 'application/json' });
    //     response.end(JSON.stringify(customers));
    //     return;
    //    }

    //    response.writeHead(404, { 'Content-Type': 'application/json' });
    //    response.end(JSON.stringify({error: 'Not found'}));
    //    return;

    //Bai 02
    const path = request.url.split('?')[0];
    if (path.startsWith('/customers/')) {
        const id = path.slice('/customers/'.length);
        if (!id) {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Invalid request' }));
            return;
        }
        const customer = customers.find(customer => customer.id === id);
        if (!customer) {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Customer not found' }));
            return;
        }
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(customer));
        return;
    }

    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Not found' }));
    return;
});



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});