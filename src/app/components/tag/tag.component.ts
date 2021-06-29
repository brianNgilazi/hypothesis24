import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  @Input() tags: string[];
  /**
   * the selected tag to be highlighted
   */
  @Input() selectedTag: string;
  constructor() { }

  ngOnInit(): void {
  }

}
