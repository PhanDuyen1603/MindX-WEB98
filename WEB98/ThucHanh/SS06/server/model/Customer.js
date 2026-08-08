import mongoose from 'mongoose';
const customerSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
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
    }
}, {
    collection: 'customer'
});
export default mongoose.model('Customer', customerSchema);