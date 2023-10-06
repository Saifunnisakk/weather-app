import React from 'react';
import './Forecast.css';

function getDayName(dateString) {
  const options = { weekday: 'long' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export const Description = ({ weather, units, forecast }) => {
  const tempunit = units === 'metric' ? '°C' : '°F';

  return (
    <div className="section section__descriptions">
      {forecast.map((day, index) => (
        <div key={index} className="card">
          <div className="description__card-icon">
            <h3>{getDayName(day.date)}</h3>
            <img src={day.iconURL} alt={day.description} />
            </div>
          <h2>{`${day.temperature.toFixed()} ${tempunit}`}</h2>
        </div>
      ))}
    </div>
  );
};
