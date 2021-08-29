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

  columns = ['name', 'email', 'phone', 'from', 'institute', 'interest', 'year', 'cv', 'stage', 'signed-up',
    'contacted', 'rejected', 'applied', 'accepted', 'approved', 'realized', 'finished', 'completed', 'ELD convert'];
  selectedColumns = this.columns;

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
      this.getDisplayedColumns();
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

  getDisplayedColumns(): void {
    this.selectedColumns = ['name', 'email', 'phone', 'from', 'institute', 'year', 'cv', 'stage'];
    const columnsToDisplayMobile = ['name', 'stage'];
    if (window.innerWidth < 600) this.selectedColumns = columnsToDisplayMobile
    if (this.authService.getRole() == "admin") this.selectedColumns.push('entity');
  }
}
