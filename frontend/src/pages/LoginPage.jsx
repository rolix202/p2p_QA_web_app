import axios from 'axios'
import React, { useState } from 'react'

const LoginPage = () => {
    const [formDetails, setFormDetails] = useState({
        email: "",
        password: ""
    })

    const handlFormInput = (e) => {
        const { name, value } = e.target
        setFormDetails((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const formSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const response = await axios.post("http://localhost:5000/api/v1/auth/login", formDetails, {
                withCredentials: true
            })

            console.log(response);
            
        } catch (error) {
            console.log(error);
            
        }
        
    }

    return (
        <div>
            <form action="" method='post' onSubmit={formSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" id='email' value={formDetails.email} onChange={handlFormInput} name='email'/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="text" id='password' value={formDetails.password} onChange={handlFormInput} name='password'/>
                </div>
                <button>Login</button>
            </form>
        </div>
    )
}

export default LoginPage