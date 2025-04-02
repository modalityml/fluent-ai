import { Job } from "./job";

export class ListModelsJob extends Job {
  constructor() {
	super();
	this.params = {};
  }

  dump() {
    const obj = super.dump();
    return { ...obj, models: { params: this.params } };
  }
}
