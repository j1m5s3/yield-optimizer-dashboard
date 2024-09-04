import { MongoClient } from "mongodb";

class MongoInterface extends MongoClient {
    /** 
     * MongoInterface - A class to interact with a MongoDB database
     * 
     * @param {string} db_name - The name of the database to connect to
    */

    db_name; // Name of the database
    db; // Database object, initialized in connectDB()

    constructor(db_name) {
        super(import.meta.env.VITE_MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        this.db_name = db_name;
        this.db = this.db(db_name);
    }

    /**
     * connectDB - Connect to the MongoDB database
     * 
     * @returns {boolean} - True if the connection is successful, false otherwise
     */
    async connectDB() {
        try {
            await this.connect();
            console.log("Connected to MongoDB");

            this.db = this.db(this.db_name);
        } catch (error) {
            console.error("Error connecting to MongoDB");
            console.error(error);
            return false;
        }
    }

    /**
     * closeDB - Close the connection to the MongoDB database
     * 
     * @returns {boolean} - True if the connection is closed successfully, false otherwise
     */
    async closeDB() {
        try {
            await this.close();
            console.log("Closed connection to MongoDB");
        } catch (error) {
            console.error("Error closing connection to MongoDB");
            console.error(error);
            return false;
        }

        return true;
    }

    /**
     * insertOne - Insert a document into a collection
     * 
     * @param {string} collection - The name of the collection
     * @param {object} document - The document to insert
     * 
     * @returns {boolean} - True if the document is inserted successfully, false otherwise
     */
    async insertOne(collection, document) {
        try {
            await this.db.collection(collection).insertOne(document);
            console.log("Inserted document into collection");
        } catch (error) {
            console.error("Error inserting document into collection");
            console.error(error);
            return false;
        }

        return true;
    }

    /**
     * findOne - Find a document in a collection
     * 
     * @param {string} collection - The name of the collection
     * @param {object} query - The query to find the document
     * 
     * @returns {object} - The document if found, null otherwise
     */
    async findOne(collection, query) {
        try {
            const document = await this.db.collection(collection).findOne(query);
            console.log("Found document in collection");
        } catch (error) {
            console.error("Error finding document in collection");
            console.error(error);
            return null;
        }

        return document;
    }
}