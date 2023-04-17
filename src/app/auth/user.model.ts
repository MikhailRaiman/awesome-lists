export class User {
  friends?: string[] = [];
  constructor(public email: string, public uid: string, public name: string) {}
}
