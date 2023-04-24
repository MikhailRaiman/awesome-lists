export class User {
  friends?: string[] = [];
  sn_endpoint = '';
  sn_login = '';
  sn_pass = '';
  constructor(public email: string, public uid: string, public name: string) {}
}
