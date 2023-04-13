export class Topic {
  id!: string;
  name?: string;
  favourite?: boolean;

  constructor(name: string) {
    this.name = name;
    this.id = Math.random().toString();
  }
}
