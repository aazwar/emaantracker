import Storable from './Storable';

export default class Rss extends Storable {
  lastdate = null;
  items = [];
}
