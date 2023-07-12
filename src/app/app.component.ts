import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  records: any[] = [];
  record: any = {};
  isEditing = false;

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.databaseService.getRecords().subscribe(records => {
      this.records = records;
    });
  }

  saveRecord() {
    if (this.isEditing) {
      this.databaseService.updateRecord(this.record.id, this.record.name, this.record.email).subscribe(() => {
        this.resetForm();
        this.loadRecords();
      });
    } else {
      this.databaseService.createRecord(this.record.name, this.record.email).subscribe(() => {
        this.resetForm();
        this.loadRecords();
      });
    }
  }

  editRecord(record: any) {
    this.isEditing = true;
    this.record = { ...record };
  }

  deleteRecord(id: number) {
    this.databaseService.deleteRecord(id).subscribe(() => {
      this.loadRecords();
    });
  }

  resetForm() {
    this.record = {};
    this.isEditing = false;
  }
}
