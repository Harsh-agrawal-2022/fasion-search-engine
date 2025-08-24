import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js'; // Corrected path
import connectDB from '../config/db.js'; // Corrected path

dotenv.config();

// Connect to the database
connectDB();

/**
 * @description Imports product data from data/product.js into the database.
 * It first clears the existing products collection.
 */
const importData = async () => {
    try {
        // Dynamically import the products array from your JS file.
        // This requires your data/product.js file to use `export default products;`
        const productsModule = await import('../data/products.js'); // Corrected path
        const products = productsModule.default;

        // Clear existing data in the Product collection
        await Product.deleteMany();
        console.log('Previous data destroyed successfully!');

        // Insert the new data from our JS file
        await Product.insertMany(products);
        console.log('New data imported successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error during data import: ${error.message}`);
        process.exit(1);
    }
};

/**
 * @description Destroys all data in the products collection.
 */
const destroyData = async () => {
    try {
        await Product.deleteMany();
        console.log('All data destroyed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error during data destruction: ${error.message}`);
        process.exit(1);
    }
};

// This allows you to run the script with arguments from the command line.
// To import data, run: node seeder.js
// To destroy data, run: node seeder.js -d
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
