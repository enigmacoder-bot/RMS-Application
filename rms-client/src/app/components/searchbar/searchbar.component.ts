import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Icon, IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styles: []
})
export class SearchbarComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  searchKey: string = '';
  @Input() size:string="3.5rem"
  @Input() icon:IconDefinition | undefined

  @Output() onChange = new EventEmitter<any>();

  private searchSubject: Subject<string> = new Subject();

  constructor() {
    // Debouncing input changes
    this.searchSubject.pipe(debounceTime(300)).subscribe(value => {
      if (value && value.length > 2) {
        this.onChange.emit({ searchKey: value, isValid: true });
      }
    });
  }

  onInputChange() {
    console.log(this.size)
    this.searchSubject.next(this.searchKey);
  }
}
