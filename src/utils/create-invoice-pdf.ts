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

const formatPrice = (price: string) =>
	new Intl.NumberFormat('tr-TR', {
		minimumFractionDigits: 2,
	}).format(Number(price));

export function createInvoicePdf(invoice: SaleInfo): PDFKit.PDFDocument {
	const doc = new PDFKit({
		margin: 100,
		info: { Title: 'Araba Satış Faturası' },
	});

	doc.moveDown(2)
		.fillColor('#3B5998')
		.font('Helvetica-Bold')
		.fontSize(16)
		.text('Stock Management System', { align: 'center' })
		.moveDown(0.2)
		.fillColor('#111')
		.fontSize(8)
		.text(`${invoice.personel_email} | +90 (444) 444 44 44`, {
			align: 'center',
		});

	doc.moveDown(4)
		.fillColor('#3B5998')
		.fontSize(12)
		.text('Araba Satis Faturasi')
		.fillColor('#333')
		.fontSize(10)
		.font('Helvetica')
		.moveDown(0.5)
		.text(`Fatura Numarasi: ${invoice.serial_number}`)
		.moveDown(0.3)
		.text(
			`Musteri Adi Soyadi: ${invoice.customer_first_name.toUpperCase()} ${invoice.customer_last_name.toUpperCase()}`,
		)
		.moveDown(0.3)
		.text(
			`Satis Tarihi: ${new Date(invoice.sale_date).toLocaleDateString(
				'tr-TR',
			)}`,
		)
		.moveDown(0.3)
		.text(
			`Satisi Yapan Personel: ${invoice.personel_first_name.toUpperCase()} ${invoice.personel_last_name.toUpperCase()}`,
		);

	doc.moveDown(6)
		.font('Helvetica-Bold')
		.fontSize(12)
		.fillColor('#3B5998')
		.text('Arac Ilan Basligi', { lineBreak: false })
		.text('Model', { align: 'right' })
		.moveDown(1)
		.font('Helvetica')
		.fill('#111')
		.text(`${invoice.title}`, 100, undefined, { lineBreak: false })
		.text(`${invoice.model}`, { align: 'right' });

	doc.moveDown(4)
		.font('Helvetica-Bold')
		.fontSize(12)
		.fillColor('#3B5998')
		.text('Toplam', { align: 'left', lineBreak: false })
		.fillColor('#111')
		.text(`${formatPrice(invoice.price)} TL`, { align: 'right' });

	doc.moveDown(4)
		.font('Helvetica-Bold')
		.fontSize(12)
		.fillColor('#3B5998')
		.text('Sartlar', 100)
		.moveDown(1)
		.fillColor('#111')
		.font('Helvetica')
		.fontSize(10)
		.list(
			[
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
			],
			110,
		);

	doc.end();

	return doc;
}
