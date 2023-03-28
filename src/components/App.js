import {useState, useEffect} from 'react';
import Die from './Die';

export default function App() {
  const [nums, setNums] = useState([]);
  const [bools, setBools] = useState([false, false, false, false, false, false, false, false, false, false]);
  const [running, setRunning] = useState(true);
  const [displayedTimer, setDisplayedTimer] = useState('00:00:00:00');
  let ms = 0;
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let timer;
  const timerFunction = () => {
    ms++
    if (ms / 100 === 1) {
      ms = 0;
      seconds++;
    }
    if (seconds / 60 === 1) {
      seconds = 0;
      minutes++;
    }
    if (minutes / 60 === 1) {
      minutes = 0;
      hours++;
    }
    const addZeroes = time => (`${time}0`).length > 2 ? time : `0${time}`;
    ms = addZeroes(ms);
    seconds = addZeroes(seconds);
    minutes = addZeroes(minutes);
    hours = addZeroes(hours);
    setDisplayedTimer(`${hours}:${minutes}:${seconds}:${ms}`);
  };
  useEffect(() => {
    if (running) {
      timer = setInterval(timerFunction, 10);
    }
    return () => {
      clearInterval(timer);
    };
  }, [running]);
  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      setNums(prev => [...prev, Math.ceil(Math.random() * 6)]);
    }
  }, []);
  useEffect(() => {
    if (bools.every(bool => bool === bools[0]) && nums.every(val => val === nums[0])) {
      setRunning(false);
      document.querySelector('audio').play();
      if ((!localStorage.getItem('storedTime') || +displayedTimer.split(':').join('') < +localStorage.getItem('storedTime').split(':').join('')) && displayedTimer !== '00:00:00:00') {
        localStorage.setItem('storedTime', displayedTimer);
      }
    } else {
      setRunning(true);
    }
  });
  const roll = () => {
    const oldNums = nums;
    setNums([]);
    if (bools.every(bool => bool === bools[0]) && nums.every(val => val === nums[0])) {
      setBools([false, false, false, false, false, false, false, false, false, false]);
      for (let i = 0; i < 10; i++) {
        setNums(prev => [...prev, Math.ceil(Math.random() * 6)]);
      }
    } else {
      for (let i = 0; i < 10; i++) {
        if (bools[i]) {
          setNums(prev => [...prev, oldNums[i]]);
        } else {
          setNums(prev => [...prev, Math.ceil(Math.random() * 6)]);
        }
      }
    }
  };
  const handleClick = id => setBools(prev => prev.map((bool, i) => id === i ? !bool : bool));
  return (
    <div>
      <main>
        <div id='absolute'>
          <p className='displayed-timer'>Game Length: {displayedTimer}</p>
          {localStorage.getItem('storedTime') && <p className='displayed-timer'>Fastest Time: {localStorage.getItem('storedTime')}</p>}
        </div>
        <div id='filler'>uewjofkansdlm</div>
        <h1>Foodroll</h1>
        <p id='description'>To play the game, click roll until all food images are the same. To freeze an image between rolls, click it.</p>
        <div id='dies'>
          {nums.map((num, i) => <Die val={num} bool={bools[i]} key={i} onClick={() => handleClick(i)}/>)}
        </div>
        <h2 onClick={roll}>{bools.every(bool => bool === bools[0]) && nums.every(val => val === nums[0]) ? 'Play again' : 'Roll'}</h2>
      </main>
    </div>
  );
}