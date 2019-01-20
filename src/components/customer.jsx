import React, {Component} from 'react';
import Course, { styles } from "./course";

class Customer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cx_name: null,
            cx_phone: null
        };

        this.updateCxName = this.updateCxName.bind(this);
        this.updateCxPhone = this.updateCxPhone.bind(this);

    }


    async updateCxName(event) {
        await this.setState({cx_name: event.target.value});
        this.props.getNamePhoneFromCustomer(this.state.cx_name, this.state.cx_phone)
    }

    async updateCxPhone(event) {
        await this.setState({cx_phone: event.target.value});
        this.props.getNamePhoneFromCustomer(this.state.cx_name, this.state.cx_phone)
    }


    render() {
        return (
            <React.Fragment>
                <div className='row' style={styles.divStyles}>
                    <input type="text" name="customer_name" placeholder="Name" onBlur={this.updateCxName}  style={styles.selectStyles}/>
                    <input type="text" name="customer_phone" placeholder="Phone Number" onBlur={this.updateCxPhone} style={styles.selectStyles}/>
                </div>
            </React.Fragment>
    )
    }
}

export default Customer;