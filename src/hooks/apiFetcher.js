export const fetchFromAPI = async (
  endpoint,
  language = "en",
  customHeaders = {}
) => {
  const BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL; // Use environment variable for base URL
  const url = `${BASE_URL}${endpoint}`;
  //test
  // const countryMapper = {
  //   en: "EN",
  //   az: "AZ",
  //   ar: "AR",
  // };

  //TODO will be deleted as all counries not work for now

  const headers = {
    "Content-Type": "application/json",
    "Accept-Language": language, // Send language in the headers
    Country: "AZ", // Default to AZ if language is not recognized,
    ...customHeaders,
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};
