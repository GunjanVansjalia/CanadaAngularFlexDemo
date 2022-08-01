import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit, TRANSLATIONS } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['ItemId', 'Name', 'IsPrimary'];
  List: any = [];
  submitted = false;
  PrimaryName = "";
  progress = 0;
  files: any[] = [];
  selectedFiles: any;
  title = 'FileUpload';
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
  constructor(private _snackBar: MatSnackBar, private _formBuilder: FormBuilder, public http: HttpClient) { }
  ngOnInit(): void {
    this.Get();
  }

  upload(file: any) {
    console.log(file)
  }
  fileBrowseHandler(event) {
    this.prepareFilesList(event.target?.files);
  }
  prepareFilesList(files: Array<any>) {
    debugger;
    this.files = [];
    let index = 0;
    if (files.length > 5) {
      this.OpenSnackBar("More then 5 image is not allowed");
      return
    }
    for (const item of files) {
      if (item.size > (1000000 * 5)) {
        this.OpenSnackBar("More then 5Mb Image is not allowed");
        return;
      }
      if (!this.isFileImage(item)) {
        this.OpenSnackBar("Only image is allowed");
        this.files = [];
        return;
      }
      item.imgBase64Path = "";
      this.files.push(item);
      this.uploadFilesSimulator(index);
      index += 1;
    }

  }
  isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
  }
  uploadFilesSimulator(index: number) {

    for (const item of this.files) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          this.files[index].imgBase64Path = e.target.result;
        };
      };
      reader.readAsDataURL(item);
    }
  }
  formatBytes(bytes, decimals = 0) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }
  onFileDropped($event) {
    this.prepareFilesList($event);
  }
  submit() {
    if (this.files.length > 0) {
      this.submitted = true;
      let frmd = new FormData();

      let ItemImageList: any = []

      for (const item of this.files) {
        frmd.append('file' + item.name, item);

        let ItemImage = {
          Name: item.name,
          IsPrimary: this.PrimaryName == item.name ? true : false,
          ItemId: 1
        };

        ItemImageList.push(ItemImage);
      }
      let body = {
        Id: 1,
        ItemImageList: ItemImageList
      }
      // frmd.append('body' + JSON.stringify(body));
      this.http.post("//localhost:5272/api/FileManager/UploadFile", frmd, {
        reportProgress: true,
        observe: 'events'
      }).subscribe((val: any) => {
        switch (val.type) {
          case HttpEventType.UploadProgress:
            this.progress = Math.round(val?.loaded * 100 / val?.total);
            break;
          case HttpEventType.Response:
            debugger
            if (val.status == 200) {
              this.SaveData(ItemImageList);
            }
            break;
        }
      });
    }
    else
    {
      this.OpenSnackBar("Please select file first");
    }
  }
  SaveData(body) {
    debugger

    // stop here if form is invalid    

    this.http.post("//localhost:5272/api/FileManager/SaveData", body).subscribe(val => {
      this.submitted = false;
      this.OpenSnackBar("Information has beed saved");
      this.Get();
    });
  }
  OpenSnackBar(message) {
    this._snackBar.open(message, "Close", {
      duration: 2000,
    });
  }
  Get() {
    this.http.get("http://localhost:5272/api/FileManager/Get").subscribe(val => {
      this.List = val;

    });
  }
}
