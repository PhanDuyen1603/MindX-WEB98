import { writeFileSync } from 'fs';
import { users, orders, products } from '../../../LyThuyet/SS03/server/data.js';

const db = {
    users,
    orders,
    products
};

writeFileSync('./db.json', JSON.stringify(db, null, 2));
console.log('Seeded db.json successfully');
