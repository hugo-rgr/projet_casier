import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: [true, 'First name is required'], minlength: 1, maxlength: 50, trim: true },
    lastname: { type: String, required: [true, 'Last name is required'], minlength: 1, maxlength: 50, trim: true },
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
    is_email_verified: {
        type: Boolean,
        default: false
    },
    email_verification_token: {
        type: String,
        default: null,
        required: false
    },
    email_verification_token_expires: {
        type: Date,
        default: null,
        required: false
    },
}, {
    timestamps: true // CreatedAt and updatedAt fields
});

const saltRounds = 12;

UserSchema.pre('save', async function(next) {
    if (this.password.length < 8 || this.password.length > 20) { //validation here to avoid validation after hashing
        const error = new Error('Password must be between 8-20 characters');
        return next(error);
    }

    // Hash password before saving if modified, else don't rehash every time while updating
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

UserSchema.methods.comparePassword = async function(candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Hide password in JSON responses
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

export default mongoose.model('users', UserSchema);
