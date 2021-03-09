import {Component, OnInit} from '@angular/core';
import {AssetReaderService} from '../../services/asset-reader.service';

@Component({
  selector: 'app-source-highlight',
  templateUrl: './source-highlight.component.html',
  styleUrls: ['./source-highlight.component.scss']
})
export class SourceHighlightComponent implements OnInit {

  readonly sourceFiles = [
    'example/app.component.ts.txt',
    'example/app.component.html.txt'
  ];

  sources = new Map<string, string>();

  constructor(private assetReaderService: AssetReaderService) {
  }

  ngOnInit(): void {
    for (const path of this.sourceFiles) {
      this.assetReaderService.loadAssetAsString(path).subscribe(txt => {
        const filename = path.substring(path.lastIndexOf('/') + 1, path.length - 4);
        this.sources.set(filename, txt);
      });
    }
  }

  showTabs(): boolean {
    return this.sources.size > 0;
  }

}
