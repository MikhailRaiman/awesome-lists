export class Topic {
  id!: string;
  color = "#ffffff";
  name?: string;
  favourite?: boolean;

  constructor(name: string) {
    this.name = name;
  }
}
