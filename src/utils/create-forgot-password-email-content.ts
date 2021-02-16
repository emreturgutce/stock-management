export function createForgotPasswordEmailContent(email: string, url: string) {
	return {
		from: '"Stock Management" <forgotpassword@stockmanagement.com>',
		to: email,
		subject: 'Stock Management Forgot Password',
		text: 'Stock Management Forgot Password',
		html: `
				<div>
					Thank you for choosing <b>Stock Management</b> to deal with car stock systems.<br><br>

					The Stock Management offers all of the information you need to get the most out of our stocks and much more.<br><br>

					To access your account, click on the big blue button:<br><br>

					<a style={
						display: inline-block; 
						padding: 12px; 
						border-radius: 6px; 
						border: 1px solid #3391ff;
					} href="${url}">Change Password</a> <br><br>

					Once again – thank you for joining our Stock Management family!<br><br>
				</div>
			`,
	};
}
