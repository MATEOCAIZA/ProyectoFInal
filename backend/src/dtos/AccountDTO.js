export class AccountDTO {
  constructor({ username, password, email, phone_number }) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.phone_number = phone_number;
  }
}
