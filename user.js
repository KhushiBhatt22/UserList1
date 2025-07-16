
// ############################################# //
// ##### Server Setup for UserList Management API #####
// ############################################# //

// Importing packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
// Define the port for the server to listen on
const port = process.env.PORT || 3000; // You can change this port

// Middleware setup
// Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(cors());
// Enable Express to parse JSON formatted request bodies
app.use(express.json());

// MongoDB connection string.
// This string is generated from the inputs provided in the UI.
mongoose.connect('mongodb+srv://users:123456789K@cluster0.qht7b6f.mongodb.net/UserList')
.then(() => {
    console.log('Connected to MongoDB');
    // Start the Express server only after successfully connecting to MongoDB
    app.listen(port, () => {
        console.log('UserList API Server is running on port ' + port);
    });
})
.catch((error) => {
    // Log any errors that occur during the MongoDB connection
    console.error('Error connecting to MongoDB:', error);
});


// ############################################# //
// ##### UserList Model Setup #####
// ############################################# //

// Define Mongoose Schema Class
const Schema = mongoose.Schema;

// Create a Schema object for the UserList model
// This schema defines the structure of userlist documents in the MongoDB collection.
const userlistSchema = new Schema({
    id: { type: Number, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true }
});

// Create a Mongoose model from the userlistSchema.
// This model provides an interface to interact with the 'userlists' collection in MongoDB.
// Mongoose automatically pluralizes "UserList" to "userlists" for the collection name.
const UserList = mongoose.model("UserList", userlistSchema);


// ############################################# //
// ##### UserList API Routes Setup #####
// ############################################# //

// Create an Express Router instance to handle userlist-related routes.
const router = express.Router();

// Mount the router middleware at the '/api/userlists' path.
// All routes defined on this router will be prefixed with '/api/userlists'.
app.use('/api/users', router);

// Route to get all userlists from the database.
// Handles GET requests to '/api/userlists/'.
router.route("/")
    .get((req, res) => {
        // Find all userlist documents in the 'userlists' collection.
        UserList.find()
            .then((userlists) => res.json(userlists)) // If successful, return userlists as JSON.
            .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
    });

// Route to get a specific userlist by its ID.
// Handles GET requests to '/api/userlists/:id'.
router.route("/:id")
    .get((req, res) => {
        // Find a userlist document by its ID from the request parameters.
        UserList.findById(req.params.id)
            .then((userlist) => res.json(userlist)) // If successful, return the userlist as JSON.
            .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
    });
    // Route to get user by custom ID (like 111)
router.route("/customid/:id")
.get((req, res) => {
    UserList.findOne({ id: parseInt(req.params.id) }) // Convert string to number
        .then((user) => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json("User not found");
            }
        })
        .catch((err) => res.status(400).json("Error: " + err));
});


// Route to add a new userlist to the database.
// Handles POST requests to '/api/userlists/add'.
router.route("/add")
    .post((req, res) => {
        // Extract attributes from the request body.
        const id = req.body.id;
        const email = req.body.email;
        const username = req.body.username;

        // Create a new UserList object using the extracted data.
        const newUserList = new UserList({
            id,
            email,
            username
        });

        // Save the new userlist document to the database.
        newUserList
            .save()
            .then(() => res.json("UserList added!")) // If successful, return success message.
            .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
    });

// Route to update an existing userlist by its ID.
// Handles PUT requests to '/api/userlists/update/:id'.
router.route("/update/:id")
    .put((req, res) => {
        // Find the userlist by ID.
        UserList.findById(req.params.id)
            .then((userlist) => {
                // Update the userlist's attributes with data from the request body.
                userlist.id = req.body.id;
                userlist.email = req.body.email;
                userlist.username = req.body.username;

                // Save the updated userlist document.
                userlist
                    .save()
                    .then(() => res.json("UserList updated!")) // If successful, return success message.
                    .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
            })
            .catch((err) => res.status(400).json("Error: " + err)); // If userlist not found or other error, return 400.
    });

// Route to delete a userlist by its ID.
// Handles DELETE requests to '/api/userlists/delete/:id'.
router.route("/delete/:id")
    .delete((req, res) => {
        // Find and delete the userlist document by ID.
        UserList.findByIdAndDelete(req.params.id)
            .then(() => res.json("UserList deleted.")) // If successful, return success message.
            .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
    });