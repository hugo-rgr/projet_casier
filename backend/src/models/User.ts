import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: [true, 'First name is required'] },
    lastname: { type: String, required: [true, 'Last name is required'] },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            'Please provide a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: '{VALUE} is not a valid role'
        },
        default: 'user',
        required: true
    },
}, {
    timestamps: true // CreatedAt and updatedAt fields
});

export default mongoose.model('users', UserSchema);