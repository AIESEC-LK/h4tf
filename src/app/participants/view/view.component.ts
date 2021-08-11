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
    "contacted": ["applied"],
    "applied": ["accepted"],
    "accepted": ["approved"],
    "approved": ["realized"],
    "realized": ["finished"],
    "finished": ["completed"],
    "completed": ["ELD convert"]
  }

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
    } finally {
      loadingDialog.close();
    }
  }

}
