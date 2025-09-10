import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [logs, setLogs] = useState([]);
  const [viewLogs, setViewLogs] = useState(false);

  const handleSend = async () => {
    if (!to || !subject || !body) return alert("Fill all fields!");
    try {
      const res = await axios.post(`${API_BASE_URL}/send`, { to, subject, body });
      alert(res.data.message);
      setTo(""); setSubject(""); setBody("");
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/logs/mongo`);
      setLogs(Array.isArray(res.data) ? res.data : res.data.logs || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (viewLogs) fetchLogs();
  }, [viewLogs]);

  return (
    <div className="container">
      <h1>📧 Email Sender</h1>

      <div className="form-group">
        <input
          type="email"
          placeholder="To Email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="form-group">
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
      </div>
      <button className="send-btn" onClick={handleSend}>Send Email</button>

      <button className="toggle-btn" onClick={() => setViewLogs(!viewLogs)}>
        {viewLogs ? "Hide Logs" : "View Logs"}
      </button>

      {viewLogs && (
        <div style={{ overflowX: "auto", marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>To</th>
                <th>Subject</th>
                <th>Body</th>
                <th>Status</th>
                <th>Delivered</th>
                <th>Error</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {logs
                .filter(
                  (log) =>
                    new Date(log.createdAt) >
                    new Date(Date.now() - 100 * 24 * 60 * 60 * 1000)
                )
                .map((log) => (
                  <tr key={log._id}>
                    <td>{log.toEmail}</td>
                    <td>{log.subject}</td>
                    <td>{log.body}</td>
                    <td>{log.status}</td>
                    <td style={{ textAlign: "center" }}>{log.delivered ? "✅" : "❌"}</td>
                    <td>{log.errorText}</td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
