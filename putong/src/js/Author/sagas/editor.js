import { take, takeEvery, fork, put, select } from 'redux-saga/effects';
import uuid from 'uuid-js';
import Api from '../../api/api';
import config from '../../config';
import AppError, { AppErrorCode } from './AppError';
import { setAppLoading, setAppMessage, setAppAlert } from './app';
import { insert } from './utils';
import { validateProjectContent } from './editor-validate';
import { buildProject } from './editor-build';
import { getToken } from './user';
import { getIdols } from './idols';
import { getExtras } from './extras';
import RGBaster from './rgbaster';

export function* getOutline() {
  return yield select(store => store.editor.outline);
}

export function* getErrors() {
  return yield select(store => store.editor.errors);
}

export function* getContent() {
  return yield select(store => store.editor.content);
}

export function* getSelectedExtraUUId() {
  return yield select(store => store.editor.selected_extra_uuid);
}

export function* getSelectedExtra() {
  return yield select(store => store.extras.list.find(ex => ex.uuid === store.editor.selected_extra_uuid));
}

export function* extragetParagraph(id) {
  const extra = yield select(store => store.extras.list.find(extra => extra.uuid === store.editor.selected_extra_uuid));
  return extra.paragraphs.find(p => p.id === id);
}

export function* extragetParagraphs() {
  const extra = yield select(store => store.extras.list.find(extra => extra.uuid === store.editor.selected_extra_uuid));
  return extra.paragraphs;
}

function* extragetFirstParagraph() {
  const extra = yield select(store => store.extras.list.find(extra => extra.uuid === store.editor.selected_extra_uuid));
  return extra.paragraphs[0];
}

export function* getParagraph(id) {
  return yield select(store => store.editor.content.paragraphs.find(p => p.id === id));
}

export function* getParagraphs() {
  return yield select(store => store.editor.content.paragraphs);
}

function* getFirstParagraph() {
  return yield select(store => store.editor.content.paragraphs[0]);
}

function* getOperations() {
  return yield select(store => store.editor.operations);
}

function* getOperationIndex() {
  return yield select(store => store.editor.operation_index);
}

function* getCurrentOperation() {
  const editor = yield select(store => store.editor);
  return editor.operations[editor.operation_index];
}

function* getNextOperation() {
  const editor = yield select(store => store.editor);
  return editor.operations[editor.operation_index + 1];
}

function* isFirstParagraph(id) {
  const first = yield getFirstParagraph();
  return first.id === id;
}

function* extraisFirstParagraph(id) {
  const first = yield extragetFirstParagraph();
  return first.id === id;
}

export function* getRoles() {
  return yield select(store => store.editor.content.roles);
}

export function* getRole(id) {
  return yield select(store => store.editor.content.roles.find(r => r.id === id));
}

function* updateProjectContent(content) {
  yield put({
    type: 'UPDATE_PROJECT_CONTENT',
    content: content,
  })
}

function* updateProjectOutline(outline) {
  yield put({
    type: 'UPDATE_PROJECT_OUTLINE',
    outline: outline,
  })
}

function* updateParagraph(...updated_paragraph) {
  yield put({
    type: 'UPDATE_PARAGRAPHS',
    paragraphs: insert(yield getParagraphs(), ...updated_paragraph),
  });
}

function* extraupdateParagraph(...updated_paragraph) {
  const paragraphs = insert(yield extragetParagraphs(), ...updated_paragraph);
  yield extraupdateParagraphs(paragraphs);
}

function* extraupdateParagraphs(paragraphs) {
  const selected_extra_uuid = yield getSelectedExtraUUId();
  const extras = yield getExtras();
  const newextras = extras.map(ex => {
    if (ex.uuid === selected_extra_uuid) {
      return { ...ex, paragraphs: paragraphs }
    } else {
      return { ...ex }
    }
  });
  yield put({
    type: 'UPDATE_EXTRAS',
    extras: newextras,
  });
}

function* newParagraphId() {
  const paragraphs = yield getParagraphs();
  return Math.max(...paragraphs.map(p => p.id)) + 1;
}

function* createNodeParagraph() {
  const id = yield newParagraphId();
  return {
    id: id,
    type: 'Node',
    title: id.toString(),
    chat_id: -1,
    text: '',
    next_id: -1,
  };
}

function* extranewParagraphId() {
  const paragraphs = yield extragetParagraphs();
  return Math.max(...paragraphs.map(p => p.id)) + 1;
}

function* extracreateNodeParagraph() {
  const id = yield extranewParagraphId();
  return {
    id: id,
    type: 'Node',
    title: id.toString(),
    chat_id: -1,
    text: '',
    next_id: -1,
  };
}

function* createBranchParagraph() {
  return {
    id: yield newParagraphId(),
    type: 'Branch',
    chat_id: -1,
    expanded: true,
    selections: [
      yield createSelection(),
      yield createSelection(),
    ]
  };
}

function* extracreateBranchParagraph() {
  return {
    id: yield extranewParagraphId(),
    type: 'Branch',
    chat_id: -1,
    expanded: true,
    selections: [
      yield createSelection(),
      yield createSelection(),
    ]
  };
}

function createNumberSelection() {
  return {
    operator: '&',
    conditions: [{ key: '', operator: '<', value: 0 }],
    next_id: -1,
  };
}

function createSelection() {
  return {
    title: '未命名选项',
    next_id: -1,
  };
}

function* createEndParagraph() {
  return {
    id: yield newParagraphId(),
    type: 'End',
    chat_id: -1,
    title: '未命名结局',
    text: '结局描述',
    gallery_id: -1,
    image: '',
    next_id: -1,
  };
}

function* createLockParagraph() {
  return {
    id: yield newParagraphId(),
    type: 'Lock',
    uuid: uuid.create(4).toString(),
    title: '',
    chat_id: -1,
    text: '无描述',
    pay_type: 'WaitOrPay',
    coin: 1,
    diamond: -1,
    next_id: -1,
  };
}

function* createGoOnParagraph() {
  return {
    id: yield newParagraphId(),
    type: 'GoOn',
    title: '',
    chat_id: -1,
    show_type: 'Off',
    next_id: -1,
  };
}

function* linkParagraphs(action) {
  const { a, b } = action;
  const paragraph_a = yield getParagraph(a.id);
  if (a.id === b.id) {
    yield setAppMessage('error', '不能连接相同的段落');
  }
  else {
    yield updateParagraph(setParagraphNextId(paragraph_a, a.index, b.id));
    return { type: 'Link', a: { ...a }, b: { ...b } };
  }
}

function* extralinkParagraphs(action) {
  const { a, b } = action;
  const paragraph_a = yield extragetParagraph(a.id);
  if (a.id === b.id) {
    yield setAppMessage('error', '不能连接相同的段落');
  }
  else {
    yield extraupdateParagraph(extrasetParagraphNextId(paragraph_a, a.index, b.id));
    return { type: 'ExtraLink', a: { ...a }, b: { ...b } };
  }
}

function* moveParagraph(action) {
  const { from_parent, to_parent, child } = action;
  // console.log('Move paragraph', from_parent.id, to_parent.id, child.id);

  const from_paragraph = yield getParagraph(from_parent.id);
  const to_paragraph = yield getParagraph(to_parent.id);
  const child_paragraph = yield getParagraph(child.id);
  if (to_paragraph.id === child_paragraph.id) {
    yield setAppMessage('error', '不能将段落作为自己的下一个段落');
  }
  else if (getParagraphNextId(to_paragraph, to_parent.index) !== -1) {
    yield setAppMessage('error', `[${to_paragraph.title}]段落的下一个段落不为空`);
  }
  else {
    if (from_paragraph.id === to_paragraph.id) {
      const p1 = setParagraphNextId(from_paragraph, from_parent.index, -1);
      const p2 = setParagraphNextId(p1, to_parent.index, child_paragraph.id);
      yield updateParagraph(p2);
    }
    else {
      yield updateParagraph(
        setParagraphNextId(from_paragraph, from_parent.index, -1),
        setParagraphNextId(to_paragraph, to_parent.index, child_paragraph.id)
      );
    }

    return { type: 'Move', from_parent, to_parent, child };
  }
}

function* extramoveParagraph(action) {
  const { from_parent, to_parent, child } = action;
  // console.log('Move paragraph', from_parent.id, to_parent.id, child.id);

  const from_paragraph = yield extragetParagraph(from_parent.id);
  const to_paragraph = yield extragetParagraph(to_parent.id);
  const child_paragraph = yield extragetParagraph(child.id);
  if (to_paragraph.id === child_paragraph.id) {
    yield setAppMessage('error', '不能将段落作为自己的下一个段落');
  }
  else if (extragetParagraphNextId(to_paragraph, to_parent.index) !== -1) {
    yield setAppMessage('error', `[${to_paragraph.title}]段落的下一个段落不为空`);
  }
  else {
    if (from_paragraph.id === to_paragraph.id) {
      const p1 = extrasetParagraphNextId(from_paragraph, from_parent.index, -1);
      const p2 = extrasetParagraphNextId(p1, to_parent.index, child_paragraph.id);
      yield extraupdateParagraph(p2);
    }
    else {
      yield extraupdateParagraph(
        extrasetParagraphNextId(from_paragraph, from_parent.index, -1),
        extrasetParagraphNextId(to_paragraph, to_parent.index, child_paragraph.id)
      );
    }

    return { type: 'ExtraMove', from_parent, to_parent, child };
  }
}

function* deleteBranchIndex(action) {
  const { paragraph_id, branch_index } = action;
  const paragraphs = yield getParagraphs();
  const branch = yield getParagraph(paragraph_id);
  const { selections } = branch;
  let items = selections;
  const parents = [];
  let deleted_item = null;
  if (items.length === 2) {
    // 如果只有2条分支，则将该段落删除
    const next_id = branch_index === 0 ? items[1].next_id : items[0].next_id;
    const delete_id = paragraph_id;
    const updated_paragraphs = [];
    // 所有该段落的上一个段落，都将被修改next_id
    paragraphs.forEach(p => {
      if (p.id !== delete_id) {
        switch (p.type) {
          case 'Node':
          case 'Lock': {
            if (p.next_id === delete_id) {
              parents.push({ paragraph_id: p.id });
              updated_paragraphs.push({ ...p, next_id });
            }
            else {
              updated_paragraphs.push(p);
            }
            break;
          }

          case 'Branch':
          case 'NumberBranch': {
            updated_paragraphs.push({
              ...p,
              selections: p.selections.map((s, i) => {
                if (s.next_id === delete_id) {
                  parents.push({ paragraph_id: p.id, branch_index: i });
                  return { ...s, next_id };
                }
                else {
                  return s;
                }
              })
            });
            break;
          }

          case 'End':
          default:
            updated_paragraphs.push(p);
        }
      }
      else {
        updated_paragraphs.push(p);
      }
    });

    yield updateProjectContent({
      ...yield getContent(),
      paragraphs: updated_paragraphs,
    });
  }
  else {
    deleted_item = items.splice(branch_index, 1)[0];
    switch (branch.type) {
      case 'Branch':
      case 'NumberBranch':
        yield updateParagraph({
          ...branch,
          selections: [...items],
        });
        break;

      default:
        break;
    }
  }

  // 移除所有未连接的段落，可以优化为遍历子段落的方式
  const deleted_paragraphs = yield removeUnlinkedParagraphs();

  return { type: 'DeleteBranchIndex', parents, deleted_item, paragraph_id, branch_index, deleted_paragraphs };
}

function* extradeleteBranchIndex(action) {
  const { paragraph_id, branch_index } = action;
  const paragraphs = yield extragetParagraphs();
  const branch = yield extragetParagraph(paragraph_id);
  const { selections } = branch;
  let items = selections;
  const parents = [];
  let deleted_item = null;
  if (items.length === 2) {
    // 如果只有2条分支，则将该段落删除
    const next_id = branch_index === 0 ? items[1].next_id : items[0].next_id;
    const delete_id = paragraph_id;
    const updated_paragraphs = [];
    // 所有该段落的上一个段落，都将被修改next_id
    paragraphs.forEach(p => {
      if (p.id !== delete_id) {
        switch (p.type) {
          case 'Node': {
            if (p.next_id === delete_id) {
              parents.push({ paragraph_id: p.id });
              updated_paragraphs.push({ ...p, next_id });
            }
            else {
              updated_paragraphs.push(p);
            }
            break;
          }

          case 'Branch': {
            updated_paragraphs.push({
              ...p,
              selections: p.selections.map((s, i) => {
                if (s.next_id === delete_id) {
                  parents.push({ paragraph_id: p.id, branch_index: i });
                  return { ...s, next_id };
                }
                else {
                  return s;
                }
              })
            });
            break;
          }

          default:
            updated_paragraphs.push(p);
        }
      } else {
        updated_paragraphs.push(p);
      }
    });

    yield extraupdateParagraphs(updated_paragraphs);
  } else {
    deleted_item = items.splice(branch_index, 1)[0];
    yield extraupdateParagraph({
      ...branch,
      selections: [...items],
    });
  }

  // 移除所有未连接的段落，可以优化为遍历子段落的方式
  const deleted_paragraphs = yield extraremoveUnlinkedParagraphs();

  return { type: 'ExtraDeleteBranchIndex', parents, deleted_item, paragraph_id, branch_index, deleted_paragraphs };
}

function* addBranchIndex(action) {
  const { paragraph_id } = action;
  const branch = yield getParagraph(paragraph_id);
  const { selections } = branch;
  if (selections.length >= 5) {
    yield setAppMessage('error', '最多支持5个分支');
    return null;
  } else {
    let item = null;
    if (branch.type === 'Branch') {
      item = yield createSelection();
    } else {
      item = yield createNumberSelection();
    }
    yield updateParagraph({
      ...branch,
      selections: [...selections, item]
    });

    return { type: 'AddBranchIndex', paragraph_id, added_item: null };
  }
}

function* extraaddBranchIndex(action) {
  const { paragraph_id } = action;
  const branch = yield extragetParagraph(paragraph_id);
  switch (branch.type) {
    case 'Branch':
      const { selections } = branch;
      if (selections.length >= 5) {
        yield setAppMessage('error', '最多支持5个分支');
        return null;
      }
      else {
        const item = yield createSelection();
        yield extraupdateParagraph({
          ...branch,
          selections: [...selections, item]
        });

        return { type: 'ExtraAddBranchIndex', paragraph_id, added_item: null };
      }

    default:
      break;
  }
}

function* disconnectParagraphs(action) {
  const { paragraph_id, branch_index } = action;
  const paragraph = yield getParagraph(paragraph_id);
  const next_id = getParagraphNextId(paragraph, branch_index);
  yield updateParagraph(setParagraphNextId(paragraph, branch_index, -1));
  return { type: 'Disconnect', paragraph_id, branch_index, next_id };
}

function* extradisconnectParagraphs(action) {
  const { paragraph_id, branch_index } = action;
  const paragraph = yield extragetParagraph(paragraph_id);
  const next_id = extragetParagraphNextId(paragraph, branch_index);
  yield extraupdateParagraph(extrasetParagraphNextId(paragraph, branch_index, -1));
  return { type: 'ExtraDisconnect', paragraph_id, branch_index, next_id };
}

function* removeUnlinkedParagraphs() {
  const paragraphs = yield getParagraphs();
  const updated_paragraphs = [];
  const deleted_paragraphs = [];
  const searching = [paragraphs[0]];
  const searched = {};

  function _getParagraph(id) {
    return paragraphs.find(p => p.id === id);
  }

  function addSearching(id) {
    if (id !== -1) {
      searching.push(_getParagraph(id));
    }
  }

  while (searching.length > 0) {
    const paragraph = searching.pop();
    if (searched[paragraph.id]) {
      continue;
    }

    searched[paragraph.id] = true;
    switch (paragraph.type) {
      case 'Branch':
      case 'NumberBranch':
        paragraph.selections.forEach(s => addSearching(s.next_id));
        break;

      default:
        addSearching(paragraph.next_id);
        break;
    }
  }

  paragraphs.forEach(p => {
    if (searched[p.id]) {
      updated_paragraphs.push(p);
    }
    else {
      deleted_paragraphs.push(p);
    }
  });

  yield updateProjectContent({
    ...yield getContent(),
    paragraphs: updated_paragraphs,
  });

  // console.log('Deleted unlinked paragraphs', deleted_paragraphs);

  return deleted_paragraphs;
}

function* extraremoveUnlinkedParagraphs() {
  const paragraphs = yield extragetParagraphs();
  const updated_paragraphs = [];
  const deleted_paragraphs = [];
  const searching = [paragraphs[0]];
  const searched = {};

  function _getParagraph(id) {
    return paragraphs.find(p => p.id === id);
  }

  function addSearching(id) {
    if (id !== -1) {
      searching.push(_getParagraph(id));
    }
  }

  while (searching.length > 0) {
    const paragraph = searching.pop();
    if (searched[paragraph.id]) {
      continue;
    }

    searched[paragraph.id] = true;
    switch (paragraph.type) {
      case 'Branch':
      case 'NumberBranch':
        paragraph.selections.forEach(s => addSearching(s.next_id));
        break;

      default:
        addSearching(paragraph.next_id);
        break;
    }
  }

  paragraphs.forEach(p => {
    if (searched[p.id]) {
      updated_paragraphs.push(p);
    }
    else {
      deleted_paragraphs.push(p);
    }
  });

  yield extraupdateParagraphs(updated_paragraphs);

  // console.log('Deleted unlinked paragraphs', deleted_paragraphs);

  return deleted_paragraphs;
}

function* watchOperations() {
  while (true) {
    try {
      const action = yield take([
        'INSERT_NODE_PARAGRAPH',
        'INSERT_BRANCH_PARAGRAPH',
        'INSERT_END_PARAGRAPH',
        'INSERT_LOCK_PARAGRAPH',
        'INSERT_GOON_PARAGRAPH',
        'DELETE_PARAGRAPH',
        'EXPAND_BRANCH',
        'LINK_PARAGRAPHS',
        'DELETE_BRANCH_INDEX',
        'ADD_BRANCH_INDEX',
        'MOVE_PARAGRAPH',
        'DISCONNECT_PARAGRAPHS',
        'EXTRA_INSERT_NODE_PARAGRAPH',
        'EXTRA_INSERT_BRANCH_PARAGRAPH',
        'EXTRA_ADD_BRANCH_INDEX',
        'EXTRA_LINK_PARAGRAPHS',
        'EXTRA_DELETE_PARAGRAPH',
        'EXTRA_EXPAND_BRANCH',
        'EXTRA_DELETE_BRANCH_INDEX',
        'EXTRA_MOVE_PARAGRAPH',
        'EXTRA_DISCONNECT_PARAGRAPHS',
      ]);

      let operation = null;
      // 用于redo/undo操作
      switch (action.type) {
        case 'INSERT_NODE_PARAGRAPH':
          operation = yield insertNodeParagraph(action);
          break;

        case 'INSERT_BRANCH_PARAGRAPH':
          operation = yield insertBranchParagraph(action);
          break;

        case 'INSERT_END_PARAGRAPH':
          operation = yield insertEndParagraph(action);
          break;

        case 'INSERT_LOCK_PARAGRAPH':
          operation = yield insertLockParagraph(action);
          break;

        case 'INSERT_GOON_PARAGRAPH':
          operation = yield insertGoOnParagraph(action);
          break;

        case 'DELETE_PARAGRAPH':
          operation = yield deleteParagraph(action);
          break;

        case 'EXPAND_BRANCH':
          yield expandBranch(action);
          break;

        case 'LINK_PARAGRAPHS':
          operation = yield linkParagraphs(action);
          break;

        case 'MOVE_PARAGRAPH':
          operation = yield moveParagraph(action);
          break;

        case 'DELETE_BRANCH_INDEX':
          operation = yield deleteBranchIndex(action);
          break;

        case 'ADD_BRANCH_INDEX':
          operation = yield addBranchIndex(action);
          break;

        case 'DISCONNECT_PARAGRAPHS':
          operation = yield disconnectParagraphs(action);
          break;

        case 'EXTRA_INSERT_NODE_PARAGRAPH':
          operation = yield extrainsertNodeParagraph(action);
          break;

        case 'EXTRA_INSERT_BRANCH_PARAGRAPH':
          operation = yield extrainsertBranchParagraph(action);
          break;

        case 'EXTRA_ADD_BRANCH_INDEX':
          operation = yield extraaddBranchIndex(action);
          break;

        case 'EXTRA_MOVE_PARAGRAPH':
          operation = yield extramoveParagraph(action);
          break;

        case 'EXTRA_LINK_PARAGRAPHS':
          operation = yield extralinkParagraphs(action);
          break;

        case 'EXTRA_DELETE_PARAGRAPH':
          operation = yield extradeleteParagraph(action);
          break;

        case 'EXTRA_EXPAND_BRANCH':
          yield extraexpandBranch(action);
          break;

        case 'EXTRA_DELETE_BRANCH_INDEX':
          operation = yield extradeleteBranchIndex(action);
          break;

        case 'EXTRA_DISCONNECT_PARAGRAPHS':
          operation = yield extradisconnectParagraphs(action);
          break;

        default:
          break;
      }

      if (operation) {
        yield addOperation(operation);
      }
    }
    catch (e) {
      if (e instanceof AppError) {
        if (e.code === AppErrorCode.InvalidOperation) {
          yield setAppMessage('error', e.extra);
        }
      }
      else {
        throw e;
      }
    }
  }
}

const MAX_OPERATIONS = 20;
function* addOperation(operation) {
  const operations = yield getOperations();
  const operation_index = yield getOperationIndex();
  const length = operations.length;
  if (length >= MAX_OPERATIONS) {
    yield updateOperations([
      ...operations.slice(-(MAX_OPERATIONS - 1), operation_index + 1),
      operation,
    ], MAX_OPERATIONS - 1);
  }
  else {
    yield updateOperations([
      ...operations.slice(0, operation_index + 1),
      operation,
    ], operation_index + 1)
  }

  yield validate();
}

function* watchUndo() {
  while (true) {
    yield take('UNDO_OPERATION');
    const operations = yield getOperations();
    const operation_index = yield getOperationIndex();
    const operation = yield getCurrentOperation();
    // console.log('undo', operation);
    if (operation) {
      switch (operation.type) {
        case 'Insert':
          yield undoInsert(operation);
          break;

        case 'Delete':
          yield undoDelete(operation);
          break;

        case 'Link':
          yield undoLink(operation);
          break;

        case 'Move':
          yield undoMove(operation);
          break;

        case 'DeleteBranchIndex':
          yield undoDeleteBranchIndex(operation);
          break;

        case 'AddBranchIndex':
          yield undoAddBranchIndex(operation);
          break;

        case 'Disconnect':
          yield undoDisconnect(operation);
          break;

        case 'ExtraInsert':
          yield extraundoInsert(operation);
          break;

        case 'ExtraDelete':
          yield extraundoDelete(operation);
          break;

        case 'ExtraLink':
          yield extraundoLink(operation);
          break;

        case 'ExtraMove':
          yield extraundoMove(operation);
          break;

        case 'ExtraDeleteBranchIndex':
          yield extraundoDeleteBranchIndex(operation);
          break;

        case 'ExtraAddBranchIndex':
          yield extraundoAddBranchIndex(operation);
          break;

        case 'ExtraDisconnect':
          yield extraundoDisconnect(operation);
          break;

        default:
          break;
      }

      yield updateOperations(operations, operation_index - 1);
      yield validate();
    } else {
      yield setAppMessage('normal', '已经到头了，无法回退！');
    }
  }
}

function* watchRedo() {
  while (true) {
    yield take('REDO_OPERATION');
    const operations = yield getOperations();
    const operation_index = yield getOperationIndex();
    const operation = yield getNextOperation();
    // console.log('redo', operation);
    if (operation) {
      switch (operation.type) {
        case 'Insert':
          yield redoInsert(operation);
          break;

        case 'Delete':
          yield redoDelete(operation);
          break;

        case 'Link':
          yield redoLink(operation);
          break;

        case 'Move':
          yield redoMove(operation);
          break;

        case 'DeleteBranchIndex':
          yield redoDeleteBranchIndex(operation);
          break;

        case 'AddBranchIndex':
          yield redoAddBranchIndex(operation);
          break;

        case 'Disconnect':
          yield redoDisconnect(operation);
          break;

        case 'ExtraInsert':
          yield extraredoInsert(operation);
          break;

        case 'ExtraDelete':
          yield extraredoDelete(operation);
          break;

        case 'ExtraLink':
          yield extraredoLink(operation);
          break;

        case 'ExtraMove':
          yield extraredoMove(operation);
          break;

        case 'ExtraDeleteBranchIndex':
          yield extraredoDeleteBranchIndex(operation);
          break;

        case 'ExtraAddBranchIndex':
          yield extraredoAddBranchIndex(operation);
          break;

        case 'ExtraDisconnect':
          yield extraredoDisconnect(operation);
          break;

        default:
          break;
      }

      yield updateOperations(operations, operation_index + 1);
      yield validate();
    } else {
      yield setAppMessage('normal', '已经到头了，无法重做！');
    }
  }
}

function* undoInsert(operation) {
  const { parent_id, branch_index } = operation;
  const parent = yield getParagraph(parent_id);
  const child_id = getParagraphNextId(parent, branch_index);
  const child = yield getParagraph(child_id);
  const child_next_id = getParagraphNextId(child, 0);
  if (child) {
    yield deleteParagraph({ paragraph_id: child.id });
  }
  yield updateParagraph(setParagraphNextId(parent, branch_index, child_next_id));

  operation.child_paragraph = child;  // 注意，这个数据不需要显示，所以不进行解构
}

function* extraundoInsert(operation) {
  const { parent_id, branch_index } = operation;
  const parent = yield extragetParagraph(parent_id);
  const child_id = extragetParagraphNextId(parent, branch_index);
  const child = yield extragetParagraph(child_id);
  const child_next_id = extragetParagraphNextId(child, 0);
  if (child) {
    yield extradeleteParagraph({ paragraph_id: child.id });
  }
  yield extraupdateParagraph(extrasetParagraphNextId(parent, branch_index, child_next_id));

  operation.child_paragraph = child;  // 注意，这个数据不需要显示，所以不进行解构
}

function* undoDelete(operation) {
  const { child_paragraph, parents } = operation;
  yield updateParagraph(child_paragraph);
  for (let i = 0, n = parents.length; i < n; i++) {
    const info = parents[i];
    const { paragraph_id: parent_id, branch_index } = info;
    const parent = yield getParagraph(parent_id);
    yield updateParagraph(setParagraphNextId(parent, branch_index, child_paragraph.id));
  }
}

function* extraundoDelete(operation) {
  const { child_paragraph, parents } = operation;
  yield extraupdateParagraph(child_paragraph);
  for (let i = 0, n = parents.length; i < n; i++) {
    const info = parents[i];
    const { paragraph_id: parent_id, branch_index } = info;
    const parent = yield extragetParagraph(parent_id);
    yield extraupdateParagraph(extrasetParagraphNextId(parent, branch_index, child_paragraph.id));
  }
}

function* undoLink(operation) {
  const { a } = operation;
  const paragraph = yield getParagraphWithNextIdUpdated(a.id, a.index, -1);
  yield updateParagraph(paragraph);
}

function* extraundoLink(operation) {
  const { a } = operation;
  const paragraph = yield extragetParagraphWithNextIdUpdated(a.id, a.index, -1);
  yield extraupdateParagraph(paragraph);
}

function* undoMove(operation) {
  yield moveParagraph({ from_parent: operation.to_parent, to_parent: operation.from_parent, child: operation.child });
}

function* extraundoMove(operation) {
  yield extramoveParagraph({ from_parent: operation.to_parent, to_parent: operation.from_parent, child: operation.child });
}

function* undoDeleteBranchIndex(operation) {
  const { parents, deleted_item, paragraph_id, branch_index, deleted_paragraphs } = operation;
  yield updateParagraph(...deleted_paragraphs);
  if (!deleted_item && parents.length > 0) {
    for (let i = 0, n = parents.length; i < n; ++i) {
      const parent = parents[i];
      yield updateParagraph(yield getParagraphWithNextIdUpdated(parent.paragraph_id, parent.branch_index, paragraph_id));
    }
  } else {
    const paragraph = yield getParagraph(paragraph_id);
    paragraph.selections.splice(branch_index, 0, deleted_item);
    yield updateParagraph({
      ...paragraph,
      selections: [...paragraph.selections],
    });
  }
}

function* extraundoDeleteBranchIndex(operation) {
  const { parents, deleted_item, paragraph_id, branch_index, deleted_paragraphs } = operation;
  yield extraupdateParagraph(...deleted_paragraphs);
  if (!deleted_item && parents.length > 0) {
    for (let i = 0, n = parents.length; i < n; ++i) {
      const parent = parents[i];
      yield extraupdateParagraph(yield extragetParagraphWithNextIdUpdated(parent.paragraph_id, parent.branch_index, paragraph_id));
    }
  }
  else {
    const paragraph = yield extragetParagraph(paragraph_id);
    paragraph.selections.splice(branch_index, 0, deleted_item);
    yield extraupdateParagraph({
      ...paragraph,
      selections: [...paragraph.selections],
    });
  }
}

function* undoAddBranchIndex(operation) {
  const { paragraph_id } = operation;
  const paragraph = yield getParagraph(paragraph_id);
  const { selections } = paragraph;
  const added_item = selections[selections.length - 1];
  yield updateParagraph({
    ...paragraph,
    selections: selections.slice(0, selections.length - 1),
  });

  operation.added_item = added_item;
}

function* extraundoAddBranchIndex(operation) {
  const { paragraph_id } = operation;
  const paragraph = yield extragetParagraph(paragraph_id);
  const { selections } = paragraph;
  const added_item = selections[selections.length - 1];
  yield extraupdateParagraph({
    ...paragraph,
    selections: selections.slice(0, selections.length - 1),
  });

  operation.added_item = added_item;
}

function* undoDisconnect(operation) {
  const { paragraph_id, branch_index, next_id } = operation;
  yield updateParagraph(yield getParagraphWithNextIdUpdated(paragraph_id, branch_index, next_id));
}

function* extraundoDisconnect(operation) {
  const { paragraph_id, branch_index, next_id } = operation;
  yield extraupdateParagraph(yield extragetParagraphWithNextIdUpdated(paragraph_id, branch_index, next_id));
}

function* redoInsert(operation) {
  const { parent_id, branch_index } = operation;
  const parent = yield getParagraph(parent_id);
  const { child_paragraph } = operation;
  const child_id = child_paragraph.id;
  yield updateParagraph(
    setParagraphNextId(parent, branch_index, child_id),
    child_paragraph
  );
}

function* extraredoInsert(operation) {
  const { parent_id, branch_index } = operation;
  const parent = yield extragetParagraph(parent_id);
  const { child_paragraph } = operation;
  const child_id = child_paragraph.id;
  yield extraupdateParagraph(
    extrasetParagraphNextId(parent, branch_index, child_id),
    child_paragraph
  );
}

function* redoDelete(operation) {
  const { child_paragraph } = operation;
  const child_id = child_paragraph.id;
  operation.child_paragraph = yield getParagraph(child_id);
  yield deleteParagraph({ paragraph_id: child_id });
}

function* extraredoDelete(operation) {
  const { child_paragraph } = operation;
  const child_id = child_paragraph.id;
  operation.child_paragraph = yield extragetParagraph(child_id);
  yield extradeleteParagraph({ paragraph_id: child_id });
}

function* redoLink(operation) {
  yield linkParagraphs({ a: operation.a, b: operation.b });
}

function* extraredoLink(operation) {
  yield extralinkParagraphs({ a: operation.a, b: operation.b });
}

function* redoMove(operation) {
  yield moveParagraph({ from_parent: operation.from_parent, to_parent: operation.to_parent, child: operation.child });
}

function* extraredoMove(operation) {
  yield extramoveParagraph({ from_parent: operation.from_parent, to_parent: operation.to_parent, child: operation.child });
}

function* redoDeleteBranchIndex(operation) {
  // {type: 'DeleteBranchIndex', parents, deleted_item, paragraph_id, branch_index, deleted_paragraphs};
  const result = yield deleteBranchIndex({ paragraph_id: operation.paragraph_id, branch_index: operation.branch_index });
  operation.deleted_item = result.deleted_item;
  operation.deleted_paragraphs = result.deleted_paragraphs;
}

function* extraredoDeleteBranchIndex(operation) {
  // {type: 'DeleteBranchIndex', parents, deleted_item, paragraph_id, branch_index, deleted_paragraphs};
  const result = yield extradeleteBranchIndex({ paragraph_id: operation.paragraph_id, branch_index: operation.branch_index });
  operation.deleted_item = result.deleted_item;
  operation.deleted_paragraphs = result.deleted_paragraphs;
}

function* redoAddBranchIndex(operation) {
  const { paragraph_id, added_item } = operation;
  const paragraph = yield getParagraph(paragraph_id);
  yield updateParagraph({
    ...paragraph,
    selections: [...paragraph.selections, added_item],
  });
}

function* extraredoAddBranchIndex(operation) {
  const { paragraph_id, added_item } = operation;
  const paragraph = yield extragetParagraph(paragraph_id);
  yield extraupdateParagraph({
    ...paragraph,
    selections: [...paragraph.selections, added_item],
  });
}

function* redoDisconnect(operation) {
  const { paragraph_id, branch_index } = operation;
  yield updateParagraph(yield getParagraphWithNextIdUpdated(paragraph_id, branch_index, -1));
}

function* extraredoDisconnect(operation) {
  const { paragraph_id, branch_index } = operation;
  yield extraupdateParagraph(yield extragetParagraphWithNextIdUpdated(paragraph_id, branch_index, -1));
}

function* updateOperations(operations, operation_index) {
  yield put({
    type: 'UPDATE_OPERATIONS',
    operations,
    operation_index,
  });
}

function* deleteParagraph(action) {
  const { paragraph_id: delete_id } = action;
  const paragraph = yield getParagraph(delete_id);
  const parents = [];
  if (yield isFirstParagraph(delete_id)) {
    yield setAppMessage('error', '无法删除首个段落');
  }
  else {
    const paragraphs = yield getParagraphs();
    const next_id = paragraph.next_id;
    const updated_paragraphs = [];
    // 所有该段落的上一个段落，都将被修改next_id
    paragraphs.forEach(p => {
      if (p.id !== delete_id) {
        switch (p.type) {
          case 'Node':
          case 'Lock': {
            if (p.next_id === delete_id) {
              parents.push({ paragraph_id: p.id });
              updated_paragraphs.push({ ...p, next_id });
            }
            else {
              updated_paragraphs.push(p);
            }
            break;
          }

          case 'Branch':
          case 'NumberBranch': {
            updated_paragraphs.push({
              ...p,
              selections: p.selections.map((s, i) => {
                if (s.next_id === delete_id) {
                  parents.push({ paragraph_id: p.id, branch_index: i });
                  return { ...s, next_id };
                }
                else {
                  return s;
                }
              })
            });
            break;
          }

          case 'End':
          default:
            updated_paragraphs.push(p);
        }
      }
    });

    yield updateProjectContent({
      ...yield getContent(),
      paragraphs: updated_paragraphs,
    });
  }

  return { type: 'Delete', child_paragraph: paragraph, parents, };
}

function* extradeleteParagraph(action) {
  const { paragraph_id: delete_id } = action;
  const paragraph = yield extragetParagraph(delete_id);
  const parents = [];
  if (yield extraisFirstParagraph(delete_id)) {
    yield setAppMessage('error', '无法删除首个段落');
  }
  else {
    const paragraphs = yield extragetParagraphs();
    const next_id = paragraph.next_id;
    const updated_paragraphs = [];
    // 所有该段落的上一个段落，都将被修改next_id
    paragraphs.forEach(p => {
      if (p.id !== delete_id) {
        switch (p.type) {
          case 'Node': {
            if (p.next_id === delete_id) {
              parents.push({ paragraph_id: p.id });
              updated_paragraphs.push({ ...p, next_id });
            }
            else {
              updated_paragraphs.push(p);
            }
            break;
          }

          case 'Branch': {
            updated_paragraphs.push({
              ...p,
              selections: p.selections.map((s, i) => {
                if (s.next_id === delete_id) {
                  parents.push({ paragraph_id: p.id, branch_index: i });
                  return { ...s, next_id };
                }
                else {
                  return s;
                }
              })
            });
            break;
          }

          default:
            updated_paragraphs.push(p);
        }
      }
    });
    yield extraupdateParagraphs(updated_paragraphs);
  }

  return { type: 'ExtraDelete', child_paragraph: paragraph, parents, };
}

function* expandBranch(action) {
  const { paragraph_id } = action;
  yield updateParagraph({
    ...yield getParagraph(paragraph_id),
    expanded: action.expanded,
  });
}

function* extraexpandBranch(action) {
  const { paragraph_id } = action;
  yield extraupdateParagraph({
    ...yield extragetParagraph(paragraph_id),
    expanded: action.expanded,
  });
}

function* insertNodeParagraph(action) {
  // console.log('Insert node paragraph');

  const { parent_id, branch_index } = action;
  const parent = yield getParagraph(parent_id);
  const child = yield createNodeParagraph();
  child.chat_id = parent.chat_id;
  child.next_id = getParagraphNextId(parent, branch_index);
  yield updateParagraph(setParagraphNextId(parent, branch_index, child.id), child);

  return { type: 'Insert', parent_id, branch_index, child_paragraph: null };
}

function* extrainsertNodeParagraph(action) {
  // console.log('Insert node paragraph');

  const { parent_id, branch_index } = action;
  const parent = yield extragetParagraph(parent_id);
  const child = yield extracreateNodeParagraph();
  child.chat_id = parent.chat_id;
  child.next_id = extragetParagraphNextId(parent, branch_index);
  yield extraupdateParagraph(extrasetParagraphNextId(parent, branch_index, child.id), child);

  return { type: 'ExtraInsert', parent_id, branch_index, child_paragraph: null };
}

function* insertBranchParagraph(action) {
  // console.log('Insert branch paragraph');

  const { parent_id, branch_index } = action;
  const parent = yield getParagraph(parent_id);
  const child = yield createBranchParagraph();
  child.selections[0].next_id = getParagraphNextId(parent, branch_index);
  child.chat_id = parent.chat_id;
  yield updateParagraph(setParagraphNextId(parent, branch_index, child.id), child);

  return { type: 'Insert', parent_id, branch_index, child_paragraph: null };
}

function* extrainsertBranchParagraph(action) {
  // console.log('Insert branch paragraph');

  const { parent_id, branch_index } = action;
  const parent = yield extragetParagraph(parent_id);
  const child = yield extracreateBranchParagraph();
  child.selections[0].next_id = extragetParagraphNextId(parent, branch_index);
  child.chat_id = parent.chat_id;
  yield extraupdateParagraph(extrasetParagraphNextId(parent, branch_index, child.id), child);

  return { type: 'ExtraInsert', parent_id, branch_index, child_paragraph: null };
}

function* insertEndParagraph(action) {
  // console.log('Insert end paragraph');

  const { parent_id, branch_index } = action;
  const parent = yield getParagraph(parent_id);
  const child = yield createEndParagraph();
  child.chat_id = parent.chat_id;
  if (getParagraphNextId(parent, branch_index) === -1) {
    yield updateParagraph(setParagraphNextId(parent, branch_index, child.id), child);

    return { type: 'Insert', parent_id, branch_index, child_paragraph: null };
  }
  else {
    yield setAppMessage('error', '只允许在末尾添加结局');
  }
}

function* insertLockParagraph(action) {
  // console.log('Insert lock paragraph');

  const { parent_id, branch_index } = action;
  const parent = yield getParagraph(parent_id);
  const child = yield createLockParagraph();
  child.next_id = getParagraphNextId(parent, branch_index);
  child.chat_id = parent.chat_id;
  yield updateParagraph(setParagraphNextId(parent, branch_index, child.id), child);

  return { type: 'Insert', parent_id, branch_index, child_paragraph: null };
}

function* insertGoOnParagraph(action) {
  console.log('Insert goon paragraph');

  const { parent_id, branch_index } = action;
  const parent = yield getParagraph(parent_id);
  const child = yield createGoOnParagraph();
  child.next_id = getParagraphNextId(parent, branch_index);
  child.chat_id = parent.chat_id;
  yield updateParagraph(setParagraphNextId(parent, branch_index, child.id), child);

  return { type: 'Insert', parent_id, branch_index, child_paragraph: null };
}

function* totalcharacter() {
  let outline = yield getOutline();
  let paragraphs = yield getParagraphs();
  let character = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    if (paragraphs[i].type === 'End') {
      character += paragraphs[i].title.replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', '').length;
      character += paragraphs[i].text.replace(/(https?:\/\/)\w+(\.\w+)+.*\.[0-9a-zA-Z]+/g, '').replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', '').length;
    } else if (paragraphs[i].type === 'Branch') {
      for (let j = 0; j < paragraphs[i].selections.length; j++) {
        character += paragraphs[i].selections[j].title.replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', '').length;
      }
    } else if (paragraphs[i].type === 'Node') {
      const blocks = paragraphs[i].text.split(/\n[\s\n]*\n/g);
      for (let j = 0, n = blocks.length; j < n; j++) {
        const lines = blocks[j].split(/\n/);
        if (lines[0].startsWith('@')) {
          if (lines[1] && (lines[1].startsWith('#图片#') || lines[1].startsWith('#音频#') || lines[1].startsWith('#数值#') || lines[1].startsWith('#立绘#'))) {
            character += 0;
          } else if (lines[1] && lines[1].startsWith('#视频#')) {
            character += lines[2] ? lines[2].replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', '').length : 0;
          } else if (lines[1] && lines[1].startsWith('#链接#')) {
            character += lines[2] ? lines[2].replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', '').length : 0;
            character += lines[3] ? lines[3].replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', '').length : 0;
          } else if (lines[1] && lines[1].startsWith('#忙碌#')) {
            character += lines[2] ? lines[2].replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', '').length : 0;
          } else if (lines[1] && lines[1].startsWith('#电话开始#')) {
            character += lines[2] ? lines[2].replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', '').length : 0;
          } else {
            // console.log(blocks[j].substring(lines[0].length + 1).replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', ''));
            character += blocks[j].substring(lines[0].length + 1).replace(/(https?:\/\/)\w+(\.\w+)+.*\.[0-9a-zA-Z]+/g, '').replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', '').length;
          }
        } else {
          // 不需要@角色的内容
          if (lines[0].startsWith('#图片#') || lines[0].startsWith('#背景音乐#') || lines[0].startsWith('#音效#') || lines[0].startsWith('#数值#') || lines[0].startsWith('==') || lines[0].startsWith('#背景#') || lines[0].startsWith('#情景结束#') || lines[0].startsWith('#电话结束#')) {
            character += 0;
          } else if (lines[0].startsWith('#视频#')) {
            character += lines[1] ? lines[1].replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', '').length : 0;
          } else if (lines[0].startsWith('#情景开始#')) {
            character += lines[1] ? lines[1].replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', '').length : 0;
          } else {
            // console.log(lines[0].replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', ''));
            character += lines[0].replace(/\s+/g, '龘').replace(/[\x00-\xff]+/g, "m").replace('龘', '').length;
          }
        }
      }
    }
  }
  outline.character_count = character;
  yield put({ type: 'UPDATE_PROJECT_OUTLINE', outline });
}

export function* validate() {
  const content = yield getContent();
  const extras = yield getExtras();
  const { errors, warnings } = validateProjectContent(content, extras);
  yield put({
    type: 'UPDATE_VALIDATION_RESULT',
    errors,
    warnings,
  });
}

//获取剧本批注
function* requestProjectComment(outline) {
  try {
    const token = yield getToken();
    yield setAppLoading('正在获取剧本批注数据...');
    const result = yield Api.fetch('/v1/project_comment/' + outline.id, {
      method: 'GET',
      headers: { "Content-Type": "application/json", "Authorization": token }
    });
    if (result.error === 0) {
      let comments = result.project_comment;
      if (comments) {
        comments.time = outline.update_time;
        comments.content = JSON.parse(comments.content);
      } else {
        comments = { id: 0, project_id: outline.id, content: [], time: outline.update_time }
      }
      yield put({
        type: 'RESPONSE_PROJECT_COMMENTS',
        comments,
      });
    } else {
      yield setAppMessage('error', '获取剧本批注数据失败,请重新刷新页面！');
      // console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('error', '网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          // console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('error', '未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      // console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

//获取剧本详细内容
export function* requestProject(action) {
  try {
    //初始化
    yield put({ type: 'CLEAR_EDITOR' });
    const token = yield getToken();
    yield setAppLoading('正在获取剧本数据...');
    const result = yield Api.fetch('/v1/project/' + action.id, {
      method: 'GET',
      headers: { "Content-Type": "application/json", "Authorization": token }
    });
    if (result.error === 0) {
      const project = result.project;
      project.tags = project.tags.split(',');
      const content = JSON.parse(project.content);

      //数值结构更新
      if (!content.numbers) {
        content.numbers = { '系统': { type: 'system', nums: { '好感度': { type: 'normal', value: 0, show_name: '' } } } }
      } else {
        if (Array.isArray(content.numbers)) {
          let nums = {};
          content.numbers.forEach(n => nums[n.title] = { type: 'normal', value: n.number, show_name: '' });
          content.numbers = { '系统': { type: 'system', nums } }
        }
      }

      //数值分支结构更新
      let paragraphs = content.paragraphs.map(p => {
        if (p.type === 'NumberBranch' && p.ranges) {
          const selections = p.ranges.map((r, key) => {
            if (key === 0) {
              return { title: p.key + '<' + r.value, operator: '&', conditions: [{ key: p.key, operator: '<', value: r.value }], next_id: r.next_id }
            } else if (key === p.ranges.length - 1) {
              return { operator: '&', conditions: [{ key: p.key, operator: '>=', value: p.ranges[key - 1].value }], next_id: r.next_id }
            } else {
              return { operator: '&', conditions: [{ key: p.key, operator: '>=', value: p.ranges[key - 1].value }, { key: p.key, operator: '<', value: r.value }], next_id: r.next_id }
            }
          });
          return { id: p.id, expanded: true, chat_id: p.chat_id, type: p.type, selections }
        } else {
          return p;
        }
      });
      content.paragraphs = paragraphs;
      // console.log(paragraphs);

      if (!project.sketch) {
        project.sketch = '';
      }

      if (!project.idols) {
        project.idols = [];
      } else {
        if (project.idols === '') {
          project.idols = [];
        } else {
          project.idols = JSON.parse(project.idols);
        }
      }
      const outline = { ...project, content: '', script: '' };
      yield put({
        type: 'RESPONSE_PROJECT',
        outline,
        content,
      });
      const comments = { id: 0, project_id: outline.id, content: [], time: outline.update_time }
      yield put({
        type: 'RESPONSE_PROJECT_COMMENTS',
        comments,
      });
      yield requestProjectComment(outline);
      yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'ProjectEditor-Editor' });
    } else {
      yield setAppMessage('error', '获取剧本数据失败,请重新再试！');
      // console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('error', '网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          // console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('error', '未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      // console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

//文件上传
function* uploadFile(action) {
  try {
    yield setAppLoading('正在上传...');
    config.token = yield getToken();
    const upload = (file) => new Promise((resolve, reject) => {
      let Bucket = '';
      let Region = 'ap-shanghai';
      if (!file) {
        reject('请重新选择文件！');
      };
      let type = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      let name = uuid.create(4).toString();
      if (type === '.jpg' || type === '.jpeg' || type === '.png' || type === '.gif') {
        if (action.filetype === 'img1' || action.filetype === 'img2' || action.filetype === 'both') {
          Bucket = 'image-1251001942';
          const createObjectURL = window.URL ? window.URL.createObjectURL : window.webkitURL.createObjectURL;
          let url = createObjectURL(file);
          var img = new Image();
          img.onload = () => {
            const bgcolor = RGBaster(img, ['0,0,0', '255,255,255']);
            // console.log(bgcolor);
            let info = '_' + img.width + '_' + img.height + '_' + bgcolor;
            name = name + info + type;
            // 上传文件
            // config.cos.putObject({
            //   Bucket: Bucket,
            //   Region: Region,
            //   Key: '/script/' + name,
            //   Body: file,
            // }, (err, data) => {
            //   if (err) {
            //     // console.log(err);
            //     reject('文件上传出错，请确保网络正常后再试！');
            //   } else {
            //     // console.log(data);
            //     resolve('http://image.putong.91smart.net/script/' + name);
            //   }
            // });
              config.importHandler(file).then(function(name){
                  resolve(name);
              },function(){
                  reject('服务器处理错误！');
              })




          }
          img.onerror = () => {
            reject('文件上传出错，可能图片存在问题！');
          }
          img.src = url;
        } else if (action.filetype === 'video') {
          reject('视频上传仅支持.mp4文件格式！');
        } else {
          reject('音频上传仅支持.mp3文件格式！');
        }
      } else if (type === '.mp4') {
        if (action.filetype === 'video' || action.filetype === 'both') {
          Bucket = 'video-1251001942';
          const createObjectURL = window.URL ? window.URL.createObjectURL : window.webkitURL.createObjectURL;
          let url = createObjectURL(file);
          let video = document.createElement("video");
          video.onloadedmetadata = () => {
            let info = '_' + video.videoWidth + '_' + video.videoHeight + '_' + Math.round(video.duration);
            name = name + info + type;
            // 上传文件
            // config.cos.putObject({
            //   Bucket: Bucket,
            //   Region: Region,
            //   Key: '/script/' + name,
            //   Body: file,
            // }, (err, data) => {
            //   if (err) {
            //     // console.log(err);
            //     reject('文件上传出错，请确保网络正常后再试！');
            //   } else {
            //     // console.log(data);
            //     resolve('http://video.putong.91smart.net/script/' + name);
            //   }
            // });
          }
            config.importHandler(file).then(function(name){
                resolve(name);
            },function(){
                reject('服务器处理错误！');
            })
          video.onerror = () => {
            reject('文件上传出错，不是标准的mp4格式！');
          }
          video.src = url;
        } else if (action.filetype === 'img1' || action.filetype === 'img2') {
          reject('图片上传仅支持jpg、jpeg、gif、png格式!');
        } else {
          reject('音频上传仅支持.mp3文件格式！');
        }
      } else if (type === '.mp3') {
        if (action.filetype === 'audio' || action.filetype === 'both') {
          Bucket = 'audio-1251001942';
          const createObjectURL = window.URL ? window.URL.createObjectURL : window.webkitURL.createObjectURL;
          let url = createObjectURL(file);
          let audio = document.createElement("audio");
          audio.onloadedmetadata = () => {
            let info = '_' + Math.round(audio.duration);
            name = name + info + type;
            // 上传文件
            // config.cos.putObject({
            //   Bucket: Bucket,
            //   Region: Region,
            //   Key: '/script/' + name,
            //   Body: file,
            // }, (err, data) => {
            //   if (err) {
            //     // console.log(err);
            //     reject('文件上传出错，请确保网络正常后再试！');
            //   } else {
            //     // console.log(data);
            //     resolve('http://audio.putong.91smart.net/script/' + name);
            //   }
            // });
              config.importHandler(file).then(function(name){
                  resolve(name);
              },function(){
                  reject('服务器处理错误！');
              })
          }
          audio.onerror = () => {
            reject('文件上传出错，可能音频存在问题！');
          }
          audio.src = url;
        } else if (action.filetype === 'video') {
          reject('视频上传仅支持.mp4文件格式！');
        } else {
          reject('图片上传仅支持.jpg、.jpeg、.gif、.png文件格式！');
        }
      } else {
        if (action.filetype === 'video') {
          reject('视频上传仅支持.mp4文件格式！');
        } else if (action.filetype === 'img1' || action.filetype === 'img2') {
          reject('图片上传仅支持.jpg、.jpeg、.gif、.png文件格式！');
        } else if (action.filetype === 'audio') {
          reject('音频上传仅支持.mp3文件格式！');
        } else {
          reject('支持图片、视频、音频文件的上传！');
        }
      }
    });
    const path = yield upload(action.file);
    action.callback(path);
  } catch (e) {
    action.callback('');
    yield setAppMessage('error', e);
  } finally {
    yield setAppLoading(null);
  }
}

//投稿
function* commitProject(action) {
  try {
    yield setAppLoading('正在检查错误...');
    yield validate();
    const errors = yield getErrors();
    if (errors.find(err => !err.extra.extra_uuid)) {
      yield setAppAlert('发布剧本失败: 剧本存在错误', null);
    } else {
      const outline = yield getOutline();
      // if (outline.character_count < 3000) {
      //   yield setAppMessage('error', '作品字数不足3000，无法投稿！');
      // } else {
      yield setAppLoading('正在编译...');
      const content = yield getContent();
      const builded = buildProject(1, outline, content);
      const project = { ...outline, content: JSON.stringify(builded.content), script: JSON.stringify(builded.script), lock_paragraphs: JSON.stringify(builded.lock_paragraphs), idols: JSON.stringify(outline.idols), tags: outline.tags.join(',') };
      const token = yield getToken();
      yield setAppLoading('正在投稿......');
      const result = yield Api.fetch('/v1/project/commit', {
        method: 'POST',
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify(project)
      });
      if (result.error === 0) {
        yield setAppMessage('success', '投稿成功，请耐心等待审核结果');
      } else {
        yield setAppMessage('error', '投稿失败！');
      }
    }
    // }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('error', '网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          // console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('error', '未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      // console.log(e, '发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

//真机预览
function* previewProject(action) {
  try {
    yield setAppMessage('normal', '开始验证剧本');
    yield validate();
    const errors = yield getErrors();
    if (errors.find(err => !err.extra.extra_uuid)) {
      yield setAppAlert('试玩发布失败: 剧本存在错误', null);
    } else {
      const outline = yield getOutline();
      yield setAppMessage('normal', '开始编译剧本');
      const content = yield getContent();
      const builded = buildProject(0, outline, content);
      const project = { ...outline, content: JSON.stringify(builded.content), script: JSON.stringify(builded.script), lock_paragraphs: JSON.stringify(builded.lock_paragraphs), idols: JSON.stringify(outline.idols), tags: outline.tags.join(',') };

      yield setAppMessage('normal', '编译剧本完成');
      const token = yield getToken();
      yield setAppLoading('正在试玩发布......');
      const result = yield Api.fetch('/v1/project/proview/', {
        method: 'POST',
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify(project)
      });

      if (result) {
        yield setAppMessage('success', '试玩发布成功，快到app试玩剧本吧！');
      } else {
        yield setAppMessage('error', '试玩发布失败！');
      }
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('error', '网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          // console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('error', '未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      // console.log(e, '发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

//保存剧本
function* saveProject(action) {
  try {
    const token = yield getToken();
    yield setAppLoading('正在保存剧本...');
    const outline = yield getOutline();
    const content = yield getContent();
    // console.log(JSON.stringify(content));
    const project = { ...outline, content: JSON.stringify(content), idols: JSON.stringify(outline.idols), tags: outline.tags.join(',') };
    const result = yield Api.fetch('/v1/project/', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify(project)
    });
    if (result.error === 0) {
      if (action && action.mode && action.mode === 'auto') {
        yield setAppMessage('success', '自动保存成功！');
      } else {
        yield setAppMessage('success', '保存了【' + project.title + '】的剧本内容！');
      }
      return true;
    } else {
      yield setAppMessage('error', '剧本保存失败,请重新尝试！');
      // console.log('发生了未知错误！');
      return false;
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('error', '网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          // console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('error', '未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      // console.log('发生了未知错误！');
    }
    return false;
  } finally {
    yield setAppLoading(null);
  }
}

function* requestIdol(action) {
  try {
    const token = yield getToken();
    yield setAppLoading('正在获取偶像数据...');
    const result = yield Api.fetch('/v1/idol/' + action.id, {
      method: 'GET',
      headers: { "Content-Type": "application/json", "Authorization": token }
    });
    if (result.error === 0) {
      const idols = yield getIdols();
      const projects = result.projects ? result.projects : [];
      const newidols = idols.map(idol => {
        if (idol.id === action.id) {
          return { ...result.idol, projects }
        } else {
          return { ...idol }
        }
      });
      yield put({ type: 'UPDATE_IDOLS', list: newidols });
      yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Home-Editidol-' + action.id });
    } else {
      yield setAppMessage('error', '获取偶像数据失败,请重新再试！');
      // console.log(result);
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('error', '网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          // console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('error', '未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      // console.log(e);
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* saveProjectContent(action) {
  yield updateProjectContent({ ...action.content });
  yield saveProject();
}

function* saveProjectOutline(action) {
  yield updateProjectOutline({ ...action.outline });
  yield saveProject();
}

function* watchActions() {
  yield takeEvery('COMMIT_PROJECT', commitProject);
  yield takeEvery('PREVIEW_PROJECT', previewProject);
  yield takeEvery('SAVE_PROJECT', saveProject);
  yield takeEvery('SAVE_PROJECT_CONTENT', saveProjectContent);
  yield takeEvery('SAVE_PROJECT_OUTLINE', saveProjectOutline);
  yield takeEvery('REQUEST_IDOL', requestIdol);
  yield takeEvery('UPLOAD_FILE', uploadFile);
  yield takeEvery('REQUEST_PROJECT', requestProject);
}

function* watchUpdateParagraph() {
  yield takeEvery('UPDATE_PARAGRAPH', function* (action) {
    yield updateParagraph({ ...action.paragraph });
  });
}

function* watchExtraUpdateParagraph() {
  yield takeEvery('EXTRA_UPDATE_PARAGRAPH', function* (action) {
    yield extraupdateParagraph({ ...action.paragraph });
  });
}

function* watchForValidation() {
  while (true) {
    yield take(['RESPONSE_PROJECT', 'UPDATE_PROJECT_CONTENT', 'UPDATE_PARAGRAPH', 'UPDATE_EXTRAS', 'RESPONSE_EXTRAS']);
    yield totalcharacter();
    yield validate();
  }
}

function getParagraphNextId(paragraph, branch_index) {
  switch (paragraph.type) {
    case 'Branch':
    case 'NumberBranch':
      return paragraph.selections[branch_index].next_id;

    default:
      return paragraph.next_id;
  }
}

function extragetParagraphNextId(paragraph, branch_index) {
  switch (paragraph.type) {
    case 'Branch':
      return paragraph.selections[branch_index].next_id;

    default:
      return paragraph.next_id;
  }
}

function setParagraphNextId(paragraph, branch_index, next_id) {
  switch (paragraph.type) {
    case 'Branch':
    case 'NumberBranch':
      return {
        ...paragraph,
        selections: paragraph.selections.map((s, i) => i === branch_index ? { ...s, next_id } : s),
      };

    default:
      return {
        ...paragraph,
        next_id,
      };
  }
}

function extrasetParagraphNextId(paragraph, branch_index, next_id) {
  switch (paragraph.type) {
    case 'Branch':
      return {
        ...paragraph,
        selections: paragraph.selections.map((s, i) => i === branch_index ? { ...s, next_id } : s),
      };

    default:
      return {
        ...paragraph,
        next_id,
      };
  }
}

function* getParagraphWithNextIdUpdated(paragraph_id, branch_index, next_id) {
  const paragraph = yield getParagraph(paragraph_id);
  return setParagraphNextId(paragraph, branch_index, next_id);
}

function* extragetParagraphWithNextIdUpdated(paragraph_id, branch_index, next_id) {
  const paragraph = yield extragetParagraph(paragraph_id);
  return extrasetParagraphNextId(paragraph, branch_index, next_id);
}

// function* getParagraphTreeScale() {
//   return yield select(store => store.editor.paragraph_tree_scale);
// }

export default function* editor() {
  yield fork(watchOperations);
  yield fork(watchUndo);
  yield fork(watchRedo);
  yield fork(watchActions);
  yield fork(watchUpdateParagraph);
  yield fork(watchExtraUpdateParagraph);
  yield fork(watchForValidation);
};


