export class Topic {
  id!: string;
  color = "#ffffff";
  order = "";
  owner: string;
  name?: string;
  favourite?: boolean;
  d = false;
  c = false;
  v = false;
  categories?: string[] = [];
  items: Item[] = [];

  constructor(name: string, owner: string) {
    this.name = name;
    this.owner = owner;
  }
}

export class Item {
  name!: string;
  category?: string;
  date?: any;
  value?: number;
}
