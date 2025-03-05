import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {Setting} from "../../models/setting";
import {SettingService} from "../../Services/setting.service";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  settings: Setting[] = [];

  constructor(private settingService: SettingService) { }

  ngOnInit(): void {
    this.settingService.getAllSettings().subscribe(data => {
      this.settings = data;
    });
  }

  saveSetting(setting: Setting) {
    this.settingService.updateSetting(setting.key, setting.value).subscribe({
      next: () => {
        Swal.fire('Success', 'Setting updated successfully', 'success');
      },
      error: () => {
        Swal.fire('Error', 'Failed to update setting', 'error');
      }
    });
  }
}
