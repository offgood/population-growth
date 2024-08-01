import config from "@/config";

const getData = async () => {
  const url = `${config.API_URL}/chart-data`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    const results = await response.json();

    return results.data || [];
  } catch (error) {
    return { msg: `chart data get all, error:`, error };
  }
};

export { getData };
