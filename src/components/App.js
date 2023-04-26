import {useState, useEffect, useRef} from 'react';
import Die from './Die';

export default function App() {
  const [nums, setNums] = useState([]);
  const [bools, setBools] = useState([false, false, false, false, false, false, false, false, false, false]);
  const [running, setRunning] = useState(true);
  const [displayedTimer, setDisplayedTimer] = useState('00:00:00:00');
  const audioRef = useRef();
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
  const resetNums = () => {
    for (let i = 0; i < 10; i++) {
      setNums(prev => [...prev, Math.floor(Math.random() * 6)]);
    }
  };
  useEffect(() => {
    if (running) {
      timer = setInterval(timerFunction, 10);
    }
    return () => {
      clearInterval(timer);
    };
  }, [running]);
  useEffect(() => resetNums(), []);
  useEffect(() => {
    if (bools.every(bool => bool === bools[0]) && nums.every(val => val === nums[0])) {
      setRunning(false);
      audioRef.current.play();
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
      resetNums();
    } else {
      for (let i = 0; i < 10; i++) {
        setNums(prev => [...prev, bools[i] ? oldNums[i] : Math.floor(Math.random() * 6)]);
      }
    }
  };
  const handleClick = id => setBools(prev => prev.map((bool, i) => id === i ? !bool : bool));
  return (
    <div>
      <main>
        <audio src="androidsound.mp3" ref={audioRef}></audio>
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
