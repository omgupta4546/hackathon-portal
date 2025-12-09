const express = require('express');
const router = express.Router();
const net = require('net');
const dns = require('dns');
const nodemailer = require('nodemailer');

const HOST = 'smtp.gmail.com';
const PORTS = [587, 465];

async function checkDNS(host) {
    return new Promise((resolve) => {
        dns.lookup(host, (err, address, family) => {
            if (err) resolve(`DNS Lookup failed: ${err.message}`);
            else resolve(`DNS Resolved: ${address} (IPv${family})`);
        });
    });
}

async function checkConnection(host, port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(5000);

        let status = '';
        socket.on('connect', () => {
            status = `✅ TCP Connection successful to ${host}:${port}`;
            socket.destroy();
            resolve(status);
        });
        socket.on('timeout', () => {
            status = `❌ TCP Connection timed out to ${host}:${port}`;
            socket.destroy();
            resolve(status);
        });
        socket.on('error', (err) => {
            status = `❌ TCP Connection error to ${host}:${port}: ${err.message}`;
            resolve(status);
        });
        socket.connect(port, host);
    });
}

async function trySendMail(port) {
    const transporter = nodemailer.createTransport({
        host: HOST,
        port: port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS ? '***HIDDEN***' : 'MISSING',
        },
        connectionTimeout: 10000,
        family: 4 // Force IPv4
    });

    try {
        await transporter.verify();
        return `✅ SMTP Handshake successful on port ${port}!`;
    } catch (err) {
        return `❌ SMTP Handshake failed on port ${port}: ${err.message}`;
    }
}

router.get('/', async (req, res) => {
    const logs = [];
    const log = (msg) => logs.push(msg);

    log('🚀 Starting Remote Email Diagnostics...');
    log(`Environment: SMTP_HOST=${process.env.SMTP_HOST}, SMTP_PORT=${process.env.SMTP_PORT}`);

    const dnsResult = await checkDNS(HOST);
    log(dnsResult);

    for (const port of PORTS) {
        log(`\nTesting Port ${port}...`);
        const tcpResult = await checkConnection(HOST, port);
        log(tcpResult);

        if (tcpResult.includes('✅')) {
            const smtpResult = await trySendMail(port);
            log(smtpResult);
        }
    }

    res.json({ logs });
});

module.exports = router;
