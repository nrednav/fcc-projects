import React, { Component } from 'react'
import "../styles/DrumMachine.css";

class DrumMachine extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      sounds: {
        q: {
          name: "Chord 1",
          src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3"
        },
        w: {
          name: "Chord 2",
          src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3"
        },
        e: {
          name: "Chord 3",
          src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3"
        },
        a: {
          name: "Shaker",
          src: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3"
        },
        s: {
          name: "Open HH",
          src: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3"
        },
        d: {
          name: "Closed HH",
          src: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3"
        },
        z: {
          name: "Punch Kick",
          src: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3"
        },
        x: {
          name: "Side Stick",
          src: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3"
        },
        c: {
          name: "Snare",
          src: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3"
        }
      }
    }
    
    // Event handler bindings
    this.playSound = this.playSound.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.playSound);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.playSound);
  }
  
  playSound(e) {
    let key = e.key || e.target.innerText.toLowerCase();
    if (!Object.keys(this.state.sounds).includes(key)) return;
    let clip = document.querySelector(`#${key}`);
    let drumPad = clip.parentElement;
    
    document.querySelector("#display").innerText = this.state.sounds[key].name;
    
    drumPad.classList.add("active");
    clip.play().then(() => {
      setTimeout(() => {
        drumPad.classList.remove("active");
      }, clip.duration * 1000)
    })
  }
  
  render() {
    const {sounds} = this.state;
    return (
      <div id="drum-machine">
        <div id="display">-</div>
        {
          Object.keys(sounds).map(key => {
            return (
              <div key={key} className="drum-pad" onClick={this.playSound}>
                <audio className="clip" id={key.toLowerCase()} src={sounds[key].src}></audio>
                {key.toUpperCase()}
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default DrumMachine