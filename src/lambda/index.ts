import fetch from "node-fetch";
import { stringify } from "csv-stringify/sync";

function getHeader(obj: {}): Array<string> {
  let headerArray: string[] = [];
  Object.keys(obj).forEach((key) => {
    console.log("key: ", key);
    headerArray.push(key);
  });
  console.log("header array: ", headerArray);
  return headerArray;
}

function getRecord(obj: { [key: string]: string | number | {} }): string[] {
  let record: Array<string> = [];
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === "string") {
      record.push(value);
    } else if (typeof value === "number") {
      record.push(value.toString());
    } else if (typeof value === "object" && value !== null) {
      record.push(JSON.stringify(value));
    } else {
      record.push("");
    }
  });
  console.log("record: ", record);
  return record;
}

function getRecords(json: {} | Array<{}>): string[][] {
  let records = [];
  if (Array.isArray(json)) {
    json.forEach((record) => {
      records.push(getRecord(record));
    });
  } else if (typeof json === "object" && json !== null) {
    records.push(getRecord(json));
  }
  console.log("records: ", records);
  return records;
}

function convertJsonToCsv(json: Array<{}> | {} | unknown): string {
  let header: string[];
  let records: string[][];
  if (Array.isArray(json)) {
    header = getHeader(json[0]);
    records = getRecords(json);
  } else if (typeof json === "object" && json !== null) {
    header = getHeader(json);
    records = getRecords(json);
  } else {
    header = [];
    records = [[]];
  }

  return stringify([[...header], ...records]);
}

export async function main(event: any) {
  const url = `${process.env["URL"]}/query`;
  const token = event.queryStringParameters["api-key"];

  const query = { select: ["*"], from: "bike", opts: { compact: true } };
  let json;
  let csv;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    json = await response.json();
    csv = convertJsonToCsv(json);

    console.log(json);
  } catch (error) {
    console.error(error);
  }

  console.log("json: ", json);

  return {
    headers: {
      "Content-Type": "application/CSV",
      "Content-Disposition": "attachment;filename=/myfilename.csv",
      //"Content-Type": "application/json",
    },
    body: csv,
    statusCode: 200,
  };
}
