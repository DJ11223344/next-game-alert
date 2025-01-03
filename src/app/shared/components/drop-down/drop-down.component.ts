import { Component, ViewEncapsulation } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-drop-down',
  imports: [ClickOutsideDirective],
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DropDownComponent {
  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
}
