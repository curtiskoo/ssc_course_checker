import React, {Component} from 'react';
import Course from "./course";
//import Select from "react-select";

const server = "http://localhost:8000/api/";

class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            course: '',
            dept: [],
            value: '',
            firstload: false,
            year: `${new Date().getFullYear()-1}/${new Date().getFullYear()}`,
            terms: ['W', 'F', 'S'],
            term: '',
            sections: [],
            section: ''
        };

        this.handleChangeDept = this.handleChangeDept.bind(this);
        this.handleChangeNum = this.handleChangeNum.bind(this);
        this.handleChangeYear = this.handleChangeYear.bind(this);
        this.handleChangeTerm = this.handleChangeTerm.bind(this);
        this.handleChangeSection = this.handleChangeSection.bind(this);


    }
    //state = {dept: [], value: '', firstload: false};

    getDept() {
        const req = server+'get_dept';
        //console.log(req);
        if (this.state.firstload === false) {
            fetch(req, {method: 'GET'})
                .then(response => response.json())
                //.then(response => console.log(response))
                .then(responseJson => this.setState({dept: responseJson.dept, firstload: true}))
        }
    }

    getCourseNum() {
        console.log(this.state)
        const req = server+ `get_course_num?dept=${(this.state.value)}&year=${(this.state.year)}&term=${this.state.term}`;
        console.log(req)
        fetch(req, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(responseJSON => this.setState({courses: responseJSON.nums}))

    }

    getCourseSection() {
        const req = server+ `get_course_section?dept=${(this.state.value)}&course=${this.state.course}&year=${(this.state.year)}&term=${this.state.term}`;
        console.log(req)
        fetch(req, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(responseJSON => this.setState({sections: responseJSON.sections}))
    }

    async handleChangeYear(event) {
        await  this.setState({year: event.target.value})
    }

    async handleChangeDept(event) {
        console.log(event.target.value);
        await this.setState({value: event.target.value, course:'', section:''});
        if (this.state.term !== '' && this.state.value !== '') {
            this.getCourseNum()
        }
    }

    async handleChangeNum(event) {
        await this.setState({course: event.target.value, section:''});
        if (this.state.term !== '' && this.state.value !== '' && this.state.course !== '') {
            this.getCourseSection()
        }
    }

    async handleChangeTerm(event) {
        await this.setState({term: event.target.value, course:'', section:''});
        if (this.state.term !== '' && this.state.value !== '') {
            this.getCourseNum()
        }
    }

    async handleChangeSection(event) {
        await this.setState({section: event.target.value});
    }

    render() {
        this.getDept();
        console.log(this.state);
        return (
            <React.Fragment>
                <form>
                    <h1 style={this.hStyles}>SSC Course Checker</h1>
                    <div className="row">
                        <select className="form-control"  style={{width: '15%', margin: '25px 0px 0px 40px'}} id="year_select" value={this.state.year} onChange={this.handleChangeYear}>
                            <option value="" disabled selected>Select a School Year</option>
                            <option value={this.state.year}>{this.state.year}</option>
                        </select>
                        <select className="form-control" style={this.sideStyles} id="term_select" value={this.state.term} onChange={this.handleChangeTerm}>
                            <option value="" disabled selected>Select a Term</option>
                            { this.state.terms.map(t => <option value={t}>{ t }</option>) }
                        </select>
                    </div>
                    <select className="form-control" style={this.selectStyles} id="dept_select" value={this.state.value} onChange={this.handleChangeDept}>
                        <option value="" disabled selected>Select a Department</option>
                        { this.state.dept.map(d => <option value={d.dept}>{ d.dept }</option>) }
                    </select>
                    <select className="form-control" style={this.selectStyles} id="num_select" value={this.state.course} onChange={this.handleChangeNum}>
                        <option value="" disabled selected>Select a Course</option>
                        { this.state.courses.map(c => <option value={c.course} selected={c.course === this.state.course}>{ c.course }</option>) }
                    </select>
                    <select className="form-control" style={this.selectStyles} id="section_select" value={this.state.section} onChange={this.handleChangeSection}>
                        <option value="" disabled selected>Select a Section</option>
                        { this.state.sections.map(s => <option value={s.section} selected={s.section === this.state.section}>{ s.section }</option>) }
                    </select>
                    <button style={this.btnStyles} className="btn-success">Submit</button>
                </form>
            </React.Fragment>
        );
    }

    sideStyles = {
        width: '15%',
        margin: '25px 25px 0px 30px'
    }

    selectStyles = {
        width: '35%',
        margin: '25px'
    };

    btnStyles = {
        borderRadius: '5px',
        marginLeft: '25px',
    };

    hStyles = {
        margin: '25px'
    };
}

export default Department;