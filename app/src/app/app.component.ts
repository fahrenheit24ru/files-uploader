import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { CheckConnectionService } from './services/check-connection.service';
import { FileUploader } from './classes/file-uploader';
import { environment } from '../environments/environment';

const URL = environment.serverUrl;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  description = `
  Create CSV files upload form
  Ability to load multiple files (with the total size restriction)
  Preview for added files (as a table)
  Checking offline/online status of the app (with deferred upload after connection recovery)
  File upload progress
  Ability to cancel the upload process`;
  status: string = 'online';
  isConnected: boolean = false;
  formGroup = this.fb.group({
    file: [null, Validators.required]
  });
  uploader: FileUploader;

  constructor(
    private _checkConnection: CheckConnectionService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this._checkConnection.checkStatus().subscribe((isConnected) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = 'online';
      } else {
        this.status = 'Connection lost! You are not connected to the server';
      }
    });
    this.uploader = new FileUploader({
      url: URL
    });
  }
}
