import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  language = 'de';

  private i18n = {
    de: {
      close: 'Schliessen',
      searchbar: {
        placeholder: 'Suchen',
        arialabel: 'Eingabefeld zum Suchen und Filtern von Kartenelementen.',
        moreresults: 'weitere Resultate gefunden.'
      },
      touchOverlay: {
        tip: 'Benutzen Sie 2 Finger um die Karte zu bedienen.'
      },
      a4a: {
        visualFunction: 'Visuelle Funktion, nicht für Screenreader gedacht.',
        zoomIn: 'Kartenausschnitt vergrössern.',
        zoomOut: 'Kartenausschnitt verkleinern.',
        selectFloor: 'Stockwerk [0] anzeigen.'
      }
    },
    fr: {
      close: 'Fermer',
      searchbar: {
        placeholder: 'Rechercher',
        arialabel: 'Champ de saisie pour la recherche et le filtrage des éléments de la carte.',
        moreresults: 'autres résultats trouvés.'
      },
      touchOverlay: {
        tip: 'Utilisez deux doigts pour consulter la carte.'
      },
      a4a: {
        visualFunction: 'Fonction visuelle, non destinée aux lecteurs d\'écran.',
        zoomIn: 'Zoomer.',
        zoomOut: 'Dézoomer.',
        selectFloor: 'Afficher l\'étage [0].'
      }
    },
    it: {
      close: 'Chiudere',
      searchbar: {
        placeholder: 'Ricerca',
        arialabel: 'Campo di inserimento per la ricerca e il filtraggio degli elementi della mappa.',
        moreresults: 'altri risultati trovati.'
      },
      touchOverlay: {
        tip: 'Utilizzate due dita per muovervi nella mappa.'
      },
      a4a: {
        visualFunction: 'Funzione visiva, non destinata ai lettori di schermo.',
        zoomIn: 'Ingrandire la sezione della mappa.',
        zoomOut: 'Ridurre la sezione della mappa.',
        selectFloor: 'Mostra il piano [0].'
      }
    },
    en: {
      close: 'Close',
      searchbar: {
        placeholder: 'Search',
        arialabel: 'Input field for searching and filtering map elements.',
        moreresults: 'more results found.'
      },
      touchOverlay: {
        tip: 'Use two fingers to operate the map.'
      },
      a4a: {
        visualFunction: 'Visual function, not intended for screen readers.',
        zoomIn: 'Zoom in on map.',
        zoomOut: 'Zoom out on map.',
        selectFloor: 'Select floor [0].'
      }
    }
  };

  constructor() {
  }

  getText(key: string): string {
    const path = (`${this.language}.${key}`).split('.');
    return path.reduce((prev, curr) => prev && prev[curr], this.i18n);
  }

  getTextWithParams(key: string, ...params: any[]): string {
    let text = this.getText(key);
    params.forEach((value, index) => text = text.replace(`[${index}]`, value));
    return text;
  }
}
