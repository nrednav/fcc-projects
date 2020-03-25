import React, { Component } from 'react';
import './styles/App.css';

import DrumMachine from "./components/DrumMachine";
import Calculator from "./components/Calculator";
import PomodoroTimer from "./components/PomodoroTimer";

class App extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      project: <DrumMachine />,
      projects: [
        {
          name: "Drum Machine",
          component: <DrumMachine />
        },
        {
          name: "Calculator",
          component: <Calculator />
        },
        {
          name: "Pomodoro Timer",
          component: <PomodoroTimer />
        }
      ]
    }

    this.showProject = this.showProject.bind(this);
  }

  showProject(component, index) {
    let selectedProject = component;
    this.setState({
      project: selectedProject
    });

    const ele = document.querySelector(".active-project");
    if (ele !== null) {
      ele.classList.remove("active-project")
      document.querySelector(`#project-${index}`).classList.add("active-project")
    } else {
      document.querySelector(`#project-${index}`).classList.add("active-project")
    }
  }
  
  render() {
    const {project, projects} = this.state;

    return (
      <div className="App">
        <div className="project-info">
          <h1 className="app-title">FCC Projects</h1>
          <ul className="projects-list">
            {
              projects.map((project,index) => {
                return (
                  <li 
                  id={`project-${index}`}
                  onClick={() => this.showProject(project.component, index)} 
                  key={project.name}>
                    {project.name}
                  </li>
                );
              })
            }
          </ul>
        </div>
        <div className="project">
          {project}
        </div>
      </div>
    );
  }
}

export default App;
