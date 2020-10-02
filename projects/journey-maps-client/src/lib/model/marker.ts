import {Position} from 'geojson';
import {MarkerCategory} from './marker-category.enum';
import {MarkerCategoryBVI} from './marker-category-bvi.enum';

export interface Marker {
  id: string;
  position: Position;
  category: MarkerCategory | MarkerCategoryBVI;
  title: string;
  subtitle: string;
}
