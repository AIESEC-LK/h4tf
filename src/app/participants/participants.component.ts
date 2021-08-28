import {Component, OnInit, ViewChild} from '@angular/core';
import {ParticipantsService} from "./participants.service";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {AuthService} from "../auth/auth.service";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-signups',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {

  participants: {}[] = [];

  //Table
  columnsToDisplay = ['first_name', 'email', 'phone', 'from', 'institute', 'interest', 'year', 'cv', 'stage'];

  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource(this.participants);
  filter = "";

  renderedData: any;

  constructor(public participantsService: ParticipantsService, public authService: AuthService, private dialog: MatDialog) {
  }

  async ngOnInit() {
    try {
      this.participants = <{}[]>await this.participantsService.getParticipants();
      console.log("Participants: ", this.participants);
      this.dataSource = new MatTableDataSource<{}>(this.participants);
      this.dataSource.sort = this.sort;
      this.dataSource.connect().subscribe(d => this.renderedData = d);
    } catch (e) {
        this.dialog.open(DialogComponent, {
          data: {
            type: "error",
            title: "ERROR",
            message: e + "Entity:" + this.authService.getEntity() + " Role:"+ this.authService.getRole() + " Email:" + this.authService.getEmail()
          }
        })
    }
  }

  public openProfile(email: string) {
    window.location.href = "/participants/"+email
  }

  public doFilter() {
    this.dataSource.filter = this.filter.trim().toLocaleLowerCase();
  }

  public async openCV(filename: string) {
    const url = await this.participantsService.getCVDownloadUrl(filename);
    console.log(url);
  }

  getDisplayedColumns(): string[] {
    let columnsToDisplay = ['first_name', 'email', 'phone', 'from', 'institute', 'year', 'cv', 'stage'];
    const columnsToDisplayMobile = ['first_name', 'stage'];
    if (window.innerWidth < 600) columnsToDisplay = columnsToDisplayMobile
    if (this.authService.getRole() == "admin") columnsToDisplay.push('entity');
    return columnsToDisplay;
  }

}
