export interface CreateQuestionChoice {
  content: string;
  answer: number;
}

export interface CreateQuestion {
  text: string;
  choiceNumber: number;
  answer: number;
  roomID: number;
  file: Express.Multer.File;
  questionChoices: CreateQuestionChoice[];
}
