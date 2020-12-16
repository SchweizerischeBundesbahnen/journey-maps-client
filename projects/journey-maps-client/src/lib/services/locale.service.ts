import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  language = 'de';

  // CHECKME ses: "Professional translations needed?
  private i18n = {
    de: {
      teaser: {
        close: 'Schliessen'
      },
      searchbar: {
        placeholder: 'Suchen',
        arialabel: 'Eingabefeld zum Suchen und Filtern von Kartenelementen.',
        moreresults: 'weitere Resultate gefunden.'
      }
    },
    fr: {
      teaser: {
        close: 'Fermer'
      },
      searchbar: {
        placeholder: 'Rechercher',
        arialabel: 'Champ de saisie pour la recherche et le filtrage des éléments de la carte.',
        moreresults: 'autres résultats trouvés.'
      }
    },
    it: {
      teaser: {
        close: 'Chiudere'
      },
      searchbar: {
        placeholder: 'Ricerca',
        arialabel: 'Campo di inserimento per la ricerca e il filtraggio degli elementi della mappa.',
        moreresults: 'altri risultati trovati.'
      }
    },
    en: {
      teaser: {
        close: 'Close'
      },
      searchbar: {
        placeholder: 'Search',
        arialabel: 'Input field for searching and filtering map elements..',
        moreresults: 'more results found.'
      }
    }
  };

  constructor() {
  }

  getText(key: string): string {
    const path = (`${this.language}.${key}`).split('.');
    return path.reduce((prev, curr) => prev && prev[curr], this.i18n);
  }
}
