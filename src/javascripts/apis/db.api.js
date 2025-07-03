export default async function getDB() {
  try {
    const response = await fetch("../src/javascripts/database.json");

    return await response.json();
  } catch (error) {
    swal({
      title: "Failed to fetch DB",
      text: "Please reload your page",
    });
  }
}
