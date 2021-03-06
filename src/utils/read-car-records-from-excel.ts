import { Workbook } from 'exceljs';

/**
 * Returns car records from an excel file.
 * @param file Excel file that you want to read from.
 * @returns array of cars that has been read from file.
 */
export async function readCarRecordsFromExcel(file: Express.Multer.File) {
	const workbook = new Workbook();

	await workbook.xlsx.load(file.buffer); // Read Excel file from buffer

	const cars: Array<Array<string>> = [];

	workbook.worksheets[0].getRows(2, 10).forEach((row) => { // Read up to 10 rows at a time
		const car: string[] = [];

		row.eachCell((cell) => {
			car.push(cell.value as string);
		});

		if (car.length === 11) { // Make sure all cells are filled.
			cars.push(car);
		}
	});

	return cars;
}
