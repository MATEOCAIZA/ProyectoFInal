export class Evidence {
  constructor({ evidence_id, type, file, process_id }) {
    this.evidence_id = evidence_id;
    this.type = type;
    this.file = file;
    this.process_id = process_id;
  }
}
