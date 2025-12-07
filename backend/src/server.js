const express = require("express");
const cors = require("cors");
const db = require("./models/model.js");     
const mechanicRoutes = require("./routes/mechanic.router.js");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/mechanics", mechanicRoutes);

const PORT = process.env.PORT || 3001;

// DB Sync (Auto create tables)
db.sequelize
  .sync()
  .then(() => console.log("✔ Database synced"))
  .catch((err) => console.log("Sync Error:", err));

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
