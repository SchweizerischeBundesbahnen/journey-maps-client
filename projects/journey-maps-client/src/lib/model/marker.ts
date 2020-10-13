import {Position} from 'geojson';
import {MarkerCategory} from './marker-category.enum';
import {MarkerCategoryBVI} from './marker-category-bvi.enum';
import {InfoBlock} from './infoblock/info-block';

export interface Marker {
  id: string;
  position: Position;
  category: MarkerCategory | MarkerCategoryBVI | string;
  icon?: string;
  iconSelected?: string;
  title: string;
  subtitle?: string;
  infoBlocks?: InfoBlock[];
}
