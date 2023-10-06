const API_KEY = "06553de95fc43c64436a422c469c117a";

const makeIconURL = (iconId) =>
  `https://openweathermap.org/img/wn/${iconId}@2x.png`;

const getFormattedWeatherData = async (city, units = "metric") => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`;

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.status}`);
    }

    const data = await response.json();
    const {
      weather,
      main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
      wind: { speed },
      sys: { country },
      name,
    } = data;
    const { description, icon } = weather[0];

    return {
      description,
      iconURL: makeIconURL(icon),
      temp,
      feels_like,
      temp_max,
      temp_min,
      pressure,
      humidity,
      speed,
      country,
      name,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

const getFiveDayForecast = async (city, units = "metric") => {
  const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${units}`;

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch forecast data: ${response.status}`);
    }

    const data = await response.json();
    const forecastList = data.list;

    const groupedForecastData = {};
    forecastList.forEach((item) => {
      const {
        main: { temp },
        weather,
        dt_txt,
      } = item;
      const { description, icon, id } = weather[0];

      const date = dt_txt.split(" ")[0];

      if (!groupedForecastData[date]) {
        groupedForecastData[date] = {
          temperature: temp,
          description,
          iconURL: makeIconURL(icon),
          conditionId: id,
        };
      } else {
        if (id === 800 || id < groupedForecastData[date].conditionId) {
          groupedForecastData[date] = {
            temperature: temp,
            description,
            iconURL: makeIconURL(icon),
            conditionId: id,
          };
        }
      }
    });

    // Convert the grouped data into an array
    const forecastData = Object.keys(groupedForecastData).map((date) => ({
      ...groupedForecastData[date],
      date,
    }));

    return forecastData;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return [];
  }
};

export { getFormattedWeatherData, getFiveDayForecast };
