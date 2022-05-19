import {Component, OnInit, ViewChild} from '@angular/core';
import {ParticipantsService} from "./participants.service";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {AuthService} from "../auth/auth.service";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Participant} from "../interfaces/participant";

@Component({
  selector: 'app-signups',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})

export class ParticipantsComponent implements OnInit {

  participants: Participant[] = [];

  columns = ['name', 'email', 'phone', 'from', 'institute', 'interest', 'year', 'cv', 'stage', 'signed-up',
    'contacted', 'rejected', 'applied', 'accepted', 'approved', 'realized', 'finished', 'completed', 'ELD convert'];
  selectedColumns = this.columns;

  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource(this.participants);
  filter = {
    quick_filter: "",
    signed_up: {
      start: null,
      end: null
    }
  };

  renderedData: any;

  constructor(public participantsService: ParticipantsService, public authService: AuthService, private dialog: MatDialog) {
  }

  async ngOnInit() {
    try {
      this.participants = await this.participantsService.getParticipants();
      console.log("Participants: ", this.participants);
      this.dataSource = new MatTableDataSource<Participant>(this.participants);
      this.dataSource.sort = this.sort;
      this.dataSource.connect().subscribe(d => this.renderedData = d);
      this.getDisplayedColumns();
      console.log("Role: ", this.authService.getRole());
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
    console.log("Filter", this.filter)
    this.dataSource.data = this.participants;
    this.dataSource.filter = this.filter.quick_filter.trim().toLocaleLowerCase();

    // Signed up date filters
    let signed_up_filter = this.filter.signed_up;
    if (signed_up_filter.start != null) {
      this.dataSource.data = this.dataSource.data.filter(e => {
        return Date.parse(e.createdTimeStamp) >= Date.parse(signed_up_filter.start!)
      });
    }
    if (signed_up_filter.end != null) {
      this.dataSource.data = this.dataSource.data.filter(e=> {
        console.log(Date.parse(e.createdTimeStamp), Date.parse(signed_up_filter.end!));
        return Date.parse(e.createdTimeStamp)  <= Date.parse(signed_up_filter.end!) + 60*60*24*1000
      });
    }
  }

  public async openCV(filename: string) {
    const url = await this.participantsService.getCVDownloadUrl(filename);
    console.log(url);
  }

  getDisplayedColumns(): void {
    this.selectedColumns = ['name', 'email', 'phone', 'from', 'institute', 'year', 'cv', 'stage', 'signed-up'];
    const columnsToDisplayMobile = ['name', 'stage'];
    if (window.innerWidth < 600) this.selectedColumns = columnsToDisplayMobile
    if (this.authService.getRole() == "admin") this.selectedColumns.push('entity');
  }
}
