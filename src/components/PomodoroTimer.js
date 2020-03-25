import React, { Component } from 'react'
import "../styles/PomodoroTimer.css";

const Control = (props) => {
  
  let {label, length} = props.data;
  let {changeControlLength} = props.data;
  
  return (
    <div className={`${label}-control`}>
      <h2 id={`${label}-label`}>
        { label.charAt(0).toUpperCase() + label.slice(1) }
      </h2>
      <button className="control-button" id={`${label}-decrement`}
        onClick={changeControlLength}>
        <i className="fas fa-minus" />
      </button>
      <p id={`${label}-length`}>{length}</p>
      <button className="control-button" id={`${label}-increment`}
        onClick={changeControlLength}>
        <i className="fas fa-plus" />
      </button>
    </div>
  );
}

const Timer = (props) => {
  
  let {
    label,
    timeLeft,
    status
  } = props.data;
  
  let {
    reset,
    startTimer,
    pauseTimer
  } = props.functions;
  
  let startStopButton;
  if (status === "off" || status === "paused") {
    startStopButton = 
      <button id="start_stop" onClick={startTimer} >
        <i className="fas fa-play" />
      </button>;
  } else if (status === "running") {
    startStopButton = 
      <button id="reset" onClick={pauseTimer} >
        <i className="fas fa-pause" />
      </button>;
  }
  
  function formatTime(time) {
    let minutes = parseInt(time / 60000);
    let seconds = (time - minutes*60000)/1000;
    if (seconds.toString().length === 1) {
      seconds = '0' + seconds.toString();
    }
    if (minutes.toString().length === 1) {
      minutes = '0' + minutes.toString();
    }
    return `${minutes}:${seconds}`;
  }
  
  return (
    <div className="timer">
      <h2 id="timer-label">
        { label.charAt(0).toUpperCase() + label.slice(1) }
      </h2>
      <div id="time-left">
        { formatTime(timeLeft) }
      </div>
      <div className="timer-controls">
        {startStopButton}
        <button id="reset" onClick={reset}>
          <i className="fas fa-sync-alt" />
        </button>
      </div>
    </div>
  );
}

class PomodoroTimer extends Component {
  constructor(props) {
    super(props);
    
    this.handleLengthChange = this.handleLengthChange.bind(this);
    this.reset = this.reset.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    
    this.timerId = null;
    this.state = {
      break: {
        label: "break",
        length: 5,
        changeControlLength: this.handleLengthChange,
        timer: {
          status: "off"
        }
      },
      session: {
        label: "session",
        length: 25,
        changeControlLength: this.handleLengthChange,
        timer: {
          status: "off"
        }
      },
      timer: {
        label: "session",
        timeLeft: 25*(60*1000),
        status: "off",
      },
      timerFunctions: {
        reset: this.reset,
        startTimer: this.startTimer,
        pauseTimer: this.pauseTimer
      }
    }
  }
  
  componentDidMount() {
    document.addEventListener('click', this.playBeep);
  }
  
  componentWillUnmount() {
    document.removeEventListener('click', this.playBeep);
  }
  
  playBeep = (e) => {
    let beep = document.querySelector("#beep");
    beep.volume = 0;
    beep.play();
    
    if (e.target.id === "beep-trigger") {
      beep.volume = 1;
      beep.play();
    }
  }
  
  startTheTimer = (type) => {
    let {timer} = this.state;
    let {length} = this.state[type];
    
    if (timer.status != "paused") {
      timer.timeLeft = length * 60 * 1000;
    }
    
    timer.label = type;
    timer.status = "running";
    this.setState({timer: timer});
    
    this.timerId = setInterval(() => {
      let timer = this.state.timer;
      if (timer.timeLeft > 0) {
        timer.timeLeft -= 1000;
        this.setState({timer: timer});
      }
      else {
        clearInterval(this.timerId);
        document.querySelector("#beep-trigger").click();
        setTimeout(() => {
          this.startTheTimer('break');
        }, 3000);
      }
    }, 1000);
  }
  
  startTimer() {
    let {timer} = this.state;
    
    if (timer.status === "off")
      this.startTheTimer("session");
    else if (timer.status === "paused")
      this.startTheTimer(timer.label);
  }
  
  pauseTimer() {
    clearInterval(this.timerId);
    this.setState({
      timer: { ...this.state.timer, status: "paused" }
    });
  }
  
  handleLengthChange(e) {
    let elementId = e.target.parentElement.id;
    let [type,action] = elementId.split("-");
    
    if (action === "decrement") {
      if (this.state[type].length - 1 > 0) {
        this.setState(prevState => {
          let newObj = {...prevState[type]}
          newObj.length = prevState[type].length - 1;
          return { [type]: newObj}
        })
      }
    }
    else if (action === "increment") {
      if (this.state[type].length + 1 <= 60) {
        this.setState(prevState => {
          let newObj = {...prevState[type]};
          newObj.length = prevState[type].length + 1;
          return { [type]: newObj }
        })
      }
    }
    
  }
  
  reset() {
    this.setState({
      break: {
        ...this.state.break,
        length: 5
      },
      session: {
        ...this.state.session,
        length: 25
      },
      timer: {
        label: "session",
        status: "off",
        timeLeft: 25*(60*1000)
      }
    })
  }
  
  render() {
    return (
      <div className="pomodoro-clock">
        <Control data={this.state.break} />
        <Control data={this.state.session} />
        <Timer data={this.state.timer} functions={this.state.timerFunctions} />
        <div id="beep-trigger"></div>
      </div>
    );
  }
}

export default PomodoroTimer
