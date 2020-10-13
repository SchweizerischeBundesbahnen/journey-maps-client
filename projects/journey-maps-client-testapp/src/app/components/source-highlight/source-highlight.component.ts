import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-source-highlight',
  templateUrl: './source-highlight.component.html',
  styleUrls: ['./source-highlight.component.scss']
})
export class SourceHighlightComponent implements OnInit {

  sources = new Map<string, string>();

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.readSourceFile('app.component.html');
    this.readSourceFile('app.component.ts');
  }

  readSourceFile(filename): void {
    this.http.get(`assets/example/${filename}.txt`, {responseType: 'text'})
      .subscribe(data => this.sources.set(filename, data));
  }

  showTabs(): boolean {
    return this.sources.size > 0;
  }

}
