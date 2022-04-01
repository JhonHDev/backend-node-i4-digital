import exceljs from 'exceljs';

import fs from 'fs';

import { IRequestData } from '../models/RequestData';

class ExcelFileService {
  private workbook: exceljs.Workbook;

  private folderName = 'files';
  private dateNow = Date.now();
  private fileName = `requests-${this.dateNow}.xlsx`;

  private path = `.../../src/${this.folderName}/${this.fileName}`;

  constructor() {
    this.workbook = new exceljs.Workbook();
  }

  setColumnsFirstSheet() {
    const columns = [
      { header: 'Id', key: 'id' },
      { header: 'Method Used', key: 'methodUsed' },
      { header: 'Created At', key: 'createdAt' },
      { header: 'Updated At', key: 'updatedAt' },
    ];

    return columns;
  }

  setColumnsSecondSheet() {
    const columns = [{ header: 'Data Returned', key: 'dataReturned' }];
    return columns;
  }

  setSheet(sheetName: string) {
    return this.workbook.addWorksheet(sheetName);
  }

  createFirstSheet(requests: IRequestData[]) {
    const columns = this.setColumnsFirstSheet();
    const sheet = this.setSheet('request-header');

    sheet.columns = columns;
    sheet.addRows(requests);
  }

  createSecondSheet(requests: IRequestData[]) {
    const dataReturned = requests.map((request) => request.dataReturned);

    const columns = this.setColumnsSecondSheet();
    const sheet = this.setSheet('request-data');

    sheet.columns = columns;
    sheet.addRows(dataReturned);
  }

  setFileConfiguration(requests: IRequestData[]) {
    this.createFirstSheet(requests);
    this.createSecondSheet(requests);
  }

  getCreatedExcelFile() {
    const excelFiles = fs.readdirSync('./src/files');
    const currentExcelFile = excelFiles[excelFiles.length - 1];

    return currentExcelFile;
  }

  getExcelFileInFormatBase64() {
    const currentExcelFile = this.getCreatedExcelFile();
    return Buffer.from(currentExcelFile).toString('base64');
  }

  async createFile(requests: IRequestData[]) {
    this.setFileConfiguration(requests);

    try {
      await this.workbook.xlsx.writeFile(this.path);

      return this.getExcelFileInFormatBase64();

      /* eslint no-console: "off" */
      console.log('The file was successfully created!');
    } catch (error) {
      /* eslint no-console: "off" */
      console.log(error);
    }
  }
}

export default ExcelFileService;
