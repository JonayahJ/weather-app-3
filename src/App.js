import React, { useEffect, useState } from 'react';
import './App.css';
import DayCard from './components/Card';

// Main App
function App() {
  // State
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [weatherData, setWeatherData] = useState('');

  // Fetch location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    })
    // console.log(latitude, longitude)
  }, [latitude, longitude])

  // Fetch weather when component mounts
  useEffect(() => {
    const baseURL = 'https://api.openweathermap.org/data/2.5/'
    const apiKey = process.env.REACT_APP_OWM_KEY
    const units = 'imperial'

    fetch(`${baseURL}onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}&exclude=current,minutely,hourly,alerts`)
      .then(res => res.json())
      .then(res => setWeatherData(res.daily.slice(0, 5).map(forecast => { // slice only 5 items
        return {
          day: forecast.dt, // UNIX timestamp
          desc: forecast.weather[0].main, // icon description
          icon: forecast.weather[0].icon, // icon
          max: forecast.temp.max, // temp max
          min: forecast.temp.min, // temp min
        }
      })));
  }, [latitude, longitude]);

  // See forecast results in console and call on page load 
  useEffect(() => {
    console.log(weatherData)
  }, [weatherData])

  return (
    <div className="App">
      <header className="App-header">
        {/* If weatherData is not undefined, map out the data to DayCard */}
        {!!weatherData && weatherData.map((i, index) => (
          <div key={index} style={{backgroundColor: index === 0 ? "#dddddd" : "transparent"}}> {/* Only at index 0, color should be #ddd. */}
            <DayCard day={i.day} desc={i.desc} icon={i.icon} max={i.max} min={i.min} />
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;

