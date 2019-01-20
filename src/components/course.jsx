import React, {Component} from 'react';
import Customer from "./customer";
//import Select from "react-select";

const server = "http://localhost:8000/api/";

export default class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            course: '',
            dept: [],
            value: '',
            firstload: false,
            year: '',
            years: [],
            terms: ['W', 'S'],
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
        const req = server+`get_dept?year=${(this.state.year)}&term=${this.state.term}`;
        //console.log(req);
        fetch(req, {method: 'GET'})
            .then(response => response.json())
            //.then(response => console.log(response))
            .then(responseJson => this.setState({dept: responseJson.dept}))
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

    getYear() {
        const req = server + 'get_year';
        console.log(req);
        fetch(req, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(responseJSON => this.setState({years: responseJSON.years}))

    }

    async handleChangeYear(event) {
        await this.setState({year: event.target.value, course:'', section:'', value:''});
        if (this.state.year !== '' && this.state.term !== '') {
            this.getDept();
            this.getCourseNum();
            this.getCourseSection();
        }
    }

    async handleChangeDept(event) {
        console.log(event.target.value);
        await this.setState({value: event.target.value, course:'', section:''});
        if (this.state.term !== '' && this.state.value !== '') {
            this.getCourseNum();
            this.getCourseSection()
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
            this.getCourseNum();
            this.getCourseSection();
        } if (this.state.term !== '' && this.state.year !== '') {
            await this.setState({value: ''});
            this.getDept()
        }
    }

    async handleChangeSection(event) {
        await this.setState({section: event.target.value});
    }

    render() {
        if (this.state.firstload === false) {
            //this.getDept();
            this.getYear();
            this.setState({firstload:true})
        }
        console.log(this.state);
        return (
            <React.Fragment>
                <form>
                    <h1 style={styles.hStyles}>SSC Course Checker</h1>
                    <h3 style={styles.hStyles}>1) Choose a School Year + Term:</h3>
                    <div className="row" style={styles.divStyles}>
                        <select className="form-control"  style={styles.selectStyles} id="year_select" value={this.state.year} onChange={this.handleChangeYear}>
                            <option value="" disabled selected>Select a School Year</option>
                            { this.state.years.map(t => <option value={t.year}>{ t.year }</option>) }
                        </select>
                        <select className="form-control" style={styles.selectStyles} id="term_select" value={this.state.term} onChange={this.handleChangeTerm}>
                            <option value="" disabled selected>Select a Term</option>
                            { this.state.terms.map(t => <option value={t}>{ t }</option>) }
                        </select>
                    </div>
                    <h3 style={styles.hStyles}>2) Choose a Course:</h3>
                    <div className='row' style={styles.divStyles}>
                        <select className="form-control" style={styles.selectStyles} id="dept_select" value={this.state.value} onChange={this.handleChangeDept}>
                            <option value="" disabled selected>Select a Department</option>
                            { this.state.dept.map(d => <option value={d.dept}>{ d.dept }</option>) }
                        </select>
                        <select className="form-control" style={styles.selectStyles} id="num_select" value={this.state.course} onChange={this.handleChangeNum}>
                            <option value="" disabled selected>Select a Course</option>
                            { this.state.courses.map(c => <option value={c.course} selected={c.course === this.state.course}>{ c.course }</option>) }
                        </select>
                        <select className="form-control" style={styles.selectStyles} id="section_select" value={this.state.section} onChange={this.handleChangeSection}>
                            <option value="" disabled selected>Select a Section</option>
                            { this.state.sections.map(s => <option value={s.section} selected={s.section === this.state.section}>{ s.section }</option>) }
                        </select>
                    </div>
                    <h3 style={styles.hStyles}>3) Enter your information: </h3>
                    <Customer/>
                </form>
            </React.Fragment>
        );
    }

}


export const styles = {

    divStyles: {
        margin: '25px 0px 0px 25px'
    },

    selectStyles : {
        width: '20%',
        margin: '0px 25px 0px 0px'
    },

    btnStyles : {
        borderRadius: '5px',
        width: '10%',
        margin: '25px 0px 0px 25px'
    },

    hStyles : {
        margin: '25px'
    }

};

