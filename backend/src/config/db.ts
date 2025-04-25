import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        await mongoose.connect(uri);
        console.log('Connexion à la base de données réussie');
    } catch (error) {
        console.error('Erreur de connexion', error);
        process.exit(1);
    }
};

export default connectDB;
