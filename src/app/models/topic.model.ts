export class Topic {
  id!: string;
  color = "#ffffff";
  order = "";
  owner: string;
  name?: string;
  favourite?: boolean;

  constructor(name: string, owner: string) {
    this.name = name;
    this.owner = owner;
  }
}
