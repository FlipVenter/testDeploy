import React from "react"; 
import withNavigate from '../hooks/withNavigate';
import Cookies from 'js-cookie';
import { NavLink } from "react-router-dom";
//import styles
import backgroundImage from "./../../public/assets/images/manSigningDocuments.jpg"; // Import the image

class Login extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            email: "",
            password: ""
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
        Cookies.set(name, value, { expires: 1 });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const { email, password } = this.state;

        const response = await fetch('/.netlify/functions/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            console.log('Login successful');
            //set cookie with email 
            Cookies.set('email', email, { expires: 1 });
            Cookies.set('LoggedIn', true, { expires: 1 });
            this.props.navigate('/Profile'); 
        } else {
            console.log(response);
            alert('Login failed. Please check your email and password.');
        }
    }

    render() {
        return (
            <div className="flex flex-col justify-start items-center box-border h-[90vh] w-full sm:overflow-y-auto">
                <div className="relative flex flex-row justify-center items-center gap-[3vw] box-border bg-myBlue-300 w-full h-[80vh]">
                    <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
                    <div className="relative flex flex-col justify-start items-center box-border lg:text-7xl xl:text-8xl text-white w-[50vw] h-5/6 md:hidden ">
                            Estate Liquidity Calculator
                    </div>
                    <div className="relative flex flex-col justify-center items-center box-border rounded-xl bg-white w-[90%] h-5/6 p-8 min-w-[350px] sm:w-screen">
                        <form className="h-full w-full flex flex-col justify-start items-center p-0" onSubmit={this.handleSubmit}>
                                <div className=" rounded-md w-full h-[15%] flex flex-start items-center justify-center text-4xl">
                                    Login
                                </div>

                                <div className=" w-full h-[65%] flex flex-col justify-center items-center gap-10 p-3">
                                        <input
                                            name="email"
                                            value={this.state.email}
                                            onChange={this.handleChange}
                                            placeholder="Email"
                                            className="w-full h-[20%] border-none bg-gray-200 rounded-md p-2  focus:outline-myBlue-100 invalid:outline-red-600 min-h-9 sm:text-lg"
                                            required
                                        />

                                        <input
                                            name="password"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                            placeholder="Password"
                                            type="password"
                                            className="w-full h-[20%] border-none bg-gray-200 rounded-md p-2 focus:outline-myBlue-100 invalid:outline-red-500 min-h-9 sm:text-lg"
                                            required
                                        />
                                </div>

                                <div className="flex justify-center items-center  w-full h-[10%]">
                                    <NavLink to="/RegisterUser"className="hover:text-myYellow-100 hover:bg-none">Don't have an account? </NavLink>
                                </div>

                                <div className=" w-full h-[20%] flex flex-col justify-center items-center">
                                    <button type="submit" className="button min-w-fit min-h-fit sm:text-lg sm:w-screen">Login</button>
                                </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withNavigate(Login);