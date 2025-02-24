const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const categoryRoutes = require("./routes/categoryRoutes.js");
const subCategoryRoutes = require("./routes/subCategoryRoutes.js");
const itemRoutes = require("./routes/itemRoutes.js");
const recommanded = require("./routes/Recommanded.routes.js");
const specailOffer = require("./routes/SpecailOffer.router.js")


const app = express();

const DB_URL = process.env.MONODB_URL
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/recommended" ,recommanded )
app.use("/api/specailoffer", specailOffer)
// MongoDB Connection
app.get("/", (req,res) => {
  res.send("Server is running!!!")
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
