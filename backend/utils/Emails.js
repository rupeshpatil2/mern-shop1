const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.sendMail = async(receiverEmail,subject,body) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: receiverEmail,
            subject: subject,
            html: body
        });
    } catch (error) {
        console.error("Failed to send email. Error:", error.message);
        console.log("FALLBACK: Email content logged below for development:");
        console.log(`To: ${receiverEmail}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}\n`);
    }
};
