import React, { useState, useEffect } from 'react'
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../Redux/store/index';
import { loginUser } from '../../../Redux/features/auth/loginslice';
import { useNavigate } from 'react-router-dom';


export default function login() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [isClient, setIsClient] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const isPasswordValid = formData.password.length >= 6;

    const iconStyle = "absolute right-3 translate-y-2 w-6 h-6";

    const ValidIcon = () => (
        <svg fill="currentColor" viewBox="0 0 24 24" className={`${iconStyle} text-green-400`}>
            <path
                fillRule="evenodd"
                d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm13.36-1.814a.75.75 0 00-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
            />
        </svg>
    );

    const InvalidIcon = () => (
        <svg fill="currentColor" viewBox="0 0 24 24" className={`${iconStyle} text-red-400`}>
            <path
                fillRule="evenodd"
                d="M12 2.25a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5zM8.47 8.47a.75.75 0 011.06 0L12 10.94l2.47-2.47a.75.75 0 111.06 1.06L13.06 12l2.47 2.47a.75.75 0 11-1.06 1.06L12 13.06l-2.47 2.47a.75.75 0 01-1.06-1.06L10.94 12 8.47 9.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
            />
        </svg>
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!isEmailValid || !isPasswordValid) {
            alert("Please enter valid email and password (min 6 characters)");
            return;
        }

        console.log("Submitting:", formData);
        dispatch(loginUser(formData)).then((result) => {
            if (loginUser.fulfilled.match(result)) {
                alert('Login successful!');
                navigate('/home');
            }
        });
    };

    useEffect(() => {
        setIsClient(true);
        setToken(localStorage.getItem("token"));
        setRole(localStorage.getItem("role"));
    }, []);

    if (!isClient) return null;

    if (token && role) {
        return <Navigate to="/home" replace />;
    }


    return (
        <>
            <div className="bg-black text-white flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
                <a href="#">
                    <div className="text-white font-semibold text-4xl tracking-tighter mx-auto flex items-center gap-2">
                        EchoAI
                    </div>
                </a>
                <div className="relative mt-12 w-full max-w-lg sm:mt-10">
                    <div className="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent" ></div>
                    <div
                        className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
                        <div className="flex flex-col p-6">
                            <h3 className="text-xl font-semibold leading-6 tracking-tighter">Login</h3>
                            <p className="mt-1.5 text-sm font-medium text-white/50">Welcome back, enter your credentials to continue.
                            </p>
                        </div>
                        <div className="p-6 pt-0">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <div>
                                        <div className="relative group rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                            <div className="flex justify-between">
                                                <label className="text-xs font-medium text-gray-400 group-focus-within:text-white">
                                                    Email
                                                </label>
                                                {formData.email && (isEmailValid ? <ValidIcon /> : <InvalidIcon />)}
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="you@example.com"
                                                className="block w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div>
                                        <div className="relative group rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                            <div className="flex justify-between">
                                                <label className="text-xs font-medium text-gray-400 group-focus-within:text-white">
                                                    Password
                                                </label>
                                                {formData.password && (isPasswordValid ? <ValidIcon /> : <InvalidIcon />)}
                                            </div>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="At least 6 characters"
                                                className="block w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" name="remember"
                                            className="outline-none focus:outline focus:outline-sky-300" />
                                        <span className="text-xs">Remember me</span>
                                    </label>
                                    <a className="text-sm font-medium text-foreground underline" href="/forgot-password">Forgot
                                        password?</a>
                                </div>
                                <div className="mt-4 flex items-center justify-end gap-x-2">
                                    <Link to="/signup" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-10 px-4 py-2 duration-200 hover:bg-white hover:text-black">Register</Link>
                                    <button
                                        className="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2 cursor-pointer"
                                        type="submit">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
