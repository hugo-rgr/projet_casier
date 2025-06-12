import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },
    locker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Locker',
        required: [true, 'Locker reference is required']
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1 day']
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Price cannot be negative']
    },
    paymentStatus: {
        type: String,
        enum: {
            values: ['pending', 'paid', 'failed', 'expired'],
            message: '{VALUE} is not a valid payment status'
        },
        default: 'pending'
    },
    paymentId: {
        type: String
    },
    emailSent: {
        type: Boolean,
        default: false
    },
    reminderSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


export default mongoose.model('Reservation', ReservationSchema);
