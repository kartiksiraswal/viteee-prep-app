// =============================
// 🎮 BACKEND: STREAK + XP SYSTEM
// =============================

/*
// Update on test submit
app.post("/submit", auth, async (req, res) => {
  const user = await User.findById(req.userId);

  const today = new Date().toDateString();

  // STREAK LOGIC
  if (user.lastActive === today) {
    // same day, no change
  } else {
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (user.lastActive === yesterday) {
      user.streak += 1;
    } else {
      user.streak = 1;
    }
  }

  user.lastActive = today;

  // XP LOGIC
  const score = req.body.score;
  user.xp += Math.floor(score * 10); // 1 mark = 10 XP

  await user.save();

  res.json({ message: "Updated XP & streak" });
});

// Fetch gamification data
app.get("/gamification", async (req, res) => {
  const users = await User.find().select("name xp streak");
  res.json(users);
});
*/
