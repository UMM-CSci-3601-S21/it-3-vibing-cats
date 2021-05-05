import { Learner } from './learner';

export class User {
  _id?: string;
  authId: string;
  name: string;
  icon: string;
  learners: Array<Learner>;
  contextPacks: Array<string>;

}
