
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DictionaryService } from './../../services/dictionary-service/dictionary.service';


@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.scss']
})
export class AddWordComponent implements OnInit {
  @Output() addWord = new EventEmitter();
  @Input() words = [];

  forms = [];
  counter = [''];
  wordName = '';
  finished = false;
  type: string;
  cleared = false;
  suggested = '';
  suggestedForms: string[] = [];

  added = false;
  loading = false;

  valid: boolean;


  constructor(private dictionary: DictionaryService) { }

  check() {
    if (this.wordName && this.type) {
      this.finished =
        this.wordName.trim().length > 0 &&
        this.wordName.trim().length <= 60 &&
        this.type.trim().length > 1 &&
        !this.words.some(word =>
          word.word === this.wordName.trim() &&
          word.forms === [this.wordName.trim(), ...this.forms.filter(e => e.trim().length !== 0)]
        );
    }
    return this.finished;
  }

  ngOnInit(): void {
  }

  add(event): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.forms.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(form: string): void {
    const index = this.forms.indexOf(form);

    if (index >= 0) {
      this.forms.splice(index, 1);
    }
  }

  suggest() {
    const typed = this.wordName;
    this.loading = true;
    setTimeout(() => {
      if (this.wordName && typed === this.wordName) {
        this.dictionary.getType(this.wordName, type => {
          if (type === 'adjective' || type === 'verb' || type === 'noun') {
            this.type = `${type}s`;
            this.suggested = type;
          } else {
            this.type = 'misc';
            this.suggested = 'misc';
          }
          this.loading = false;
          this.check();
        }, err => console.log(err)
        );

        this.dictionary.getForms(this.wordName, forms => {
          let count = 0;
          this.forms = forms.filter(w => w.split(' ').length < 2)
          .filter(_=>{
            count++;
            return count <= 10;
          });
          console.log(forms);
          this.check();
        }, err => console.log(err)
        );
      }
    }, 1000);
  }

  suggestForms(){
    this.forms = this.suggestedForms;
  }

  save() {
    this.addWord.emit({
      name: this.wordName.trim(),
      forms: [...new Set([this.wordName.trim(),
      ...this.forms.filter(e => e.length !== 0)])],// This line removes repetitions and inserts main word
      type: this.type
    });
    this.wordName = '';
    this.forms = [];
    this.counter = [''];
    this.added = false;
    this.finished = false;
    this.suggested = '';
    this.type = '';
    this.cleared = true;
  }
}
