import hot from "./assets/hot.jpeg";
import cold from "./assets/cold.jpg";
import { Description } from "./Forecast";
import { useEffect, useState } from "react";
import { getFormattedWeatherData, getFiveDayForecast } from "./Weather";
function App() {
  const [city, setCity] = useState("mahe");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hot);

  useEffect(() => {
    const fetchData = async () => {
      const weatherData = await getFormattedWeatherData(city, units);
      setWeather(weatherData);

      const threshold = units === "metric" ? 25 : 60;
      if (weatherData.temp <= threshold) {
        setBg(cold);
      } else {
        setBg(hot);
      }

      const forecastData = await getFiveDayForecast(city, units);
      setForecast(forecastData);
    };

    fetchData();
  }, [units, city]);

  const handleClickUnit = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const handleInputKeyDown = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section__inputs">
              <input
                onKeyDown={handleInputKeyDown}
                type="text"
                name="city"
                placeholder="Enter City"
              />
              <button onClick={handleClickUnit}>°F</button>
            </div>

            <div className="section section__temperature">
              <div className="icon">
                <h3>
                  {weather.name}, {weather.country}
                </h3>
                <img src={weather.iconURL} alt="weather" />
                <h3>{weather.description}</h3>
              </div>
              <div className="center-text">
                <p>Today</p>
              </div>
              <div className="temperature">
                <h1>
                  {weather.temp.toFixed()}°{units === "metric" ? "C" : "F"}
                </h1>

                <div className="weather-details">
                  <p>H: {weather.humidity}%</p>
                  <p>P: {weather.pressure} hPa</p>
                  <p>
                    WS: {weather.speed.toFixed()}{" "}
                    {units === "metric" ? "m/s" : "m/h"}
                  </p>
                </div>
              </div>
            </div>

            {/* /* Pass the forecast data to Description component */}
            <Description weather={weather} units={units} forecast={forecast} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
