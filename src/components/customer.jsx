import React, {Component} from 'react';
import Department, { styles } from "./department";

class Customer extends Component {

    render() {
        return (
            <div className='row' style={styles.divStyles}>
                <input type="text" name="customer_name" placeholder="Name" style={styles.selectStyles}/>
                <input type="text" name="customer_phone" placeholder="Phone Number" style={styles.selectStyles}/>
            </div>
        )
    }
}

export default Customer;