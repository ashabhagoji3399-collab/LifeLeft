import { useEffect, useState } from "react";
import "./App.css";

const items = [
  {
    id: "steel",
    name: "Steel Bottle",
    emoji: "🥤",
    category: "Reusable Item",
    score: 95,
    confidence: 98,
    impact: "Low",
    action: "REUSE FIRST",
    points: 10,
    why: "Steel bottles are durable and designed for repeated use, so reusing them avoids unnecessary waste.",
    tip: "Clean and refill your bottle instead of replacing it frequently.",
    steps: [
      "Clean the bottle properly",
      "Continue using it regularly",
      "Replace it only when it is damaged"
    ]
  },
  {
    id: "plastic",
    name: "Plastic Bottle",
    emoji: "🧴",
    category: "Plastic Waste",
    score: 70,
    confidence: 94,
    impact: "Medium",
    action: "RECYCLE",
    points: 7,
    why: "Empty plastic bottles can often be recycled when they are separated correctly.",
    tip: "Empty and rinse the bottle before putting it with recyclable waste.",
    steps: [
      "Empty and rinse the bottle",
      "Separate it from wet waste",
      "Place it in the recyclable-waste stream"
    ]
  },
  {
    id: "can",
    name: "Metal Can",
    emoji: "🥫",
    category: "Metal Waste",
    score: 75,
    confidence: 96,
    impact: "Medium",
    action: "RECYCLE",
    points: 7,
    why: "Metal containers can be recovered and recycled instead of being sent directly to landfill.",
    tip: "Rinse the container and keep it separate from wet waste.",
    steps: [
      "Empty and rinse the can",
      "Keep it with dry recyclable waste",
      "Send it to a recycling collection point"
    ]
  },
  {
    id: "glass",
    name: "Glass Bottle",
    emoji: "🍾",
    category: "Glass Waste",
    score: 80,
    confidence: 95,
    impact: "Low",
    action: "RECYCLE",
    points: 7,
    why: "Glass can be recycled repeatedly when collected and processed correctly.",
    tip: "Handle broken glass carefully and keep it separate from regular waste.",
    steps: [
      "Empty the bottle",
      "Keep glass separate",
      "Send it to a suitable glass collection point"
    ]
  },
  {
    id: "paper",
    name: "Paper / Cardboard",
    emoji: "📦",
    category: "Paper Waste",
    score: 85,
    confidence: 97,
    impact: "Low",
    action: "RECYCLE",
    points: 7,
    why: "Clean paper and cardboard can commonly be reused or recycled.",
    tip: "Reuse boxes and paper before sending them for recycling.",
    steps: [
      "Check if it can be reused",
      "Keep it dry and clean",
      "Put it with paper recyclables"
    ]
  },
  {
    id: "food",
    name: "Food Waste",
    emoji: "🍎",
    category: "Organic Waste",
    score: 90,
    confidence: 93,
    impact: "Low",
    action: "COMPOST",
    points: 8,
    why: "Organic food waste can be converted into useful compost instead of being mixed with dry waste.",
    tip: "Separate food scraps from plastic and other dry waste.",
    steps: [
      "Separate food scraps",
      "Put them into a compost system",
      "Use the resulting compost for plants"
    ]
  },
  {
    id: "electronic",
    name: "Electronic Item",
    emoji: "💻",
    category: "E-Waste",
    score: 60,
    confidence: 91,
    impact: "High",
    action: "E-WASTE COLLECTION",
    points: 6,
    why: "Electronic products should be handled separately because they can contain materials that require specialised recycling.",
    tip: "Never mix electronic waste with normal household waste.",
    steps: [
      "Switch off and disconnect the item",
      "Keep it separately",
      "Give it to an authorised e-waste collection point"
    ]
  },
  {
    id: "clothing",
    name: "Clothing / Fabric",
    emoji: "👕",
    category: "Textile",
    score: 90,
    confidence: 96,
    impact: "Low",
    action: "REUSE / DONATE",
    points: 9,
    why: "Usable clothing can have a second life through reuse, repair or donation.",
    tip: "Repair or donate wearable clothes instead of throwing them away.",
    steps: [
      "Check whether it can be repaired",
      "Reuse or donate wearable clothing",
      "Recycle unusable fabric where available"
    ]
  }
];

const badges = [
  {
    id: "first",
    name: "First Step",
    icon: "🌱",
    description: "Complete your first scan",
    requirement: 1
  },
  {
    id: "explorer",
    name: "Eco Explorer",
    icon: "🌍",
    description: "Complete 5 scans",
    requirement: 5
  },
  {
    id: "champion",
    name: "Reuse Champion",
    icon: "♻️",
    description: "Reuse 3 items",
    requirement: 3
  },
  {
    id: "recycler",
    name: "Recycling Hero",
    icon: "🔄",
    description: "Recycle 5 items",
    requirement: 5
  }
];

function App() {
  const [page, setPage] = useState("home");
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [history, setHistory] = useState([]);

  const [videoStream, setVideoStream] = useState(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("lifeleft-history");

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lifeleft-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (page !== "scanner" || capturedImage) {
      return;
    }

    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        setVideoStream(stream);

        const video = document.getElementById("camera-video");

        if (video) {
          video.srcObject = stream;
        }
      } catch (error) {
        console.log("Camera error:", error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [page, capturedImage]);

  const captureImage = () => {
    const video = document.getElementById("camera-video");

    if (!video) return;

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    setCapturedImage(canvas.toDataURL("image/jpeg"));
  };

  const chooseItem = (item) => {
    setSelectedItem(item);

    const newEntry = {
      id: Date.now(),
      name: item.name,
      emoji: item.emoji,
      action: item.action,
      score: item.score,
      points: item.points,
      date: new Date().toLocaleString()
    };

    setHistory((previous) => [newEntry, ...previous]);
  };

  const resetScan = () => {
    setCapturedImage(null);
    setSelectedItem(null);
  };

  const goHome = () => {
    resetScan();

    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }

    setPage("home");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("lifeleft-history");
  };

  const totalScans = history.length;

  const averageScore =
    totalScans === 0
      ? 0
      : Math.round(
          history.reduce((sum, item) => sum + item.score, 0) /
            totalScans
        );

  const totalPoints = history.reduce(
    (sum, item) => sum + item.points,
    0
  );

  const reuseCount = history.filter(
    (item) =>
      item.action === "REUSE FIRST" ||
      item.action === "REUSE / DONATE"
  ).length;

  const recycleCount = history.filter(
    (item) => item.action === "RECYCLE"
  ).length;

  const earnedBadges = badges.filter((badge) => {
    if (badge.id === "first") {
      return totalScans >= 1;
    }

    if (badge.id === "explorer") {
      return totalScans >= 5;
    }

    if (badge.id === "champion") {
      return reuseCount >= 3;
    }

    if (badge.id === "recycler") {
      return recycleCount >= 5;
    }

    return false;
  });

  const renderHome = () => (
    <div className="home-page">
      <header className="top-header">
        <div className="brand">
          <div className="logo">♻️</div>

          <div>
            <h1>LifeLeft</h1>
            <p>Give everyday items another chance.</p>
          </div>
        </div>
      </header>

      <main className="home-content">
        <section className="hero-card">
          <div className="hero-text">
            <span className="small-label">SMART SUSTAINABILITY</span>

            <h2>
              Know what your
              <br />
              <span>item's LifeLeft is.</span>
            </h2>

            <p>
              Scan an everyday item and discover whether it
              should be reused, recycled, composted or handled
              differently.
            </p>

            <button
              className="primary-button"
              onClick={() => setPage("scanner")}
            >
              📷 Scan an Item
            </button>
          </div>

          <div className="hero-illustration">
            <div className="floating-item">♻️</div>
            <div className="floating-item small">🌱</div>
            <div className="floating-item tiny">🔄</div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <span className="small-label">YOUR PROGRESS</span>
              <h2>Your Impact</h2>
            </div>

            <span className="points-pill">
              🌱 {totalPoints} pts
            </span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>📷</span>
              <strong>{totalScans}</strong>
              <p>Total Scans</p>
            </div>

            <div className="stat-card">
              <span>🌱</span>
              <strong>{averageScore}</strong>
              <p>Avg. Score</p>
            </div>

            <div className="stat-card">
              <span>♻️</span>
              <strong>{reuseCount}</strong>
              <p>Reuse Actions</p>
            </div>

            <div className="stat-card">
              <span>🔄</span>
              <strong>{recycleCount}</strong>
              <p>Recycled</p>
            </div>
          </div>
        </section>

        <section className="badge-section">
          <div className="section-heading">
            <div>
              <span className="small-label">ACHIEVEMENTS</span>
              <h2>Your Badges</h2>
            </div>

            <span>
              {earnedBadges.length}/{badges.length}
            </span>
          </div>

          <div className="badge-grid">
            {badges.map((badge) => {
              const earned = earnedBadges.some(
                (item) => item.id === badge.id
              );

              return (
                <div
                  className={`badge-card ${
                    earned ? "earned" : "locked"
                  }`}
                  key={badge.id}
                >
                  <div className="badge-icon">
                    {earned ? badge.icon : "🔒"}
                  </div>

                  <div>
                    <strong>{badge.name}</strong>
                    <p>{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <button
          className="history-button"
          onClick={() => setPage("history")}
        >
          📊 View Scan History
        </button>

        <div className="info-strip">
          <span>🌍</span>
          <div>
            <strong>Small choices matter.</strong>
            <p>
              LifeLeft helps you make better everyday waste
              decisions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );

  const renderScanner = () => (
    <div className="scanner-page">
      <header className="scanner-header">
        <button className="back-button" onClick={goHome}>
          ←
        </button>

        <div>
          <h1>Scan an Item</h1>
          <p>Point your camera at an everyday item</p>
        </div>
      </header>

      {!capturedImage && (
        <div className="camera-section">
          <div className="camera-container">
            <video
              id="camera-video"
              autoPlay
              playsInline
              muted
            />

            <div className="camera-frame">
              <span className="corner top-left"></span>
              <span className="corner top-right"></span>
              <span className="corner bottom-left"></span>
              <span className="corner bottom-right"></span>
            </div>

            <div className="camera-label">
              <span className="pulse-dot"></span>
              Ready to identify this item
            </div>
          </div>

          <button
            className="capture-button"
            onClick={captureImage}
          >
            <span>📷</span>
            Capture Item
          </button>

          <p className="camera-note">
            Make sure the item is clearly visible.
          </p>
        </div>
      )}

      {capturedImage && !selectedItem && (
        <div className="selection-section">
          <div className="preview-card">
            <img src={capturedImage} alt="Captured item" />
          </div>

          <div className="selection-title">
            <span className="small-label">LIFELEFT ANALYSIS</span>
            <h2>What did you scan?</h2>
            <p>
              Confirm the item so LifeLeft can generate the
              appropriate sustainability recommendation.
            </p>
          </div>

          <div className="item-grid">
            {items.map((item) => (
              <button
                className="item-button"
                key={item.id}
                onClick={() => chooseItem(item)}
              >
                <span className="item-emoji">
                  {item.emoji}
                </span>

                <span>{item.name}</span>
              </button>
            ))}
          </div>

          <button className="secondary-button" onClick={resetScan}>
            🔄 Retake Photo
          </button>
        </div>
      )}

      {capturedImage && selectedItem && (
        <div className="result-section">
          <div className="analysis-header">
            <div className="analysis-icon">✨</div>

            <div>
              <span className="small-label">
                LIFELEFT ANALYSIS
              </span>

              <h2>Item successfully analyzed</h2>

              <p>
                Your item has been matched with a sustainability
                action.
              </p>
            </div>

            <div className="verified">✓</div>
          </div>

          <div className="result-image-card">
            <img
              src={capturedImage}
              alt="Analyzed item"
            />
          </div>

          <div className="detected-card">
            <div className="detected-icon">
              {selectedItem.emoji}
            </div>

            <div>
              <span>DETECTED ITEM</span>
              <h2>{selectedItem.name}</h2>
              <p>{selectedItem.category}</p>
            </div>
          </div>

          <div className="confidence-card">
            <div className="confidence-top">
              <span>Identification Confidence</span>
              <strong>{selectedItem.confidence}%</strong>
            </div>

            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{
                  width: `${selectedItem.confidence}%`
                }}
              ></div>
            </div>

            <small>
              Confidence shown for the selected item category.
            </small>
          </div>

          <div className="score-card">
            <div className="score-circle">
              <strong>{selectedItem.score}</strong>
              <span>/100</span>
            </div>

            <div>
              <span>LIFELEFT SCORE</span>
              <h3>Potential for a better next step</h3>
              <p>
                Higher scores indicate a more sustainable
                handling option.
              </p>
            </div>
          </div>

          <div className="result-info-grid">
            <div className="result-info-card">
              <span>🌍</span>
              <small>Environmental Impact</small>
              <strong>{selectedItem.impact}</strong>
            </div>

            <div className="result-info-card">
              <span>🏆</span>
              <small>Impact Points</small>
              <strong>+{selectedItem.points}</strong>
            </div>
          </div>

          <div className="recommendation-card">
            <span className="small-label">
              RECOMMENDED ACTION
            </span>

            <h2>♻️ {selectedItem.action}</h2>

            <p>{selectedItem.why}</p>
          </div>

          <div className="tip-card">
            <span>💡</span>

            <div>
              <strong>LifeLeft Tip</strong>
              <p>{selectedItem.tip}</p>
            </div>
          </div>

          <div className="steps-card">
            <div className="section-heading">
              <div>
                <span className="small-label">
                  ACTION PLAN
                </span>

                <h2>What happens next?</h2>
              </div>
            </div>

            <div className="steps-list">
              {selectedItem.steps.map((step, index) => (
                <div className="step" key={step}>
                  <div className="step-number">
                    {index + 1}
                  </div>

                  <div>
                    <strong>{step}</strong>
                    <p>
                      Step {index + 1} of{" "}
                      {selectedItem.steps.length}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="points-earned">
            🎉 You earned{" "}
            <strong>+{selectedItem.points} Impact Points</strong>
          </div>

          <div className="action-buttons">
            <button
              className="primary-button"
              onClick={resetScan}
            >
              📷 Scan Another Item
            </button>

            <button
              className="secondary-button"
              onClick={() => {
                resetScan();
                setPage("history");
              }}
            >
              📊 View Scan History
            </button>
          </div>

          <p className="disclaimer">
            LifeLeft provides educational sustainability
            guidance. Actual recycling and disposal options may
            vary by location and local waste-management rules.
          </p>
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="history-page">
      <header className="scanner-header">
        <button
          className="back-button"
          onClick={() => setPage("home")}
        >
          ←
        </button>

        <div>
          <h1>Scan History</h1>
          <p>Your LifeLeft journey</p>
        </div>
      </header>

      <main className="history-content">
        <div className="history-summary">
          <div>
            <span>Total Scans</span>
            <strong>{totalScans}</strong>
          </div>

          <div>
            <span>Impact Points</span>
            <strong>{totalPoints}</strong>
          </div>

          <div>
            <span>Badges</span>
            <strong>
              {earnedBadges.length}/{badges.length}
            </strong>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="empty-history">
            <div>🌱</div>
            <h2>No scans yet</h2>
            <p>
              Start scanning everyday items to build your
              sustainability journey.
            </p>

            <button
              className="primary-button"
              onClick={() => setPage("scanner")}
            >
              📷 Start First Scan
            </button>
          </div>
        ) : (
          <>
            <div className="history-list">
              {history.map((item) => (
                <div className="history-item" key={item.id}>
                  <div className="history-emoji">
                    {item.emoji}
                  </div>

                  <div className="history-details">
                    <strong>{item.name}</strong>
                    <span>{item.action}</span>
                    <small>{item.date}</small>
                  </div>

                  <div className="history-score">
                    <strong>{item.score}</strong>
                    <span>Score</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="primary-button"
              onClick={() => setPage("scanner")}
            >
              📷 Scan Another Item
            </button>

            <button
              className="clear-button"
              onClick={clearHistory}
            >
              🗑️ Clear History
            </button>
          </>
        )}
      </main>
    </div>
  );

  if (page === "scanner") {
    return renderScanner();
  }

  if (page === "history") {
    return renderHistory();
  }

  return renderHome();
}

export default App;