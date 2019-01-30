export function buildProject(type, outline, content) {
  const in_roles = content.roles;
  const in_galleries = content.galleries;
  let in_paragraphs = content.paragraphs;
  const in_numbers = content.numbers;
  const out_roles = in_roles.map(r => ({ ...r, gallery_ids: [] }));
  const out_galleries = in_galleries.map(g => ({ ...g, items: [] }));
  const out_paragraphs = [];
  const out_lock_paragraphs = [];
  try {
    function getParagraph(paragraphs, id) {
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        if (paragraph.id === id) {
          return paragraph;
        }
      }
    };

    function getreviewparagraphs(paragraphs) {
      let nottoreview = {};
      const reviewparagraphs = paragraphs.map(p => ({ ...p }));
      const _visit = (paragraph) => {
        const notReview = nottoreview[paragraph.id];
        nottoreview[paragraph.id] = true;
        if (!notReview) {
          if (paragraph.type !== 'Branch') {
            const next_paragraph = getParagraph(reviewparagraphs, paragraph.next_id);
            if (next_paragraph) {
              _visit(next_paragraph);
            }
          } else {
            for (let i = 0; i < paragraph.selections.length; i++) {
              const next_paragraph = getParagraph(reviewparagraphs, paragraph.selections[i].next_id);
              if (next_paragraph) {
                _visit(next_paragraph);
              }
            }
          }
        }
      }
      for (let i = 0; i < reviewparagraphs.length; i++) {
        if (reviewparagraphs[i].type !== 'Branch') {
          if (reviewparagraphs[i].next_id !== -1) {
            const next_paragraph = getParagraph(reviewparagraphs, reviewparagraphs[i].next_id);
            if (next_paragraph && next_paragraph.type === 'GoOn' && next_paragraph.show_type === 'Off') {
              _visit(next_paragraph);
              reviewparagraphs[i].next_id = -1;
            } else if (next_paragraph && next_paragraph.type === 'GoOn' && next_paragraph.show_type === 'On') {
              nottoreview[next_paragraph.id] = true;
              reviewparagraphs[i].next_id = next_paragraph.next_id;
            }
          }
        } else {
          for (let j = 0; j < reviewparagraphs[i].selections.length; j++) {
            const next_paragraph = getParagraph(reviewparagraphs, reviewparagraphs[i].selections[j].next_id);
            if (next_paragraph && next_paragraph.type === 'GoOn' && next_paragraph.show_type === 'Off') {
              _visit(next_paragraph);
              reviewparagraphs[i].selections[j].next_id = -1;
            } else if (next_paragraph && next_paragraph.type === 'GoOn' && next_paragraph.show_type === 'On') {
              nottoreview[next_paragraph.id] = true;
              reviewparagraphs[i].selections[j] = next_paragraph.next_id;
            }
          }
        }
      }

      const returnparagraphs = reviewparagraphs.filter(p => !nottoreview[p.id]);
      // console.log(returnparagraphs);
      return returnparagraphs;
    }

    function getRoleIdByName(name) {
      switch (name) {
        case '我':
          return 0;
        default:
          return (out_roles.find(r => r.name === name)).id;
      }
    }

    function getGalleryById(id) {
      return out_galleries.find(g => g.id === id);
    }

    function getGalleryByTitle(title) {
      return out_galleries.find(g => g.title === title);
    }

    function getGalleryIdByTitle(title) {
      return out_galleries.find(g => g.title === title).id;
    }

    function addToGallery(title, item) {
      const gallery = getGalleryByTitle(title);
      const items = gallery.items;
      // 如果不存在相同的item才需要增加到items中
      switch (item.type) {
        case 'GalleryItemImage': {
          if (!gallery.items.find(i => i.image === item.image)) {
            items.push(item);
          }
          break;
        }

        case 'GalleryItemVideo': {
          if (!gallery.items.find(i => i.video === item.video)) {
            items.push(item);
          }
          break;
        }

        case 'GalleryItemAudio': {
          if (!gallery.items.find(i => i.audio === item.audio)) {
            items.push(item);
          }
          break;
        }

        case 'GalleryItemCall': {
          if (!gallery.items.find(i => i.title === item.title)) {
            items.push(item);
          }
          break;
        }

        case 'GalleryItemEnding': {
          if (!gallery.items.find(i => i.title === item.title)) {
            items.push(item);
          }
          break;
        }

        case 'GalleryItemScene': {
          if (!gallery.items.find(i => i.title === item.title)) {
            items.push(item);
          }
          break;
        }

        default:
          break;
      }
    }

    function trimParagraphText(text) {
      // 移除首尾的多余空行和空格
      return text.replace(/^[\s\n]+|[\s\n]+$/g, '');
    }

    function buildCallNode(blocks, i) {
      const call = { type: 'Call', lines: [] };
      const first_lines = blocks[i].split(/\n/);
      call.role_id = getRoleIdByName(first_lines[0].substring(1).trim());
      call.title = first_lines[2].trim();
      call.image = first_lines[3].trim();

      while (true) {
        i++;
        const lines = blocks[i].split(/\n/);
        if (lines[0].startsWith('#电话结束#')) {
          break;
        } else {
          const role_id = getRoleIdByName(lines[0].substring(1).trim());
          const text = lines[1].trim();
          const audio = lines[2] ? lines[2].trim() : undefined;
          call.lines.push({ role_id, text, audio });
        }
      }

      if (first_lines[4]) {
        const gallery_title = first_lines[4].substring(1).trim();
        addToGallery(gallery_title, { ...call, type: 'GalleryItemCall' });
        call.gallery_id = getGalleryIdByTitle(gallery_title);
      }
      return { call, block_index: i };
    }

    function buildVideoCallNode(blocks, i) {
      const call = { type: 'Call', lines: [] };
      const first_lines = blocks[i].split(/\n/);
      call.role_id = getRoleIdByName(first_lines[0].substring(1).trim());
      call.title = first_lines[2].trim();
      call.video = first_lines[3].trim();

      if (first_lines[4] && first_lines[4].startsWith('>')) {
        const gallery_title = first_lines[4].substring(1).trim();
        addToGallery(gallery_title, { ...call, type: 'GalleryItemCall' });
        call.gallery_id = getGalleryIdByTitle(gallery_title);
      } else {
        call.image = first_lines[4].trim();
      }

      if (first_lines[5] && first_lines[5].startsWith('>')) {
        const gallery_title = first_lines[5].substring(1).trim();
        addToGallery(gallery_title, { ...call, type: 'GalleryItemCall' });
        call.gallery_id = getGalleryIdByTitle(gallery_title);
      }

      while (true) {
        i++;
        const lines = blocks[i].split(/\n/);
        if (lines[0].startsWith('#视频电话结束#')) {
          break;
        } else {
          const role_id = getRoleIdByName(lines[0].substring(1).trim());
          const text = lines[1].trim();
          const audio = lines[2] ? lines[2].trim() : undefined;
          call.lines.push({ role_id, text, audio });
        }
      }

      return { call, block_index: i };
    }

    function buildSceneNode(blocks, i) {
      const scene = { type: 'Scene', lines: [] };
      const first_lines = blocks[i].split(/\n/);
      scene.title = first_lines[1].trim();

      while (true) {
        i++;

        const lines = blocks[i].split(/\n/);
        if (lines[0].startsWith('@')) {
          if (lines[1].startsWith('#立绘#')) {
            const role_id = getRoleIdByName(lines[0].substring(1).trim());
            const name = lines[2].trim();
            scene.lines.push({ type: 'RoleAnimation', role_id, name, });
          }
          else {
            const role_id = getRoleIdByName(lines[0].substring(1).trim());
            const text = lines[1].trim();
            const audio = lines[2] ? lines[2].trim() : undefined;
            scene.lines.push({ type: 'Text', role_id, text, audio });
          }
        } else if (lines[0].startsWith('#情景结束#')) {
          break;
        } else if (lines[0].startsWith('#背景#')) {
          const url = lines[1].trim();
          scene.lines.push({ type: 'Background', url });
        } else if (lines[0].startsWith('#背景音乐#')) {
          const audio = lines[1].trim();
          scene.lines.push({ type: 'SceneBGM', audio });
        } else {
          scene.lines.push({ type: 'Text', role_id: -1, text: blocks[i].trim() });
        }
      }

      if (first_lines[2]) {
        const gallery_title = first_lines[2].substring(1).trim();
        addToGallery(gallery_title, { ...scene, type: 'GalleryItemScene' });
        scene.gallery_id = getGalleryIdByTitle(gallery_title);
      }

      return { scene: scene, block_index: i };
    }

    function buildParagraphText(text) {
      const nodes = [];
      const trimmed_text = trimParagraphText(text);
      const blocks = trimmed_text.split(/\n[\s\n]*\n/);
      for (let i = 0, n = blocks.length; i < n; i++) {
        const lines = blocks[i].split(/\n/);
        if (lines[0].startsWith('@')) {
          // 有角色的内容，例如@我、@旁白、@角色名
          const role_id = getRoleIdByName(lines[0].substring(1).trim());

          if (lines[1].startsWith('#图片#')) {                                // 图片
            const image = lines[2].trim();
            if (lines[3]) {
              const gallery_title = lines[3].substring(1).trim();
              addToGallery(gallery_title, { type: 'GalleryItemImage', image, });
              nodes.push({ type: 'Image', role_id, image, gallery_id: getGalleryIdByTitle(gallery_title) });
            } else {
              nodes.push({ type: 'Image', role_id, image, });
            }
          } else if (lines[1].startsWith('#视频#')) {                           // 视频
            const text = lines[2].trim();
            const video = lines[3].trim();
            if (lines[4]) {
              if (lines[4].startsWith('>')) {
                const gallery_title = lines[4].substring(1).trim();
                addToGallery(gallery_title, { type: 'GalleryItemVideo', video, text });
                nodes.push({ type: 'Video', role_id, text, video, gallery_id: getGalleryIdByTitle(gallery_title) });
              } else {
                const preview = lines[4].trim();
                if (lines[5]) {
                  const gallery_title = lines[5].substring(1).trim();
                  addToGallery(gallery_title, { type: 'GalleryItemVideo', video, text });
                  nodes.push({ type: 'Video', role_id, text, video, preview, gallery_id: getGalleryIdByTitle(gallery_title) });
                } else {
                  nodes.push({ type: 'Video', role_id, text, video, preview });
                }
              }
            } else {
              nodes.push({ type: 'Video', role_id, text, video });
            }
          } else if (lines[1].startsWith('#音频#')) {                                // 音频
            const audio = lines[2].trim();
            if (lines[3]) {
              if (lines[3].startsWith('>')) {
                const gallery_title = lines[3].substring(1).trim();
                addToGallery(gallery_title, { type: 'GalleryItemAudio', audio, role_id });
                nodes.push({ type: 'Audio', role_id, audio, gallery_id: getGalleryIdByTitle(gallery_title) });
              } else {
                const text = lines[3];
                if (lines[4]) {
                  const gallery_title = lines[4].substring(1).trim();
                  addToGallery(gallery_title, { type: 'GalleryItemAudio', audio, role_id });
                  nodes.push({ type: 'Audio', role_id, audio, text, gallery_id: getGalleryIdByTitle(gallery_title) });
                } else {
                  nodes.push({ type: 'Audio', role_id, audio, text });
                }
              }
            } else {
              nodes.push({ type: 'Audio', role_id, audio, });
            }
          } else if (lines[1].startsWith('#链接#')) {                           // 链接
            const title = lines[2].trim();
            const text = lines[3].trim();
            const link = lines[4].trim();
            const image = lines[5].trim();
            nodes.push({ type: 'Link', title, text, link, image, role_id, });
          } else if (lines[1].startsWith('#忙碌#')) {                           // 忙碌
            const text = lines[2].trim();
            // console.log('忙碌', text);
            nodes.push({ type: 'Busy', text, target_role_id: role_id });
          } else if (lines[1].startsWith('#电话开始#')) {
            const { call, block_index } = buildCallNode(blocks, i);
            nodes.push(call);
            i = block_index;
          } else if (lines[1].startsWith('#视频电话开始#')) {
            const { call, block_index } = buildVideoCallNode(blocks, i);
            nodes.push(call);
            i = block_index;
          } else {
            const text = blocks[i].substring(lines[0].length + 1).trim();
            nodes.push({ type: 'Text', text, role_id });                      // 文本
          }
        } else {
          // 不需要@角色的内容
          if (lines[0].startsWith('#图片#')) {                            // 旁白图片
            const image = lines[1].trim();
            if (lines[2]) {
              const gallery_title = lines[2].substring(1).trim();
              addToGallery(gallery_title, { type: 'GalleryItemImage', image, });
              nodes.push({ type: 'Image', role_id: -1, image, gallery_id: getGalleryIdByTitle(gallery_title) });
            } else {
              nodes.push({ type: 'Image', role_id: -1, image, });
            }
          } else if (lines[0].startsWith('#视频#')) {                           // 旁白视频
            const text = lines[1].trim();
            const video = lines[2].trim();
            if (lines[3]) {
              if (lines[3].startsWith('>')) {
                const gallery_title = lines[3].substring(1).trim();
                addToGallery(gallery_title, { type: 'GalleryItemVideo', video, text });
                nodes.push({ type: 'Video', role_id: -1, text, video, gallery_id: getGalleryIdByTitle(gallery_title) });
              } else {
                const preview = lines[3].trim();
                if (lines[4]) {
                  const gallery_title = lines[4].substring(1).trim();
                  addToGallery(gallery_title, { type: 'GalleryItemVideo', video, text });
                  nodes.push({ type: 'Video', role_id: -1, text, video, preview, gallery_id: getGalleryIdByTitle(gallery_title) });
                } else {
                  nodes.push({ type: 'Video', role_id: -1, text, video, preview });
                }
              }
            } else {
              nodes.push({ type: 'Video', role_id: -1, text, video });
            }
          } else if (lines[0].startsWith('==')) {                               // 延迟
            const time = parseFloat(lines[0].substring(2).trim()) * 60000;
            nodes.push({ type: 'Delay', time });
            // console.log('Delay for', time);
          } else if (lines[0].startsWith('#背景音乐#')) {                        //背景音乐
            const audio = lines[1].trim();
            if (lines[2]) {
              const times = parseInt(lines[2].trim(), 10);
              nodes.push({ type: 'BGM', audio, times });
            } else {
              nodes.push({ type: 'BGM', audio, times: -1 });
            }
          } else if (lines[0].startsWith('#音效#')) {                           //音效
            const audio = lines[1].trim();
            if (lines[2]) {
              const times = parseInt(lines[2].trim(), 10);
              nodes.push({ type: 'Sound', audio, times });
            } else {
              nodes.push({ type: 'Sound', audio, times: 1 });
            }
          } else if (lines[0].startsWith('#数值#')) {                          // 数值
            const line = lines[1].trim();
            const key = line.split(/[=\-+*/]/g)[0];
            const value = parseInt(line.replace(key, '').substring(1), 10);
            let operator = line.match(/[=\-+*/]/g)[0];
            nodes.push({ type: 'Number', key: key, value: value, operator: operator });
          } else if (lines[0].startsWith('#情景开始#')) {                               // 情景开始
            const { scene, block_index } = buildSceneNode(blocks, i);
            nodes.push(scene);
            i = block_index;
          } else if (lines[0].length > 0) {
            nodes.push({ type: 'Text', role_id: -1, text: blocks[i].trim() });       // 旁白文本
          }
        }
      }

      return nodes;
    }

    function buildNumbers(in_numbers) {
      const number_group = {};
      let numbers = {};
      Object.keys(in_numbers).forEach(g => {
        number_group[g] = { type: in_numbers[g].type, nums: Object.keys(in_numbers[g].nums) };
        numbers = Object.assign(numbers, in_numbers[g].nums);
      });
      const out_numbers = { number_group, numbers };
      // console.log(out_numbers);
      return out_numbers;
    }

    function buildParagraph(in_paragraph) {
      const nodes = [];
      switch (in_paragraph.type) {
        case 'Node': {
          nodes.push(...buildParagraphText(in_paragraph.text));
          nodes[nodes.length - 1].next_paragraph_id = in_paragraph.next_id;
          break;
        }

        case 'Branch': {
          nodes.push({
            type: 'Selection',
            selections: in_paragraph.selections.map(s => {
              if (s.show_type) {
                return {
                  text: s.title,
                  show_type: s.show_type,
                  operator: s.operator,
                  conditions: s.conditions.map(c => ({ ...c, value: parseInt(c.value, 10) })),
                  next_paragraph_id: s.next_id,
                }
              } else {
                return {
                  text: s.title,
                  next_paragraph_id: s.next_id,
                }
              }
            }),
          });
          break;
        }

        case 'NumberBranch': {
          nodes.push({
            type: 'NumberBranch',
            branches: in_paragraph.selections.map(s => {
              return {
                operator: s.operator,
                conditions: s.conditions.map(c => ({ ...c, value: parseInt(c.value, 10) })),
                next_paragraph_id: s.next_id,
              }
            }),
          });
          break;
        }

        case 'End': {
          if (in_paragraph.gallery_id === -1 || !in_paragraph.gallery_id) {
            nodes.push({ type: 'Ending', title: in_paragraph.title.trim(), text: in_paragraph.text.trim(), image: in_paragraph.image.trim() });
          }
          else {
            nodes.push({ type: 'Ending', title: in_paragraph.title.trim(), text: in_paragraph.text.trim(), image: in_paragraph.image.trim(), gallery_id: in_paragraph.gallery_id });
            const gallery = getGalleryById(in_paragraph.gallery_id);
            gallery && gallery.items.push({ type: 'GalleryItemEnding', title: in_paragraph.title.trim(), text: in_paragraph.text.trim(), image: in_paragraph.image.trim() });
          }
          break;
        }

        case 'Lock': {
          nodes.push({
            type: 'Lock',
            uuid: type === 0 ? '*' + in_paragraph.uuid : in_paragraph.uuid,
            title: in_paragraph.title.trim(),
            text: in_paragraph.text.trim(),
            pay_type: in_paragraph.pay_type,
            coin: in_paragraph.coin,
            diamond: in_paragraph.diamond,
            next_paragraph_id: in_paragraph.next_id
          });
          break;
        }

        default:
          break;
      }

      return {
        id: in_paragraph.id,
        title: in_paragraph.title,
        chat_id: in_paragraph.chat_id,
        nodes: nodes,
      };
    }

    function buildLockParagraph(in_paragraph) {
      if (in_paragraph.type === 'Lock') {
        return {
          uuid: type === 0 ? '*' + in_paragraph.uuid : in_paragraph.uuid,
          game_id: outline.id,
          type: in_paragraph.pay_type,
          diamond: in_paragraph.diamond,
          coin: in_paragraph.coin,
        };
      }
    }


    in_paragraphs = getreviewparagraphs(in_paragraphs);
    // getreviewparagraphs(in_paragraphs);
    in_paragraphs.forEach(p => {
      if (p.type === 'Lock') {
        // lockparagraphs
        out_lock_paragraphs.push(buildLockParagraph(p));
      }
      // paragraphs
      out_paragraphs.push(buildParagraph(p))
    })

    // gallery_ids in roles
    const gallery_ids = out_galleries.map(g => g.id);
    out_roles.forEach(r => {
      if (r.has_memory) {
        r.gallery_ids = [...gallery_ids];
      } else {
        r.gallery_ids = [];
      }
      return r;
    });

    const out_numbers = buildNumbers(in_numbers);

    const script = {
      id: type === 0 ? -1 * outline.id : outline.id,
      game_id: type === 0 ? -1 * outline.id : outline.id,
      // title: outline.title,
      // roles: out_roles,

      // test
      title: outline.title,
      roles: out_roles.map(r => ({ ...r, name: r.name })),

      galleries: out_galleries,
      paragraphs: out_paragraphs,
      number_group: out_numbers.number_group,
      numbers: out_numbers.numbers,
      idols: outline.idols,
    };

    return {
      content: { ...content, paragraphs: in_paragraphs },
      script,
      lock_paragraphs: out_lock_paragraphs
    }
  }
  catch (e) {
    // @todo
    // 抛出异常，一般情况下在外部逻辑代码中需要上报build异常日志

    console.error(e);
    throw new Error();
  }
}

export function buildExtra(content, extra) {
  const roles = content.roles;
  try {
    // const script = {};

    function getRoleIdByName(name) {
      switch (name) {
        case '我':
          return 0;
        default:
          return (roles.find(r => r.name === name)).id;
      }
    }

    function trimParagraphText(text) {
      // 移除首尾的多余空行和空格
      return text.replace(/^[\s\n]+|[\s\n]+$/g, '');
    }

    function buildCallNode(blocks, i) {
      const call = { type: 'Call', lines: [] };
      const first_lines = blocks[i].split(/\n/);
      call.role_id = getRoleIdByName(first_lines[0].substring(1).trim());
      call.title = first_lines[2].trim();
      call.image = first_lines[3].trim();

      while (true) {
        i++;
        const lines = blocks[i].split(/\n/);
        if (lines[0].startsWith('#电话结束#')) {
          break;
        } else {
          const role_id = getRoleIdByName(lines[0].substring(1).trim());
          const text = lines[1].trim();
          const audio = lines[2] ? lines[2].trim() : undefined;
          call.lines.push({ role_id, text, audio });
        }
      }
      return { call, block_index: i };
    }

    function buildVideoCallNode(blocks, i) {
      const call = { type: 'Call', lines: [] };
      const first_lines = blocks[i].split(/\n/);
      call.role_id = getRoleIdByName(first_lines[0].substring(1).trim());
      call.title = first_lines[2].trim();
      call.video = first_lines[3].trim();

      while (true) {
        i++;
        const lines = blocks[i].split(/\n/);
        if (lines[0].startsWith('#视频电话结束#')) {
          break;
        } else {
          const role_id = getRoleIdByName(lines[0].substring(1).trim());
          const text = lines[1].trim();
          const audio = lines[2] ? lines[2].trim() : undefined;
          call.lines.push({ role_id, text, audio });
        }
      }

      return { call, block_index: i };
    }

    function buildSceneNode(blocks, i) {
      const scene = { type: 'Scene', lines: [] };
      const first_lines = blocks[i].split(/\n/);
      scene.title = first_lines[1].trim();

      while (true) {
        i++;

        const lines = blocks[i].split(/\n/);
        if (lines[0].startsWith('@')) {
          if (lines[1].startsWith('#立绘#')) {
            const role_id = getRoleIdByName(lines[0].substring(1).trim());
            const name = lines[2].trim();
            scene.lines.push({ type: 'RoleAnimation', role_id, name, });
          }
          else {
            const role_id = getRoleIdByName(lines[0].substring(1).trim());
            const text = lines[1].trim();
            const audio = lines[2] ? lines[2].trim() : undefined;
            scene.lines.push({ type: 'Text', role_id, text, audio });
          }
        } else if (lines[0].startsWith('#情景结束#')) {
          break;
        } else if (lines[0].startsWith('#背景#')) {
          const url = lines[1].trim();
          scene.lines.push({ type: 'Background', url });
        } else if (lines[0].startsWith('#背景音乐#')) {
          const audio = lines[1].trim();
          scene.lines.push({ type: 'SceneBGM', audio });
        } else {
          scene.lines.push({ type: 'Text', role_id: -1, text: blocks[i].trim() });
        }
      }

      return { scene: scene, block_index: i };
    }

    function buildParagraphText(text) {
      const nodes = [];
      const trimmed_text = trimParagraphText(text);
      const blocks = trimmed_text.split(/\n[\s\n]*\n/);
      for (let i = 0, n = blocks.length; i < n; i++) {
        const lines = blocks[i].split(/\n/);
        if (lines[0].startsWith('@')) {
          // 有角色的内容，例如@我、@旁白、@角色名
          const role_id = getRoleIdByName(lines[0].substring(1).trim());

          if (lines[1].startsWith('#图片#')) {                                // 图片
            const image = lines[2].trim();
            nodes.push({ type: 'Image', role_id, image, });
          } else if (lines[1].startsWith('#视频#')) {                           // 视频
            const text = lines[2].trim();
            const video = lines[3].trim();
            if (lines[4]) {
              const preview = lines[4].trim();
              nodes.push({ type: 'Video', role_id, text, video, preview });
            } else {
              nodes.push({ type: 'Video', role_id, text, video });
            }
          } else if (lines[1].startsWith('#音频#')) {                                // 音频
            const audio = lines[2].trim();
            if (lines[3]) {
              const text = lines[3];
              nodes.push({ type: 'Audio', role_id, audio, text });
            } else {
              nodes.push({ type: 'Audio', role_id, audio, });
            }
          } else if (lines[1].startsWith('#链接#')) {                           // 链接
            const title = lines[2].trim();
            const text = lines[3].trim();
            const link = lines[4].trim();
            const image = lines[5].trim();
            nodes.push({ type: 'Link', title, text, link, image, role_id, });
          } else if (lines[1].startsWith('#忙碌#')) {                           // 忙碌
            const text = lines[2].trim();
            // console.log('忙碌', text);
            nodes.push({ type: 'Busy', text, target_role_id: role_id });
          } else if (lines[1].startsWith('#电话开始#')) {
            const { call, block_index } = buildCallNode(blocks, i);
            nodes.push(call);
            i = block_index;
          } else if (lines[1].startsWith('#视频电话开始#')) {
            const { call, block_index } = buildVideoCallNode(blocks, i);
            nodes.push(call);
            i = block_index;
          } else {
            const text = blocks[i].substring(lines[0].length + 1).trim();
            nodes.push({ type: 'Text', text, role_id });                      // 文本
          }
        } else {
          // 不需要@角色的内容
          if (lines[0].startsWith('#图片#')) {                            // 旁白图片
            const image = lines[1].trim();
            nodes.push({ type: 'Image', role_id: -1, image, });
          } else if (lines[0].startsWith('#视频#')) {                           // 旁白视频
            const text = lines[1].trim();
            const video = lines[2].trim();
            if (lines[3]) {
              const preview = lines[3].trim();
              nodes.push({ type: 'Video', role_id: -1, text, video, preview });
            } else {
              nodes.push({ type: 'Video', role_id: -1, text, video });
            }
          } else if (lines[0].startsWith('==')) {                               // 延迟
            const time = parseFloat(lines[0].substring(2).trim()) * 60000;
            nodes.push({ type: 'Delay', time });
            // console.log('Delay for', time);
          } else if (lines[0].startsWith('#背景音乐#')) {                        //背景音乐
            const audio = lines[1].trim();
            if (lines[2]) {
              const times = parseInt(lines[2].trim(), 10);
              nodes.push({ type: 'BGM', audio, times });
            } else {
              nodes.push({ type: 'BGM', audio, times: -1 });
            }
          } else if (lines[0].startsWith('#音效#')) {                           //音效
            const audio = lines[1].trim();
            if (lines[2]) {
              const times = parseInt(lines[2].trim(), 10);
              nodes.push({ type: 'Sound', audio, times });
            } else {
              nodes.push({ type: 'Sound', audio, times: 1 });
            }
          } else if (lines[0].startsWith('#数值#')) {                          // 数值
            const line = lines[1].trim();
            const key = line.split(/[=\-+*/]/g)[0];
            const value = parseInt(line.split(/[=\-+*/]/g)[1], 10);
            const operator = line.match(/[=\-+*/]/g)[0];
            nodes.push({ type: 'Number', key: key, value: value, operator: operator });
          } else if (lines[0].startsWith('#情景开始#')) {                               // 情景开始
            const { scene, block_index } = buildSceneNode(blocks, i);
            nodes.push(scene);
            i = block_index;
          } else if (lines[0].length > 0) {
            nodes.push({ type: 'Text', role_id: -1, text: blocks[i].trim() });       // 旁白文本
          }
        }
      }

      return nodes;
    }

    function buildExtraParagraph(in_paragraph) {
      const nodes = [];
      switch (in_paragraph.type) {
        case 'Node': {
          nodes.push(...buildParagraphText(in_paragraph.text));
          nodes[nodes.length - 1].next_paragraph_id = in_paragraph.next_id;
          break;
        }

        case 'Branch': {
          nodes.push({
            type: 'Selection',
            selections: in_paragraph.selections.map(s => ({
              text: s.title,
              next_paragraph_id: s.next_id,
            })),
          });
          break;
        }

        default:
          break;
      }
      return {
        id: in_paragraph.id,
        nodes: nodes,
      };
    }

    const content = extra.paragraphs.map(paragraph => {
      return buildExtraParagraph(paragraph);
    });
    return {
      game_id: extra.game_id,
      uuid: extra.uuid,
      title: extra.title,
      text: extra.text,
      preview: extra.preview,
      idol_id: extra.idol_id,
      rarity: extra.rarity,
      level: extra.level,
      paragraphs: extra.paragraphs,
      content: JSON.stringify(content),
    }
  } catch (e) {
    // @todo
    // 抛出异常，一般情况下在外部逻辑代码中需要上报build异常日志

    console.error(e);
    throw new Error();
  }
}


// WEBPACK FOOTER //
// ./src/Author/sagas/editor-build.js