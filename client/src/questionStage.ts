import { setClassDisplay, thisPlayerJwt } from './utils';
import { globalState } from './globalState';
import { NewQuestionDto } from './dto/incoming/NewQuestionDto';

export const handleNewQuestion = (data: NewQuestionDto): void => {
    globalState.questionQueue.push(data.question);
};

export const popNextFromQuestionQueue = async (): Promise<string> => {
    // TODO deal with the possibility of queue being empty
    return globalState.questionQueue.shift();
};

export const showNextQuestion = async (): Promise<void> => {
    const question = await popNextFromQuestionQueue();
    document.getElementById('question').innerText = question;
};

export const handleSubmitAnswerButtonClick = (socket: SocketIOClient.Socket): void => {
    const answer = (document.getElementById('answerTextInput') as HTMLInputElement).value;
    socket.emit('submitAnswer', { answer, jwt: thisPlayerJwt() });

    document.getElementById('mySubmission').innerText = answer;
    setClassDisplay('questionStage-presubmit', 'none');
    setClassDisplay('questionStage-postsubmit', 'block');
};
