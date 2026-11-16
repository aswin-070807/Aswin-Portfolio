import { describe, expect, it } from "vitest";
import {
  extractDriveFileId,
  getDeterministicAngle,
  getDriveThumbnailUrl,
  groupCertificatesIntoRooms,
  parseCertificatesCSV,
} from "../lib/certificationsData";

describe("Certificates CSV Parser and Floor Plan logic", () => {
  it("detects header row with blank rows above and different column positions", () => {
    const sampleCsv = `
,,,
,,,
"extra col","certificate link","random","Certificate name","issued by"
"","https://drive.google.com/file/d/ABC123XYZ/view?usp=sharing","","React Architecture","Frontend Masters"
"","https://drive.google.com/file/d/DEF456UVW/view?usp=sharing","","Node.js Backend Security","Linux Foundation"
    `.trim();

    const result = parseCertificatesCSV(sampleCsv);
    expect(result).toHaveLength(2);
    // Newest is the last row of the sheet (marker 1)
    expect(result[0].name).toBe("Node.js Backend Security");
    expect(result[0].markerNumber).toBe(1);
    expect(result[0].issuer).toBe("Linux Foundation");
    expect(result[0].fileId).toBe("DEF456UVW");

    expect(result[1].name).toBe("React Architecture");
    expect(result[1].markerNumber).toBe(2);
  });

  it("deduplicates identical certificate name and issuer (case-insensitive)", () => {
    const sampleCsv = `
"Certificate name","issued by","certificate link"
"Python Basics","Coursera","https://drive.google.com/file/d/111/view"
"python basics","  coursera  ","https://drive.google.com/file/d/222/view"
"Advanced Python","Coursera","https://drive.google.com/file/d/333/view"
    `.trim();

    const result = parseCertificatesCSV(sampleCsv);
    expect(result).toHaveLength(2);
  });

  it("groups certificates into rooms ordered by size then alphabetically", () => {
    const sampleCsv = `
"Certificate name","issued by","certificate link"
"Cert A","IBM","https://drive.google.com/file/d/1/view"
"Cert B","Infosys","https://drive.google.com/file/d/2/view"
"Cert C","Infosys","https://drive.google.com/file/d/3/view"
"Cert D","Infosys","https://drive.google.com/file/d/4/view"
"Cert E","IBM","https://drive.google.com/file/d/5/view"
"Cert F","Google","https://drive.google.com/file/d/6/view"
    `.trim();

    const items = parseCertificatesCSV(sampleCsv);
    const rooms = groupCertificatesIntoRooms(items);

    // Infosys has 3, IBM has 2, Google has 1
    expect(rooms).toHaveLength(3);
    expect(rooms[0].issuer).toBe("Infosys");
    expect(rooms[0].markers).toHaveLength(3);
    expect(rooms[0].roomCode).toBe("ROOM 01");

    expect(rooms[1].issuer).toBe("IBM");
    expect(rooms[1].markers).toHaveLength(2);
    expect(rooms[1].roomCode).toBe("ROOM 02");

    expect(rooms[2].issuer).toBe("Google");
    expect(rooms[2].markers).toHaveLength(1);
    expect(rooms[2].roomCode).toBe("ROOM 03");
  });

  it("generates deterministic angle between -0.6 and 0.6", () => {
    const angle1 = getDeterministicAngle("Mathworks");
    const angle2 = getDeterministicAngle("Mathworks");
    expect(angle1).toBe(angle2);
    expect(angle1).toBeGreaterThanOrEqual(-0.6);
    expect(angle1).toBeLessThanOrEqual(0.6);
  });

  it("extracts Google Drive file ID and builds thumbnail URL", () => {
    const fileId = extractDriveFileId(
      "https://drive.google.com/file/d/1Cxni9QlPQWRUM1A1sSvv-EuqUCu46k7J/view?usp=sharing"
    );
    expect(fileId).toBe("1Cxni9QlPQWRUM1A1sSvv-EuqUCu46k7J");
    expect(getDriveThumbnailUrl(fileId)).toBe(
      "https://drive.google.com/thumbnail?id=1Cxni9QlPQWRUM1A1sSvv-EuqUCu46k7J&sz=w400"
    );
  });
});
