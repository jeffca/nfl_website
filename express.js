const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://127.0.0.1:5173',
};

app.use(cors(corsOptions)); // Enable CORS for all routes

// Connect to SQLite database
const db = new sqlite3.Database('nfldata.db');

app.get('/TeamAverages', (req, res) => {
  db.all('SELECT * FROM TeamAverages', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/Schedule', (req, res) => {
  db.all('SELECT * FROM Schedule', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/RushingMatchups', (req, res) => {
  db.all('SELECT * FROM RushingMatchups ORDER BY CAST("Expected Rush Yards Ranking" AS NUMERIC) ASC ', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });  
});

app.get('/RushingMatchups/last', (req, res) => {
  const week = req.params.week;
  db.all('SELECT * FROM RushingMatchups WHERE `Week Number` = (SELECT MAX(CAST(`Week Number` AS NUMERIC)) FROM RushingMatchups) ORDER BY CAST(`Expected Rush Yards` AS NUMERIC) DESC;', [week], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });  
});


app.get('/RushingMatchups/:week', (req, res) => {
  const week = req.params.week;
  db.all('SELECT * FROM RushingMatchups WHERE `Week Number` = ? ORDER BY CAST(`Rushing Yards Result` AS NUMERIC) DESC; ', [week], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });  
});

app.get('/PassingMatchups', (req, res) => {
  db.all('SELECT * FROM PassingMatchups ORDER BY CAST("Expected Pass Yards Ranking" AS NUMERIC) ASC ', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });  
});

app.get('/PassingMatchups/last', (req, res) => {
  const week = req.params.week;
  db.all('SELECT * FROM PassingMatchups WHERE `Week` = (SELECT MAX(CAST(`Week` AS NUMERIC)) FROM PassingMatchups) ORDER BY CAST(`Expected Pass Yards` AS NUMERIC) DESC;', [week], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });  
});

app.get('/PassingMatchups/:week', (req, res) => {
  const week = req.params.week;
  db.all('SELECT * FROM PassingMatchups WHERE `Week` = ? ORDER BY CAST(`Passing Yards Result` AS NUMERIC) DESC; ', [week], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });  
});

app.get('/TeamHistory', (req, res) => {
  db.all('SELECT * FROM TeamHistory', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/TeamHistory/:team', (req, res) => {
  const teamName = req.params.team;
  db.all('SELECT * FROM TeamHistory WHERE `Team Final` = ?', [teamName], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/TeamQuarterbacks', (req, res) => {
  db.all('SELECT * FROM TeamQuarterbacks', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/TeamQuarterbacks/:team', (req, res) => {
  const teamName = req.params.team;
  db.all('SELECT * FROM TeamQuarterbacks WHERE `Team Final` = ?', [teamName], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/TeamRunningBacks', (req, res) => {
  db.all('SELECT * FROM TeamRunningBacks', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/TeamRunningBacks/:team', (req, res) => {
  const teamName = req.params.team;
  db.all('SELECT * FROM TeamRunningBacks WHERE `Team Final` = ?', [teamName], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/TeamWideReceivers', (req, res) => {
  db.all('SELECT * FROM TeamWideReceivers', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/TeamWideReceivers/:team', (req, res) => {
  const teamName = req.params.team;
  db.all('SELECT * FROM TeamWideReceivers WHERE `Team Final` = ?', [teamName], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});


app.get('/Players', (req, res) => {
  const searchTerm = req.query.search;
  db.all('SELECT * FROM Players', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!searchTerm) {
      return res.json(rows);
    }

    // Filter players based on the search term
    const filteredPlayers = rows.filter(player =>
      player.Player.toLowerCase().includes(searchTerm.toLowerCase())
    );

    res.json(filteredPlayers);    
  });
});


app.get('/Quarterbacks', (req, res) => {
  db.all('SELECT * FROM Quarterbacks', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);    
  });
});

app.get('/Quarterbacks/:player', (req, res) => {
  const player = req.params.player;
  db.all('SELECT * FROM Quarterbacks WHERE `Player` = ?', [player], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/RunningBacks', (req, res) => {
  db.all('SELECT * FROM RunningBacks', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/RunningBacks/:player', (req, res) => {
  const player = req.params.player;
  db.all('SELECT * FROM RunningBacks WHERE `Player` = ?', [player], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/WideReceivers', (req, res) => {
  db.all('SELECT * FROM WideReceivers', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/WideReceivers/:player', (req, res) => {
  const player = req.params.player;
  db.all('SELECT * FROM WideReceivers WHERE `Player` = ?', [player], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/QBStars', (req, res) => {
  db.all('SELECT * FROM QBStars', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/QBStars/last', (req, res) => {
  db.all("SELECT * FROM QBStars WHERE `Week Number` = (SELECT MAX(CAST(`Week Number` AS NUMERIC)) FROM QBStars) ORDER BY CAST(`SUM of Yds` AS NUMERIC) DESC;", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/QBStars/:week', (req, res) => {
  const week = req.params.week;
  db.all('SELECT * FROM QBStars WHERE `Week Number` = ?', [week], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/RBStars', (req, res) => {
  db.all('SELECT * FROM RBStars', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/RBStars/last', (req, res) => {
  db.all("SELECT * FROM RBStars WHERE `Week Number` = (SELECT MAX(CAST(`Week Number` AS NUMERIC)) FROM RBStars) ORDER BY CAST(`SUM of Yds` AS NUMERIC) DESC;", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/RBStars/:week', (req, res) => {
  const week = req.params.week;
  db.all('SELECT * FROM RBStars WHERE `Week Number` = ?', [week], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});


app.get('/WRStars', (req, res) => {
  db.all('SELECT * FROM WRStars', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/WRStars/last', (req, res) => {
  db.all("SELECT * FROM WRStars WHERE `Week Number` = (SELECT MAX(CAST(`Week Number` AS NUMERIC)) FROM WRStars) ORDER BY CAST(`SUM of Yds` AS NUMERIC) DESC;", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/WRStars/:week', (req, res) => {
  const week = req.params.week;
  db.all('SELECT * FROM WRStars WHERE `Week Number` = ?', [week], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
