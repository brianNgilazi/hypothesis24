import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  @Input() size: 's'|'m'|'l' = 'm';

  ngOnInit(): void {
  }

}
