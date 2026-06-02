require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server environment variables.');
}

const supabase = createClient(supabaseUrl || '', supabaseServiceRoleKey || '');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server werkt!');
});

app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Naam en email zijn verplicht.' });
    }

    const { data, error } = await supabase
        .from('users')
        .insert([{ name, email }])
        .select()
        .single();

    if (error) {
        return res.status(500).json({ message: error.message });
    }

    return res.status(201).json(data);
});

app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});
