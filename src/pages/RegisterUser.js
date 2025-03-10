import React from 'react';
import withNavigate from '../hooks/withNavigate';
import backgroundImage from "./../../public/assets/images/family.jpg"; // Import the image
import { NavLink } from 'react-router-dom';

class RegisterUser extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            firstName: "",
            lastName: "",
            SAID: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }


    handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Registering user');

        const { firstName, lastName, password, email, phoneNumber, SAID } = this.state;

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                firstName,
                lastName,
                password,
                email,
                phoneNumber,
                SAID, 
                
            })
        });

        if (response.ok) {
            // Handle successful registration (e.g., redirect to login page)
            console.log('Registration successful');
            // Redirect to login page
            this.props.navigate('/');  
        } else {
            const errorData = await response.json();
            this.setState({ errorMessage: errorData.message }); // Set error message in state
            console.error('Registration failed:', errorData.message);
            alert(`Registration failed: ${errorData.message}`); // Alert the user with the error message
        }
    };

    render() {
        return (
            <div className="relative bg-myBlue-300 h-[90vh] box-border flex justify-center items-center mx-0 p-10">
                <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${backgroundImage})` }}></div>

                <div className="relative flex flex-col justify-center items-center box-border rounded-xl bg-white w-[90%] sm:w-[35vw] gap-7 h-[85vh] p-8 min-w-[350px]">
                    <div className='text-2xl font-bold text-center rounded-lg box-border h-[10%] flex justify-center items-center'>
                        Register
                    </div>
                    <form onSubmit={this.handleSubmit} className="flex flex-col items-center gap-3 overflow-y-auto h-[80%] w-full p-2">
                        <div className=' w-full flex flex-col justify-center items-start mx-0 p-0'>
                            
                            <input 
                                type="text" 
                                name="firstName" 
                                value={this.state.firstName} 
                                onChange={this.handleChange}
                                placeholder='First Name'
                                className="w-full h-[7vh] border-none bg-gray-200 rounded-md p-2  focus:outline-myBlue-100 invalid:outline-red-600"
                                required
                            />
                        </div>
                        <div className=' w-full flex flex-col justify-center items-start mx-0 p-0'>
                            
                            <input 
                                type="text" 
                                name="lastName" 
                                value={this.state.lastName} 
                                onChange={this.handleChange}
                                placeholder='Last Name'
                                className="w-full h-[7vh] border-none bg-gray-200 rounded-md p-2  focus:outline-myBlue-100 invalid:outline-red-600"
                                required
                            />
                        </div>
                        <div className=' w-full flex flex-col justify-center items-start mx-0 p-0'>
                            
                            <input 
                                type="text" 
                                name="SAID" 
                                value={this.state.SAID} 
                                onChange={this.handleChange}
                                placeholder='SAID'
                                className="w-full h-[7vh] border-none bg-gray-200 rounded-md p-2  focus:outline-myBlue-100 invalid:outline-red-600"
                                required
                            />
                        </div>
                        <div className=' w-full flex flex-col justify-center items-start mx-0 p-0'>
                            
                            <input 
                                type="email" 
                                name="email" 
                                value={this.state.email} 
                                onChange={this.handleChange}
                                placeholder='Email'
                                className="w-full h-[7vh] border-none bg-gray-200 rounded-md p-2  focus:outline-myBlue-100 invalid:outline-red-600"
                                required
                            />
                        </div>
                        <div className=' w-full flex flex-col justify-center items-start mx-0 p-0'>
                            
                            <input 
                                type="text" 
                                name="phoneNumber" 
                                value={this.state.phoneNumber} 
                                onChange={this.handleChange}
                                placeholder='Phone Number'
                                className="w-full h-[7vh] border-none bg-gray-200 rounded-md p-2  focus:outline-myBlue-100 invalid:outline-red-600"
                                required
                            />
                        </div>
                        <div className=' w-full flex flex-col justify-center items-start mx-0 p-0'>
                            
                            <input 
                                type="password" 
                                name="password" 
                                value={this.state.password} 
                                onChange={this.handleChange}
                                placeholder='Password'
                                className="w-full h-[7vh] border-none bg-gray-200 rounded-md p-2  focus:outline-myBlue-100 invalid:outline-red-600"
                                required
                            />
                        </div>
                        <div className=' w-full flex flex-col justify-center items-start mx-0 p-0'>
                            
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                value={this.state.confirmPassword} 
                                onChange={this.handleChange}
                                placeholder='Confirm Password'
                                className="w-full h-[7vh] border-none bg-gray-200 rounded-md p-2  focus:outline-myBlue-100 invalid:outline-red-600"
                                required
                            />
                        </div>

                    </form>

                    <div className=' w-full flex justify-center items-center h-[5%] '>
                        <NavLink to="/" className="hover:text-myYellow-100 hover:bg-none">Already have an account? </NavLink>
                    </div>

                    <div className=" w-full h-[10%] rounded-lg flex justify-center items-center">
                        <button type="submit" className="button" onClick={this.handleSubmit}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withNavigate(RegisterUser);