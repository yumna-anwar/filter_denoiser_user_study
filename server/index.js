const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const sqlite = require("better-sqlite3");
const db = new sqlite("data.db", { verbose: console.log });

const PORT = process.env.PORT || 3001;
const app = express();
const { exec } = require('child_process');

app.use(cors());

app.use(express.json());

app.use(
  "/assets/stimulisentences",
  express.static(path.join(__dirname, "assets/stimulisentences"))
);
app.use(
  "/assets/test_sentence",
  express.static(path.join(__dirname, "assets/test_sentence"))
);
app.use(
  "/assets/MHAconfigs",
  express.static(path.join(__dirname, "assets/MHAconfigs"))
);

app.get("/api/get-all-user", (req, res) => {
  const query = db.prepare("SELECT * FROM users");
  const data = query.all();
  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(200).json({ success: false, message: "User not found" });
  }
});

app.get("/api/get-user/:id", (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL parameters
  const query = db.prepare("SELECT * FROM users WHERE id = ?");
  const data = query.get(userId); // Use .get() to retrieve a single row

  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(200).json({ success: false, message: "User not found" });
  }
});

app.get("/api/get-user-gain/:id", (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL parameters
  const query = db.prepare("SELECT * FROM UserGain WHERE id = ?");
  const data = query.get(userId); // Use .get() to retrieve a single row

  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(200).json({ success: false, message: "User not found" });
  }
});
app.get("/api/get-all-user-gain", (req, res) => {
  const query = db.prepare("SELECT * FROM UserGain");
  const data = query.all();
  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(200).json({ success: false, message: "User not found" });
  }
});


app.post("/api/login", (req, res) => {
  const { UserName, Password } = req.body;

  if (!UserName || !Password) {
    return res.status(200).json({
      success: false,
      message: "Missing UserName or Password in the request.",
    });
  }

  const getUser = db.prepare("SELECT * FROM users WHERE UserName = ?");
  const user = getUser.get(UserName);

  if (user) {
    const hashedPassword = user.PasswordHash;
    bcrypt.compare(Password, hashedPassword).then((res2) => {
      if (res2) {
        return res.status(200).json({
          success: true,
          message: "Login Successful",
          userId: user.Id,
          isAdmin: user.IsAdmin === 1,
        });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "Invalid Password" });
      }
    });
  } else {
    return res
      .status(200)
      .json({ success: false, message: "No Account Found" });
  }
});

app.post("/api/register", (req, res) => {
  const { FullName, UserName, Age, Gender, IsHearing, PasswordHash } = req.body;

  if (
    !FullName ||
    !UserName ||
    !Age ||
    !Gender ||
    IsHearing === undefined ||
    !PasswordHash
  ) {
    return res.status(200).json({
      success: false,
      message: "Missing or invalid data in the request.",
    });
  }

  const checkUser = db.prepare(
    "SELECT COUNT(*) as count FROM users WHERE UserName = ?"
  );
  const existingUser = checkUser.get(UserName);

  if (existingUser.count > 0) {
    return res
      .status(200)
      .json({ success: false, message: "UserName already exists." });
  }

  let statement = db.prepare(
    "INSERT INTO users (FullName, UserName, Age, Gender, IsHearing, PasswordHash, IsAdmin) VALUES (?, ?, ?, ?, ?, ?, ?);"
  );

  let info = statement.run([
    FullName,
    UserName,
    Age,
    Gender,
    IsHearing,
    PasswordHash,
    0,
  ]);

  if (info) {
    return res
      .status(200)
      .json({ success: true, message: "Registration Complete" });
  }
  return res
    .status(500)
    .json({ success: false, message: "Registration Not Complete" });
});

app.get("/api/list-files", (req, res) => {
  const assetsFolder = path.join(__dirname, "assets/stimulisentences"); // Replace 'assets' with your folder name
  const baseUrl = `${req.protocol}://${req.get("host")}`; // Construct the base URL

  fs.readdir(assetsFolder, (err, files) => {
    if (err) {
      console.error(err);
      res.status(200).json({ success: false, message: "Error reading files" });
    } else {
      const fileData = [];

      files.forEach((file) => {
        const filePath = path.join(assetsFolder, file);
        const fileUrl = `${baseUrl}/assets/stimulisentences/${file}`; // Construct the URL
        fileData.push({ path: fileUrl, file });
      });

      const compareStrings = (a, b) => {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
      };

      var sortedData = fileData.sort(function (a, b) {
        return compareStrings(a.file, b.file);
      });

      res.json({ success: true, fileData: sortedData });
    }
  });
});

app.post("/api/add-user-study", (req, res) => {
  const { UserId, FileName, Rate, Guid } = req.body;

  if (!UserId || !FileName || !Rate || !Guid) {
    return res.status(200).json({
      success: false,
      message: "Missing or invalid data in the request.",
    });
  }

  const checkUser = db.prepare(
    "SELECT COUNT(*) as count FROM users WHERE Id = ?"
  );
  const existingUser = checkUser.get(UserId);
  console.log(existingUser);
  if (existingUser.count === 0) {
    return res.status(200).json({ success: false, message: "User Not Found." });
  }

  let statement = db.prepare(
    "INSERT INTO UserStudies (UserId, FileName, Rate, Guid, CreatedOn) VALUES (?, ?, ?, ?, ?);"
  );

  let info = statement.run([
    UserId,
    FileName,
    Rate,
    Guid,
    new Date().toISOString(),
  ]);

  if (info) {
    return res.status(200).json({ success: true, message: "Answer Submitted" });
  }
  return res.status(200).json({ success: false, message: "Answer Not Submit" });
});

app.get("/api/get-filterC", (req, res) => {
  const query = db.prepare("SELECT * FROM filterC");
  const data = query.all();
  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(200).json({ success: false, message: "User not found" });
  }
});
app.get("/api/get-filterB", (req, res) => {
  const query = db.prepare("SELECT * FROM filterB");
  const data = query.all();
  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(200).json({ success: false, message: "User not found" });
  }
});
app.get("/api/get-filterA", (req, res) => {
  const query = db.prepare("SELECT * FROM filterA");
  const data = query.all();
  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(200).json({ success: false, message: "User not found" });
  }
});
app.get("/api/get-filterC-id/:id", (req, res) => {
  const filterId = req.params.id; // Get the user ID from the URL parameters
  const query = db.prepare("SELECT * FROM filterC WHERE sno = ?");
  const data = query.get(filterId); // Use .get() to retrieve a single row

  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(200).json({ success: false, message: "Filter not found" });
  }
});
app.get("/api/get-filterB-id/:id", (req, res) => {
  const filterId = req.params.id; // Get the user ID from the URL parameters
  const query = db.prepare("SELECT * FROM filterB WHERE sno = ?");
  const data = query.get(filterId); // Use .get() to retrieve a single row

  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(200).json({ success: false, message: "Filter not found" });
  }
});
app.get("/api/get-filterA-id/:id", (req, res) => {
  const filterId = req.params.id; // Get the user ID from the URL parameters
  const query = db.prepare("SELECT * FROM filterA WHERE sno = ?");
  const data = query.get(filterId); // Use .get() to retrieve a single row

  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(200).json({ success: false, message: "Filter not found" });
  }
});

app.post("/api/add-filter-A", (req, res) => {
  const {
    UserId,
    Step,
    RHz200,
    RHz500,
    RHz1000,
    RHz2000,
    RHz3000,
    RHz4000,
    RHz6000,
    RHz8000,
    LHz200,
    LHz500,
    LHz1000,
    LHz2000,
    LHz3000,
    LHz4000,
    LHz6000,
    LHz8000, Volume, Gaintable} = req.body;

  if (!UserId || !Step || !Volume || !Gaintable) {
    return res.status(200).json({
      success: false,
      message: "Missing or invalid data in the request.",
    });
  }

  const checkUser = db.prepare(
    "SELECT COUNT(*) as count FROM users WHERE Id = ?"
  );

  const existingUser = checkUser.get(UserId);
  console.log(existingUser);
  if (existingUser.count === 0) {
    return res.status(200).json({ success: false, message: "User Not Found." });
  }

  let statement = db.prepare(
    "INSERT INTO filterA (UserId, step, R200hz, R500hz, R1000hz, R2000hz, R3000hz, R4000hz, R6000hz, R8000hz, L200hz, L500hz, L1000hz, L2000hz, L3000hz, L4000hz, L6000hz, L8000hz, volume, gtable, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
  );

  let info = statement.run([
    UserId,
    Step,
    RHz200,
    RHz500,
    RHz1000,
    RHz2000,
    RHz3000,
    RHz4000,
    RHz6000,
    RHz8000,
    LHz200,
    LHz500,
    LHz1000,
    LHz2000,
    LHz3000,
    LHz4000,
    LHz6000,
    LHz8000,
    Volume,
    Gaintable,
    new Date().toISOString(),
  ]);

  if (info) {
    return res.status(200).json({ success: true, message: "Gain Table Saved" });
  }
  return res.status(200).json({ success: false, message: "Gain Table Not Saved Not" });
});

app.post('/api/run-filterA-test', (req, res) => {
  // Extract the parameters
  // return res.status(200).json({ success: true, message: "run-filterA-test Submitted" });
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const {mhagainparam} = req.body;

  // const sourceAudioPath = `${baseUrl}/assets/test_sentence/stereo_ISTS.wav`;
  // const destAudioPath = `${baseUrl}/assets/test_sentence/filterA-test/stereo_ISTS.wav`;
  // const scriptPath = `${baseUrl}/assets/MHAconfigs/Test_FilterA.sh`;

  const scriptPath = path.join(__dirname, "/assets/MHAconfigs/Test_FilterA.sh");
  const sourceAudioPath = path.join(__dirname, "/assets/test_sentence/stereo_ISTS.wav");
  const destAudioPath = path.join(__dirname, "/assets/test_sentence/filterA-test/stereo_ISTS.wav");

  // Basic validation example
  if (!mhagainparam || typeof mhagainparam !== 'string') {
    return res.status(400).send({ message: 'Invalid parameter' });
  }
  // Add single quotes around mhagainparam
  const mhagainparamWithQuotes = `'${mhagainparam}'`;
  console.log(`${scriptPath} ${sourceAudioPath} ${destAudioPath} ${mhagainparamWithQuotes}`);
  exec(`${scriptPath} ${sourceAudioPath} ${destAudioPath} ${mhagainparamWithQuotes}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ success: false, message: 'Script execution failed', error });
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send({ success: true, message: 'Script executed successfully', stdout, stderr });
  });
});



// // Function to stream audio
// function streamAudio(req, res, audioFilePath) {
//   const stat = fs.statSync(audioFilePath);
//   const fileSize = stat.size;
//   const range = req.headers.range;
//   if (range) {
//     const parts = range.replace(/bytes=/, '').split('-');
//     const start = parseInt(parts[0], 10);
//     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//     const chunksize = end - start + 1;
//     const file = fs.createReadStream(audioFilePath, { start, end });
//     const head = {
//       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//       'Accept-Ranges': 'bytes',
//       'Content-Length': chunksize,
//       'Content-Type': 'audio/wav', // Adjust MIME type as needed
//     };
//     res.writeHead(206, head);
//     file.pipe(res);
//   } else {
//     const head = {
//       'Content-Length': fileSize,
//       'Content-Type': 'audio/wav', // Adjust MIME type as needed
//     };
//     res.writeHead(200, head);
//     fs.createReadStream(audioFilePath).pipe(res);
//   }
// }
//
// // Watch for changes in the audio file
// let audioStream = null; // Variable to store the audio stream
// const filterAtestFilePath = path.join(__dirname, "/assets/test_sentence/filterA-test/stereo_ISTS.wav");
// fs.watchFile(filterAtestFilePath, (curr, prev) => {
//   if (curr.mtime > prev.mtime) {
//     // The audio file has changed, close the existing audio stream if it exists
//     if (audioStream) {
//       audioStream.close();
//       audioStream = null;
//     }
//     // Create a new audio stream
//     audioStream = fs.createReadStream(filterAtestFilePath);
//     console.log('Audio file has changed. Reloaded audio stream.');
//   }
// });
//
// app.get('/api/stream-filterA-audio', (req, res) => {
//   if (audioStream) {
//     // Pipe the audio stream to the response
//     res.setHeader('Content-Type', 'audio/wav');
//     audioStream.pipe(res);
//   } else {
//     // If no audio stream exists, create one and pipe it to the response
//     audioStream = fs.createReadStream(filterAtestFilePath);
//     audioStream.on('error', (err) => {
//       console.error('Error creating audio stream:', err);
//       res.status(500).send('Internal Server Error');
//     });
//     audioStream.pipe(res);
//      res.setHeader('Content-Type', 'audio/wav');
//   }
//   });


app.get("/api/get-all-user-study", (req, res) => {
  const query = db.prepare(
    `SELECT Guid, u.Fullname, u.UserName FROM UserStudies us JOIN users u ON us.UserId = u.Id GROUP BY Guid ORDER BY us.Id desc;`
  );
  const data = query.all();
  if (data) {
    const formattedData = data.map((item) => {
      const query2 = db.prepare(
        `SELECT * FROM UserStudies WHERE Guid = '${item.Guid}';`
      );
      const data2 = query2.all();
      return {
        Guid: item.Guid,
        FullName: item.FullName,
        UserName: item.UserName,
        Data: data2 ? data2 : [],
      };
    });
    res.status(200).json({ success: true, data: formattedData });
  } else {
    res.status(200).json({ success: false, message: "User Study not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
