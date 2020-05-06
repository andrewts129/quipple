import { Injectable } from '@nestjs/common';
import questions = require('./questions.json');

@Injectable()
export class QuestionService {
    async randomQuestion(): Promise<string> {
        return questions[Math.floor(Math.random() * questions.length)];
    }
}
