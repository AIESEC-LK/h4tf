import {Component, OnInit, ViewChild} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {ParticipantsService} from "./participants.service";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-signups',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {

  participants: {}[] = [];

  //Table
  columnsToDisplay = ['first_name', 'email', 'phone', 'from', 'institute', 'interest', 'year', 'cv'];

  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource(this.participants);
  filter = "";

  constructor(private participantsService: ParticipantsService) { }

  async ngOnInit() {
    this.participants = <{}[]>await this.participantsService.getParticipants();
    console.log("Participants: ", this.participants);
    this.dataSource = new MatTableDataSource<{}>(this.participants);
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  public doFilter() {
    this.dataSource.filter = this.filter.trim().toLocaleLowerCase();
  }



}
