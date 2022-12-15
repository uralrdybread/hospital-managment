import { DeleteDoctorComponent } from './delete-doctor/delete-doctor.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from './../../../shared/service/data.service';
import { AddDoctorComponent } from './add-doctor/add-doctor.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Doctor } from 'src/app/shared/model/doctor';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {


  doctorsArr : Doctor[] = [];
  displayedColumns: string[] = ['name', 'mobile', 'email', 'department', 'gender', 'action'];
  dataSource!: MatTableDataSource<Doctor>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private dataApi: DataService,
    private _snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.getAllDoctors();
  }

  addDoctor() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title : 'Register doctor',
      button : 'Register'
    }

    const dialogRef = this.dialog.open(AddDoctorComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data: any) => {
      if(data) {
        this.dataApi.addDoctor(data);
        this.openSnackBar("Registration of doctor is successful.", "Ok")
      }
    })
  }

  editDoctor(row : any) {
    if(row.id == null || row.name == null){
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = row;
    dialogConfig.data.title = "Edit doctor";
    dialogConfig.data.buttonName = "Update";
    dialogConfig.data.birthdate = row.birthdate.toDate();

    const dialogRef = this.dialog.open(AddDoctorComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data: any) => {
      if(data) {
        this.dataApi.updateDoctor(data);
        this.openSnackBar("Details is updated successfully.", "Ok")
      }
    })
  }

  deleteDoctor(row : any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title : 'Delete doctor',
      doctorName : row.name
    }

    const dialogRef = this.dialog.open(DeleteDoctorComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data: any) => {
      if(data) {
        this.dataApi.deleteDoctor(row.id);
        this.openSnackBar("Doctor deleted successfully.", "Ok")
      }
    })
  }


  getAllDoctors(){
    this.dataApi.getAllDoctors().subscribe(res => {
      this.doctorsArr = res.map((e : any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })
      console.log(this.doctorsArr)
      this.dataSource = new MatTableDataSource(this.doctorsArr)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
