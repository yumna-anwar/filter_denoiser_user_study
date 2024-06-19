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
  "/assets/_stimulisentences",
  express.static(path.join(__dirname, "assets/_stimulisentences"))
);
app.use(
  "/assets/test_sentence",
  express.static(path.join(__dirname, "assets/test_sentence"))
);
app.use(
  "/assets/MHAconfigs",
  express.static(path.join(__dirname, "assets/MHAconfigs"))
);
app.use(
  "/assets/stimulisentences_usertest",
  express.static(path.join(__dirname, "assets/stimulisentences_usertest"))
);
app.use(
  "/assets/stimulisentences_pairwise",
  express.static(path.join(__dirname, "assets/stimulisentences_pairwise"))
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


// ASSESTS/USERID/MODELNAME_SNR_SENTENCENAME.WAV
app.get("/api/list-files", (req, res) => {
  const assetsFolder = path.join(__dirname, "assets/_stimulisentences"); // Replace 'assets' with your folder name
  const baseUrl = `${req.protocol}://${req.get("host")}`; // Construct the base URL

  fs.readdir(assetsFolder, (err, files) => {
    if (err) {
      console.error(err);
      res.status(200).json({ success: false, message: "Error reading files" });
    } else {
      const fileData = [];

      files.forEach((file) => {
        const fileUrl = `${baseUrl}/assets/_stimulisentences/${file}`; // Construct the URL
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
app.get("/api/list-files-user/:id", (req, res) => {
  const participantId = req.params.id;
  const keyword = "Combined_";
  const assetsFolder = path.join(__dirname, `assets/stimulisentences_usertest/${participantId}`); // Replace 'assets' with your folder name
  const baseUrl = `${req.protocol}://${req.get("host")}`; // Construct the base URL

  fs.readdir(assetsFolder, (err, files) => {
    if (err) {
      console.error(err);
      res.status(200).json({ success: false, message: "Error reading files" });
    } else {
      const fileData = [];

      files.forEach((file) => {
        if (file.startsWith(keyword)) {
        const fileUrl = `${baseUrl}/assets/stimulisentences_usertest/${participantId}/${file}`; // Construct the URL
        fileData.push({ path: fileUrl, file });
        }
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
app.get("/api/list-files-userid/:id", (req, res) => {
  const participantId = req.params.id;
  const assetsFolder = path.join(__dirname, `assets/stimulisentences_usertest/${participantId}`); // Replace 'assets' with your folder name
  const baseUrl = `${req.protocol}://${req.get("host")}`; // Construct the base URL

  fs.readdir(assetsFolder, (err, files) => {
    if (err) {
      console.error(err);
      res.status(200).json({ success: false, message: "Error reading files" });
    } else {
      const fileData = [];

      files.forEach((file) => {
        const filePath = path.join(assetsFolder, file);
        const fileUrl = `${baseUrl}/assets/stimulisentences_usertest/${participantId}/${file}`; // Construct the URL
        //fileData.push({ path: fileUrl, file });
        fileData.push(file);
      });
      //const sortedData = fileData.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      res.json({ success: true, message:"File reading Successful",fileData: fileData });
    }
  });
});
app.get("/api/list-files-pairwise", (req, res) => {
  const basePath = path.join(__dirname, 'assets/stimulisentences_pairwise/');
  const baseUrl = `${req.protocol}://${req.get("host")}`;
    const folders = ["mod1", "mod2", "mod3", "mod4", "mod5","mod6"];
    let filesByFolder = [];
    let promises = [];

    folders.forEach(folder => {
      const folderPath = path.join(basePath, folder);
      // Reading each folder and pushing the promise into an array
      promises.push(
        fs.promises.readdir(folderPath).then(files => {
          // Filter and map the files to include the full path and folder name
          return files.filter(file => file.endsWith('.wav')).map(file => ({
            name: file,
            path: `${baseUrl}/assets/stimulisentences_pairwise/${folder}/${file}`,
            folder: folder
          }));
        }).catch(err => {
          console.error(`Error reading files from folder: ${folder}`, err);
          return []; // Return an empty array in case of error to keep the structure
        })
      );
    });

    // Resolve all promises and process files pairwise
    Promise.all(promises).then(filesByFolder => {
      let filePairs = [];
      const baseFolderFiles = filesByFolder[0]; // Assuming the first folder is the base for comparison

      // Generate all combinations of folder pairs
    for (let i = 0; i < filesByFolder.length; i++) {
      for (let j = i + 1; j < filesByFolder.length; j++) {
        filesByFolder[i].forEach(file1 => {
          const matchFile = filesByFolder[j].find(file2 => file2.name === file1.name);
          if (matchFile) {
            filePairs.push({
              path1: file1.path,
              path2: matchFile.path,
              name1: file1.folder,
              name2: matchFile.folder,
              fileName: file1.name
            });
          }
        });
      }
    }

      // Send the response with the pairs
      console.log(filePairs);
      res.json({ success: true, message: "File pairs fetched successfully", filePairs: filePairs });
    }).catch(error => {
      console.error("Failed to read files pairwise", error);
      res.status(500).json({ success: false, message: "Failed to read files pairwise" });
    });

  });

app.get("/api/list-directories", (req, res) => {
  const basePath = path.join(__dirname, `assets/stimulisentences_usertest/`); // Adjust path as needed
  fs.readdir(basePath, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Error reading directory" });
    }
    const directories = entries
      .filter(entry => entry.isDirectory())
      .map(dir => dir.name);
    res.json({ success: true, message: "Directories fetched successfully", directories: directories });
  });
});


app.post("/api/add-user-study", (req, res) => {
  const { UserId, FileName, Rate, TimeTaken, Guid } = req.body;

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
    "INSERT INTO UserStudies (UserId, FileName, Rate, Guid, CreatedOn, timetaken) VALUES (?, ?, ?, ?, ?, ?);"
  );

  let info = statement.run([
    UserId,
    FileName,
    Rate,
    Guid,
    new Date().toISOString(),
    TimeTaken
  ]);

  if (info) {
    return res.status(200).json({ success: true, message: "Answer Submitted" });
  }
  return res.status(200).json({ success: false, message: "Answer Not Submit" });
});

app.post("/api/add-user-study-pairwise", (req, res) => {
  const { UserId, FileName1,FileName2, Rate, TimeTaken, ReasonslessAnnoying, ReasonslessEffortful, ReasonsmoreNatural, ReasonsbetterQuality, Guid } = req.body;

  if (!UserId || !FileName1 || !FileName2 || !Rate || !Guid) {
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
    "INSERT INTO UserStudiesPair (UserId, FileName1,FileName2, Rate, Guid, CreatedOn, timetaken, lessAnnoying, lessEffortful, moreNatural, betterQuality) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
  );

  let info = statement.run([
    UserId,
    FileName1,
    FileName2,
    Rate,
    Guid,
    new Date().toISOString(),
    TimeTaken,
    ReasonslessAnnoying,
    ReasonslessEffortful,
    ReasonsmoreNatural,
    ReasonsbetterQuality

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
app.get("/api/get-usergain", (req, res) => {
  const query = db.prepare("SELECT * FROM UserGain");
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
app.get("/api/get-usergain-id/:id", (req, res) => {
  const filterId = req.params.id; // Get the user ID from the URL parameters
  const query = db.prepare("SELECT * FROM UserGain WHERE ParticipantID = ?");
  const data = query.get(filterId); // Use .get() to retrieve a single row

  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(200).json({ success: false, message: "User data not found" });
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

app.post("/api/add-filter-B", (req, res) => {
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
    "INSERT INTO filterB (UserId, step, R200hz, R500hz, R1000hz, R2000hz, R3000hz, R4000hz, R6000hz, R8000hz, L200hz, L500hz, L1000hz, L2000hz, L3000hz, L4000hz, L6000hz, L8000hz, volume, gtable, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
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

app.post("/api/add-filter-C", (req, res) => {
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
    "INSERT INTO filterC (UserId, step, R200hz, R500hz, R1000hz, R2000hz, R3000hz, R4000hz, R6000hz, R8000hz, L200hz, L500hz, L1000hz, L2000hz, L3000hz, L4000hz, L6000hz, L8000hz, volume, gtable, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
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

app.post("/api/add-user-gain", (req, res) => {
  const {
    UserId,
    ParticipantID,
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
  // Check for existing record with the given ParticipantID
  const checkParticipant = db.prepare("SELECT COUNT(*) as count FROM UserGain WHERE ParticipantID = ?");
  const existingRecord = checkParticipant.get(ParticipantID);
  if (existingRecord.count > 0) {
    // Update existing record
    const updateStmt = db.prepare(
      `UPDATE UserGain
      SET UserId = ?, Step = ?, R200hz = ?, R500hz = ?, R1000hz = ?, R2000hz = ?, R3000hz = ?, R4000hz = ?, R6000hz = ?, R8000hz = ?,
          L200hz = ?, L500hz = ?, L1000hz = ?, L2000hz = ?, L3000hz = ?, L4000hz = ?, L6000hz = ?, L8000hz = ?, Volume = ?, Gtable = ?, Date = ?
      WHERE ParticipantID = ?`
    );
    let info = updateStmt.run(
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
      ParticipantID
    );
  } else {
      // Insert new record
      let statement = db.prepare(
        `INSERT INTO UserGain (UserId, ParticipantID, Step, R200hz, R500hz, R1000hz, R2000hz, R3000hz, R4000hz, R6000hz, R8000hz, L200hz, L500hz, L1000hz, L2000hz, L3000hz, L4000hz, L6000hz, L8000hz, Volume, Gtable, Date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );

      let info = statement.run(
        UserId,
        ParticipantID,
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
        new Date().toISOString()
      );
    }
    // Simplify response for brevity, check actual operation success in practice
  return res.status(200).json({ success: true, message: "Operation completed successfully." });

});

app.post('/api/run-filterA-test', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const {mhagainparam} = req.body;
  const scriptPath = path.join(__dirname, "/assets/MHAconfigs/Test_FilterA.sh");
  const sourceAudioPath = path.join(__dirname, "/assets/test_sentence/stereo_ISTS.wav");
  const destAudioPath = path.join(__dirname, "/assets/test_sentence/filterA-test/stereo_ISTS.wav");
  if (!mhagainparam || typeof mhagainparam !== 'string') {
    return res.status(400).send({ message: 'Invalid parameter' });
  }
  const mhagainparamWithQuotes = `'${mhagainparam}'`;
  console.log(`${scriptPath} ${sourceAudioPath} ${destAudioPath} ${mhagainparamWithQuotes}`);
  exec(`${scriptPath} ${sourceAudioPath} ${destAudioPath} ${mhagainparamWithQuotes}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ success: false, message: 'Script execution failed', error });
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send({ success: true, message: 'Script A executed successfully', stdout, stderr });
  });
});
app.post('/api/run-filterB-test', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const {mhagainparam} = req.body;
  const scriptPath = path.join(__dirname, "/assets/MHAconfigs/Test_FilterB.sh");
  const sourceAudioPath = path.join(__dirname, "/assets/test_sentence/stereo_Pink_Noise.wav");
  const destAudioPath = path.join(__dirname, "/assets/test_sentence/filterB-test/stereo_Pink_Noise.wav");
  if (!mhagainparam || typeof mhagainparam !== 'string') {
    return res.status(400).send({ message: 'Invalid parameter' });
  }
  const mhagainparamWithQuotes = `'${mhagainparam}'`;
  console.log(`${scriptPath} ${sourceAudioPath} ${destAudioPath} ${mhagainparamWithQuotes}`);
  exec(`${scriptPath} ${sourceAudioPath} ${destAudioPath} ${mhagainparamWithQuotes}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ success: false, message: 'Script execution failed', error });
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send({ success: true, message: 'Script B executed successfully', stdout, stderr });
  });
});
app.post('/api/run-filterC-test', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const {mhagainparam} = req.body;
  const scriptPath = path.join(__dirname, "/assets/MHAconfigs/Test_FilterC.sh");
  const sourceAudioPath = path.join(__dirname, "/assets/test_sentence/stereo_Pink_Noise.wav");
  const destAudioPath = path.join(__dirname, "/assets/test_sentence/filterC-test/stereo_Pink_Noise.wav");
  if (!mhagainparam || typeof mhagainparam !== 'string') {
    return res.status(400).send({ message: 'Invalid parameter' });
  }
  const mhagainparamWithQuotes = `'${mhagainparam}'`;
  console.log(`${scriptPath} ${sourceAudioPath} ${destAudioPath} ${mhagainparamWithQuotes}`);
  exec(`${scriptPath} ${sourceAudioPath} ${destAudioPath} ${mhagainparamWithQuotes}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ success: false, message: 'Script execution failed', error });
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send({ success: true, message: 'Script C executed successfully', stdout, stderr });
  });
});

app.post('/api/run-userGain-test', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const {mhagainparam, filterAparam, filterBparam, filterCparam} = req.body;
  const scriptPath = path.join(__dirname, "/assets/MHAconfigs/Run_all.sh")
  const sourceAudioPath = path.join(__dirname, "/assets/test_sentence");
  const destAudioPath = path.join(__dirname, "/assets/test_sentence/usergain-test");
  const mhagainparamWithQuotes = `'${mhagainparam}'`;
  const filterAparamWithQuotes = `'${filterAparam}'`;
  const filterBparamWithQuotes = `'${filterBparam}'`;
  const filterCparamWithQuotes = `'${filterCparam}'`;

  exec(`${scriptPath} ${sourceAudioPath} ${destAudioPath} ${mhagainparamWithQuotes} ${filterAparamWithQuotes} ${filterBparamWithQuotes} ${filterCparamWithQuotes} ${0}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ success: false, message: 'Script execution failed', error });
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send({ success: true, message: 'Script user gain executed successfully', stdout, stderr });
  });
    });

app.post('/api/run-userGain-All', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const {mhagainparam, filterAparam, filterBparam, filterCparam, latency, participantId} = req.body;
  const scriptPath = path.join(__dirname, "/assets/MHAconfigs/Run_all.sh")
  const sourceAudioPath = path.join(__dirname, "/assets/stimulisentences");
  const destAudioPath = path.join(__dirname, `/assets/stimulisentences_usertest/${participantId}`);
  const mhagainparamWithQuotes = `'${mhagainparam}'`;
  const filterAparamWithQuotes = `'${filterAparam}'`;
  const filterBparamWithQuotes = `'${filterBparam}'`;
  const filterCparamWithQuotes = `'${filterCparam}'`;

  exec(`${scriptPath} ${sourceAudioPath} ${destAudioPath} ${mhagainparamWithQuotes} ${filterAparamWithQuotes} ${filterBparamWithQuotes} ${filterCparamWithQuotes} ${latency}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ success: false, message: 'Script execution failed', error });
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send({ success: true, message: 'Script run all executed successfully', stdout, stderr });
  });
    });


async function runScript(scriptPath, sourcePath, destPath, param) {
  try {
    const { stdout, stderr } = await exec(`${scriptPath} ${sourcePath} ${destPath} ${param}`);
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
  } catch (error) {
    console.error(`exec error: ${error}`);
    throw new Error('Script execution failed');
  }
}

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
