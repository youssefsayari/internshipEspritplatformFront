import { Component, OnInit } from '@angular/core';
import { DefenseService } from '../Services/defense.service';
import { Defense } from '../models/defense';

@Component({
  selector: 'app-defense',
  templateUrl: './defense.component.html',
  styleUrls: ['./defense.component.scss']
})
export class DefenseComponent implements OnInit {
  defenses: Defense[] = [];

  constructor(private defenseService: DefenseService) {}

  ngOnInit(): void {
    this.defenseService.getAllDefenses().subscribe(data => {
      this.defenses = data;
    });
  }
}
