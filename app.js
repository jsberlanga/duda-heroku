const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const hbs = require('hbs');
const fs = require('fs');
const nodemailer = require('nodemailer');

const port = process.env.PORT || 3000
const app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', exphbs());
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('home.hbs', {
        titlePage: 'Duda Transport'
    })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        titlePage: 'About Us'
    })
});

app.get('/trucks', (req, res) => {
    res.render('trucks.hbs', {
        titlePage: 'Trucks'
    })
});

app.get('/contact', (req, res) => {
    res.render('contact.hbs', {
        titlePage: 'Contact Us'
    })
});

app.post('/send', (req, res) => {
    const output = `
    <h4>You have a new email from Duda Transport</h4>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name} </li>
        <li>Email: ${req.body.email} </li>
        <li>Phone: ${req.body.phone} </li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>  
`
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'duda.atthost24.pl',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "admin@dudatransport.com", // generated ethereal user
        pass: "Trans1234"  // generated ethereal password
    },
    tls: {
        rejectUnauthorized:false
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"Duda Transport Contact Form" <admin@dudatransport.com>', // sender address
    to: 'dudatransport5@gmail.com', // list of receivers
    subject: 'Message from dudatransport.com', // Subject line
    // text: 'Hello world?', // plain text body
    html: output // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('Contact', {msg:'Email has been sent'})

});

});

app.listen(port, () => {
    console.log(`Server has started in port:${port}`)
})