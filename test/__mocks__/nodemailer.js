

module.exports = {
    createTransport () {

    }

}

// the '__mocks__' folder dectect the file created insdie the mocks folder. then its freeze the same named module in node modules 
// so we can't use that module again when it's in the tesing mode

//@sendgrid/mail -> create  foldername = @sendgrid and filename = mail.js inside __mocks__ folder