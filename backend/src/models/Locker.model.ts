import mongoose from 'mongoose';

const LockerSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: [true, 'Locker number is required'],
        unique: true
    },
    size: {
        type: String,
        enum: {
            values: ['small', 'medium', 'large'],
            message: '{VALUE} is not a valid size'
        },
        required: [true, 'Size is required']
    },
    status: {
        type: String,
        enum: {
            values: ['available', 'reserved', 'maintenance'],
            message: '{VALUE} is not a valid status'
        },
        default: 'available'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    }
}, {
    timestamps: true
});


export default mongoose.model('Locker', LockerSchema);
