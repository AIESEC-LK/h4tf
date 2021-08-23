import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignUpService} from "./sign-up.service";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, startWith} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from "../dialog/dialog.component";
import {ActivatedRoute} from "@angular/router";

interface UNIVERSITY {
  entity: string,
  university: string
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  universities: UNIVERSITY[] = [];
  countries = {
    raw: [] as string[],
    filtered: null as null | Observable<string[]>
  };
  years = ["School Leaver", "1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"];

  form = new FormGroup({
    first_name: new FormControl(null, [Validators.required]),
    last_name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [Validators.required,
      Validators.pattern('(^(0\\s*)([0-9]\\s*){8}[0-9]$)|^\\+([0-9]\\s*)*$')]),
    from: new FormControl(null, [Validators.required]),
    university: new FormControl(),
    universityFilter: new FormControl(),
    country: new FormControl(),
    year: new FormControl(null, [Validators.required]),
    interest: new FormControl(null, [Validators.required]),
    consent: new FormControl(null,  [Validators.requiredTrue]),
    cv: new FormControl(null,  [Validators.required]),
    cv_filename: new FormControl(),
    entity: new FormControl()
  });

  public filteredUniversities: UNIVERSITY[] = [];

  // @ts-ignore
  @ViewChild('universitySearch') inputEl: ElementRef;

  formData = {
    cv: "",
    cv_file: null as null | File
  }

  constructor(private signUpService: SignUpService, private dialog: MatDialog, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    if (<string>this.route.snapshot.paramMap.get("entity")) {
      this.form.get("entity")?.setValue(<string>this.route.snapshot.paramMap.get("entity"));
    }

    this.signUpService.getUniversities().subscribe(data => {
      this.universities = data;
      this.filteredUniversities = data;
    });

    this.signUpService.getCountries().subscribe(data => {
      this.countries.raw = data;
    });

    // @ts-ignore
    this.countries.filtered = this.form.get("country").valueChanges
      .pipe(
        startWith(''),
        map((value: any) => this._filter(value, this.countries.raw))
      );

  }

  // @ts-ignore
  onFileSelected(event) {
    const file:File = event.target.files[0];
    this.formData.cv_file = file;
    if (file) {
      this.formData.cv = file.name;
    }
  }

  // @ts-ignore
  doUniversityFilter(event) {
    this.filteredUniversities = this.search(event.target.value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.universities.filter(option => option.university.toLowerCase().includes(filter));
  }


  isFormValid(): boolean {
    if (!this.form.valid) return false;
    if (this.form.get("from")?.value == "local" &&  this.form.get("university")?.value != null &&
      this.form.get("university")?.value != "") return true;
    if (this.form.get("from")?.value == "international" &&  this.form.get("country")?.value != null &&
      this.form.get("country")?.value != "") return true;
    return false;
  }

  async submitForm() {
    let loadingDialog = this.dialog.open(DialogComponent, {data: {type: "loading"}});
    try {
      if (!this.form.valid) throw "There was an error with your form";
      if (await this.signUpService.checkDuplicateEmail(this.form.get("email")?.value)) throw "Your email has already been used to sign up.";

      if (this.form.get("entity")?.value == null) {
        this.universities.forEach((university) => {
          if (university.university == this.form.get("university")?.value) this.form.get("entity")?.setValue(university.entity);
        })
      }

      let fileName: string = "";
      if (this.formData.cv_file != null) fileName = await this.signUpService.uploadCV(<File>this.formData.cv_file);
      this.form.get("cv_filename")?.setValue(fileName);

      await this.signUpService.submitForm(this.form.value);

      this.dialog.open(DialogComponent, {
        data: {
          type: "success",
          title: "You have successfully signed up",
          message: "One of our representatives will be in touch with you shortly"
        }
      }).afterClosed().subscribe(() => {
        window.location.href = "https://aiesec.lk/h4tf"
      })
    } catch (err){
        this.dialog.open(DialogComponent, {
          data: {
            type: "error",
            title: "ERROR",
            message: "This email has already been used to sign up."
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
