'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaClock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle, FaUserPlus, FaLock, FaUser } from 'react-icons/fa';
import { apiRequest } from '@/lib/api';

interface ValidationErrors {
    username?: string;
    password?: string;
    password2?: string;
    token?: string;
    [key: string]: string | undefined;
}

interface ApiError {
    message?: string;
    token?: string[];
    password?: string[];
    password2?: string[];
    username?: string[];
}

// Component that uses useSearchParams
function AcceptInvitationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        token: token || '',
        username: '',
        password: '',
        password2: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    // Check if token is valid on component mount
    useEffect(() => {
        if (!token) {
            setError('Invalid invitation link. Please check your email for the correct link.');
        } else {
            // Update token in form data when component mounts
            setFormData(prev => ({ ...prev, token: token }));
        }
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation errors when user starts typing
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = () => {
        const errors: ValidationErrors = {};

        if (!formData.username) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters long';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }

        if (!formData.password2) {
            errors.password2 = 'Please confirm your password';
        } else if (formData.password !== formData.password2) {
            errors.password2 = 'Passwords do not match';
        }

        if (!formData.token) {
            errors.token = 'Invalid invitation token';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiRequest('/users/invitation/accept/', {
                method: 'POST',
                body: formData
            });

            // Store authentication data
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_data', JSON.stringify(response.user));

            setSuccess('Welcome to the team! Redirecting to dashboard...');

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Invitation acceptance error:', err);
            const apiError = err as ApiError;
            if (apiError.token) {
                setError(apiError.token[0] || 'Invalid or expired invitation token.');
            } else if (apiError.password) {
                setValidationErrors({ password: apiError.password[0] });
            } else if (apiError.password2) {
                setValidationErrors({ password2: apiError.password2[0] });
            } else if (apiError.username) {
                setValidationErrors({ username: apiError.username[0] });
            } else {
                setError(apiError.message || 'Failed to accept invitation. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                    <FaUserPlus className="h-8 w-8 text-white" />
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-20 -z-10"></div>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            Accept Invitation
                        </h2>
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                            Complete your account setup to join the team
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
                        <div className="p-8">
                            {/* Success Message */}
                            {success && (
                                <div className="mb-6 bg-green-50/80 dark:bg-green-900/30 backdrop-blur-sm rounded-xl border border-green-200/50 dark:border-green-800/30 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="w-6 h-6 bg-green-100 dark:bg-green-800/30 rounded-lg flex items-center justify-center">
                                                <FaCheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-green-800 dark:text-green-400">
                                                {success}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm rounded-xl border border-red-200/50 dark:border-red-800/30 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="w-6 h-6 bg-red-100 dark:bg-red-800/30 rounded-lg flex items-center justify-center">
                                                <FaExclamationTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-red-800 dark:text-red-400">
                                                {error}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Username Field */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Username *
                                    </label>
                                    <div className="flex items-center gap-3 rounded-xl shadow-sm bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 px-3 py-3">
                                        <FaUser className="h-4 w-4 text-gray-400" />
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            autoComplete="username"
                                            required
                                            value={formData.username}
                                            onChange={handleChange}
                                            className={`block w-full bg-transparent outline-none border-none placeholder-gray-400 dark:text-white ${validationErrors.username
                                                ? 'text-red-600 dark:text-red-400'
                                                : ''
                                                }`}
                                            placeholder="Enter your username"
                                        />
                                    </div>
                                    {validationErrors.username && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                            {validationErrors.username}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Create Password *
                                    </label>
                                    <div className="flex items-center gap-3 rounded-xl shadow-sm bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 px-3 py-3 relative">
                                        <FaLock className="h-4 w-4 text-gray-400" />
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`block w-full bg-transparent outline-none border-none placeholder-gray-400 dark:text-white ${validationErrors.password
                                                ? 'text-red-600 dark:text-red-400'
                                                : ''
                                                }`}
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-4 w-4" />
                                            ) : (
                                                <FaEye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {validationErrors.password && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                            {validationErrors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="password2" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm Password *
                                    </label>
                                    <div className="flex items-center gap-3 rounded-xl shadow-sm bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 px-3 py-3 relative">
                                        <FaLock className="h-4 w-4 text-gray-400" />
                                        <input
                                            id="password2"
                                            name="password2"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            required
                                            value={formData.password2}
                                            onChange={handleChange}
                                            className={`block w-full bg-transparent outline-none border-none placeholder-gray-400 dark:text-white ${validationErrors.password2
                                                ? 'text-red-600 dark:text-red-400'
                                                : ''
                                                }`}
                                            placeholder="Confirm your password"
                                        />
                                        <button
                                            type="button"
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <FaEyeSlash className="h-4 w-4" />
                                            ) : (
                                                <FaEye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {validationErrors.password2 && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                            {validationErrors.password2}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !token}
                                    className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-3"></div>
                                            Accepting Invitation...
                                        </div>
                                    ) : (
                                        'Accept Invitation & Join Team'
                                    )}
                                </button>

                                {/* Sign In Link */}
                                <div className="text-center pt-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => router.push('/login')}
                                            className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                        >
                                            Sign in here
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Loading component
function LoadingFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            <div className="relative z-10 min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        </div>
    );
}

export default function AcceptInvitation() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AcceptInvitationForm />
        </Suspense>
    );
}