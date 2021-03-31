import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.scss']
})
export class AddWordComponent implements OnInit {
  @Output() addWord = new EventEmitter();

  forms = [''];
  wordName = '';
  finished = false;
  type: string;

  added = false;

  valid: boolean;


  constructor() { }

  check() {
    if (this.wordName && this.type) {
      this.finished =
        this.wordName.length > 1 && this.type.length > 1;
      console.log(this.wordName.length);
    }
    return this.finished;
  }

  ngOnInit(): void {
  }

  add(val) {
    this.forms.push(val);
  }

  removeForm(i: number) {
    console.log(i);
    this.forms.splice(i, 1);
  }

  save() {
    this.addWord.emit({ name: this.wordName, forms: this.forms.filter(e => e.length !== 0), type: this.type });
    console.log(this.forms + this.wordName + this.type);
    this.wordName = '';
    this.forms = [];
    this.forms.push('');
    this.added = false;
    this.finished = false;
  }
}
