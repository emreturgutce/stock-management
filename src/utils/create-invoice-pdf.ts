import PDFKit from 'pdfkit';

interface SaleInfo {
	sale_date: string;
	serial_number: string;
	price: string;
	customer_first_name: string;
	customer_last_name: string;
	personel_first_name: string;
	personel_last_name: string;
	personel_email: string;
	title: string;
	description: string;
	model: string;
	year: string;
	is_new: string;
}

export function createInvoicePdf(invoice: SaleInfo): PDFKit.PDFDocument {
	const doc = new PDFKit({ margin: 50 });

	doc.image('public/logo.png', 50, 45, { width: 50 })
		.fillColor('#444444')
		.fontSize(20)
		.text('Stock Management System', 110, 57)
		.fontSize(10)
		.text('123 Main Street', 200, 65, { align: 'right' })
		.text('New York, NY, 10025', 200, 80, { align: 'right' })
		.moveDown();

	const shipping = {
		name: 'John Doe',
		address: '1234 Main Street',
		city: 'San Francisco',
		state: 'CA',
		country: 'US',
		postal_code: 94111,
	};

	doc.text(`Invoice Number: ${invoice.serial_number}`, 50, 200)
		.text(`Invoice Date: ${invoice.sale_date}`, 50, 215)
		.text(`Balance Due: ${invoice.price}`, 50, 130)
		.text(shipping.name, 475, 200)
		.text(shipping.address, 475, 215)
		.text(
			`${shipping.city}, ${shipping.state}, ${shipping.country}`,
			475,
			130,
		)
		.moveDown();

	doc.fontSize(10)
		.text(invoice.title, 50, 360)
		.text(invoice.description, 50, 380)
		.text(invoice.price, 50, 460);

	doc.end();

	return doc;
}
