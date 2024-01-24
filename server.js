const express = require('express');
const axios = require('axios');

// Create Express app
const app = express();
const port = 3000;

// Endpoint for fetching country data
app.get('/fetch-country', async (req, res) => {
    try {
        // Fetch country data from the REST Countries API
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const data = response.data;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching country data:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Endpoint for processing country data
app.get('/process-country', async (req, res) => {
    try {
        // Fetch data from the REST Countries API
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const data = response.data;

        // Filter to include only countries with population > 50 million
        const filteredData = data.filter(country => country.population > 50000000);

        // Extract only name, capital, population, and region
        const transformedData = filteredData.map(country => ({
            name: country.name.common,
            capital: country.capital[0],
            population: country.population,
            region: country.region,
        }));

        // Sort by population in descending order
        const sortedData = transformedData.sort((a, b) => b.population - a.population);

        res.json({ success: true, data: sortedData });
    } catch (error) {
        console.error('Error processing country data:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// HTML file for frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
