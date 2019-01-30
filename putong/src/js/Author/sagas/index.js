import { fork } from 'redux-saga/effects';
import app from './app';
import user from './user';
import editor from './editor';
import projects from './projects';
import idols from './idols';
import extras from './extras';

export default function* root() {
    yield fork(app);
    yield fork(user);
    yield fork(editor);
    yield fork(projects);
    yield fork(idols);
    yield fork(extras);
}


// WEBPACK FOOTER //
// ./src/Author/sagas/index.js