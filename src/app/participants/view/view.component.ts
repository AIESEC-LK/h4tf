import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ParticipantsService} from "../participants.service";
import {Participant} from "../../interfaces/participant";
import {DialogComponent} from "../../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  public participant?: Participant

  public nextStages = {
    "signed-up": ["contacted", "rejected"],
    "rejected": ["signed up"],
    "contacted": ["applied", "rejected"],
    "applied": ["accepted", "rejected"],
    "accepted": ["approved"],
    "approved": ["realized"],
    "realized": ["finished"],
    "finished": ["completed"],
    "completed": ["ELD convert"]
  };

  public stagesFlow = ["signed up", "contacted", "applied", "accepted", "approved", "realized", "finished",
    "completed", "ELD convert"]

  constructor(private route: ActivatedRoute, private participantsService: ParticipantsService,
              private dialog: MatDialog) { }

  async ngOnInit() {
    if (!this.route.snapshot.paramMap.get("email")) return;
    const email = <string>this.route.snapshot.paramMap.get("email");
    this.participant = await this.participantsService.getParticipant(email);
    console.log(this.participant);
  }

  getNextStages(): string[] {
    if (this.participant?.status == "signed up") return this.nextStages["signed-up"];
    // @ts-ignore
    return this.nextStages[this.participant!.status]
  }

  async changeStatus(nextStage: string) {
    let loadingDialog = this.dialog.open(DialogComponent, {data: {type: "loading"}});
    try {
      await this.participantsService.changeStatus(this.participant!.email, nextStage);
      this.participant!.status = nextStage;
      // @ts-ignore
      this.participant[nextStage+'Timestamp'] = new Date().toISOString();
    } finally {
      loadingDialog.close();
    }
  }

  public getStagesSoFar() {
    let stages = ["signed up"];
    //let stages = [];
    for (let stage of this.stagesFlow) {
      if (stage == "signed up") continue;
      // if (stage == this.participant?.status) break;
      // @ts-ignore
      if (this.participant[stage+'Timestamp'] !== undefined) stages.push(stage);
    }
    //if (stages.indexOf(<string>this.participant?.status) !=  -1) stages.push(<string>this.participant?.status);
    return stages;
  }

  public getTimestamp(stage: any): string {
    let timestamp;
    // @ts-ignore
    timestamp = new Date(<string>this.participant[stage+'Timestamp']);
    if (stage == "signed up") {
      // @ts-ignore
      timestamp = new Date(<string>this.participant['createdTimeStamp']);
    }
    timestamp = timestamp.toLocaleDateString() + " " + timestamp.toLocaleTimeString();
    return this.participantsService.getTimestamp(timestamp);
  }

}
