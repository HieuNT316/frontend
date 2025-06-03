/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url The URL to issue the GET request.
 * @returns {Promise<object>} A promise that resolves to the fetched model.
 */
async function fetchModel(url) {
  //console.log("Fetching from:", url);
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",  // BẮT BUỘC để gửi session cookie kèm theo
    });


    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const model = await response.json();
    return model;
  } catch (error) {
    console.error("Error fetching model:", error);
    throw error; // propagate error to caller
  }
}

export default fetchModel;
