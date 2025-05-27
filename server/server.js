const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/reportsdb', { useNewUrlParser: true, useUnifiedTopology: true });

const ReportSchema = new mongoose.Schema({
    uuid: String,
    name: String
    // Add other fields as needed
});
const Report = mongoose.model('Report', ReportSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create new report
app.post('/api/reports', async (req, res) => {
    try {
        const { uuid, name } = req.body;
        const report = new Report({ uuid, name });
        await report.save();
        res.json(report); // Always send JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save report' }); // Send error as JSON
    }
});

// Get all reports
app.get('/api/reports', async (req, res) => {
    const reports = await Report.find();
    res.json(reports);
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));

app.delete('/api/reports', async (req, res) => {
    try {
        await Report.deleteMany({});
        res.json({ message: 'All reports deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete reports' });
    }
});

app.get('/api/reports/:name', async (req, res) => {
    try {
        const report = await Report.findOne({ name: req.params.name });
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch report' });
    }
});