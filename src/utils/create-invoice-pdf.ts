import PDFKit from 'pdfkit';

const invoiceData = {
	shipping: {
		name: 'John Doe',
		address: '1234 Main Street',
		city: 'San Francisco',
		state: 'CA',
		country: 'US',
		postal_code: 94111,
	},
	items: [
		{
			item: 'TC 100',
			description: 'Toner Cartridge',
			quantity: 2,
			amount: 6000,
		},
		{
			item: 'USB_EXT',
			description: 'USB Cable Extender',
			quantity: 1,
			amount: 2000,
		},
	],
	subtotal: 8000,
	paid: 0,
	invoice_nr: 1234,
};

export function createInvoicePdf(invoice = invoiceData): PDFKit.PDFDocument {
	const doc = new PDFKit({ margin: 50 });

	// Header
	doc.image('public/logo.png', 50, 45, { width: 50 })
		.fillColor('#444444')
		.fontSize(20)
		.text('Stock Management System', 110, 57)
		.fontSize(10)
		.text('123 Main Street', 200, 65, { align: 'right' })
		.text('New York, NY, 10025', 200, 80, { align: 'right' })
		.moveDown();

	const { shipping } = invoice;

	doc.text(`Invoice Number: ${invoice.invoice_nr}`, 50, 200)
		.text(`Invoice Date: ${new Date()}`, 50, 215)
		.text(`Balance Due: ${invoice.subtotal - invoice.paid}`, 50, 130)
		.text(shipping.name, 475, 200)
		.text(shipping.address, 475, 215)
		.text(
			`${shipping.city}, ${shipping.state}, ${shipping.country}`,
			475,
			130,
		)
		.moveDown();

	let i,
		invoiceTableTop = 330;

	for (i = 0; i < invoice.items.length; i++) {
		const item = invoice.items[i];
		const position = invoiceTableTop + (i + 1) * 30;
		doc.fontSize(10)
			.text(item.item, 50, position)
			.text(item.description, 150, position)
			.text(String(item.amount / item.quantity), 280, position, {
				width: 90,
				align: 'right',
			})
			.text(String(item.quantity), 370, position, {
				width: 90,
				align: 'right',
			})
			.text(String(item.amount), 0, position, { align: 'right' });
	}

	doc.end();

	return doc;
}
