export class ProcessDTO {
  constructor({ title, type, offense, last_update, denounced, denouncer, province, carton, account_id }) {
    this.title = title;
    this.type = type;
    this.offense = offense;
    this.last_update = last_update;
    this.denounced = denounced;
    this.denouncer = denouncer;
    this.province = province;
    this.carton = carton;
    this.account_id = account_id;
  }
}
