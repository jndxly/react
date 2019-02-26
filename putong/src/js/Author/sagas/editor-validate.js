export const ValidationCode = {
  TestError: 1000,
  InvalidChatIdOfParagraph: 1001,
  InvalidGalleryIdOfRole: 1002,

  RoleNameNotFound: 1003,
  GalleryTitleNotFound: 1004,
  NodeWithoutContentError: 1005,
  DuplicatedRoleName: 1006,
  ParagraphWithoutContentError: 1007,
  EndParagraphGalleryIdNotFound: 1008,
  InvalidCoinOfLock: 1009,
  InvalidParagraphType: 1010,
  NumberKeyNotFound: 1011,

  ImageNodeFormatError: 1100,
  ImageNodeGalleryFormatError: 1101,
  ImageNodeUrlNotFound: 1102,

  VideoNodeTextFormatError: 1110,
  VideoNodeGalleryFormatError: 1111,
  VideoNodeFormatError: 1112,
  VideoNodeUrlNotFound: 1113,

  LinkNodeTitleFormatError: 1120,
  LinkNodeTextFormatError: 1121,
  LinkNodeLinkFormatError: 1122,
  LinkNodeImageFormatError: 1123,
  LinkNodeFormatError: 1124,

  BusyNodeFormatError: 1130,
  BusyNodeRoleIsUserError: 1131,
  BusyNodeTextNotFound: 1132,

  DelayNodeInvalidTime: 1140,
  DelayNodeFormatError: 1141,

  AudioNodeFormatError: 1150,
  AudioNodeGalleryFormatError: 1151,
  AudioNodeUrlNotFound: 1152,

  CallStartNodeFormatError: 1160,
  CallNodeTitleNotFound: 1161,
  CallNodeImageNotFound: 1162,
  CallNodeLineRoleNotFound: 1163,
  CallEndNodeFormatError: 1164,
  CallNodeLineTextNotFound: 1165,
  CallNodeLineFormatError: 1166,
  CallStartNodeRoleIsPlayer: 1167,
  CallNodeGalleryFormatError: 1168,
  CallNodeNotComplete: 1169,
  CallNodeVideoNotFound: 11610,
  CallStartNodeRoleNotFound: 11611,

  NumberNodeFormatError: 1170,
  NumberNodeContentNotFound: 1171,

  BgmNodeFormatError: 1180,
  BgmNodeUrlNotFound: 1181,
  BgmNodeNumNotFound: 1182,
  BgmNodeInvalidNum: 1183,

  SoundNodeFormatError: 1190,
  SoundNodeUrlNotFound: 1191,
  SoundNodeNumNotFound: 1192,
  SoundNodeInvalidNum: 1193,

  SelectionNextParagraphNotFound: 1200,
  NumberSelectionNextParagraphNotFound: 1201,
  InvalidNumberBranchValue: 1202,
  NumberSelectionOptionNotFound: 1203,

  SceneStartNodeFormatError: 1210,
  SceneNodeTitleNotFound: 1211,
  SceneNodeLineTextNotFound: 1212,
  SceneNodeLineFormatError: 1213,
  SceneEndNodeFormatError: 1214,
  SceneNodeNotComplete: 1215,
  BackgroundFormatError: 1216,
  BackgroundUrlNotFound: 1217,
  RoleAnimationFormatError: 1218,
  RoleAnimationNameNotFound: 1219,
  InvalidRoleAnimationName: 1220,
  SceneHasNoContent: 1221,
  NodeTagFormatError: 1222,

  ExtraTitleIsEmpty: 1230,
  ExtrapPreviewIsEmpty: 1231,
  InvalidParagraphText: 1232,
  ExtraInvalidGallery: 1233,

  InvalidUrl: 1240,

  TestWarning: 2000,

  ParagrapWithoutNextParagraph: 2001,
  LockWithoutNextParagraph: 2002,
};

export class ValidationError {
  constructor(code, extra) {
    this.code = code;
    this.extra = extra;
  }
}
ValidationError.prototype.name = 'ValidationError';
ValidationError.prototype.toString = function () {
  // return this.getContext() + this.getMessage() +  `  (${this.code})`;
  return this.getContext() + this.getMessage();
};

ValidationError.prototype.getContext = function () {
  const { type, title, line_number, extra_uuid, extra_title } = this.extra;
  const isextra = extra_uuid && extra_uuid !== null ? '番外' : '剧本';
  const extratitle = extra_title !== null ? '《' + extra_title + '》' : '';
  if (title) {
    if (line_number) {
      return `【${isextra}】${extratitle}${type}<${title}>, 第${line_number}行: `;
    } else {
      return `【${isextra}】${extratitle}${type}<${title}>: `;
    }
  } else {
    return `【${isextra}】${extratitle}${type}`;
  }
};

ValidationError.prototype.getMessage = function () {
  switch (this.code) {
    case ValidationCode.InvalidUrl:
      return `链接地址格式错误: "${this.extra.url}"`;

    case ValidationCode.InvalidGalleryIdOfRole:
      return `角色的回忆不存在`;

    case ValidationCode.RoleNameNotFound:
      return `角色不存在: "${this.extra.name}"`;

    case ValidationCode.GalleryTitleNotFound:
      return `回忆不存在: "${this.extra.title}"`;

    case ValidationCode.DuplicatedRoleName:
      return `角色名重复: "${this.extra.name}"`;

    case ValidationCode.ParagraphWithoutContentError:
      return `段落缺少内容`;

    case ValidationCode.InvalidChatIdOfParagraph:
      return `聊天窗口所选角色不存在或未选择`;

    case ValidationCode.InvalidCoinOfLock:
      return `剧情锁的价格设置错误, 必须为大于零的整数`;

    case ValidationCode.InvalidParagraphType:
      return `错误的段落类型: "${this.extra.type}"`;

    case ValidationCode.NumberKeyNotFound:
      return `数值不存在: "${this.extra.key}"`;

    case ValidationCode.NodeWithoutContentError:
      return `缺少对白内容`;

    case ValidationCode.EndParagraphGalleryIdNotFound:
      return `结局所选回忆错误, 请重新选择`;

    case ValidationCode.ImageNodeGalleryFormatError:
      return `#图片#回忆格式错误: "${this.extra.text}", 请在回忆名称前添加">"符号`;

    case ValidationCode.ImageNodeFormatError:
      return `#图片#格式错误: "${this.extra.text}"`;

    case ValidationCode.ImageNodeUrlNotFound:
      return `#图片#格式错误, 缺少图片链接`;

    case ValidationCode.VideoNodeTextFormatError:
      return `#视频#格式错误, 需要填写视频简介`;

    case ValidationCode.VideoNodeGalleryFormatError:
      return `#视频#回忆格式错误: "${this.extra.text}", 请在回忆名称前添加">"符号`;

    case ValidationCode.VideoNodeFormatError:
      return `#视频#格式错误: "${this.extra.text}"`;

    case ValidationCode.VideoNodeUrlNotFound:
      return `#视频#格式错误, 缺少视频链接`;

    case ValidationCode.AudioNodeGalleryFormatError:
      return `#音频#回忆格式错误: "${this.extra.text}", 请在回忆名称前添加">"符号`;

    case ValidationCode.AudioNodeFormatError:
      return `#音频#格式错误: "${this.extra.text}"`;

    case ValidationCode.AudioNodeUrlNotFound:
      return `#音频#格式错误, 缺少音频链接`;

    case ValidationCode.BgmNodeFormatError:
      return `#背景音乐#格式错误: "${this.extra.text}"`;

    case ValidationCode.BgmNodeUrlNotFound:
      return `#背景音乐#格式错误, 缺少背景音乐链接`;

    // case ValidationCode.BgmNodeNumNotFound:
    //     return `#背景音乐#格式错误, 缺少循环次数`;

    case ValidationCode.BgmNodeInvalidTimes:
      return `#背景音乐#格式错误, 循环次数只能为正整数字`;

    case ValidationCode.SoundNodeFormatError:
      return `#音效#格式错误: "${this.extra.text}"`;

    case ValidationCode.SoundNodeUrlNotFound:
      return `#音效#格式错误, 缺少音效链接`;

    // case ValidationCode.SoundNodeNumNotFound:
    //     return `#音效#格式错误, 缺少循环次数`;

    case ValidationCode.SoundNodeInvalidTimes:
      return `#音效#格式错误, 循环次数只能为正整数字`;

    case ValidationCode.LinkNodeTitleFormatError:
      return `#链接#格式错误, 缺少标题`;

    case ValidationCode.LinkNodeTextFormatError:
      return `#链接#格式错误, 缺少描述`;

    case ValidationCode.LinkNodeLinkFormatError:
      return `#链接#格式错误, 缺少网址链接`;

    case ValidationCode.LinkNodeImageFormatError:
      return `#链接#格式错误, 缺少预览图链接`;

    case ValidationCode.LinkNodeFormatError:
      return `#链接#格式错误: "${this.extra.text}"`;

    case ValidationCode.BusyNodeFormatError:
      return `#忙碌#格式错误: "${this.extra.text}"`;

    case ValidationCode.BusyNodeRoleIsUserError:
      return `#忙碌#格式错误, 所属角色不能是"我"`;

    case ValidationCode.BusyNodeTextNotFound:
      return `#忙碌#格式错误, 缺少忙碌提示文本`;

    case ValidationCode.DelayNodeInvalidTime:
      return `==延时格式错误，"=="后不是数字: "${this.extra.number}"`;

    case ValidationCode.DelayNodeFormatError:
      return `==延时格式错误: "${this.extra.text}"`;

    case ValidationCode.CallStartNodeFormatError:
      return `电话格式错误: "${this.extra.text}"`;

    case ValidationCode.CallNodeTitleNotFound:
      return `电话格式错误, 缺少标题`;

    case ValidationCode.CallNodeImageNotFound:
      return `电话格式错误, 缺少图片`;

    case ValidationCode.CallNodeVideoNotFound:
      return `电话格式错误, 缺少视频`;

    case ValidationCode.CallNodeLineRoleNotFound:
      return `电话过程格式错误, 缺少@角色名`;

    case ValidationCode.CallEndNodeFormatError:
      return `电话格式错误: "${this.extra.text}"`;

    case ValidationCode.CallNodeLineTextNotFound:
      return `电话过程格式错误, 缺少文本`;

    case ValidationCode.CallNodeLineFormatError:
      return `电话过程格式错误: "${this.extra.text}"`;

    case ValidationCode.CallStartNodeRoleIsPlayer:
      return `电话格式错误, 所属角色不能是"我"`;

    case ValidationCode.CallStartNodeRoleNotFound:
      return `电话格式错误, 所属角色没有找到`;

    case ValidationCode.CallNodeGalleryFormatError:
      return `电话回忆格式错误: "${this.extra.text}", 请在回忆名称前添加">"符号`;

    case ValidationCode.CallNodeNotComplete:
      return '电话格式错误，缺少结束标签';

    case ValidationCode.NumberNodeFormatError:
      return `#数值#格式错误: "${this.extra.text}"`;

    case ValidationCode.NumberNodeContentNotFound:
      return `#数值#格式错误, 缺少数值表达式`;

    case ValidationCode.SelectionNextParagraphNotFound:
      return `分支必须连接到下一个段落`;

    case ValidationCode.NumberSelectionNextParagraphNotFound:
      return `分支必须连接到下一个段落`;

    case ValidationCode.InvalidNumberBranchValue:
      return `条件的数值不是有效数字: 第${this.extra.index + 1}个分支`;

    case ValidationCode.NumberSelectionOptionNotFound:
      return `条件为空: 第${this.extra.index + 1}个分支`;

    case ValidationCode.SceneStartNodeFormatError:
      return `#情景开始#格式错误: "${this.extra.text}"`;

    case ValidationCode.SceneNodeTitleNotFound:
      return `#情景开始#格式错误, 缺少标题`;

    case ValidationCode.SceneNodeLineTextNotFound:
      return `情景过程格式错误, 缺少文本`;

    case ValidationCode.SceneEndNodeFormatError:
      return `#情景结束#格式错误: "${this.extra.text}"`;

    case ValidationCode.SceneNodeNotComplete:
      return '缺少#情景结束#';

    case ValidationCode.BackgroundFormatError:
      return `#背景#格式错误: "${this.extra.text}"`;

    case ValidationCode.BackgroundUrlNotFound:
      return `#背景#格式错误, 缺少图片或视频地址`;

    case ValidationCode.RoleAnimationFormatError:
      return `#立绘#格式错误: "${this.extra.text}"`;

    case ValidationCode.RoleAnimationNameNotFound:
      return `#立绘#格式错误, 缺少立绘名称`;

    case ValidationCode.InvalidRoleAnimationName:
      return `#立绘#不存在: "${this.extra.name}"`;

    case ValidationCode.SceneHasNoContent:
      return `#情景#必须包含至少一条对白`;

    case ValidationCode.InvalidParagraphText:
      return `番外包含非视频、电话、情景的文本内容`;

    case ValidationCode.ExtraInvalidGallery:
      return `番外内容不可收集到回忆`

    default:
      return '未知错误';
  }
};

export class ValidationWarning {
  constructor(code, extra) {
    this.code = code;
    this.extra = extra;
  }
}

ValidationWarning.prototype.name = 'ValidationWarning';

ValidationWarning.prototype.getContext = function () {
  const { type, title, line_number, extra_uuid, extra_title } = this.extra;
  const isextra = extra_uuid !== null ? '番外' : '剧本';
  const extratitle = extra_title !== null ? '《' + extra_title + '》' : '';
  if (title) {
    if (line_number) {
      return `【${isextra}】${extratitle}${type}<${title}>, 第${line_number}行: `;
    } else {
      return `【${isextra}】${extratitle}${type}<${title}>: `;
    }
  } else {
    return `【${isextra}】${extratitle}${type}`;
  }
};

ValidationWarning.prototype.getMessage = function () {
  switch (this.code) {
    case ValidationCode.ParagrapWithoutNextParagraph:
      return `段落后未接任何段落, 将作“未完待续”处理`;

    case ValidationCode.LockWithoutNextParagraph:
      return `剧情锁后未接任何段落, 将作“未完待续”处理`;

    case ValidationCode.NodeTagFormatError:
      return `"${this.extra.text}"标签不正确，请检查`;

    default:
      return '未知警告';
  }
};

// const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
//     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//     '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//     '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
const URL_PATTERN = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/);

function isValidUrl(url) {
  return URL_PATTERN.test(url);
}

export function validateProjectContent(content, extras) {
  const { roles, galleries, paragraphs, numbers } = content;
  const role_names = {};
  const errors = [];
  const warnings = [];
  let current_line_number = null;
  let current_extra_uuid = null;
  let current_extra_title = null;
  let current_id = null;
  let current_title = null;
  let current_type = null;
  let validate_state = 'normal';  // normal | call
  let incallorscene = false;
  let scene_has_text_content = false;

  function addError(code, extra) {
    errors.push(new ValidationError(code, {
      ...getCurrentContext(),
      ...(extra || {}),
    }));
  }

  function addWarning(code, extra) {
    warnings.push(new ValidationWarning(code, {
      ...getCurrentContext(),
      ...(extra || {}),
    }));
  }

  // function getGallery(id) {
  //     return galleries.find(g => g.id === id);
  // }

  // function getRole(id) {
  //     return roles.find(r => r.id === id);
  // }

  function getRoleByChatId(chat_id) {
    return roles.find(r => r.chat_id === chat_id);
  }

  function getRoleByName(name) {
    return roles.find(r => r.name === name);
  }

  function getGalleryById(id) {
    return galleries.find(g => g.id === id);
  }

  function getGalleryByTitle(title) {
    return galleries.find(g => g.title === title);
  }

  function getCurrentContext() {
    return { extra_uuid: current_extra_uuid, extra_title: current_extra_title, id: current_id, type: current_type, title: current_title, line_number: current_line_number };
  }

  function validateRole(role) {
    const { name, gallery_ids } = role;
    if (role_names[name]) {
      addError(ValidationCode.DuplicatedRoleName, { name })
    }

    for (let i = 0; i < gallery_ids.length; i++) {
      const gallery_id = gallery_ids[i];
      if (!gallery_id) {
        addError(ValidationCode.InvalidGalleryIdOfRole, { gallery_id });
      }
    }
  }

  function validateRoles() {
    for (let i = 0; i < roles.length; i++) {
      validateRole(roles[i]);
    }
  }

  function validateRoleName(name) {
    switch (name) {
      case '我':
        break;

      default:
        const role = getRoleByName(name);
        if (!role) {
          addError(ValidationCode.RoleNameNotFound, { name });
        }
    }
  }

  function validateRoleAnimationName(role_name, animation_name) {
    const role = getRoleByName(role_name);
    if (role && (!role.animations || (role.animations && !role.animations.find(a => a.name === animation_name)))) {
      addError(ValidationCode.InvalidRoleAnimationName, { name: animation_name });
    }
  }

  function validateNumber(key) {
    if (!numbers || key === '') {
      addError(ValidationCode.NumberKeyNotFound, { key });
    } else {
      let nums = {};
      Object.keys(numbers).forEach(n => {
        nums = Object.assign(nums, numbers[n].nums);
      });
      if (!Object.keys(nums).find(n => n === key)) {
        addError(ValidationCode.NumberKeyNotFound, { key });
      }
    }
  }

  function validateGalleryTitle(title) {
    const gallery = getGalleryByTitle(title);
    if (!gallery) {
      addError(ValidationCode.GalleryTitleNotFound, { title });
    }
  }

  function validateGalleryId(id) {
    if (id !== -1) {
      const gallery = getGalleryById(id);
      if (!gallery) {
        addError(ValidationCode.EndParagraphGalleryIdNotFound);
      }
    }
  }

  function validateUrl(url) {
    if (!isValidUrl(url)) {
      // warnings.push(new ValidationWarning(ValidationCode.InvalidUrl, {
      //     ...getCurrentContext(),
      //     url,
      // }));

      // 目前暂时把无效的地址作为错误处理
      addError(ValidationCode.InvalidUrl, { url });
    }
  }

  function validateImageUrl(url) {
    if (!isValidUrl(url)) {
      // warnings.push(new ValidationWarning(ValidationCode.InvalidUrl, {
      //     ...getCurrentContext(),
      //     url,
      // }));

      // 目前暂时把无效的图片地址作为错误处理
      addError(ValidationCode.InvalidUrl, { url });
    }
  }

  function validateVideoUrl(url) {
    if (!isValidUrl(url)) {
      // warnings.push(new ValidationWarning(ValidationCode.InvalidUrl, {
      //     ...getCurrentContext(),
      //     url,
      // }));

      // 目前暂时把无效的视频地址作为错误处理
      addError(ValidationCode.InvalidUrl, { url });
    }
  }

  function validateAudioUrl(url) {
    if (!isValidUrl(url)) {
      // warnings.push(new ValidationWarning(ValidationCode.InvalidUrl, {
      //     ...getCurrentContext(),
      //     url,
      // }));

      // 目前暂时把无效的图片地址作为错误处理
      addError(ValidationCode.InvalidUrl, { url });
    }
  }

  function validateBgmUrl(url) {
    if (!isValidUrl(url)) {
      addError(ValidationCode.InvalidUrl, { url });
    }
  }

  function validateSoundUrl(url) {
    if (!isValidUrl(url)) {
      addError(ValidationCode.InvalidUrl, { url });
    }
  }

  function validateImageNode(lines) {
    // #图片#
    if (lines[0].length > 4) {
      addError(ValidationCode.ImageNodeFormatError, { text: lines[0].substring(4) });
    }

    // Url
    if (lines[1]) {
      current_line_number++;
      validateImageUrl(lines[1].trim());
    } else {
      addError(ValidationCode.ImageNodeUrlNotFound);
      return;
    }

    // Gallery
    if (lines[2]) {
      current_line_number++;
      if (lines[2].startsWith('>')) {
        const gallery_title = lines[2].substring(1).trim();
        validateGalleryTitle(gallery_title);
      } else {
        addError(ValidationCode.ImageNodeGalleryFormatError, { text: lines[2] });
      }
    } else {
      return;
    }

    if (lines[3]) {
      current_line_number++;
      addError(ValidationCode.ImageNodeFormatError, { text: lines[3] });
      current_line_number += lines.length - 4;
    }
  }

  function validateAudioNode(lines) {
    // #音频#
    if (lines[0].length > 4) {
      addError(ValidationCode.AudioNodeFormatError, { text: lines[0].substring(4) });
    }

    // Url
    if (lines[1]) {
      current_line_number++;
      validateAudioUrl(lines[1].trim());
    } else {
      addError(ValidationCode.AudioNodeUrlNotFound);
      return;
    }

    //Text or Gallery
    if (lines[2]) {
      current_line_number++;
      if (lines[2].startsWith('>')) {
        const gallery_title = lines[2].substring(1).trim();
        validateGalleryTitle(gallery_title);
      }
    }

    // Gallery
    if (lines[3]) {
      current_line_number++;
      if (lines[3].startsWith('>')) {
        const gallery_title = lines[3].substring(1).trim();
        validateGalleryTitle(gallery_title);
      } else {
        addError(ValidationCode.AudioNodeGalleryFormatError, { text: lines[3] });
      }
    } else {
      return;
    }

    if (lines[4]) {
      current_line_number++;
      addError(ValidationCode.AudioNodeFormatError, { text: lines[4] });
      current_line_number += lines.length - 5;
    }
  }

  function validateBgmNode(lines) {
    // #背景音乐#
    if (lines[0].length > 6) {
      addError(ValidationCode.BgmNodeFormatError, { text: lines[0].substring(6) });
    }

    // Url
    if (lines[1]) {
      current_line_number++;
      validateBgmUrl(lines[1].trim());
    } else {
      addError(ValidationCode.BgmNodeUrlNotFound);
      return;
    }

    // Times
    if (lines[2]) {
      current_line_number++;
      if (isNaN(parseInt(lines[2], 10)) || parseInt(lines[2], 10) <= 0) {
        addError(ValidationCode.BgmNodeInvalidTimes);
      }
    }
    // else {
    //     addError(ValidationCode.BgmNodeNumNotFound);
    //     return;
    // }

    if (lines[3]) {
      current_line_number++;
      addError(ValidationCode.BgmNodeFormatError, { text: lines[3] });
      current_line_number += lines.length - 4;
    }
  }

  function validateSoundNode(lines) {
    // #音效#
    if (lines[0].length > 4) {
      addError(ValidationCode.SoundNodeFormatError, { text: lines[0].substring(4) });
    }

    // Url
    if (lines[1]) {
      current_line_number++;
      validateSoundUrl(lines[1].trim());
    } else {
      addError(ValidationCode.SoundNodeUrlNotFound);
      return;
    }

    // Times
    if (lines[2]) {
      current_line_number++;
      if (isNaN(parseInt(lines[2], 10)) || parseInt(lines[2], 10) <= 0) {
        addError(ValidationCode.SoundNodeInvalidTimes);
      }
    }
    // else {
    //     addError(ValidationCode.SoundNodeNumNotFound);
    //     return;
    // }

    if (lines[3]) {
      current_line_number++;
      addError(ValidationCode.SoundNodeFormatError, { text: lines[3] });
      current_line_number += lines.length - 4;
    }
  }

  function validateCallStartNode(lines, role_name) {
    if (role_name === '我') {
      current_line_number--;
      addError(ValidationCode.CallStartNodeRoleIsPlayer);
      current_line_number++;
    }

    // #电话开始#

    if (lines[0] !== '#电话开始#' && lines[0] !== '#视频电话开始#') {
      addError(ValidationCode.CallStartNodeFormatError, { text: lines[0].substring(6) });
    }

    // Title
    if (lines[1]) {
      current_line_number++;
    } else {
      addError(ValidationCode.CallNodeTitleNotFound);
      return;
    }

    // Image
    if (lines[2]) {
      current_line_number++;
      if (lines[0] === '#电话开始#') {
        validateImageUrl(lines[2].trim());
      } else if (lines[0] === '#视频电话开始#') {
        validateVideoUrl(lines[2].trim());
      }
    } else {
      if (lines[0] === '#电话开始#') {
        addError(ValidationCode.CallNodeImageNotFound);
      } else if (lines[0] === '#视频电话开始#') {
        addError(ValidationCode.CallNodeVideoNotFound);
      }
      return;
    }

    if (lines[0] === '#电话开始#') {
      // Gallery or Iamge
      if (lines[3]) {
        current_line_number++;
        if (lines[3].startsWith('>')) {
          if (current_extra_uuid !== null) {
            addError(ValidationCode.ExtraInvalidGallery, { text: lines[3] });
          } else {
            const gallery_title = lines[3].substring(1).trim();
            validateGalleryTitle(gallery_title);
          }
        } else {
          addError(ValidationCode.CallNodeGalleryFormatError, { text: lines[3] });
        }
      }

      if (lines[4]) {
        current_line_number++;
        addError(ValidationCode.CallStartNodeFormatError, { text: lines[4] });
        current_line_number += lines.length - 5;
      }
    } else if (lines[0] === '#视频电话开始#') {
      // Gallery or Image
      if (lines[3]) {
        current_line_number++;
        if (lines[3].startsWith('>')) {
          if (current_extra_uuid !== null) {
            addError(ValidationCode.ExtraInvalidGallery, { text: lines[3] });
          } else {
            const gallery_title = lines[3].substring(1).trim();
            validateGalleryTitle(gallery_title);
          }
        } else {
          validateImageUrl(lines[3].trim());
          if (lines[4]) {
            current_line_number++;
            if (lines[4].startsWith('>')) {
              if (current_extra_uuid !== null) {
                addError(ValidationCode.ExtraInvalidGallery, { text: lines[4] });
              } else {
                const gallery_title = lines[4].substring(1).trim();
                validateGalleryTitle(gallery_title);
              }
            } else {
              addError(ValidationCode.CallNodeGalleryFormatError, { text: lines[3] });
            }
          }
        }
      }

      if (lines[5]) {
        current_line_number++;
        addError(ValidationCode.CallStartNodeFormatError, { text: lines[5] });
        current_line_number += lines.length - 5;
      }
    }

    validate_state = 'call';
    incallorscene = true;
  }

  function validateCallLine(block) {
    const lines = block.split(/\n/);
    if (lines[0].startsWith('@')) {
      const role_name = lines[0].substring(1).trim();
      validateRoleName(role_name);

      if (lines[1]) {
        current_line_number++;
      } else {
        addError(ValidationCode.CallNodeLineTextNotFound);
        return;
      }

      if (lines[2]) {
        current_line_number++;
        validateAudioUrl(lines[2].trim());
        return;
      }

      if (lines[3]) {
        current_line_number++;
        addError(ValidationCode.CallNodeLineFormatError, { text: lines[3] });
        current_line_number += lines.length - 4;
      }
    } else if (lines[0].startsWith('#电话结束#') || lines[0].startsWith('#视频电话结束#')) {
      validateCallEndNode(lines);
    } else {
      addError(ValidationCode.CallNodeLineRoleNotFound);
    }
  }

  function validateCallEndNode(lines) {
    // #电话结束#
    if (lines[0] !== '#电话结束#' && lines[0] !== '#视频电话结束#') {
      addError(ValidationCode.CallEndNodeFormatError, { text: lines[0].substring(6) });
    }

    if (lines[1]) {
      current_line_number++;
      addError(ValidationCode.CallEndNodeFormatError, { text: lines[1] });
      current_line_number += lines.length - 2;
    }

    validate_state = 'normal';
    incallorscene = false;
  }

  function validateSceneStartNode(lines) {
    // #情景开始#
    if (lines[0].length > 6) {
      addError(ValidationCode.SceneStartNodeFormatError, { text: lines[0].substring(6) });
    }

    // Title
    if (lines[1]) {
      current_line_number++;
    } else {
      addError(ValidationCode.SceneNodeTitleNotFound);
      return;
    }

    // Gallery
    if (lines[2]) {
      current_line_number++;
      if (lines[2].startsWith('>')) {
        if (current_extra_uuid !== null) {
          addError(ValidationCode.ExtraInvalidGallery, { text: lines[2] });
        } else {
          const gallery_title = lines[2].substring(1).trim();
          validateGalleryTitle(gallery_title);
        }
      } else {
        addError(ValidationCode.VideoNodeGalleryFormatError, { text: lines[2] });
      }
    }

    if (lines[3]) {
      current_line_number++;
      addError(ValidationCode.CallStartNodeFormatError, { text: lines[3] });
      current_line_number += lines.length - 4;
    }

    validate_state = 'scene';
    incallorscene = true;
    scene_has_text_content = false;
  }

  function validateSceneBgm(lines) {
    // 情景中的#背景音乐#
    if (lines[0].length > 6) {
      addError(ValidationCode.BgmNodeFormatError, { text: lines[0].substring(6) });
    }

    // Url
    if (lines[1]) {
      current_line_number++;
      validateBgmUrl(lines[1].trim());
    } else {
      addError(ValidationCode.BgmNodeUrlNotFound);
      return;
    }

    if (lines[3]) {
      current_line_number++;
      addError(ValidationCode.BgmNodeFormatError, { text: lines[3] });
      current_line_number += lines.length - 4;
    }
  }

  function validateSceneLine(block) {
    const lines = block.split(/\n/);
    if (lines[0].startsWith('@')) {
      const role_name = lines[0].substring(1).trim();
      validateRoleName(role_name);

      if (lines[1]) {
        current_line_number++;

        if (lines[1].startsWith('#立绘#')) {
          if (lines[1].length > 4) {
            addError(ValidationCode.RoleAnimationFormatError, { text: lines[1].substring(4) });
          }

          // Animation name
          if (lines[2]) {
            current_line_number++;
            validateRoleAnimationName(role_name, lines[2].trim());
          } else {
            addError(ValidationCode.RoleAnimationNameNotFound);
            return;
          }

          if (lines[3]) {
            current_line_number++;
            addError(ValidationCode.RoleAnimationFormatError, { text: lines[3] });
            current_line_number += lines.length - 4;
          }
        } else {  // 角色对白, 可以增加音频
          scene_has_text_content = true;

          if (lines[2]) {
            current_line_number++;
            validateAudioUrl(lines[2].trim());
          }

          if (lines[3]) {
            current_line_number++;
            addError(ValidationCode.SceneNodeLineFormatError, { text: lines[3] });
            current_line_number += lines.length - 4;
          }
        }
      } else {
        addError(ValidationCode.SceneNodeLineTextNotFound);
        return;
      }
    } else {
      if (lines[0].match(/#.+#/)) {
        if (lines[0].startsWith('#情景结束#')) {
          validateSceneEndNode(lines);
        } else if (lines[0].startsWith('#背景音乐#')) {
          validateSceneBgm(lines)
        } else if (lines[0].startsWith('#背景#')) {
          validateSceneBackground(lines)
        } else {
          addWarning(ValidationCode.NodeTagFormatError, { text: lines[0] });
        }
      } else {
        // 旁白
        scene_has_text_content = true;
      }
    }
  }

  function validateSceneBackground(lines) {
    // #背景#
    if (lines[0].length > 4) {
      addError(ValidationCode.BackgroundFormatError, { text: lines[0].substring(4) });
    }

    // Url
    if (lines[1]) {
      current_line_number++;
      validateUrl(lines[1].trim());
    } else {
      addError(ValidationCode.BackgroundUrlNotFound);
      return;
    }

    if (lines[2]) {
      current_line_number++;
      addError(ValidationCode.BackgroundFormatError, { text: lines[2] });
      current_line_number += lines.length - 3;
    }
  }

  function validateSceneEndNode(lines) {
    // #情景结束#
    if (lines[0].length > 6) {
      addError(ValidationCode.SceneEndNodeFormatError, { text: lines[0].substring(6) });
    }

    if (lines[1]) {
      current_line_number++;
      addError(ValidationCode.SceneEndNodeFormatError, { text: lines[1] });
      current_line_number += lines.length - 2;
    }

    if (!scene_has_text_content) {
      addError(ValidationCode.SceneHasNoContent);
    }

    validate_state = 'normal';
    incallorscene = false;
  }

  function validateVideoNode(lines) {
    // #视频#
    if (lines[0].length > 4) {
      addError(ValidationCode.VideoNodeFormatError, { text: lines[0].substring(4) });
    }

    // Text
    if (lines[1]) {
      current_line_number++;
    } else {
      addError(ValidationCode.VideoNodeTextFormatError);
      return;
    }

    // Url
    if (lines[2]) {
      current_line_number++;
      validateVideoUrl(lines[2].trim());
    } else {
      addError(ValidationCode.VideoNodeUrlNotFound);
      return;
    }

    // Gallery
    if (lines[3]) {
      current_line_number++;
      if (lines[3].startsWith('>')) {
        if (current_extra_uuid !== null) {
          addError(ValidationCode.ExtraInvalidGallery, { text: lines[3] });
        } else {
          const gallery_title = lines[3].substring(1).trim();
          validateGalleryTitle(gallery_title);
        }
      } else {
        validateImageUrl(lines[3].trim());
        if (lines[4]) {
          current_line_number++;
          if (lines[4].startsWith('>')) {
            if (current_extra_uuid !== null) {
              addError(ValidationCode.ExtraInvalidGallery, { text: lines[4] });
            } else {
              const gallery_title = lines[4].substring(1).trim();
              validateGalleryTitle(gallery_title);
            }
          } else {
            addError(ValidationCode.VideoNodeGalleryFormatError, { text: lines[4] });
          }
        }
      }
    } else {
      return;
    }

    if (lines[5]) {
      current_line_number++;
      addError(ValidationCode.VideoNodeFormatError, { text: lines[5] });
      current_line_number += lines.length - 5;
    }
  }

  function validateLinkNode(lines) {
    // #链接#
    if (lines[0].length > 4) {
      addError(ValidationCode.LinkNodeFormatError, { text: lines[0].substring(4) });
    }

    // 标题
    if (lines[1]) {
      current_line_number++;
    } else {
      addError(ValidationCode.LinkNodeTitleFormatError);
    }

    // 描述
    if (lines[2]) {
      current_line_number++;
    } else {
      addError(ValidationCode.LinkNodeTextFormatError);
    }

    // 链接
    if (lines[3]) {
      current_line_number++;
      validateUrl(lines[3].trim());
    } else {
      addError(ValidationCode.LinkNodeLinkFormatError);
    }

    // 预览图
    if (lines[4]) {
      current_line_number++;
      validateImageUrl(lines[4].trim());
    } else {
      addError(ValidationCode.LinkNodeImageFormatError);
    }

    if (lines[5]) {
      current_line_number++;
      addError(ValidationCode.LinkNodeFormatError, { text: lines[5] });
      current_line_number += lines.length - 6;
    }
  }

  function validateBusyNode(lines, role_name) {
    if (role_name === '我') {
      current_line_number--;
      addError(ValidationCode.BusyNodeRoleIsUserError);
      current_line_number++;
    }

    // #忙碌#
    if (lines[0].length > 4) {
      addError(ValidationCode.BusyNodeFormatError, { text: lines[0].substring(4) });
    }

    // Text
    if (lines[1]) {
      current_line_number++;
    } else {
      addError(ValidationCode.BusyNodeTextNotFound);
      return;
    }

    if (lines[2]) {
      current_line_number++;
      // addError(ValidationCode.BusyNodeFormatError, { text: lines[2] });
      current_line_number += lines.length - 3;
    }
  }

  function validateTextNode(lines) {
    current_line_number += lines.length - 1;
  }

  function validateDelayNode(lines) {
    const number = lines[0].substring(2).trim();
    if (isNaN(number)) {
      addError(ValidationCode.DelayNodeInvalidTime, { number });
    }

    if (lines[1]) {
      current_line_number++;
      addError(ValidationCode.DelayNodeFormatError, { text: lines[1] });
      current_line_number += lines.length - 2;
    }
  }

  function validateNumberNode(lines) {
    if (lines[1]) {
      const line = lines[1].trim();
      current_line_number++;
      const elements_set = line.split('=');
      const elements_change = line.split(/[*/+-]/g);
      if (elements_set.length === 2) {
        const key = elements_set[0];
        const value = parseInt(elements_set[1], 10);
        if (!key || isNaN(value) || line.indexOf('.') !== -1) {
          addError(ValidationCode.NumberNodeFormatError, { text: line });
          return;
        } else {
          validateNumber(key);
        }
      } else if (elements_set.length === 1 && elements_change.length === 2) {
        const key = elements_change[0];
        const value = parseInt(elements_change[1], 10);
        const operator = line.match(/[*/+-]/g)[0];
        console.log(!key || value === 0 || isNaN(value) || !operator || line.indexOf('.') !== -1);
        if (!key || value === 0 || isNaN(value) || !operator || line.indexOf('.') !== -1) {
          addError(ValidationCode.NumberNodeFormatError, { text: line });
          return;
        } else {
          validateNumber(key);
        }
      }

    } else {
      addError(ValidationCode.NumberNodeContentNotFound);
      return;
    }

    if (lines[2]) {
      current_line_number++;
      addError(ValidationCode.NumberNodeFormatError, { text: lines[2] });
      current_line_number += lines.length - 3;
    }
  }

  function validateBlock(block) {
    switch (validate_state) {
      case 'call':
        validateCallLine(block);
        break;

      case 'scene':
        validateSceneLine(block);
        break;

      case 'normal':
      default: {
        const lines = block.split(/\n/);
        if (lines[0].startsWith('@')) {
          const role_name = lines[0].substring(1).trim();
          validateRoleName(role_name);

          if (lines.length > 1) {
            current_line_number++;
            if (lines[1].startsWith('#图片#')) {                                // 图片
              if (current_extra_uuid !== null && !incallorscene) {
                addError(ValidationCode.InvalidParagraphText);
                break;
              }
              validateImageNode(lines.slice(1));
            } else if (lines[1].startsWith('#视频#')) {                           // 视频
              validateVideoNode(lines.slice(1));
            } else if (lines[1].startsWith('#链接#')) {                           // 链接
              if (current_extra_uuid !== null && !incallorscene) {
                addError(ValidationCode.InvalidParagraphText);
                break;
              }
              validateLinkNode(lines.slice(1));
            } else if (lines[1].startsWith('#忙碌#')) {                           // 忙碌
              if (current_extra_uuid !== null && !incallorscene) {
                addError(ValidationCode.InvalidParagraphText);
                break;
              }
              validateBusyNode(lines.slice(1), role_name);
            } else if (lines[1].startsWith('#音频#')) {                            // 音频
              if (current_extra_uuid !== null && !incallorscene) {
                addError(ValidationCode.InvalidParagraphText);
                break;
              }
              validateAudioNode(lines.slice(1));
            } else if (lines[1].startsWith('#电话开始#') || lines[1].startsWith('#视频电话开始#')) {
              validateCallStartNode(lines.slice(1), role_name);
            } else {
              if (lines[1].match(/#.+#/)) {
                addWarning(ValidationCode.NodeTagFormatError, { text: lines[1] });
              } else {
                if (current_extra_uuid !== null && !incallorscene) {
                  addError(ValidationCode.InvalidParagraphText);
                  break;
                }
                validateTextNode(lines.slice(1));
              }
            }
          } else {  // lines.length === 1
            addError(ValidationCode.NodeWithoutContentError);
          }
        } else {
          if (lines[0].startsWith('#图片#')) {                                      // 旁白图片
            if (current_extra_uuid !== null && !incallorscene) {
              addError(ValidationCode.InvalidParagraphText);
              break;
            }
            validateImageNode(lines);
          } else if (lines[0].startsWith('#视频#')) {                                 // 旁白视频
            validateVideoNode(lines);
          } else if (lines[0].startsWith('#背景音乐#')) {                            // 背景音乐
            if (current_extra_uuid !== null && !incallorscene) {
              addError(ValidationCode.InvalidParagraphText);
              break;
            }
            validateBgmNode(lines);
          } else if (lines[0].startsWith('#音效#')) {                            // 音效
            if (current_extra_uuid !== null && !incallorscene) {
              addError(ValidationCode.InvalidParagraphText);
              break;
            }
            validateSoundNode(lines);
          } else if (lines[0].startsWith('==')) {                                   // 延迟
            if (current_extra_uuid !== null && !incallorscene) {
              addError(ValidationCode.InvalidParagraphText);
              break;
            }
            validateDelayNode(lines);
          } else if (lines[0].startsWith('#数值#')) {
            if (current_extra_uuid !== null && !incallorscene) {
              addError(ValidationCode.InvalidParagraphText);
              break;
            }
            validateNumberNode(lines);
          } else if (lines[0].startsWith('#情景开始#')) {
            validateSceneStartNode(lines);
          } else if (lines[0].startsWith('#电话开始#') || lines[0].startsWith('#视频电话开始#')) {
            addError(ValidationCode.CallStartNodeRoleNotFound);
            return;
          } else if (lines[0].length > 0) {                                          // 旁白文本
            if (lines[0].match(/#.+#/)) {
              addWarning(ValidationCode.NodeTagFormatError, { text: lines[0] });
            } else {
              if (current_extra_uuid !== null && !incallorscene) {
                addError(ValidationCode.InvalidParagraphText);
                break;
              }
              validateTextNode(lines);
            }
          }
        }
      }
    }
  }

  function trimParagraphText(text) {
    // 移除首尾的多余空行和空格
    return text.replace(/^[\s\n]+|[\s\n]+$/g, '');
  }

  function validateExtra(extra) {
    current_extra_uuid = extra.uuid;
    current_extra_title = extra.title;
    extra.paragraphs.forEach(p => {
      validateParagraph(p);
    });
  }

  function validateNodeParagraph(paragraph) {
    if (current_extra_uuid === null && paragraph.next_id === -1) {
      addWarning(ValidationCode.ParagrapWithoutNextParagraph);
    }
    const blank_text = paragraph.text.match(/^[\s\n]+/);
    current_line_number = blank_text ? blank_text.toString().match(/\n/g) !== null ? blank_text.toString().match(/\n/g).length + 1 : 1 : 1;
    const text = trimParagraphText(paragraph.text);
    const pattern = new RegExp(/\n[\s\n]*\n/, 'g');
    let index = 0;
    if (text.length <= 0) {
      addError(ValidationCode.ParagraphWithoutContentError);
      return;
    }

    // 每两个或者两个以上的换行，包括换行之间有空格，认为是分隔符，将文本分割为多个块(block)
    let block_splitter = pattern.exec(text);
    while (true) {
      if (block_splitter) {
        const length = block_splitter ? block_splitter.toString().length : 0;
        const block = text.substring(index, pattern.lastIndex - length);
        validateBlock(block);
        index = pattern.lastIndex;
        current_line_number += block_splitter.toString().match(/\n/g).length;
        block_splitter = pattern.exec(text);
      } else {
        const block = text.substring(index);
        validateBlock(block);
        break;
      }
    }

    switch (validate_state) {
      case 'call':
        addError(ValidationCode.CallNodeNotComplete);
        validate_state = 'normal';
        break;

      case 'scene':
        addError(ValidationCode.SceneNodeNotComplete);
        validate_state = 'normal';
        break;

      case 'normal':
      default:
        break;
    }
  }

  function validateSelection(selection, index) {
    if (selection.next_id === -1) {
      current_title = selection.title;
      addError(ValidationCode.SelectionNextParagraphNotFound, { index });
    }

    if (selection.show_type) {
      selection.conditions.forEach(c => {
        validateNumber(c.key);
        if (isNaN(parseInt(c.value, 10))) {
          addError(ValidationCode.InvalidNumberBranchValue, { index });
        }
      });
    }
  }

  function validateNumberSelection(selection, index) {
    if (selection.next_id === -1) {
      addError(ValidationCode.NumberSelectionNextParagraphNotFound, { index });
    }
    if (selection.conditions && selection.conditions.length > 0) {
      selection.conditions.forEach(c => {
        validateNumber(c.key);
        if (isNaN(parseInt(c.value, 10))) {
          addError(ValidationCode.InvalidNumberBranchValue, { index });
        }
      });
    } else {
      addError(ValidationCode.NumberSelectionOptionNotFound, { index });
    }
  }

  function validateBranchParagraph(paragraph) {
    const { selections } = paragraph;
    for (let i = 0, n = selections.length; i < n; i++) {
      validateSelection(selections[i], i);
    }
  }

  function validateNumberBranchParagraph(paragraph) {
    const { selections } = paragraph;
    for (let i = 0, n = selections.length; i < n; i++) {
      validateNumberSelection(selections[i], i);
    }
  }

  function validateEndParagraph(paragraph) {
    const { gallery_id } = paragraph;
    validateGalleryId(gallery_id);
  }

  function validateLockParagraph(paragraph) {
    if (current_extra_uuid === null && paragraph.next_id === -1) {
      addWarning(ValidationCode.LockWithoutNextParagraph);
    }
    const { coin } = paragraph;
    if (!Number.isSafeInteger(coin) || coin <= 0) {
      addError(ValidationCode.InvalidCoinOfLock);
    }
  }

  function validateParagraph(paragraph) {
    const { id, title, chat_id } = paragraph;
    current_id = id;
    current_title = title;
    current_line_number = null;

    switch (paragraph.type) {
      case 'Node':
        current_type = '段落';
        if (current_extra_uuid === null && !getRoleByChatId(chat_id)) {
          addError(ValidationCode.InvalidChatIdOfParagraph);
        }
        validateNodeParagraph(paragraph);
        break;

      case 'Branch':
        current_title = paragraph.selections[0].title;
        current_type = '分支';
        if (current_extra_uuid === null && !getRoleByChatId(chat_id)) {
          addError(ValidationCode.InvalidChatIdOfParagraph);
        }
        validateBranchParagraph(paragraph);
        break;

      case 'NumberBranch':
        current_title = paragraph.selections[0].title;
        current_type = '数值分支';
        if (!getRoleByChatId(chat_id)) {
          addError(ValidationCode.InvalidChatIdOfParagraph);
        }
        validateNumberBranchParagraph(paragraph);
        break;

      case 'End':
        current_type = '结局';
        if (!getRoleByChatId(chat_id)) {
          addError(ValidationCode.InvalidChatIdOfParagraph);
        }
        validateEndParagraph(paragraph);
        break;

      case 'Lock':
        current_type = '剧情锁';
        if (!getRoleByChatId(chat_id)) {
          addError(ValidationCode.InvalidChatIdOfParagraph);
        }
        validateLockParagraph(paragraph);
        break;

      case 'GoOn':
        current_type = '待续';
        if (!getRoleByChatId(chat_id)) {
          addError(ValidationCode.InvalidChatIdOfParagraph);
        }
        break;

      default:
        if (current_extra_uuid === null && !getRoleByChatId(chat_id)) {
          addError(ValidationCode.InvalidChatIdOfParagraph);
        }
        addError(ValidationCode.InvalidParagraphType, paragraph.type);
        break;
    }
  }

  function validateParagraphs() {
    current_extra_uuid = null;
    current_extra_title = null;
    paragraphs.forEach(p => {
      validateParagraph(p);
    });
  }

  function validateExtras() {
    extras.forEach(extra => {
      validateExtra(extra);
    });
  }

  validateRoles();
  validateParagraphs();
  validateExtras();

  // console.log('warnings');
  // console.log(warnings);
  // console.log('errors');
  // console.log(errors);

  return {
    errors,
    warnings,
  }
}


// WEBPACK FOOTER //
// ./src/Author/sagas/editor-validate.js