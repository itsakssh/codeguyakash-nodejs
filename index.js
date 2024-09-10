require('dotenv').config()
const os = require("os");
const express = require("express")
const cluster = require("cluster")

const app = express();
const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 4200;

if (cluster.isPrimary) {
    console.log(`Primary Server PID: ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died `);
    });
} else {
    app.get('/', (req, res) => {
        const formattedPID = process.pid.toString().padStart(4, '0');
        res.status(200).json({ message: 'Running...', ServerPID: formattedPID });
    });

    app.listen(PORT, () => {
        console.log(`[Server Running...on ${PORT}] (PID ${process.pid.toString().padStart(6, '0')})`);
    });
}
