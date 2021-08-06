import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  universities = [
    "University of Colombo", "University of Kelaniya"
  ]

  countries = [
    "England", "France", "Sri Lanka"
  ]

  form = {
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    from: "local",
    university: null,
    country: null,
    interest: null,
    cv: ""
  }

  constructor() { }

  ngOnInit(): void {
  }

  // @ts-ignore
  onFileSelected(event) {
    const file:File = event.target.files[0];
    if (file) {
      this.form.cv = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);
    }
  }
}
