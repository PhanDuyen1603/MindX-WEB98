import mongoose from 'mongoose';
const customerSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    apiKey: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        required: true
    },
}, {
    collection: 'customer'
});
export default mongoose.model('Customer', customerSchema);