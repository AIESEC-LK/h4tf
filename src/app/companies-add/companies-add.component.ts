import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompaniesAddService } from "./companies-add.service";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from "../dialog/dialog.component";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../auth/auth.service";

interface UNIVERSITY {
  entity: string,
  //university: string
}

@Component({
  selector: 'app-company-reg',
  templateUrl: './companies-add.component.html',
  styleUrls: ['./companies-add.component.css']
})
export class CompaniesAddComponent implements OnInit {

  entities: string[] = [];

  form = new FormGroup({
    company_name: new FormControl(null, [Validators.required]),
    company_address: new FormControl(null, [Validators.required]),
    company_email: new FormControl(null, [Validators.required, Validators.email]),
    company_phone: new FormControl(null, [Validators.required,
    Validators.pattern('(^(0\\s*)([0-9]\\s*){8}[0-9]$)|^\\+([0-9]\\s*)*$')]),
    full_name: new FormControl(null, [Validators.required]),
    designation: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [Validators.required,
    Validators.pattern('(^(0\\s*)([0-9]\\s*){8}[0-9]$)|^\\+([0-9]\\s*)*$')]),
    entity: new FormControl()
  });

  // @ts-ignore
  @ViewChild('universitySearch') inputEl: ElementRef;

  constructor(private signUpService: CompaniesAddService, private dialog: MatDialog, private route: ActivatedRoute) {
  }

  async ngOnInit() {
    if (<string>this.route.snapshot.paramMap.get("entity")) {
      this.form.get("entity")?.setValue(<string>this.route.snapshot.paramMap.get("entity"));
    }

    this.signUpService.getEntities().subscribe(data => {
      this.entities = data;
    });
  }

  randomNumberInRange() {
    // Get number between 0 and max entities count
    var max = this.entities.length;
    return Math.floor((Math.random() * max));
  }

  async submitForm() {
    let loadingDialog = this.dialog.open(DialogComponent, { data: { type: "loading" } });
    try {
      if (!this.form.valid) throw "There was an error with your form";
      if (await this.signUpService.checkDuplicateCompany(this.form.get("company_name")?.value)) throw "The company has already been registered.";

      if (this.form.get("entity")?.value == null) {
        this.form.get("entity")?.setValue(this.entities[this.randomNumberInRange()]);
      }

      await this.signUpService.submitForm(this.form.value);

      this.dialog.open(DialogComponent, {
        data: {
          type: "success",
          title: "Registration",
          message: "Company is successfully registered"
        }
      }).afterClosed().subscribe(() => {
        window.location.href = "https://h4tf.aiesec.lk/companies"
      })
    } catch (err) {
      this.dialog.open(DialogComponent, {
        data: {
          type: "error",
          title: "ERROR",
          message: err
        }
      })
    } finally {
      loadingDialog.close();
    }
    return;
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
