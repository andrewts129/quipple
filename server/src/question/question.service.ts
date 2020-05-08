import { Injectable } from '@nestjs/common';
import questions = require('./questions.json');

const nRandomElements = (a: any[], n: number) => {
    if (n === 0) {
        return [];
    } else if (n >= a.length) {
        return [...a];
    } else {
        const element = a[Math.floor(Math.random() * a.length)];
        const rest = a.filter((x) => x !== element);
        return [element, ...nRandomElements(rest, n - 1)];
    }
};

@Injectable()
export class QuestionService {
    async randomQuestions(n: number): Promise<string[]> {
        return nRandomElements(questions, n);
    }
}
