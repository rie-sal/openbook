gabriele
mojave7314
Online

marie — Today at 10:23 AM
Image
marie — Today at 5:24 PM
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
Expand
message.txt
6 KB
﻿
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/recommend', async (req, res) => {
    console.log('Received request body:', req.body);
    const { message } = req.body;

    if (!process.env.OPENAI_API_KEY) {
        console.error('OpenAI API key is missing!');
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    console.log('Using API key:', process.env.OPENAI_API_KEY.slice(0, 5) + '...');

    try {
        console.log('Making request to OpenAI...');
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `
                            You are an assistant that only recommends books from this exact list. 
                            You must only suggest books from this list and nothing else:
                            1984 by George Orwell
                            Pride and Prejudice by Jane Austen
                            The Hobbit by J.R.R. Tolkien
                            Moby Dick by Herman Melville
                            The Catcher in the Rye by J.D. Salinger
                            The Great Gatsby by F. Scott Fitzgerald
                            Fahrenheit 451 by Ray Bradbury
                            The Girl on the Train by Paula Hawkins
                            Sapiens: A Brief History of Humankind by Yuval Noah Harari
                            To Kill a Mockingbird by Harper Lee
                            The Odyssey by Homer
                            Crime and Punishment by Fyodor Dostoevsky
                            War and Peace by Leo Tolstoy
                            The Brothers Karamazov by Fyodor Dostoevsky
                            Brave New World by Aldous Huxley
                            The Picture of Dorian Gray by Oscar Wilde
                            The Shining by Stephen King
                            The Alchemist by Paulo Coelho
                            Catch-22 by Joseph Heller
                            The Lord of the Rings by J.R.R. Tolkien
                            The Road by Cormac McCarthy
                            The Outsiders by S.E. Hinton
                            The Chronicles of Narnia by C.S. Lewis
                            100 Years of Solitude by Gabriel García Márquez
                            The Bell Jar by Sylvia Plath
                            The Handmaid's Tale by Margaret Atwood
                            Do not suggest any books outside of this list. If the user asks for a book, pick from this list only.
                        `
                    },
                    {
                        role: 'user',
                        content: `${message}\nYou must only suggest books from this list and nothing else: \n1984 by George Orwell\nPride and Prejudice by Jane Austen\nThe Hobbit by J.R.R. Tolkien\nMoby Dick by Herman Melville\nThe Catcher in the Rye by J.D. Salinger\nThe Great Gatsby by F. Scott Fitzgerald\nFahrenheit 451 by Ray Bradbury\nThe Girl on the Train by Paula Hawkins\nSapiens: A Brief History of Humankind by Yuval Noah Harari\nTo Kill a Mockingbird by Harper Lee\nThe Odyssey by Homer\nCrime and Punishment by Fyodor Dostoevsky\nWar and Peace by Leo Tolstoy\nThe Brothers Karamazov by Fyodor Dostoevsky\nBrave New World by Aldous Huxley\nThe Picture of Dorian Gray by Oscar Wilde\nThe Shining by Stephen King\nThe Alchemist by Paulo Coelho\nCatch-22 by Joseph Heller\nThe Lord of the Rings by J.R.R. Tolkien\nThe Road by Cormac McCarthy\nThe Outsiders by S.E. Hinton\nThe Chronicles of Narnia by C.S. Lewis\n100 Years of Solitude by Gabriel García Márquez\nThe Bell Jar by Sylvia Plath\nThe Handmaid's Tale by Margaret Atwood\nDo not suggest any books outside of this list. If the user asks for a book, pick from this list only.`
                    }
                ],
                max_tokens: 150,
                temperature: 0.0 // Enforcing deterministic behavior
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        console.log('OpenAI response received:', response.data);

        const recommendation = response.data.choices[0].message.content;
        console.log('Sending recommendation back to client:', recommendation);
       
        res.json({ recommendation });

    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data || 'No response data',
            status: error.response?.status || 'No status code'
        });

        res.status(500).json({
            error: 'Failed to fetch recommendation',
            details: error.response?.data || error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('OpenAI API Key present:', !!process.env.OPENAI_API_KEY);
});
message.txt
6 KB