// backend/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PythonShell } = require('python-shell');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/plot1', (req, res) => {
    const { functionStr, variables } = req.body;
    console.log('Received function:', functionStr); // Log received function
    console.log('Received variables count:', variables); // Log variable count

    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // Get print results in real-time
        pythonPath: 'C:/Python310/python.exe', // Change this to the path of your Python executable
        scriptPath: __dirname, // This sets the working directory to the current directory
        args: [functionStr.replace('X', 'x'), variables],
    };

    PythonShell.run('plotter.py', options, (err, results) => {
        if (err) {
            console.error('Error running Python script:', err); // Log any Python errors
            return res.status(500).send({ error: err.message });
        }

        console.log('Python script results:', results); // Log the results from Python
        const imgStr = results.join('\n').trim(); // Get the Base64 string from results
        if (!imgStr) {
            console.error('No image data returned from Python script'); // Log error if no image data
            return res.status(500).send({ error: 'No image data returned from Python script' });
        }
        res.send({ image: `data:image/png;base64,${imgStr}` }); // Return the Base64 image
    });
});

app.post('/plot2', (req, res) => {
    const { functionStr, variables } = req.body;
    console.log('Received function:', functionStr);
    console.log('Received variables count:', variables);

    let options = {
        mode: 'text',
        pythonOptions: ['-u'],
        pythonPath: 'C:/Python310/python.exe',
        scriptPath: __dirname,
        args: [functionStr.replace('X', 'x'), variables],
        debug: true,
    };

    console.log('Starting Python script...');
    PythonShell.run('plotter.py', options, (err, results) => {
        console.log('Python script execution finished.'); // Log after execution
        if (err) {
            console.error('Error running Python script:', err);
            return res.status(500).send({ error: err.message });
        }

        console.log('Python script results:', results);
        const imgStr = results.join('\n').trim();
        if (!imgStr) {
            console.error('No image data returned from Python script');
            return res.status(500).send({ error: 'No image data returned from Python script' });
        }
        res.send({ image: `data:image/png;base64,${imgStr}` });
    });
});

app.post('/plot', (req, res) => {
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // Get print results in real-time
        pythonPath: 'C:/Python310/python.exe', // Ensure this is correct
        scriptPath: __dirname, // Path where the script is located
        args: [], // No arguments for this test
    };

    console.log('Starting test Python script...');
    PythonShell.run('test_script.py', options, (err, results) => {
        console.log('Test Python script execution finished.'); // Log after execution
        if (err) {
            console.error('Error running test Python script:', err);
            return res.status(500).send({ error: err.message });
        }

        console.log('Test Python script results:', results);
        res.send({ message: 'Success', results }); // Return the results for this test
    });
});



app.get('/test', (req, res) => {
    let options = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: ['sin(x)', 1], // Test with a simple function
    };

    PythonShell.run('plotter.py', options, (err, results) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.send({ result: results.join('\n') }); // Return results directly
    });
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
