import {Component, OnInit, ViewChild} from '@angular/core';
import {ParticipantsService} from "./participants.service";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {AuthService} from "../auth/auth.service";

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

  constructor(public participantsService: ParticipantsService, public authService: AuthService) { }

  async ngOnInit() {
    this.participants = <{}[]>await this.participantsService.getParticipants();
    console.log("Participants: ", this.participants);
    this.dataSource = new MatTableDataSource<{}>(this.participants);
    this.dataSource.sort = this.sort;
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
    const columnsToDisplay = ['first_name', 'email', 'phone', 'from', 'institute', 'interest', 'year', 'cv', 'stage'];
    const columnsToDisplayMobile = ['first_name', 'stage'];
    if (window.innerWidth < 600) return  columnsToDisplayMobile
    return columnsToDisplay;
  }




}
