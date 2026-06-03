// src/components/UserForm.jsx
import { useState } from 'react';

export default function UserForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('');

        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Iets ging fout');

            setName('');
            setEmail('');
            setPassword('');
            setStatus(`Gebruiker opgeslagen: ${data.name}`);
        } catch (err) {
            setStatus(err.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username
                <input
                    type="text"
                    placeholder="e.g. anna_michiels"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>

            <label>
                Email
                <input
                    type="email"
                    placeholder="e.g. anna.michiels@gmail.be"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>

            <label>
                Password
                <input
                    type="password"
                    placeholder="********"
                    minLength={8}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Opslaan...' : 'Opslaan'}
            </button>

            {status && <p>{status}</p>}
        </form>
    );
}
