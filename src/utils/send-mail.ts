import nodemailer, { Transporter } from 'nodemailer';
import { NODE_ENV, SENDGRID_PASSWORD, SENDGRID_USERNAME } from '../config';

let transporter: Transporter;

if (NODE_ENV !== 'production') {
	nodemailer.createTestAccount((error, testAccount) => {
		if (error) {
			console.error(`Could not create mail test account: ${error}`);
			process.exit(1);
		}

		const transportOptions = {
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false,
			auth: {
				user: testAccount.user,
				pass: testAccount.pass,
			},
		};

		transporter = nodemailer.createTransport(transportOptions);
	});
} else {
	transporter = nodemailer.createTransport({
		service: 'SendGrid',
		auth: {
			user: SENDGRID_USERNAME,
			password: SENDGRID_PASSWORD,
		},
	} as any);
}

export async function sendEmail(mailOptions: nodemailer.SendMailOptions) {
	const info = await transporter.sendMail(mailOptions);

	console.info(`Preview URL:  ${nodemailer.getTestMessageUrl(info)}`);
}
