"use strict"

async function getStatistics() {
  try {
    const response = await fetch(`../public/javascripts/database.json`);
    const data = await response.json();

    return data.statistics;
  } catch (error) {
    console.error("Get Statistics Failed error:", error);
  }
}

export { getStatistics };
