const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/plot', (req, res) => {
    const { functionStr, variables } = req.body;
    console.log('Received function:', functionStr);
    console.log('Received variables count:', variables);

    const pythonScriptPath = path.join(__dirname, 'plotter.py');
    console.log('Python script path:', pythonScriptPath);

    const pythonProcess = spawn('python3', [pythonScriptPath, functionStr.replace('X', 'x'), variables.toString()]);

    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error('Error from Python script:', data.toString());
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        try {
            const output = JSON.parse(dataString);
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
