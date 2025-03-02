
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth : {
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
})

// Send email for successfull regiestration

exports.welcomeMail = async ( email, name ) => {
    
    // try {

    //     const mailOptions = {
    //         from : process.env.EMAIL,
    //         to : email,
    //         subject : `Thank's for joining`,
    //         text : `Welcome to Mediazone faimily ${name}.`
    //     }


    //    const info = await transporter.sendMail( mailOptions);

    // } catch (error) {
    //     console.log(`my err:`,error)
    // }
}

// Send Mail for dectivating account

exports.cancelMail = async ( email, name ) => {

    // try {

    //     const mailOptions = {

    //         from : 'Mediazone',
    //         to : email,
    //         subject : 'Account deactivate',
    //         text : `Dear ${name}, your account has been deactivated, please infrom to the mediazone if that's not you`
    
    //     }
    
    //     const info  = await transporter.sendMail( mailOptions )

        
    // } catch ( error ) {

    //     console.log( error );

    // }
}

