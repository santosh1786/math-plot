const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PythonShell } = require('python-shell');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to plot the function
app.post('/plot', (req, res) => {
    const { functionStr, variables } = req.body;
    console.log('Received function:', functionStr);
    console.log('Received variables count:', variables);

    const pythonScriptPath = path.join(__dirname, 'plotter.py');
    console.log('Python script path:', pythonScriptPath);

    let options = {
        mode: 'text',
        pythonPath: '/usr/bin/python3', // Explicitly set the path to Python 3
        pythonOptions: ['-u'], // Get print results in real-time
        scriptPath: __dirname,
        args: [functionStr.replace('X', 'x'), variables.toString()]
    };

    console.log('Starting Python script...');
    PythonShell.run('plotter.py', options, (err, results) => {
        console.log('Python script execution finished.');
        if (err) {
            console.error('Error running Python script:', err);
            return res.status(500).send({ error: err.toString() });
        }
    
        // Parse the JSON output
        try {
            const output = JSON.parse(results.join(''));
            if (output.error) {
                console.error('Error from Python script:', output.error);
                return res.status(500).send({ error: output.error });
            }
    
            res.send({ image: `data:image/png;base64,${output.image}` });
        } catch (parseError) {
            console.error('Failed to parse Python output:', parseError);
            return res.status(500).send({ error: 'Failed to parse Python output' });
        }
    });    
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
