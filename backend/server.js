const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🔥 Backend is working!");
});
<script src="https://platform.linkedin.com/badges/js/profile.js" async defer type="text/javascript"></script>
<div class="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="dark" data-type="VERTICAL" data-vanity="kartikpal2608" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/kartikpal2608?trk=profile-badge">Kartik Pal</a></div>
              
app.get("/test", (req, res) => {
  res.json({ message: "API test successful" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
