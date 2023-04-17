export class Topic {
  id!: string;
  color = "#ffffff";
  owner: string;
  name?: string;
  favourite?: boolean;

  constructor(name: string, owner: string) {
    this.name = name;
    this.owner = owner;
  }
}
