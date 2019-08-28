import graphql from '../../common/graphql';

export function getQiNiuToken() {
  return (dispatch: any, getState: any) => {
    return new Promise(async (resolve, reject) => {

      let [ err, res ] = await graphql({
        apis: [{
          api: 'qiniuToken',
          // args,
          fields: `
            token
            url
          `
        }],
        headers: { accessToken: getState().user.accessToken },
        cache: true
      });

      if (err) {
        resolve([err])
      } else {
        resolve([null, res])
      }

    })
  }
}
