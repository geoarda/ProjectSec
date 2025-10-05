import moment from "moment";
import simpleGit from "simple-git";
import fs from "fs";

const git = simpleGit();
let commitData = [];

// JSON dosyası varsa yükle
if (fs.existsSync("pattern-data.json")) {
  commitData = JSON.parse(fs.readFileSync("pattern-data.json"));
}

// Harf patternleri (0 = boş, 1 = commit yap)
const patterns = {
  "C": [
    [0,1,1],
    [1,0,0],
    [1,0,0],
    [1,0,0],
    [0,1,1]
  ],
  "O": [
    [0,1,0],
    [1,0,1],
    [1,0,1],
    [1,0,1],
    [0,1,0]
  ],
  "D": [
    [1,1,0],
    [1,0,1],
    [1,0,1],
    [1,0,1],
    [1,1,0]
  ],
  "E": [
    [1,1,1],
    [1,0,0],
    [1,1,0],
    [1,0,0],
    [1,1,1]
  ],
  "P": [
    [1,1,0],
    [1,0,1],
    [1,1,0],
    [1,0,0],
    [1,0,0]
  ],
  "R": [
    [1,1,0],
    [1,0,1],
    [1,1,0],
    [1,0,1],
    [1,0,1]
  ]
};

// Commit oluşturma fonksiyonu (Windows uyumlu)
const createCommit = async (date) => {
  const safeDate = date.replace(/:/g, "-");
  const fileName = `commit-${safeDate}.txt`;
  fs.writeFileSync(fileName, `Commit for ${date}`);
  await git.add(fileName);
  await git.commit(`Commit for ${date}`, { "--date": date });
  commitData.push(date);
  fs.writeFileSync("pattern-data.json", JSON.stringify(commitData, null, 2));
  console.log(`Commit oluşturuldu: ${date}`);
};

// Contribution pattern’ini grafiğe uygula
const createPattern = async (text, startDate) => {
  let colOffset = 0;

  for (const letter of text.toUpperCase()) {
    const pattern = patterns[letter];
    if (!pattern) continue;

    for (let col = 0; col < pattern[0].length; col++) {
      for (let row = 0; row < pattern.length; row++) {
        if (pattern[row][col] === 1) {
          let date = moment(startDate)
            .add(row, "days")
            .add((col + colOffset) * 7, "days")
            .toISOString();
          await createCommit(date);
        }
      }
    }

    colOffset += pattern[0].length + 1; // harfler arası boşluk
  }
};

// Örnek kullanım: "CODEPRO" yazısı 1 Eylül 2025’ten itibaren
createPattern("CODEPRO", "2025-09-01");
