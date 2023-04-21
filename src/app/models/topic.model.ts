export class Topic {
  id!: string;
  color = "#ffffff";
  order = "";
  owner: string;
  name?: string;
  favourite?: boolean;
  n = false;
  d = false;
  c = false;
  v = false;
  categories?: string[] = [];
  items: Item[] = [];
  calcTotal = false;
  completable = false;

  constructor(name: string, owner: string) {
    this.name = name;
    this.owner = owner;
  }
}

export class Item {
  ts!: string;
  name?: string;
  category?: string;
  date?: any;
  value?: number;
  selected = false;
  done = false;
}
