import {Component, OnInit, ViewChild} from '@angular/core';
import {CompaniesService} from "./companies.service";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {AuthService} from "../auth/auth.service";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Company} from "../interfaces/company";

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})

export class CompaniesComponent implements OnInit {

  companies: Company[] = [];

  columns = ['company_name', 'company_address', 'company_email', 'company_contact', 'full_name', 'designation', 'email', 'contact', 'stage', 'signed-up',
    'contacted', 'rejected', 'accepted'];
  selectedColumns = this.columns;

  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource(this.companies);
  filter = {
    quick_filter: "",
    signed_up: {
      start: null,
      end: null
    }
  };

  renderedData: any;

  constructor(public companiesService: CompaniesService, public authService: AuthService, private dialog: MatDialog) {
  }

  async ngOnInit() {
    try {
      this.companies = await this.companiesService.getCompanies();
      console.log("Companies: ", this.companies);
      this.dataSource = new MatTableDataSource<Company>(this.companies);
      this.dataSource.sort = this.sort;
      this.dataSource.connect().subscribe(d => this.renderedData = d);
      this.getDisplayedColumns();
      //console.log("Role: ", this.authService.getRole());
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

  public openProfile(company_name: string) {
    window.location.href = "/companies/" + company_name
  }

  public doFilter() {
    console.log("Filter", this.filter)
    this.dataSource.data = this.companies;
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
    const url = await this.companiesService.getCVDownloadUrl(filename);
    console.log(url);
  }

  getDisplayedColumns(): void {
    this.selectedColumns = ['company_name', 'company_address', 'company_email', 'company_contact', 'full_name', 'designation', 'email', 'contact', 'stage', 'signed-up'];
    const columnsToDisplayMobile = ['company_name', 'stage'];
    if (window.innerWidth < 600) this.selectedColumns = columnsToDisplayMobile
    if (this.authService.getRole() == "admin") this.selectedColumns.push('entity');
  }
}
