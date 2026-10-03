// Adaptador del modelo de esta actividad a los cuestionarios comunes de Biología.
import { STRUCTURES } from './banco-preguntas.mjs';
import * as model from '../../recursos/modelo-repaso.mjs';
export const shuffle = model.shuffle;
export const answerQuestion = model.answerQuestion;
export const nextQuestion = model.nextQuestion;
export const createRoundGenerator = (bank, random = Math.random) => model.createRoundGenerator(bank, STRUCTURES, { random });
export const createQuizState = (round) => model.createQuizState(round, STRUCTURES);
export const scoreQuiz = (state) => { const score = model.scoreQuiz(state); return { ...score, structures: score.categories }; };
