import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, BarChart, Bar, Tooltip, CartesianGrid } from "recharts";

const API = "https://your-backend-url.onrender.com";

export default function AdminPanel() {
  const [questions, setQuestions] = useState([]);
  const [file, setFile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);
  const [gamification, setGamification] = useState([]);

  const token = localStorage.getItem("token");

  const fetchAll = () => {
    fetch(`${API}/questions`).then(res => res.json()).then(setQuestions);
    fetch(`${API}/admin-analytics`, { headers: { Authorization: token } }).then(res => res.json()).then(setAnalytics);
    fetch(`${API}/leaderboard`).then(res => res.json()).then(setLeaderboard);
    fetch(`${API}/badges`).then(res => res.json()).then(setBadges);
    fetch(`${API}/gamification`).then(res => res.json()).then(setGamification);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Upload CSV first");
    const formData = new FormData();
    formData.append("file", file);

    await fetch(`${API}/upload-csv`, {
      method: "POST",
      headers: { Authorization: token },
      body: formData,
    });

    fetchAll();
  };

  const deleteQuestion = (id) => {
    fetch(`${API}/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    }).then(fetchAll);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">🚀 Admin Dashboard</h1>

        {/* 🎮 Gamification */}
        <Card className="mb-6 bg-gray-900 border border-gray-700">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-3">🎮 Gamification (XP + Streak)</h2>
            {gamification.map((u, i) => (
              <div key={i} className="flex justify-between border-b border-gray-700 py-2">
                <span>{u.name}</span>
                <span>🔥 {u.streak} days | ⭐ {u.xp} XP</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="mb-6 bg-gray-900 border border-gray-700">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-3">🏆 Leaderboard</h2>
            {leaderboard.map((user, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-700">
                <span>#{i + 1} {user.name}</span>
                <span className="font-semibold">{user.avgScore.toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[["Users", analytics.totalUsers],["Questions", analytics.totalQuestions],["Tests", analytics.totalAttempts],["Avg Score", analytics.avgScore?.toFixed(2)]].map(([label,val],i)=>(
              <Card key={i} className="bg-gray-900 border border-gray-700 hover:scale-105 transition">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400">{label}</p>
                  <h2 className="text-xl font-bold">{val}</h2>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Charts */}
        {analytics && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-gray-900 border border-gray-700">
              <CardContent>
                <h3 className="mb-3">📈 Score Trend</h3>
                <LineChart width={350} height={220} data={analytics.trend?.map((v,i)=>({name:`T${i+1}`,score:v}))}>
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="score" stroke="#00ffcc" />
                </LineChart>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border border-gray-700">
              <CardContent>
                <h3 className="mb-3">📊 Subject Accuracy</h3>
                <BarChart width={350} height={220} data={Object.entries(analytics.subjectAvg||{}).map(([k,v])=>({subject:k,value:v}))}>
                  <XAxis dataKey="subject" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar dataKey="value" fill="#4ade80" />
                </BarChart>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload */}
        <Card className="mb-6 bg-gray-900 border border-gray-700">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold">📂 Upload CSV</h2>
            <Input type="file" onChange={(e)=>setFile(e.target.files[0])} />
            <Button className="w-full" onClick={handleUpload}>Upload</Button>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card className="bg-gray-900 border border-gray-700">
          <CardContent className="p-4">
            <h2 className="mb-3">📚 Question Bank</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {questions.map(q=> (
                <div key={q._id} className="p-3 bg-gray-800 rounded-xl flex justify-between items-center">
                  <span className="text-sm">{q.question}</span>
                  <Button size="sm" variant="destructive" onClick={()=>deleteQuestion(q._id)}>Delete</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

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
