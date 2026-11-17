
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Reuse existing connection
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        // Reuse an ongoing connection attempt
        if (mongoose.connection.readyState === 2) {
            return mongoose.connection.asPromise();
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000
        });

        console.log(
            `MongoDB Connected successfully: ${conn.connection.host}`
        );

        return conn.connection;
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        throw error;
    }
};

export default connectDB;
