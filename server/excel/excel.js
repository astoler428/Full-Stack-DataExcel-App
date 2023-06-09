//all functions relating to creating and exporting to excel files

const xlsx = require("xlsx");
const { dataDB, tagsDB, recentTagDB } = require("../db/databases.js");

function exportToExcel(fileName, data) {
  let file = xlsx.readFile(fileName);
  xlsx.utils.sheet_add_json(file.Sheets.Sheet1, [data], {
    origin: -1,
    skipHeader: 1,
  });
  xlsx.writeFile(file, fileName);
}

async function createFile(fileName) {
  //if creating data file, reset data.json

  if (fileName === "Data.xlsx") {
    await dataDB.setData([]);
    await tagsDB.setTags([]);
    await recentTagDB.setRecentTag({ tag: "" });
  }

  const workBook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet([]);
  xlsx.utils.book_append_sheet(workBook, worksheet, "Sheet1");
  xlsx.writeFile(workBook, fileName);
}

function exportToDataExcelFile() {
  let file = xlsx.readFile("./Data.xlsx");
  let lineNumber = 0;
  dataDB.data.forEach((pieceOfData) => {
    xlsx.utils.sheet_add_json(
      file.Sheets.Sheet1,
      [[pieceOfData.dataPoint, ...pieceOfData.tags]],
      {
        skipHeader: 1,
        origin: lineNumber++,
      }
    );
    xlsx.writeFile(file, "./Data.xlsx");
  });
}

function exportToTagsExcelFile() {
  let file = xlsx.readFile("./Tags.xlsx");
  let lineNumber = 0;
  tagsDB.tags.forEach((tag) => {
    xlsx.utils.sheet_add_json(file.Sheets.Sheet1, [[tag]], {
      skipHeader: 1,
      origin: lineNumber++,
    });
    xlsx.writeFile(file, "./Tags.xlsx");
  });
}

module.exports = {
  exportToExcel,
  createFile,
  exportToDataExcelFile,
  exportToTagsExcelFile,
};
