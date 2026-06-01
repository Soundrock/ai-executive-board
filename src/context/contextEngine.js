import fs from "fs";

export function loadErpContext() {

  try {

    const file =
      "reports/knowledge/erp-knowledge.json";

    if (!fs.existsSync(file)) {
      return null;
    }

    return JSON.parse(
      fs.readFileSync(file,"utf8")
    );

  } catch {
    return null;
  }

}
