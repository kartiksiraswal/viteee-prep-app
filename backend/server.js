const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🧠 Dummy users (temporary, no database)
let users = [
  {
    id: "1",
    name: "Kartik",
    xp: 0,
    streak: 0,
    lastActive: null
  }
];

// ✅ Basic route
app.get("/", (req, res) => {
  res.send("🔥 Backend is working!");
});

// 🎮 SUBMIT TEST (XP + STREAK)
app.post("/submit", (req, res) => {
  const { userId, score } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const today = new Date().toDateString();

  // 🔥 STREAK LOGIC
  if (user.lastActive === today) {
    // same day → no change
  } else {
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (user.lastActive === yesterday) {
      user.streak += 1;
    } else {
      user.streak = 1;
    }
  }

  user.lastActive = today;

  // ⭐ XP LOGIC
  user.xp += Math.floor(score * 10);

  res.json({
    message: "Updated XP & streak",
    user
  });
});

// 📊 GET GAMIFICATION DATA
app.get("/gamification", (req, res) => {
  res.json(users);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
