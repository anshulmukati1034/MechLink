const express = require("express");
const cors = require("cors");
const db = require("./models/model.js");     
const mechanicRoutes = require("./routes/mechanic.router.js");
const categoryRoutes = require("./routes/category.router.js");
const mechanicProfileRoutes = require("./routes/mechanicProfile.router.js");
const userRoutes = require("./routes/user.router.js");

const app = express();
app.use(
  cors({
    origin: "*", 
    credentials: true,              
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/mechanic", mechanicProfileRoutes);

const PORT = process.env.PORT || 3001;

// DB Sync (Auto create tables)
db.sequelize
  .sync() 
  .then(() => console.log("✔ Database synced"))
  .catch((err) => console.log("Sync Error:", err));

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
