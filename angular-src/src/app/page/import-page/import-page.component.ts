import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierModel } from '../../model/model';
import { SupplierService } from '../../service/supplier.service';
import { UploadOutput, UploadFile, UploadInput} from 'ngx-uploader';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  title: string;
  line1: string;
  line2: string;
}

@Component({
  selector: 'app-import-page',
  templateUrl: 'import-page-dialog.html',
})
export class ImportCompleteDialog {

  constructor(
    public dialogRef: MatDialogRef<ImportCompleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    public onCloseClick(): void {
      this.dialogRef.close();
  }
}

@Component({
  selector: 'app-import-page',
  templateUrl: './import-page.component.html',
  styleUrls: ['./import-page.component.css']
})
export class ImportPageComponent implements OnInit {
  public sheetName: string;
  public supplier: SupplierModel;
  // public supplierID: string;
  private file: UploadFile;
  public fileName: string;
  public suppliers: SupplierModel[];
  public uploadInput: EventEmitter<UploadInput>;
  public dlgData: DialogData;
  constructor(
    private router: Router,
    private supplierSrv: SupplierService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.sheetName = '';
    // this.supplierID = '';
    this.fileName= '';
    this.uploadInput = new EventEmitter<UploadInput>(); 
    this.dlgData={
      'title': '',
      'line1': '',
      'line2': ''
    }
    this.supplierSrv.getSuppliers().subscribe((response) => {
      this.suppliers = response;
    });
  }

  // public onSelectChange(event){
  //   this.supplierID = this.supplier._id;
  // }

  public onUploadOutput(output: UploadOutput): void {
    if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // when all files added in queue
      this.file = output.file;
      this.fileName = output.file.name;
    }
    if(output.type === 'done'){
      this.file=null;
      this.fileName = ''
      switch(output.file.responseStatus){
        case 200:
          this.dlgData.title = '匯入成功';
          this.dlgData.line1 = '新增: '+ output.file.response.nCreate+'筆';
          this.dlgData.line2 = '修改: '+ output.file.response.nModified+'筆';
        break;
        case 400:
          this.dlgData.title = '匯入失敗';
          this.dlgData.line1 = '請指訂工作表和供應商';
        break;
        case 403:
          this.dlgData.title = '匯入失敗';
          this.dlgData.line1 = '檔案：'+this.fileName + ',工作表：'+this.sheetName +'重覆匯入';
        break;
        case 404:
          this.dlgData.title = '匯入失敗';
          this.dlgData.line1 = '找不到供應商，請新增供應商';
        break;
        case 409:
          this.dlgData.title = '匯入失敗';
          this.dlgData.line1 = '檔案：'+this.fileName + '找不到工作表：'+this.sheetName;
        break;
      }
      this.openDialog();
    }
  };


  private openDialog(): void {
    const dialogRef = this.dialog.open(ImportCompleteDialog, {
      width: '250px',
      data: this.dlgData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.router.navigate(['/', 'itemPage']);
    });
  }

  public onSubmit() {
    console.log('on submit');
    const event: UploadInput = {
      type: 'uploadAll',
      url: '/upload/item',
      method: 'POST',
      data: { 
        sheetName: this.sheetName.toString(),
        supplierID: this.supplier._id.toString(),
        supplierName: this.supplier.name.toString()
      }
    };
    this.uploadInput.emit(event);
  }

  public onBack() {
    this.router.navigate(['/', 'itemPage']);
  }
}
