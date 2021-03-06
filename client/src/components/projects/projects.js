import React, {Component} from 'react';
import './projects.css'
import { Menu, Image, Segment, Modal } from 'semantic-ui-react'
import Axios from 'axios';

class Project extends Component { 
  
  render(){
    let linksLabel = null;
    let github = null;  
    if (this.props.github !== "") {
      linksLabel = <b>Links:</b>;
      github = <a href={this.props.github} target="_blank"><Image spaced id="project-link-logo" src="https://image.flaticon.com/icons/svg/37/37819.svg" inline={true} size={"mini"} /></a>;
    }
    let devpost = null;  
    if (this.props.devpost !== "") {
      linksLabel = <b>Links:</b>;
      devpost = <a href={this.props.devpost} target="_blank"><Image spaced id="project-link-logo" src="https://upload.wikimedia.org/wikipedia/commons/6/6a/External_link_font_awesome.svg" inline={true} size={"mini"} /></a>;
    }
    let image = null;
    if (this.props.img !== "") {
      image = <Image shape={"rounded"} bordered={true} centered={true} size={"large"} src={this.props.img} alt={this.props.altTxt}/>;
    }
  
    return (
      <Segment>
        {image}
        <h3>{this.props.name} — {this.props.date}</h3>
        <p id="textSegment">{this.props.txt}</p>
        {linksLabel} {devpost}{github}
      </Segment>
    )
  }
}

class Projects extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            years: []
        };
        this.getPosts = this.getPosts.bind(this);
    }
  
    componentDidMount() {
        this.getYears();
    }
    
    getPosts(){
        Axios.get('/api/projects/' + this.state.activeItem).then(res => {
            const projects = res.data.sort((a,b) => new Date(a.date + ' ' + a.year) - new Date(b.date + ' ' + b.year));
            this.setState({ projects: projects });
        });
    }
    
    getYears = () => {
        Axios.get('/api/projectyears/').then(res => {
            this.setState({ years: res.data, activeItem: String(res.data.sort((a, b) => b - a)[0])}, this.getPosts);
        });
    }
    
    handleItemClick = (e, { name }) => {this.setState({ activeItem: name }, this.getPosts)}
    
    render(){ return(
        <Modal closeIcon={true} trigger={this.props.trigger}>
        <Modal.Header>Projects</Modal.Header>
        <Segment.Group id="group">
            <Segment textAlign={"center"}>
                <Menu pointing secondary stackable>
                    {this.state.years.concat().sort((a, b) => b - a).map(year =>
                        <Menu.Item key={year} name={year} active={this.state.activeItem === String(year)} onClick={this.handleItemClick}/>
                    )}
                </Menu>
            </Segment>
            <Segment.Group id="group">
            {this.state.projects.reverse().map(project =>
                <Project key={project._id} name={project.name} date={project.date} txt={project.text} img={project.img} devpost={project.devpost} github={project.github}/>
            )}
            </Segment.Group>
        </Segment.Group>
        </Modal>
    )}
}
export default Projects