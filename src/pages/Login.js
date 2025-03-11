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
            // <div className="flex flex-col justify-start items-center box-border h-[90vh] w-full">
            //     <div className="relative flex flex-row justify-center items-center gap-[3vw] box-border bg-myBlue-300 w-full h-[80vh]">
            //         <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            //         <div className="relative flex flex-col justify-start items-center box-border lg:text-7xl xl:text-8xl text-white w-[50vw] h-5/6 md:flex ">
            //                 Estate Liquidity Calculator
            //         </div>
            //         <div className="relative flex flex-col justify-center items-center box-border rounded-xl bg-white w-[90%] sm:w-[35vw] h-5/6 p-8 min-w-[350px]">
            //             <form className="h-full w-full flex flex-col justify-start items-center p-0" onSubmit={this.handleSubmit}>
            //                     <div className=" rounded-md w-full h-[15%] flex flex-start items-center justify-center text-4xl">
            //                         Login
            //                     </div>

            //                     <div className=" w-full h-[65%] flex flex-col justify-center items-center gap-10 p-3">
            //                             <input
            //                                 name="email"
            //                                 value={this.state.email}
            //                                 onChange={this.handleChange}
            //                                 placeholder="Email"
            //                                 className="w-full h-[20%] border-none bg-gray-200 rounded-md p-2  focus:outline-myBlue-100 invalid:outline-red-600"
            //                                 required
            //                             />

            //                             <input
            //                                 name="password"
            //                                 value={this.state.password}
            //                                 onChange={this.handleChange}
            //                                 placeholder="Password"
            //                                 type="password"
            //                                 className="w-full h-[20%] border-none bg-gray-200 rounded-md p-2 focus:outline-myBlue-100 invalid:outline-red-500"
            //                                 required
            //                             />
            //                     </div>

            //                     <div className="flex justify-center items-center  w-full h-[10%]">
            //                         <NavLink to="/RegisterUser"className="hover:text-myYellow-100 hover:bg-none">Don't have an account? </NavLink>
            //                     </div>

            //                     <div className=" w-full h-[20%] flex flex-col justify-center items-center">
            //                         <button type="submit" className="button">Login</button>
            //                     </div>
            //             </form>
            //         </div>
            //     </div>
            // </div>
            <div class="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
                <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
                    <h1 class="font-bold text-center text-2xl mb-5">Your Logo</h1>  
                    <div class="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
                    <div class="px-5 py-7">
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
                        <input type="text" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
                        <input type="text" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                        <button type="button" class="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
                            <span class="inline-block mr-2">Login</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                    <div class="py-5">
                        <div class="grid grid-cols-2 gap-1">
                        <div class="text-center sm:text-left whitespace-nowrap">
                            <button class="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block align-text-top">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                <span class="inline-block ml-1">Forgot Password</span>
                            </button>
                        </div>
                        <div class="text-center sm:text-right  whitespace-nowrap">
                            <button class="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block align-text-bottom	">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span class="inline-block ml-1">Help</span>
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="py-5">
                        <div class="grid grid-cols-2 gap-1">
                        <div class="text-center sm:text-left whitespace-nowrap">
                            <button class="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block align-text-top">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span class="inline-block ml-1">Back to your-app.com</span>
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withNavigate(Login);