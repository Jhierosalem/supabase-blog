'use client'; // Required for client-side interactivity in Next.js App Router
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Update the path if necessary
import styles from './Auth.module.css'; // Import the CSS module

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (type) => {
    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const { error } =
        type === 'LOGIN'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (error) {
        alert(error.message);
      } else {
        alert(type === 'LOGIN' ? 'Logged in successfully!' : 'Signed up successfully!');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.authTitle}>Welcome Again</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.authInput}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.authInput}
      />
      <a href="#" className={styles.forgotPassword}>Forgot your password?</a>
      <button
        onClick={() => handleLogin('LOGIN')}
        className={styles.authButton}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Log in'}
      </button>
      <p className={styles.signUpLink}>
        Don’t have an account? <a href="#" onClick={() => handleLogin('SIGNUP')}>Sign Up</a>
      </p>
    </div>
  );
}